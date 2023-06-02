import express, { Request, Response } from "express"
import { db, bucket } from '../../utils/Firebase';
import { UserModel } from "../../models/profile/User";
import multer from "multer";
import { v4 as uuid } from 'uuid';
import { NFTModel } from "../../models/nfts/NFTS";

const router = express.Router();
// Firebase :=> User => WalletAddress => Profile

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');


// Set New User - If WalletAddress Not Exist
router.post("/createprofile", async (req: Request, res: Response) => {
    const body = req.body;
    const walletAddress = body.walletAddress;

    const user: UserModel = {
        name: body.name || null,
        email: body.email || null,
        bannerImage: body.bannerImage || null,
        profileImage: body.profileImage || null,
        walletAddress: body.walletAddress,
        bio: body.bio || null,
        twitterAccount: body.twitterAccount || null,
        wesite: body.wesite || null,
        url: body.url || null
    }
    // Check if user exist
    const userRef = db.collection("users").doc(walletAddress);
    const doc = await userRef.get();

    if (doc.exists) {
        return res.json({
            message: "User Already Exist",
            data: doc.data(),
        }).status(400)
    }

    try {
        const response = await db.collection("users").doc(walletAddress).set(user);
        if (response) {
            return res.json({
                message: "Profile Created",
                data: user,
            }).status(200)
        }
    } catch (error) {
        console.log(error);
        return res.json({
            message: "error creating profile",
        }).status(500)
    }
})

// upload profile image
router.post("/uploadprofileimage/:walletAddress", upload, async (req: Request, res: Response) => {
    const walletAddress = req.params.walletAddress;
    const file = req.file;
    if (file) {
        const metadata = {
            metadata: {
                firebaseStorageDownloadTokens: uuid()
            },
            contentType: file.mimetype,
            cacheControl: 'public, max-age=31536000',
        };

        // compress the quality of image only
        // const compressedImage = await sharp(file.buffer).webp({ quality: 50 }).toBuffer();

        // upload this webp image to firebase storage
        const filepath = `users/${walletAddress}/profileimage`;


        const fileUpload = bucket.file(filepath);
        await fileUpload.save(file.buffer, {
            metadata: metadata,
        });
        // get image url
        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`;
        // update user profile image
        const userRef = db.collection("users").doc(walletAddress);
        const response = await userRef.update({
            profileImage: url,
        });
        if (response) {
            return res.json({
                message: "Profile Image Uploaded",
                data: url,
            }).status(200)
        }
        else
            return res.json({
                message: "error uploading profile image",
            }).status(500)
    }
    
    return res.json({
        message: "error uploading profile image",
    }).status(500)
})


router.post("/uploadbannerimage/:walletAddress", upload, async (req: Request, res: Response) => {
    const walletAddress = req.params.walletAddress;
    const file = req.file;
    if (file) {
        const metadata = {
            metadata: {
                firebaseStorageDownloadTokens: uuid()
            },
            contentType: file.mimetype,
            cacheControl: 'public, max-age=31536000',
        };

        // compress the quality of image only
        // const compressedImage = await sharp(file.buffer).webp({ quality: 50 }).toBuffer();

        // upload this webp image to firebase storage
        const filepath = `users/${walletAddress}/bannerimage`;


        const fileUpload = bucket.file(filepath);
        await fileUpload.save(file.buffer, {
            metadata: metadata,
        });
        // get image url
        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`;
        // update user profile image
        const userRef = db.collection("users").doc(walletAddress);
        const response = await userRef.update({
            bannerImage: url,
        });
        if (response) {
            return res.json({
                message: "Banner Image Uploaded",
                data: url,
            }).status(200)
        }
        else
            return res.json({
                message: "error uploading banner image",
            }).status(500)
    }
    
    return res.json({
        message: "error uploading banner image",
    }).status(500)
})




// Get User Profile
router.get("/:walletaddress", async (req: Request, res: Response) => {
    const walletaddress = req.params.walletaddress;
    // get the user profile from firebase
    const userRef = db.collection("users").doc(walletaddress);
    const doc = await userRef.get();

    if (doc.exists) {
        return res.json({
            message: "User Profile",
            data: doc.data(),
        }).status(200)
    }

    res.json({ message: "Profile not found" }).status(404)
})

// Update User
router.put("/updateprofile", async (req: Request, res: Response) => {
    const body = req.body;
    const { walletAddress, ...rest } = body;
    const userRef = db.collection("users").doc(walletAddress);

    // check if user exist
    const doc = await userRef.get();
    if (doc.exists) {
        // update user
        const response = await userRef.update(rest);
        if (response) {
            return res.json({
                message: "Profile Updated",
                data: rest,
            }).status(200)
        }
        return res.json({
            message: "error updating profile",
        }).status(500)
    }
    return res.json({
        message: "User Not Found",
    }).status(404)
})


// add liked NFTs to user profile
router.post("/addlikednfts", async (req: Request, res: Response) => {
    const body = req.body;
    const { walletAddress, nft } = body;
    const userRef = db.collection("users").doc(walletAddress);

    // check if user exist
    const doc = await userRef.get();
    if (doc.exists) {
        // update user
        const response = await userRef.update({
            likedNFTs: [...doc.data()?.likedNFTs, nft]
        });
        if (response) {
            return res.json({
                message: "Liked NFTs Updated",
                data: nft,
            }).status(200)
        }
        return res.json({
            message: "error updating liked NFTs",
        }).status(500)
    }
    return res.json({
        message: "User Not Found",
    }).status(404)
})

// remove liked NFTs from user profile
router.post("/removelikednfts", async (req: Request, res: Response) => {
    const body = req.body;
    const { walletAddress, nftAddress } = body;
    const userRef = db.collection("users").doc(walletAddress);

    // check if user exist
    const doc = await userRef.get();
    if (doc.exists) {
        // update user
        const response = await userRef.update({
            likedNFTs: doc.data()?.likedNFTs.filter((nft: NFTModel) => nft.nftAddress !== nftAddress)
        });
        if (response) {
            return res.json({
                message: "Liked NFTs Updated",
                data: nftAddress,
            }).status(200)
        }
        return res.json({
            message: "error updating liked NFTs",
        }).status(500)
    }
    return res.json({
        message: "User Not Found",
    }).status(404)
})

// get liked NFTs from user profile
router.get("/getlikednfts/:walletAddress", async (req: Request, res: Response) => {
    const walletAddress = req.params.walletAddress;
    const userRef = db.collection("users").doc(walletAddress);

    // check if user exist
    const doc = await userRef.get();
    if (doc.exists) {
        return res.json({
            message: "Liked NFTs",
            data: doc.data()?.likedNFTs,
        }).status(200)
    }
    return res.json({
        message: "User Not Found",
    }).status(404)
})

// add followed users to user profile
router.post("/addfollowedusers", async (req: Request, res: Response) => {
    const body = req.body;
    const { walletAddress, user } = body;
    const userRef = db.collection("users").doc(walletAddress);

    // check if user exist
    const doc = await userRef.get();
    if (doc.exists) {
        // update user
        const response = await userRef.update({
            followedUsers: [...doc.data()?.followedUsers, user]
        });
        if (response) {
            return res.json({
                message: "Followed Users Updated",
                data: user,
            }).status(200)
        }
        return res.json({
            message: "error updating followed users",
        }).status(500)
    }
    return res.json({

        message: "User Not Found",
    }).status(404)
})

// remove followed users from user profile
router.post("/removefollowedusers", async (req: Request, res: Response) => {
    const body = req.body;
    const { walletAddress, userAddress } = body;
    const userRef = db.collection("users").doc(walletAddress);

    // check if user exist
    const doc = await userRef.get();
    if (doc.exists) {
        // update user
        const response = await userRef.update({
            followedUsers: doc.data()?.followedUsers.filter((user: UserModel) => user.walletAddress !== userAddress)
        });
        if (response) {
            return res.json({
                message: "Followed Users Updated",
                data: userAddress,
            }).status(200)
        }
        return res.json({
            message: "error updating followed users",
        }).status(500)
    }
    return res.json({
        message: "User Not Found",
    }).status(404)
})

// get followed users from user profile
router.get("/getfollowedusers/:walletAddress", async (req: Request, res: Response) => {
    const walletAddress = req.params.walletAddress;
    const userRef = db.collection("users").doc(walletAddress);

    // check if user exist
    const doc = await userRef.get();
    if (doc.exists) {
        return res.json({
            message: "Followed Users",
            data: doc.data()?.followedUsers,
        }).status(200)
    }
    return res.json({
        message: "User Not Found",
    }).status(404)
})




export { router as ProfileRoute }