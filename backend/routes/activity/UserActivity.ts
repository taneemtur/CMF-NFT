import express, { Response, Request } from "express";
import { db } from "../../utils/Firebase";

const router = express.Router();

// activity -> user_activity -> user_id -> activity_name: [{
//    ...activity_data
// }]
// User Activities
// Create Collection
// Create NFT
// List NFT
// Buy NFT
// Sell NFT
// Like user
// Follow user
// Delete NFT
// Delete Collection
// Edit NFT
// Edit Collection


// add activity/update the activity
router.post("/", async (req: Request, res: Response) => {
    const { userId, activityName, activityData } = req.body;
    try {
        const activityRef = db.collection("activity").doc(userId)
        const activityDoc = await activityRef.get()
        if (activityDoc.exists) {
            const activityDataFir = activityDoc.data()

            if (activityDataFir) {
                const activity = activityDataFir[activityName]
                if (activity) {
                    await activityRef.update({
                        [activityName]: [...activity, activityData]
                    })
                } else {
                    await activityRef.update({
                        [activityName]: [activityData]
                    })
                }
            } else {
                await activityRef.update({
                    [activityName]: [activityData]
                })
            }
        }
        else {
            await activityRef.set({
                [activityName]: [activityData]
            })
        }

        res.status(200).send("Activity added");

    } catch {
        res.status(500).send("Error adding activity");
    }
});

// get activity of user
router.get("/:userId", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const activityRef = db.collection("activity").doc(userId)
        const activityDoc = await activityRef.get()
        if (activityDoc.exists) {
            const activityDataFir = activityDoc.data()
            if (activityDataFir) {
                res.status(200).send({
                    "data": activityDataFir,
                    "message": "List of activities"
                })
            }
            else {
                res.status(200).send({
                    "data": [],
                    "message": "List of activities"
                })
            }
        }else{
            res.status(200).send({
                "data": [],
                "message": "List of activities"
            })
        }

    } catch{
        res.status(500).send("Error getting activity");
    }
});

export { router as UserActivityRouter }