import express from "express"
import { Request, Response } from "express";
import { db } from "../../utils/Firebase";
import { v4 as uuid } from 'uuid';

const router = express.Router();

// function to update the nft owner
function updateNFTOwner(nftAddress: string, newOwner: string) {
    const nft = db.collection("nfts").doc(nftAddress);
    nft.update({
        owner: newOwner
    })
}

// add transaction
// Transactions Table: 
// Seller_id
// Buyer_id
// tokenId
// nftAddress
// collectionAddress

router.post("/", async (req: Request, res: Response) => {
    const body = req.body;
    const sellerId = body.sellerId;
    const buyerId = body.buyerId;
    const tokenId = body.tokenId;
    const nftAddress = body.nftAddress;
    const collectionAddress = body.collectionAddress;

    const data = {
        seller_id: sellerId,
        buyer_id: buyerId,
        tokenId: tokenId,
        nftAddress: nftAddress,
        collectionAddress: collectionAddress
    }

    try {
        const id = uuid();
        const response = await db.collection("fixed_priced_transactions").doc(id).set(data);
        if (response) {
            updateNFTOwner(nftAddress, buyerId);
            return res.json({
                message: "Transaction added",
            }).status(200)
        }
    } catch (error) {
        console.log(error);
        return res.json({
            message: "error adding transaction",
        }).status(500)
    }
})

export {router as FixedPricedNFTsRoute}