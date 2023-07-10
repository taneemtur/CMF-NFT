import express, { Request, Response } from "express";
import { db } from "../../utils/Firebase";
import { CategoryModel } from "../../models/category/Category";
import { NFTModel } from "../../models/nfts/NFTS";
import { CollectionModel } from "../../models/collections/Collection";
const router = express.Router();

// add
// Firebase
// landing_page -> explore_items -> categoryName -> NFTs -> NFT
router.post("/", async (req: Request, res: Response) => {
    const body = req.body;
    const category = body.category;
    const NFT = body.NFT; // array of NFTs (object)


    const exploreItemsRef = db.collection("landing_page").doc("explore_items").collection(category).doc("NFTs");
    const doc = await exploreItemsRef.get() as any;
    if (!doc.exists) {
        const nftRef = db.collection("nfts").doc(NFT.nftAddress);
        const nftDoc = await nftRef.get() as any;
        if (nftDoc.exists) {
            const nft = nftDoc.data();
            if (nft) {
                nft.exploreItem = true;
                await nftRef.update(nft);
            }
        }
        await exploreItemsRef.set({
            categoryName: category,
            NFTs: [NFT]
        });
    }

    else {
        const NFTs = doc.data()?.NFTs || [];
        // check if NFT already exists
        const NFTAddress = NFT.nftAddress;
        const NFTExists = NFTs.find((NFT: any) => NFT.nftAddress === NFTAddress);
        if (NFTExists) {
            // remove nft
            const newNFTs = NFTs.filter((NFT: any) => NFT.nftAddress !== NFTAddress);
            await exploreItemsRef.update({
                NFTs: newNFTs
            });
            const nftRef = db.collection("nfts").doc(NFT.nftAddress);
            const nftDoc = await nftRef.get() as any;
            if (nftDoc.exists) {
                const nft = nftDoc.data();
                if (nft) {
                    nft.exploreItem = false;
                    await nftRef.update(nft);
                }
            }
            return res.status(200).send({
                message: "Successfully removed explore item",
            });
        } else {
            const nftRef = db.collection("nfts").doc(NFT.nftAddress);
            const nftDoc = await nftRef.get() as any;
            if (nftDoc.exists) {
                const nft = nftDoc.data();
                if (nft) {
                    nft.exploreItem = true;
                    await nftRef.update(nft);
                }
            }
            await exploreItemsRef.update({
                NFTs: [...NFTs, NFT]
            });
        }
    }

    res.status(200).send({
        message: "Successfully added explore item",
    });
});

// get by category
router.get("/categoryname/:categoryName", async (req: Request, res: Response) => {
    const categoryName = req.params.categoryName;
    const exploreItemsRef = db.collection("landing_page").doc("explore_items").collection(categoryName).doc("NFTs");
    const doc = await exploreItemsRef.get();
    if (!doc.exists) {
        res.status(404).send({
            message: "Category not found",
        });
    }
    else {
        // get max of 10
        const NFTs = doc.data()?.NFTs;
        const newNFTs = NFTs.slice(0, 10);
        res.status(200).send({
            message: "Successfully retrieved explore items",
            data: newNFTs,
        });
    }
});

// delete by category
router.delete("/:categoryName", async (req: Request, res: Response) => {
    const categoryName = req.params.categoryName;
    const exploreItemsRef = db.collection("explore_items").doc(categoryName);
    const doc = await exploreItemsRef.get();
    if (!doc.exists) {
        res.status(404).send({
            message: "Category not found",
        });
    }
    else {
        await exploreItemsRef.delete();
        res.status(200).send({
            message: "Successfully deleted explore items",
        });
    }
});

// get all categires, all Nfts in each category
router.get("/categoriessnfts", async (req: Request, res: Response) => {

    // fetch all categories
    const categoriesRef = db.collection("categories")
    const categoriesDoc = await categoriesRef.get();
    const categories: any[] = [];
    for (const doc of categoriesDoc.docs) {
        const category = doc.data()
        const categoryName = category.name;
        if (category?.isHome) {
            categories.push(categoryName);
        }
    }


    const landingpageRef = db.collection("landing_page").doc("explore_items");
    const categoriesNFTs: any = {};
    for (const category of categories) {
        try {
            const exploreItemsRef = landingpageRef.collection(category).doc("NFTs");
            const doc = await exploreItemsRef.get();
            if (!doc.exists) {
                categoriesNFTs[category] = [];
            }
            else {
                const NFTs = doc.data()?.NFTs;
                const newNFTs = NFTs.slice(0, 10);
                categoriesNFTs[category] = newNFTs;
            }
        } catch (err) {
            console.log(err);
        }
    }

    // add new category "All" and add all NFTs to it
    const allNFTs: any[] = [];
    for (const category in categoriesNFTs) {
        allNFTs.push(...categoriesNFTs[category]);
    }

    categoriesNFTs["All"] = allNFTs;

    res.status(200).send({
        message: "Successfully retrieved categories and NFTs",
        data: {
            categories: categories,
            categoriesNFTs: categoriesNFTs,
        },
    });

});

// delete by NFT Address in a category
router.delete("/:categoryName/:NFTAddress", async (req: Request, res: Response) => {
    const categoryName = req.params.categoryName;
    const NFTAddress = req.params.NFTAddress;
    const exploreItemsRef = db.collection("landing_page").doc("explore_items").collection(categoryName).doc("NFTs");
    const doc = await exploreItemsRef.get();
    if (!doc.exists) {
        res.status(404).send({
            message: "Category not found",
        });
    }
    else {
        const NFTs = doc.data()?.NFTs;
        const newNFTs = NFTs.filter((NFT: any) => NFT.nftAddress !== NFTAddress);
        await exploreItemsRef.update({
            NFTs: newNFTs
        });
        res.status(200).send({
            message: "Successfully deleted explore items",
        });
    }
});

export { router as ExploreItemsRoute }