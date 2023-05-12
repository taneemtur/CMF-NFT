import { DocumentData, DocumentReference } from '@firebase/firestore-types'


interface CollectionModel {
    name: string;
    description: string;
    collectionAddress: string;
    owner: DocumentData;
    paymentTokens: string[];
    blockchain: string;
    collectionImage?: string;
}

export { CollectionModel }