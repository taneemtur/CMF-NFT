import express, {Response, Request} from "express";
import { db } from "../../utils/Firebase";

const router = express.Router();

// Firebase: activity -> nft_activity -> nft_id -> activity_data: [{
//    ...activity_data
// }]

// add
router.post("/", async (req: Request, res: Response) => {
    const { nftId, activityData } = req.body;
    try {
        // activity -> nft_id -> activity_data: [{}]
        const activityRef = db.collection("activity").doc(nftId)
        const activityDoc = await activityRef.get()
        if (activityDoc.exists) {
            const activityDataFir = activityDoc.data()
            if (activityDataFir) {
                const activity = activityDataFir["activity_data"]
                if (activity) {
                    await activityRef.update({
                        "activity_data": [...activity, activityData]
                    })
                } else {
                    await activityRef.update({
                        "activity_data": [activityData]
                    })
                }
            } else {
                await activityRef.update({
                    "activity_data": [activityData]
                })
            }
        }else {
            await activityRef.set({
                "activity_data": [activityData]
            })
        }
        res.status(200).send("Activity added");
    }catch {
        res.status(500).send("Error adding activity");
    }
});

// get
router.get("/:nftId", async (req: Request, res: Response) => {
    const nftId = req.params.nftId;
    try {
        const activityRef = db.collection("activity").doc(nftId)
        const activityDoc = await activityRef.get()
        if (activityDoc.exists) {
            const activityDataFir = activityDoc.data()
            if (activityDataFir) {
                res.status(200).send({
                    "data": activityDataFir["activity_data"],
                    "message": "List of activities"
                })
            }
            else {
                res.status(200).send({
                    "data": {},
                    "message": "List of activities"
                })
            }
        }else{
            res.status(200).send({
                "data": {},
                "message": "List of activities"
            })
        }
    } catch {
        res.status(500).send("Error getting activity");
    }
});

export {router as NFTActivityRouter}