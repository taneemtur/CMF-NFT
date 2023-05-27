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
                return res.json({
                    message: "NFT Address already exists",
                }).status(400)
            } else {
                heroSectionArray.push(nftAddress);
                try {
                    const response = await heroSection.update({
                        hero_section: heroSectionArray
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
    const herosection = db.collection("landing_page").doc("hero_section");
    const snapshot = await herosection.get();
    if (snapshot.exists) {
        const data = snapshot.data();
        if (data) {
            const promises: DocumentData[] = []
            let heroSectionArray = data.hero_section || [];
            if (heroSectionArray.length === 0) {
                return res.json({
                    message: "No Most Popular Collections",
                    data: [],
                }).status(200)
            } else {
                heroSectionArray = heroSectionArray.slice(0, 10);
                heroSectionArray.forEach((nftAddress: string) => {
                    promises.push(db.collection("nfts").doc(nftAddress).get())
                })
                // fetch owner and category from each collection
                const nfts = await Promise.all(promises);
                const nftsDataPromises: DocumentData[] = []
                nfts.forEach(async (nft: DocumentData) => {
                    nftsDataPromises.push(new Promise(async (res, rej) => {
                        const collectionRef:any = nft.data()?.collection;
                        const collection :any= await collectionRef.get();
                        const ownerRef = nft.data()?.owner;
                        const owner = await ownerRef.get();

                        res({
                            ...nft.data(),
                            collection: collection.data(),
                            owner: owner.data(),
                        })
                    }))
                })
                Promise.all(nftsDataPromises).then((nftData) => {
                    return res.json({
                        message: "Most Popular Collections",
                        data: nftData,
                    }).status(200)
                }).catch((error) => {
                    console.log(error);
                    return res.json({
                        message: "error fetching collection data",
                    }).status(500)
                })
            }
        }
    } else {
        return res.json({
            message: "Most Popular Collections does not exist",
        }).status(400)
    }
})

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