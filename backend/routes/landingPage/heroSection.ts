import express from "express";
import { Request, Response } from "express";
import { db } from "../../utils/Firebase";
import { DocumentData } from "@firebase/firestore-types";

const router = express.Router();

// add
// receive nft address
// firebase -> landing_page -> hero_section -> hero_section: array
router.post("/", async (req: Request, res: Response) => {
    const body = req.body;
    const nftAddress = body.nftAddress;
    const heroSection = db.collection("landing_page").doc("hero_section");
    const snapshot = await heroSection.get();
    if (snapshot.exists) {
        const data = snapshot.data();
        if (data) {
            let heroSectionArray = data.hero_section || [];
            if (heroSectionArray.includes(nftAddress)) {
                // remove NFT Address
                const nftRef = db.collection("nfts").doc(nftAddress)
                const nftSnapshot = await nftRef.get();
                if (nftSnapshot.exists) {
                    const nft = nftSnapshot.data();
                    if (nft) {
                        nft.heroSection = false;
                        await nftRef.update(nft);
                    }
                }
                return res.json({
                    message: "NFT removed",
                }).status(400)
            } else {
                heroSectionArray.push(nftAddress);
                try {
                    const response = await heroSection.update({
                        hero_section: heroSectionArray
                    });
                    const nftRef = db.collection("nfts").doc(nftAddress)
                    const nftSnapshot = await nftRef.get();
                    if (nftSnapshot.exists) {
                        const nft = nftSnapshot.data();
                        if (nft) {
                            nft.heroSection = true;
                            await nftRef.update(nft);
                        }
                    }
                    if (response) {
                        return res.json({
                            message: "NFT Address added",
                        }).status(200)
                    }
                } catch (error) {
                    console.log(error);
                    return res.json({
                        message: "error adding nft address",
                    }).status(500)
                }
            }
        }
    } else {
        // create new document
        try {
            const response = await heroSection.set({
                hero_section: [nftAddress]
            });
            if (response) {
                return res.json({
                    message: "NFT Address added",
                }).status(200)
            }
        } catch (error) {
            console.log(error);
            return res.json({
                message: "error adding nft address",
            }).status(500)
        }
    }
})

// get
router.get("/", async (req: Request, res: Response) => {
    try {
        const herosection = db.collection("landing_page").doc("hero_section");
        const snapshot = await herosection.get();
        
        if (snapshot.exists) {
            const data = snapshot.data();
            if (data) {
                let heroSectionArray: string[] = data.hero_section || [];
                if (heroSectionArray.length === 0) {
                    return res.json({
                        message: "No Most Popular Collections",
                        data: [],
                    }).status(200);
                } else {
                    heroSectionArray = heroSectionArray.slice(0, 10);
                    const promises: Promise<any>[] = [];
                    
                    heroSectionArray.forEach((nftAddress: string) => {
                        const nftRef = db.collection("nfts").doc(nftAddress);
                        promises.push(nftRef.get());
                    });

                    const nfts = await Promise.all(promises);

                    const nftsDataPromises: Promise<any>[] = nfts.map(async (nftSnapshot) => {
                        const nftData = nftSnapshot.data();
                        if (!nftData) return null;

                        const collectionRef = nftData.collection;
                        const ownerRef = nftData.owner;

                        const [collectionSnapshot, ownerSnapshot] = await Promise.all([
                            collectionRef.get(),
                            ownerRef.get()
                        ]);

                        const collectionData = collectionSnapshot.data();
                        const ownerData = ownerSnapshot.data();

                        if (collectionData && ownerData) {
                            return {
                                ...nftData,
                                collection: collectionData,
                                owner: ownerData,
                            };
                        }

                        return null;
                    });

                    const nftDataArray = await Promise.all(nftsDataPromises);
                    const validNftsData = nftDataArray.filter((nftData) => nftData !== null);

                    return res.json({
                        message: "Most Popular Collections",
                        data: validNftsData,
                    }).status(200);
                }
            }
        } else {
            return res.json({
                message: "Most Popular Collections does not exist",
            }).status(400);
        }
    } catch (error) {
        console.log(error);
        return res.json({
            message: "Error fetching Most Popular Collections",
        }).status(500);
    }
});


// delete
router.delete("/", async (req: Request, res: Response) => {
    const body = req.body;
    const nftAddress = body.nftAddress;
    const heroSection = db.collection("landing_page").doc("hero_section");
    const snapshot = await heroSection.get();
    if (snapshot.exists) {
        const data = snapshot.data();
        if (data) {
            let heroSectionArray = data.hero_section || [];
            if (heroSectionArray.includes(nftAddress)) {
                heroSectionArray = heroSectionArray.filter((nft: string) => nft !== nftAddress);
                try {
                    const response = await heroSection.update({
                        hero_section: heroSectionArray
                    });
                    if (response) {
                        return res.json({
                            message: "NFT Address deleted",
                        }).status(200)
                    }
                } catch (error) {
                    console.log(error);
                    return res.json({
                        message: "error deleting nft address",
                    }).status(500)
                }
            } else {
                return res.json({
                    message: "NFT Address does not exist",
                }).status(400)
            }
        }
    } else {
        return res.json({
            message: "Hero Section does not exist",
        }).status(400)
    }
})


export { router as HeroSectionRouter }