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
    image?: string | null;
    collection: DocumentData | CollectionModel;
    externalLink: string;
    blockchain: string;
    type: LISTINGTYPE | null;
    price: string;
    owner: DocumentData | UserModel;
    auctionTimeEnd: string | null;
    supply: string;
    listed?: boolean;
    tokenID?: string;
}


export {NFTModel};