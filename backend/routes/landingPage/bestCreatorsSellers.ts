import express, { Response, Request } from "express";
import { db } from "../../utils/Firebase";
import { UserModel } from "../../models/profile/User";
import { DocumentData } from "@firebase/firestore-types";

const router = express.Router();


// add
// receive user wallet address
// firebase -> landing_page -> best_creators_sellers -> best_creators_sellers: array
router.post("/", async (req: Request, res: Response) => {
    const body = req.body;
    const walletAddress = body.walletAddress;
    const bestCreatorsSellers = db.collection("landing_page").doc("best_creators_sellers");
    const snapshot = await bestCreatorsSellers.get();
    if (snapshot.exists) {
        const data = snapshot.data();
        if (data) {
            let bestCreatorsSellersArray = data.best_creators_sellers || [];
            if (bestCreatorsSellersArray.includes(walletAddress)) {
                return res.json({
                    message: "Wallet Address already exists",
                }).status(400)
            } else {
                bestCreatorsSellersArray.push(walletAddress);
                try {
                    const response = await bestCreatorsSellers.update({
                        best_creators_sellers: bestCreatorsSellersArray
                    });
                    if (response) {
                        return res.json({
                            message: "Wallet Address added",
                        }).status(200)
                    }
                } catch (error) {
                    console.log(error);
                    return res.json({
                        message: "error adding wallet address",
                    }).status(500)
                }
            }
        }
    } else {
        // create new document
        try {
            const response = await bestCreatorsSellers.set({
                best_creators_sellers: [walletAddress]
            });
            if (response) {
                return res.json({
                    message: "Wallet Address added",
                }).status(200)
            }
        } catch (error) {
            console.log(error);
            return res.json({
                message: "error adding wallet address",
            }).status(500)
        }
    }
})

// get
router.get("/", async (req: Request, res: Response) => {
    const bestCreatorsSellers = db.collection("landing_page").doc("best_creators_sellers");
    const snapshot = await bestCreatorsSellers.get();
    if (snapshot.exists) {
        const data = snapshot.data();
        if (data) {
            const promises = []
            let bestCreatorsSellersArray = data.best_creators_sellers || [];
            if (bestCreatorsSellersArray.length === 0) {
                return res.json({
                    message: "No Best Creators Sellers",
                    data: [],
                }).status(200)
            }
            bestCreatorsSellersArray = bestCreatorsSellersArray.slice(0, 10);
            for (let i = 0; i < bestCreatorsSellersArray.length; i++) {
                const walletAddress = bestCreatorsSellersArray[i];
                const promise = db.collection("users").doc(walletAddress).get();
                promises.push(promise);
            }
            const snapshots = await Promise.all(promises);
            const users:DocumentData[] = [];
            snapshots.forEach((snapshot) => {
                if (snapshot.exists) {
                    const user = snapshot.data();
                    if (user) {
                        users.push(user);
                    }
                }
            })
            return res.json({
                message: "Best Creators Sellers Fetched",
                data: users,
            }).status(200)
        }
    } else {
        return res.json({
            message: "Best Creators Sellers does not exist",
        }).status(400)
    }
})

// delete
router.delete("/", async (req: Request, res: Response) => {
    const body = req.body;
    const walletAddress = body.walletAddress;
    const bestCreatorsSellers = db.collection("landing_page").doc("best_creators_sellers");
    const snapshot = await bestCreatorsSellers.get();
    if (snapshot.exists) {
        const data = snapshot.data();
        if (data) {
            const bestCreatorsSellersArray = data.best_creators_sellers || [];
            if (bestCreatorsSellersArray.length === 0) {
                return res.json({
                    message: "No Best Creators Sellers",
                    data: [],
                }).status(200)
            }
            if (bestCreatorsSellersArray.includes(walletAddress)) {
                const index = bestCreatorsSellersArray.indexOf(walletAddress);
                bestCreatorsSellersArray.splice(index, 1);
                try {
                    const response = await bestCreatorsSellers.update({
                        best_creators_sellers: bestCreatorsSellersArray
                    });
                    if (response) {
                        return res.json({
                            message: "Wallet Address deleted",
                        }).status(200)
                    }
                } catch (error) {
                    console.log(error);
                    return res.json({
                        message: "error deleting wallet address",
                    }).status(500)
                }
            } else {
                return res.json({
                    message: "Wallet Address does not exist",
                }).status(400)
            }
        }
    } else {
        return res.json({
            message: "Best Creators Sellers does not exist",
        }).status(400)
    }
})

export { router as BestCreatorsSellersRoute}