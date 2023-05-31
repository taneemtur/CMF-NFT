import express from "express"
import { Request, Response } from "express";
import { db } from "../../utils/Firebase";

const router = express.Router();

// add
// Transactions Table: 
// Bidder_id
// Bidder_price
// tokenId
// nftAddress
// collectionAddress

router.post("/", async (req: Request, res: Response) => {
    const body = req.body;
    const bidderId = body.bidderId;
    const bidderPrice = body.bidderPrice;
    const tokenId = body.tokenId;
    const nftAddress = body.nftAddress;
    const collectionAddress = body.collectionAddress;
    const transaction = db.collection("auction_priced_transactions").doc();
    try {
        const response = await transaction.set({
            bidder_id: bidderId,
            bidder_price: bidderPrice,
            tokenId: tokenId,
            nftAddress: nftAddress,
            collectionAddress: collectionAddress
        });
        if (response) {
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

// update owner of NFT
router.put("/", async (req: Request, res: Response) => {
    const body = req.body;
    const nftAddress = body.nftAddress;
    const newOwner = body.newOwner;
    const nft = db.collection("nfts").doc(nftAddress);
    try {
        const newOwnerRef = db.collection("users").doc(newOwner);
        const response = await nft.update({
            owner: newOwnerRef
        });
        if (response) {
            return res.json({
                message: "NFT owner updated",
            }).status(200)
        }
    } catch (error) {
        console.log(error);
        return res.json({
            message: "error updating nft owner",
        }).status(500)
    }
})

export {router as AuctionPricedNFTsRoute}