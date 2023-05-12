import express, { Response, Request } from "express";
import { db } from "../../utils/Firebase";
import { LISTINGTYPE, NFTModel } from "../../models/nfts/NFTS";


const router = express.Router();

// listNFT
router.post("/listnft", async (req: Request, res: Response) => {
    const body = req.body;
    const nft: NFTModel = {
        nftAddress: body.nftAddress,
        name: body.name,
        supply: body.supply,
        description: body.description,
        image: body.image || null,
        collectionAddress: body.collectionAddress,
        metaData: body.metaData,
        blockchain: body.blockchain,
        owner: body.owner,
        price: body.price,
        type: body.type == "fixedprice" ? LISTINGTYPE.fixedprice : LISTINGTYPE.auction,
        auctionTimeEnd: body.auctionTimeEnd || null,
    }

    // get collection and set the nft collection address to collection
    const collectionRef = db.collection("collections").doc(body.collectionAddress);
    nft.collectionAddress = collectionRef;

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
    const { nftAddress, collectionAddress, owner, ...restBody } = req.body;
    const nftRef = db.collection("nfts").doc(nftAddress);
    const doc = await nftRef.get();
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
    const nfts: NFTModel[] = [];
    querySnapshot.forEach((doc) => {
        const nft = doc.data() as NFTModel;
        nfts.push(nft);
    })
    return res.json({
        message: "Fixed Price NFTs",
        data: nfts,
    }).status(200)
})

// Get AuctionedNFTs
router.get("/getauctionednfts", async (req: Request, res: Response) => {
    const nftsRef = db.collection("nfts");
    const query = nftsRef.where("type", "==", LISTINGTYPE.auction);
    const querySnapshot = await query.get();
    const nfts: NFTModel[] = [];
    querySnapshot.forEach((doc) => {
        const nft = doc.data() as NFTModel;
        nfts.push(nft);
    })
    return res.json({
        message: "Auctioned NFTs",
        data: nfts,
    }).status(200)
})

// Get a Single NFT
router.get("/:nftAddress", async (req: Request, res: Response) => {
    const nftAddress = req.params.nftAddress;
    const nftRef = db.collection("nfts").doc(nftAddress);
    const doc = await nftRef.get();
    const nft = doc.data() as NFTModel;
    return res.json({
        message: "NFT",
        data: nft,
    }).status(200)
})

// Get all NFTS
router.get("/", async (req: Request, res: Response) => {
    const nftsRef = db.collection("nfts");
    const querySnapshot = await nftsRef.get();
    const nfts: NFTModel[] = [];
    querySnapshot.forEach((doc) => {
        const nft = doc.data() as NFTModel;
        nfts.push(nft);
    })
    return res.json({
        message: "NFTs",
        data: nfts,
    }).status(200)
})

// Get all fixedprice NFTS of a user
router.get("/getfixedpricenfts/:userAddress", async (req: Request, res: Response) => {
    const userAddress = req.params.userAddress;
    try {
        const nftsRef = db.collection("nfts");
        const userRef = db.collection("users").doc(userAddress);
        const query = nftsRef.where("type", "==", LISTINGTYPE.fixedprice).where("owner", "==", userRef);
        const querySnapshot = await query.get();
        const nfts: NFTModel[] = [];
        querySnapshot.forEach((doc) => {
            const nft = doc.data() as NFTModel;
            nfts.push(nft);
        })
        return res.json({
            message: "Fixed Price NFTs",
            data: nfts,
        }).status(200)
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
        const nfts: NFTModel[] = [];
        querySnapshot.forEach((doc) => {
            const nft = doc.data() as NFTModel;
            nfts.push(nft);
        })
        return res.json({
            message: "Auctioned NFTs",
            data: nfts,
        }).status(200)
    } catch {
        return res.json({
            message: "Error Fetching NFTs",
        }).status(500)
    }
})


export { router as NFTSRoute };