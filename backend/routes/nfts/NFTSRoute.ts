import express, { Response, Request } from "express";
import { bucket, db } from "../../utils/Firebase";
import { LISTINGTYPE, NFTModel } from "../../models/nfts/NFTS";
import multer from "multer";
import { v4 as uuid } from "uuid";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

// Create NFT
router.post("/createnft", upload, async (req: Request, res: Response) => {
    const body = JSON.parse(req.body.data);
    const file = req.file;
    const nft: NFTModel = {
        nftAddress: body.nftAddress,
        name: body.name,
        blockchain: body.blockchain,
        collection: body.collectionAddress,
        description: body.description,
        externalLink: body.externalLink,
        owner: body.owner,
        price: body.price,
        supply: body.supply,
        image: null,
        auctionTimeEnd: null,
        type: null,
        listed: false
    }

    try {
        const userRef = db.collection("users").doc(body.owner);
        if (file) {
            const fileMetada = {
                metadata: {
                    firebaseStorageDownloadTokens: uuid()
                },
                contentType: file.mimetype,
                cacheControl: 'public, max-age=31536000',
            }
            const filepath = `nfts/${body.nftAddress}/nftImage`;
            const fileUpload = bucket.file(filepath);
            await fileUpload.save(file.buffer, {
                metadata: fileMetada,
            });
            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media&token=${fileMetada.metadata.firebaseStorageDownloadTokens}`;
            nft.owner = userRef;
            nft.image = url;

            const collectionRef = db.collection("collections").doc(body.collectionAddress);
            nft.collection = collectionRef;
            const response = await db.collection("nfts").doc(body.nftAddress).set(nft);
            if (response) {
                return res.json({
                    message: "NFT Created",
                    data: nft,
                }).status(200)
            } else {
                return res.json({
                    message: "Error Creating NFT",
                }).status(500)
            }
        } else {
            return res.json({
                message: "Error Creating NFT",
            }).status(500)
        }

    } catch {
        return res.json({
            message: "Error Creating NFT",
        }).status(500)
    }
})

// listNFT
router.post("/listnft", async (req: Request, res: Response) => {
    const body = req.body;
    const nft: NFTModel = {
        nftAddress: body.nftAddress,
        name: body.name,
        supply: body.supply,
        description: body.description,
        image: body.image || null,
        collection: body.collectionAddress,
        externalLink: body.externalLink,
        blockchain: body.blockchain,
        owner: body.owner,
        price: body.price,
        type: body.type == "fixedprice" ? LISTINGTYPE.fixedprice : LISTINGTYPE.auction,
        auctionTimeEnd: body.auctionTimeEnd || null,
    }

    // get collection and set the nft collection address to collection
    const collectionRef = db.collection("collections").doc(body.collectionAddress);
    nft.collection = collectionRef;

    // get user and set the nft owner to user
    const userRef = db.collection("users").doc(body.owner);
    nft.owner = userRef;

    try {
        const response = await db.collection("nfts").doc(body.nftAddress).set(nft);
        if (response) {
            return res.json({
                message: "NFT Listed",
                data: nft,
            }).status(200)
        }
    } catch {
        return res.json({
            message: "Error Listing NFT",
        }).status(500)
    }
})

// Update ListedNFTs
router.put("/updatenft", async (req: Request, res: Response) => {
    const { nftAddress, ...restBody } = req.body;
    const nftRef = db.collection("nfts").doc(nftAddress);
    const doc = await nftRef.get();
    // get collection ref
    const collectionRef = db.collection("collections").doc(restBody.collectionAddress);
    // get user ref
    const userRef = db.collection("users").doc(restBody.owner);

    restBody.collection = collectionRef;
    restBody.owner = userRef;
    // convert doc to nftModel
    const nft: NFTModel = doc.data() as NFTModel;
    // update the NFT
    const updatedNFT: NFTModel = { ...nft, ...restBody };
    // update nft in firebase
    try {
        const response = await nftRef.set(updatedNFT);
        if (response) {
            return res.json({
                message: "NFT Updated",
                data: updatedNFT,
            }).status(200)
        }
    } catch {
        return res.json({
            message: "Error Updating NFT",
        }).status(500)
    }
})

// Delete ListedNFT
router.delete("/:nftaddress", async (req: Request, res: Response) => {
    const nftAddress = req.params.nftaddress;
    const nftRef = db.collection("nfts").doc(nftAddress);
    try {
        const response = await nftRef.delete();
        if (response) {
            return res.json({
                message: "NFT Deleted",
            }).status(200)
        }
    } catch {
        return res.json({
            message: "Error Deleting NFT",
        }).status(500)
    }
})

// Get FixedPriceNFTs
router.get("/getfixedpricenfts", async (req: Request, res: Response) => {
    const nftsRef = db.collection("nfts");
    const query = nftsRef.where("type", "==", LISTINGTYPE.fixedprice);
    const querySnapshot = await query.get();
    const promises: Promise<NFTModel>[] = [];
    const nfts: NFTModel[] = [];
    if (querySnapshot.empty) {
        return res.json({
            message: "No NFTs Found",
            data: [],
        }).status(200)
    }
    querySnapshot.forEach(async (doc) => {
        promises.push(new Promise(async (resolve, reject) => {
            const nft = doc.data();
            const collection = (await doc.data()?.collection.get()).data();
            collection.category = (await collection.category.get()).data();
            collection.owner = (await collection.owner.get()).data();
            const nftModel = {
                ...nft,
                collection,
                owner: (await doc.data()?.owner.get()).data()
            } as NFTModel;
            nfts.push(nftModel);
            resolve(nftModel);
        }))
    })
    Promise.all(promises).then((data) => {
        return res.json({
            message: "NFTs",
            data: data,
        }).status(200)
    }).catch((err) => {
        console.log(err);
        return res.json({
            message: "Error Fetching NFTs",
        }).status(500)
    })
})

// Get AuctionedNFTs
router.get("/getauctionednfts", async (req: Request, res: Response) => {
    const nftsRef = db.collection("nfts");
    const query = nftsRef.where("type", "==", LISTINGTYPE.auction);
    const querySnapshot = await query.get();
    const promises: Promise<NFTModel>[] = [];
    const nfts: NFTModel[] = [];
    if (querySnapshot.empty) {
        return res.json({
            message: "No NFTs Found",
            data: [],
        }).status(200)
    }
    querySnapshot.forEach(async (doc) => {
        promises.push(new Promise(async (resolve, reject) => {
            const nft = doc.data();
            const collection = (await doc.data()?.collection.get()).data();
            collection.category = (await collection.category.get()).data();
            collection.owner = (await collection.owner.get()).data();
            const nftModel = {
                ...nft,
                collection,
                owner: (await doc.data()?.owner.get()).data()
            } as NFTModel;
            nfts.push(nftModel);
            resolve(nftModel);
        }))
    })
    Promise.all(promises).then((data) => {
        return res.json({
            message: "NFTs",
            data: data,
        }).status(200)
    }).catch((err) => {
        console.log(err);
        return res.json({
            message: "Error Fetching NFTs",
        }).status(500)
    })
})

// Get a Single NFT
router.get("/:nftAddress", async (req: Request, res: Response) => {
    const nftAddress = req.params.nftAddress;
    try {
        const nftRef = db.collection("nfts").doc(nftAddress);
        const doc = await nftRef.get();
        const nft = doc.data() as NFTModel;
        const promises: Promise<NFTModel>[] = [];
        promises.push(new Promise(async (resolve, reject) => {
            const collection = (await doc.data()?.collection.get()).data();
            collection.category = (await collection.category.get()).data();
            collection.owner = (await collection.owner.get()).data();
            const nftModel = {
                ...nft,
                collection,
                owner: (await doc.data()?.owner.get()).data()
            } as NFTModel;
            resolve(nftModel);
        }))
        Promise.all(promises).then((data) => {
            return res.json({
                message: "NFT",
                data: data[0],
            }).status(200)
        }).catch((err) => {
            console.log(err);
            return res.json({
                message: "Error Fetching NFT",
            }).status(500)
        })
    } catch {
        return res.json({
            message: "Error Fetching NFT",
        }).status(500)
    }
})

// Get all NFTS
router.get("/", async (req: Request, res: Response) => {
    const nftsRef = db.collection("nfts");
    const querySnapshot = await nftsRef.get();
    const promises: Promise<NFTModel>[] = [];
    const nfts: NFTModel[] = [];
    if (querySnapshot.empty) {
        return res.json({
            message: "No NFTs",
            data: [],
        }).status(200)
    }
    querySnapshot.forEach(async (doc) => {
        promises.push(new Promise(async (resolve, reject) => {
            const nft = doc.data();
            const collection = (await doc.data()?.collection.get()).data();
            collection.category = (await collection.category.get()).data();
            collection.owner = (await collection.owner.get()).data();
            const nftModel = {
                ...nft,
                collection,
                owner: (await doc.data()?.owner.get()).data()
            } as NFTModel;
            nfts.push(nftModel);
            resolve(nftModel);
        }))
    })
    Promise.all(promises).then((data) => {
        return res.json({
            message: "NFTs",
            data: data,
        }).status(200)
    }).catch((err) => {
        console.log(err);
        return res.json({
            message: "Error Fetching NFTs",
        }).status(500)
    })
})

// Get all fixedprice NFTS of a user
router.get("/getfixedpricenfts/:userAddress", async (req: Request, res: Response) => {
    const userAddress = req.params.userAddress;
    try {
        const nftsRef = db.collection("nfts");
        const userRef = db.collection("users").doc(userAddress);
        const query = nftsRef.where("type", "==", LISTINGTYPE.fixedprice).where("owner", "==", userRef);
        const querySnapshot = await query.get();
        const promises: Promise<NFTModel>[] = [];
        const nfts: NFTModel[] = [];
        if (querySnapshot.empty) {
            return res.json({
                message: "No NFTs",
                data: [],
            }).status(200)
        }
        querySnapshot.forEach(async (doc) => {
            promises.push(new Promise(async (resolve, reject) => {
                const nft = doc.data();
                const collection = (await doc.data()?.collection.get()).data();
                collection.category = (await collection.category.get()).data();
                collection.owner = (await collection.owner.get()).data();
                const nftModel = {
                    ...nft,
                    collection,
                    owner: (await doc.data()?.owner.get()).data()
                } as NFTModel;
                nfts.push(nftModel);
                resolve(nftModel);
            }))
        })
        Promise.all(promises).then((data) => {
            return res.json({
                message: "NFTs",
                data: data,
            }).status(200)
        }).catch((err) => {
            console.log(err);
            return res.json({
                message: "Error Fetching NFTs",
            }).status(500)
        })
    } catch {
        return res.json({
            message: "Error Fetching NFTs",
        }).status(500)
    }

})

// Get all auctioned NFTS of a user
router.get("/getauctionednfts/:userAddress", async (req: Request, res: Response) => {
    const userAddress = req.params.userAddress;
    try {
        const nftsRef = db.collection("nfts");
        const userRef = db.collection("users").doc(userAddress);
        const query = nftsRef.where("type", "==", LISTINGTYPE.auction).where("owner", "==", userRef);
        const querySnapshot = await query.get();
        const promises: Promise<NFTModel>[] = [];
        const nfts: NFTModel[] = [];
        if (querySnapshot.empty) {
            return res.json({
                message: "NFTs",
                data: [],
            }).status(200)
        }

        querySnapshot.forEach(async (doc) => {
            promises.push(new Promise(async (resolve, reject) => {
                const nft = doc.data();
                const collection = (await doc.data()?.collection.get()).data();
                collection.category = (await collection.category.get()).data();
                collection.owner = (await collection.owner.get()).data();
                const nftModel = {
                    ...nft,
                    collection,
                    owner: (await doc.data()?.owner.get()).data()
                } as NFTModel;
                nfts.push(nftModel);
                resolve(nftModel);
            }))
        })
        Promise.all(promises).then((data) => {
            return res.json({
                message: "NFTs",
                data: data,
            }).status(200)
        }).catch((err) => {
            console.log(err);
            return res.json({
                message: "Error Fetching NFTs",
            }).status(500)
        })
    } catch {
        return res.json({
            message: "Error Fetching NFTs",
        }).status(500)
    }
})

// Get all NFTS of a user
router.get("/getnfts/:userAddress", async (req: Request, res: Response) => {
    const userAddress = req.params.userAddress;
    try {
        const nftsRef = db.collection("nfts");
        const userRef = db.collection("users").doc(userAddress);
        const query = nftsRef.where("owner", "==", userRef);
        const querySnapshot = await query.get();
        const promises: Promise<NFTModel>[] = [];
        const nfts: NFTModel[] = [];
        if (querySnapshot.empty) {
            return res.json({
                message: "NFTs",
                data: [],
            }).status(200)
        }
        querySnapshot.forEach(async (doc) => {
            promises.push(new Promise(async (resolve, reject) => {
                const nft = doc.data();
                const collection = (await doc.data()?.collection.get()).data();
                collection.category = (await collection.category.get()).data();
                collection.owner = (await collection.owner.get()).data();
                const nftModel = {
                    ...nft,
                    collection,
                    owner: (await doc.data()?.owner.get()).data()
                } as NFTModel;
                nfts.push(nftModel);
                resolve(nftModel);
            }))
        })
        Promise.all(promises).then((data) => {
            return res.json({
                message: "NFTs",
                data: data,
            }).status(200)
        }).catch((err) => {
            console.log(err);
            return res.json({
                message: "Error Fetching NFTs",
            }).status(500)
        })
    } catch {
        return res.json({
            message: "Error Fetching NFTs",
        }).status(500)
    }
})

// Get all NFTS of a collection
router.get("/getcollectionnfts/:collectionAddress", async (req: Request, res: Response) => {
    const collectionAddress = req.params.collectionAddress;
    try {
        const nftsRef = db.collection("nfts");
        const collectionRef = db.collection("collections").doc(collectionAddress);
        const query = nftsRef.where("collection", "==", collectionRef);
        const querySnapshot = await query.get();
        const promises: Promise<NFTModel>[] = [];
        const nfts: NFTModel[] = [];
        if (querySnapshot.empty) {
            return res.json({
                message: "NFTs",
                data: [],
            }).status(200)
        }
        querySnapshot.forEach(async (doc) => {
            promises.push(new Promise(async (resolve, reject) => {
                const nft = doc.data();
                const collection = (await doc.data()?.collection.get()).data();
                collection.category = (await collection.category.get()).data();
                collection.owner = (await collection.owner.get()).data();
                const nftModel = {
                    ...nft,
                    collection,
                    owner: (await doc.data()?.owner.get()).data()
                } as NFTModel;
                nfts.push(nftModel);
                resolve(nftModel);
            }))
        })
        Promise.all(promises).then((data) => {
            return res.json({
                message: "NFTs",
                data: data,
            }).status(200)
        }).catch((err) => {
            console.log(err);
            return res.json({
                message: "Error Fetching NFTs",
            }).status(500)
        })
    } catch {
        return res.json({
            message: "Error Fetching NFTs",
        }).status(500)
    }
})


export { router as NFTSRoute };