import express, {Response, Request} from "express";
import { db } from "../../utils/Firebase";

const router = express.Router();

// Firebase: activity -> nft_activity -> nft_id -> activity_data: [{
//    ...activity_data
// }]

// add
router.post("/add", async (req: Request, res: Response) => {
    const { nft_id, activity_data } = req.body;
    try {
        const activityRef = db.collection("activity").doc("nft_activity").collection(nft_id);
        const snapshot = await activityRef.get();
        if (snapshot.empty) {
            // activities[{...activity_data}]
            await activityRef.add({
                activity_data: [activity_data]
            });
        } else {
            // activities[{...activity_data}, {...activity_data}]
            await activityRef.doc(snapshot.docs[0].id).update({
                activity_data: [...snapshot.docs[0].data().activity_data, activity_data]
            });
        }
        res.status(200).send("Activity added");
    }catch {
        res.status(500).send("Error adding activity");
    }
});

// get
router.get("/get", async (req: Request, res: Response) => {
    const { nft_id } = req.body;
    try {
        const activityRef = db.collection("activity").doc("nft_activity").collection(nft_id);
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