import { DocumentData, DocumentReference } from '@firebase/firestore-types'
import { CategoryModel } from '../category/Category';
import { UserModel } from '../profile/User';


interface CollectionModel {
    name: string;
    description: string;
    collectionAddress: string;
    owner: DocumentData | UserModel;
    blockchain: string;
    collectionImage?: string;
    category: DocumentData | string | CategoryModel | DocumentReference<DocumentData> | DocumentReference<CategoryModel>;
    approved: boolean;
}

export { CollectionModel }