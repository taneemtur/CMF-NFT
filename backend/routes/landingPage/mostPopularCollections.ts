import express from "express";
import { Request, Response } from "express";
import { db } from "../../utils/Firebase";
import { DocumentData } from "@firebase/firestore-types";

const router = express.Router();

// add
// receive collection address
// firebase -> landing_page -> most_popular_collections -> most_popular_collections: array
router.post("/", async (req: Request, res: Response) => {
    const body = req.body;
    const collectionAddress = body.collectionAddress;
    const mostPopularCollections = db.collection("landing_page").doc("most_popular_collections");
    const snapshot = await mostPopularCollections.get();
    if (snapshot.exists) {
        const data = snapshot.data();
        if (data) {
            let mostPopularCollectionsArray = data.most_popular_collections || [];
            if (mostPopularCollectionsArray.includes(collectionAddress)) {
                // remove collection address
                const collectionRef = db.collection("collections").doc(collectionAddress)
                const collectionSnapshot = await collectionRef.get();
                if (collectionSnapshot.exists) {
                    const collection = collectionSnapshot.data();
                    if (collection) {
                        collection.mostPopular = false;
                        await collectionRef.update(collection);
                    }
                }
                return res.json({
                    message: "Collection Address removed",
                }).status(400)
            } else {
                mostPopularCollectionsArray.push(collectionAddress);
                try {
                    const response = await mostPopularCollections.update({
                        most_popular_collections: mostPopularCollectionsArray
                    });
                    const collectionRef = db.collection("collections").doc(collectionAddress)
                    const collectionSnapshot = await collectionRef.get();
                    if (collectionSnapshot.exists) {
                        const collection = collectionSnapshot.data();
                        if (collection) {
                            collection.mostPopular = true;
                            await collectionRef.update(collection);
                        }
                    }
                    if (response) {
                        return res.json({
                            message: "Collection Address added",
                        }).status(200)
                    }
                } catch (error) {
                    console.log(error);
                    return res.json({
                        message: "error adding collection address",
                    }).status(500)
                }
            }
        }
    } else {
        // create new document
        try {
            const response = await mostPopularCollections.set({
                most_popular_collections: [collectionAddress]
            });
            if (response) {
                return res.json({
                    message: "Collection Address added",
                }).status(200)
            }
        } catch (error) {
            console.log(error);
            return res.json({
                message: "error adding collection address",
            }).status(500)
        }
    }
})

// get
router.get("/", async (req: Request, res: Response) => {
    const mostPopularCollections = db.collection("landing_page").doc("most_popular_collections");
    const snapshot = await mostPopularCollections.get();
    if (snapshot.exists) {
        const data = snapshot.data();
        if (data) {
            const promises: DocumentData[] = []
            let mostPopularCollectionsArray = data.most_popular_collections || [];
            if (mostPopularCollectionsArray.length === 0) {
                return res.json({
                    message: "No Most Popular Collections",
                    data: [],
                }).status(200)
            } else {
                mostPopularCollectionsArray = mostPopularCollectionsArray.slice(0, 10);
                mostPopularCollectionsArray.forEach((collectionAddress: string) => {
                    promises.push(db.collection("collections").doc(collectionAddress).get())
                })
                // fetch owner and category from each collection
                const collections = await Promise.all(promises);
                const collectionsDatapromises: DocumentData[] = []
                collections.forEach(async (collection: DocumentData) => {
                    collectionsDatapromises.push(new Promise(async (res, rej) => {
                        const categoryRef = collection.data()?.category;
                        const category = await categoryRef.get();
                        const ownerRef = collection.data()?.owner;
                        const owner = await ownerRef.get();

                        res({
                            ...collection.data(),
                            category: category.data(),
                            owner: owner.data(),
                        })
                    }))
                })
                Promise.all(collectionsDatapromises).then((collectionsData) => {
                    return res.json({
                        message: "Most Popular Collections",
                        data: collectionsData,
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
    const collectionAddress = body.collectionAddress;
    const mostPopularCollections = db.collection("landing_page").doc("most_popular_collections");
    const snapshot = await mostPopularCollections.get();
    if (snapshot.exists) {
        const data = snapshot.data();
        if (data) {
            let mostPopularCollectionsArray = data.most_popular_collections || [];
            if (mostPopularCollectionsArray.length === 0) {
                return res.json({
                    message: "No Most Popular Collections",
                }).status(200)
            }
            if (mostPopularCollectionsArray.includes(collectionAddress)) {
                mostPopularCollectionsArray = mostPopularCollectionsArray.filter((collection: string) => collection !== collectionAddress)
                try {
                    const response = await mostPopularCollections.update({
                        most_popular_collections: mostPopularCollectionsArray
                    });
                    if (response) {
                        return res.json({
                            message: "Collection Address deleted",
                        }).status(200)
                    }
                } catch (error) {
                    console.log(error);
                    return res.json({
                        message: "error deleting collection address",
                    }).status(500)
                }
            } else {
                return res.json({
                    message: "Collection Address does not exist",
                }).status(400)
            }
        }
    } else {
        return res.json({
            message: "Most Popular Collections does not exist",
        }).status(400)
    }
})

export { router as MostPopularCollectionRoute }