import { DocumentData } from "@firebase/firestore-types";
import { CollectionModel } from "../collections/Collection";
import { UserModel } from "../profile/User";

export enum LISTINGTYPE {
    "fixedprice"="fixedprice",
    "auction"="auction"
}

interface NFTModel  {
    nftAddress: string;
    name: string;
    description: string;
    image?: string;
    collection: DocumentData | CollectionModel;
    metaData: string;
    blockchain: string;
    type: LISTINGTYPE
    price: string;
    owner: DocumentData | UserModel;
    auctionTimeEnd: string | null;
    supply: string;
}


export {NFTModel};