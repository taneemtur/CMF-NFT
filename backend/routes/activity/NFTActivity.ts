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
        const activityRef = db.collection("activity").doc("nft_activity").collection(nftId);
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
    }catch {
        res.status(500).send("Error adding activity");
    }
});

// get
router.get("/", async (req: Request, res: Response) => {
    const { nftId } = req.body;
    try {
        const activityRef = db.collection("activity").doc("nft_activity").collection(nftId);
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

export {router as NFTActivityRouter}