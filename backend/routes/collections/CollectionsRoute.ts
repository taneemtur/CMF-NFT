import express, { Request, Response } from "express";
import { CollectionModel } from "../../models/collections/Collection";
import { bucket, db } from "../../utils/Firebase";
import multer from "multer";
import { v4 as uuid } from "uuid"

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

// Create Collection
router.post("/createcollection", upload, async (req: Request, res: Response) => {
    const body = JSON.parse(req.body.data);
    const file = req.file;
    const collectionID = uuid();
    const collection: CollectionModel = {
        name: body.name,
        description: body.description,
        collectionAddress: collectionID,
        owner: body.owner,
        paymentTokens: body.paymentTokens,
        blockchain: body.blockchain,
        collectionImage: body.collectionImage || null,
        category: body.categoryID
    }

    try {
        const userRef = db.collection("users").doc(body.owner);
        // Upload the image to firebase storage
        if (file) {
            const metadata = {
                metadata: {
                    firebaseStorageDownloadTokens: uuid()
                },
                contentType: file.mimetype,
                cacheControl: 'public, max-age=31536000',
            };
            const filepath = `collections/${collectionID}/collectionImage`;

            const fileUpload = bucket.file(filepath);
            await fileUpload.save(file.buffer, {
                metadata: metadata,
            });
            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`;
            collection.owner = userRef;
            collection.collectionImage = url;

            const categoryref = db.collection("categories").doc(body.categoryID);
            collection.category = categoryref;


            const response = await db.collection("collections").doc(collectionID).set(collection);
            if (response) {
                return res.json({
                    message: "Collection Created",
                    data: collection,
                }).status(200)
            } else {
                return res.json({
                    message: "error creating collection",
                }).status(500)
            }
        } else {
            return res.json({
                message: "error creating collection",
            }).status(500)
        }

    } catch (error) {
        console.log(error);
        return res.json({
            message: "error creating collection",
        }).status(500)
    }
})


// Update Collection
router.put("/updatecollection", upload, async (req: Request, res: Response) => {
    const body = JSON.parse(req.body.data);
    const file = req.file;

    const { collectionAddress, ...restBody } = body;
    const collectionRef = db.collection("collections").doc(collectionAddress);
    const doc = await collectionRef.get();
    // convert doc to collectionModel
    const collection: CollectionModel = doc.data() as CollectionModel;
    // check if owner in body
    if (restBody.owner) {
        const userRef = db.collection("users").doc(restBody.owner);
        restBody.owner = userRef;
    }
    // check if category in body
    if (restBody.category) {
        const categoryref = db.collection("categories").doc(restBody.category);
        restBody.category = categoryref;
    }

    if (file) {
        const metadata = {
            metadata: {
                firebaseStorageDownloadTokens: uuid()
            },
            contentType: file.mimetype,
            cacheControl: 'public, max-age=31536000',
        };
        const filepath = `collections/${collectionAddress}/collectionImage`;

        const fileUpload = bucket.file(filepath);
        await fileUpload.save(file.buffer, {
            metadata: metadata,
        });
        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`;
        collection.collectionImage = url;
    }
    // update collection
    const updatedCollection: CollectionModel = { ...collection, ...restBody };
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
        const data = {
            ...doc.data(),
            category: (await doc.data()?.category.get()).data(),
            owner: (await doc.data()?.owner.get()).data(),
        }
        return res.json({
            message: "Collection",
            data: data,
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
    if (snapshot.empty) {
        console.log("No collection ref")
        return res.json({
            message: "Collections",
            data: [],
        }).status(200)
    }
    const promises: Promise<CollectionModel>[] = []
    snapshot.forEach(async (doc) => {
        promises.push(new Promise(async (resolve, reject) => {
            const data = {
                ...doc.data(),
                category: (await doc.data()?.category.get()).data(),
                owner: (await doc.data()?.owner.get()).data(),
            }
            collections.push(data as CollectionModel);
            resolve(data as CollectionModel);
        }))
    });
    Promise.all(promises).then(() => {

        return res.json({
            message: "Collections",
            data: collections,
        }).status(200)
    }).catch((error) => {
        console.log(error);
        return res.json({
            message: "error getting collections",
        }).status(500)
    })
})

export { router as CollectionsRoute }