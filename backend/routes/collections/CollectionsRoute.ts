import express, { Request, Response } from "express";
import { CollectionModel } from "../../models/collections/Collection";
import { db } from "../../utils/Firebase";

const router = express.Router();

// Create Collection
router.post("/createcollection", async (req: Request, res: Response) => {
    const body = req.body;
    const collection: CollectionModel = {
        name: body.name,
        description: body.description,
        collectionAddress: body.collectionAddress,
        owner: body.owner,
        paymentTokens: body.paymentTokens,
        blockchain: body.blockchain,
        collectionImage: body.collectionImage || null,
    }

    
    try {
        const userRef = db.collection("users").doc(body.owner);
     
        collection.owner = userRef;
        const response = await db.collection("collections").doc(body.collectionAddress).set(collection);
        if (response) {
            return res.json({
                message: "Profile Created",
                data: collection,
            }).status(200)
        }
    } catch (error) {
        console.log(error);
        return res.json({
            message: "error creating collection",
        }).status(500)
    }
})


// Update Collection
router.put("/updatecollection", async (req: Request, res: Response) => {
    const {collectionAddress, ...restBody} = req.body;
    const collectionRef = db.collection("collections").doc(collectionAddress);
    const doc = await collectionRef.get();
    // convert doc to collectionModel
    const collection: CollectionModel = doc.data() as CollectionModel;
    // check if owner in body
    if (restBody.owner) {
        const userRef = db.collection("users").doc(restBody.owner);
        restBody.owner = userRef;
    }
    // update collection
    const updatedCollection: CollectionModel = {...collection, ...restBody};
    // update collection in firebase
    try {
        const response = await collectionRef.set(updatedCollection);
        if (response) {
            return res.json({
                message: "Collection Updated",
                data: updatedCollection,
            }).status(200)
        }
    } catch (error) {
        console.log(error);
        return res.json({
            message: "error updating collection",
        }).status(500)
    }
})

// Delete Collection
router.delete("/:collectionaddress", async (req: Request, res: Response) => {
    const collectionAddress = req.params.collectionaddress;
    const collectionRef = db.collection("collections").doc(collectionAddress);
    const doc = await collectionRef.get();
    if (doc.exists) {
        try {
            const response = await collectionRef.delete();
            if (response) {
                return res.json({
                    message: "Collection Deleted",
                }).status(200)
            }
        } catch (error) {
            console.log(error);
            return res.json({
                message: "error deleting collection",
            }).status(500)
        }
    }
    return res.json({
        message: "Collection Not Found",
    }).status(404)
})

// Get a collection
router.get("/:collectionaddress", async (req: Request, res: Response) => {
    const collectionAddress = req.params.collectionaddress;
    const collectionRef = db.collection("collections").doc(collectionAddress);
    const doc = await collectionRef.get();
    if (doc.exists) {
        return res.json({
            message: "Collection",
            data: doc.data(),
        }).status(200)
    }
    return res.json({
        message: "Collection Not Found",
    }).status(404)
})

// Get all collections of a user
router.get("/user/:useraddress", async (req: Request, res: Response) => {
    const userAddress = req.params.useraddress;
    const userRef = db.collection("users").doc(userAddress);
    const collectionsRef = db.collection("collections").where("owner", "==", userRef);

    const collections: CollectionModel[] = [];
    const snapshot = await collectionsRef.get();
    snapshot.forEach((doc) => {
        collections.push(doc.data() as CollectionModel);
    });
    return res.json({
        message: "Collections",
        data: collections,
    }).status(200)
})

export { router as CollectionsRoute }