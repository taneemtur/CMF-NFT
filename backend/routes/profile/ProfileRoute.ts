import express, { Request, Response } from "express"
import { db } from '../../utils/Firebase';
import { UserModel } from "../../models/profile/User";
const router = express.Router();

// Firebase :=> User => WalletAddress => Profile


// Set New User - If WalletAddress Not Exist
router.post("/createprofile", async (req: Request, res: Response) => {
    const body = req.body;
    const walletAddress = body.walletAddress;

    const user: UserModel = {
        name: body.name || null,
        email: body.email || null,
        wallterAddress: body.walletAddress,
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

export { router as ProfileRoute }