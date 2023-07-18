
interface BidModel  {
    nftAddress: string;
    blockchain: string;
    price: string;
    user: string;
    owner: string;
    auctionTimeStart: string | null;
    auctionTimeEnd: string | null;
    userBidTime: string | null;
    auctionListingId?: number | null;
    paymentToken?: string | null;
    claimReward: Boolean | null;
    claimNFT: Boolean | null;
}


export {BidModel};