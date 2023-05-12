import { DocumentData } from "@firebase/firestore-types";

export enum LISTINGTYPE {
    "fixedprice"="fixedprice",
    "auction"="auction"
}

interface NFTModel  {
    nftAddress: string;
    name: string;
    description: string;
    image?: string;
    collectionAddress: DocumentData;
    metaData: string;
    blockchain: string;
    type: LISTINGTYPE
    price: string;
    owner: DocumentData;
    auctionTimeEnd: string | null;
    supply: string;
}


export {NFTModel};