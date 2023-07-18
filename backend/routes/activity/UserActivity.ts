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
        const activityRef = db.collection("activity").doc(userId);
        const activityDoc = await activityRef.get();

        if (activityDoc.exists) {
            const activityData = activityDoc.data();
            if(activityData){
                const valuesArray = Object.values(activityData);
                const activityArray: any[] = [];
                
                valuesArray.forEach(item => {
                    if(Array.isArray(item)){
                        item.forEach(child => {
                            activityArray.push(child);
                        });
                    }
                });
                res.status(200).send({
                    "data": activityArray, // Wrap the data in an array since we have only one document
                    "message": "Activity found for the specified wallet address" 
                });
            }
        } else {
            res.status(200).send({
                "data": [],
                "message": "No activity found for the specified wallet address"
            });
        }

    } catch{
        res.status(500).send("Error getting activity");
    }
});

export { router as UserActivityRouter }