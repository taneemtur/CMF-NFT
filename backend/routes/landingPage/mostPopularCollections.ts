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
    try {
        const mostPopularCollections = db.collection("landing_page").doc("most_popular_collections");
        const snapshot = await mostPopularCollections.get();
        
        if (snapshot.exists) {
            const data = snapshot.data();
            if (data) {
                let mostPopularCollectionsArray: string[] = data.most_popular_collections || [];
                if (mostPopularCollectionsArray.length === 0) {
                    return res.json({
                        message: "No Most Popular Collections",
                        data: [],
                    }).status(200);
                } else {
                    mostPopularCollectionsArray = mostPopularCollectionsArray.slice(0, 10);
                    const promises: Promise<any>[] = [];
                    
                    mostPopularCollectionsArray.forEach((collectionAddress: string) => {
                        const collectionRef = db.collection("collections").doc(collectionAddress);
                        promises.push(collectionRef.get());
                    });

                    const collections = await Promise.all(promises);

                    const collectionsDataPromises: Promise<any>[] = collections.map(async (collectionSnapshot) => {
                        const collectionData = collectionSnapshot.data();
                        if (!collectionData) return null;

                        const categoryRef = collectionData.category;
                        const ownerRef = collectionData.owner;

                        const [categorySnapshot, ownerSnapshot] = await Promise.all([
                            categoryRef.get(),
                            ownerRef.get()
                        ]);

                        const categoryData = categorySnapshot.data();
                        const ownerData = ownerSnapshot.data();

                        if (categoryData && ownerData) {
                            return {
                                ...collectionData,
                                category: categoryData,
                                owner: ownerData,
                            };
                        }

                        return null;
                    });

                    const collectionsDataArray = await Promise.all(collectionsDataPromises);
                    const validCollectionsData = collectionsDataArray.filter((collectionData) => collectionData !== null);

                    return res.json({
                        message: "Most Popular Collections",
                        data: validCollectionsData,
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