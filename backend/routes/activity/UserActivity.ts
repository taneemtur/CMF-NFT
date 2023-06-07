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
        const activityRef = db.collection("activity").doc(userId).collection(activityName);
        const snapshot = await activityRef.get();
        if (snapshot.empty) {
            // activities[{...activity_data}]
            await activityRef.add({
                activity_data: [activityData]
            });
        } else {
            // activities[{...activity_data}, {...activity_data}]
            await activityRef.doc(snapshot.docs[0].id).update({
                activity_data: [...snapshot.docs[0].data().activity_data, activityData]
            });
        }
        res.status(200).send("Activity added");
    } catch {
        res.status(500).send("Error adding activity");
    }
});

// get activity of user
router.get("/", async (req: Request, res: Response) => {
    const { userId, activityName } = req.body;
    try {
        const activityRef = db.collection("activity").doc(userId).collection(activityName);
        const snapshot = await activityRef.get();
        if (snapshot.empty) {
            res.status(200).send([]);
        } else {
            res.status(200).send(snapshot.docs[0].data().activity_data);
        }
    } catch {
        res.status(500).send("Error getting activity");
    }
});

export { router as UserActivityRouter}