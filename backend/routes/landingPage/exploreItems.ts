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
    const NFTs = body.NFTs; // array of NFTs (object)


    const exploreItemsRef = db.collection("landing_page").doc("explore_items").collection(category).doc("NFTs");
    const doc = await exploreItemsRef.get();
    if (!doc.exists) {
        await exploreItemsRef.set({
            categoryName: category,
            NFTs: NFTs
        });
    }
    else {
        await exploreItemsRef.update({
            NFTs: [...doc.data()?.NFTs, NFTs]
        });
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
    const categoriesRef = db.collection("categories")
    const categoriesDoc = await categoriesRef.get();
    // fetch all collections with the categoryRef
    const categories: any[] = [];
    const categoriesNFTs: any = {};
    for (const doc of categoriesDoc.docs) {
        const category = doc.data()
        const categoryName = category.name;
        categories.push(categoryName);
        // fetch all NFTs containing the categoryName
        const nftsRef = db.collection("nfts")
        const nftsDoc = await nftsRef.where("category", "==", categoryName).get();
        const nfts: any[] = [];
        for (const doc of nftsDoc.docs) {
            const nft = doc.data()
            const owner = await nft.owner.get();
            const collection = await nft.collection.get();
            const data = {
                name: nft.name,
                price: nft.price,
                image: nft.image,
                supply: nft.supply,
                listed: nft.listed,
                collection: {
                    name: collection.data()?.name,
                },
                owner: {
                    name: owner.data()?.name,
                    address: owner.data()?.walletAddress,
                }
            }
            nfts.push(data);
        }
        categoriesNFTs[categoryName] = [
            ...categoriesNFTs[categoryName] || [],
            ...nfts
        ];

    }
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