import admin from 'firebase-admin';
// const serviceAccount = require('../../serviceAccountKey.json');
import {key} from "./key"

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(JSON.stringify(key))),
    storageBucket: "superex-nft.appspot.com"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
export { admin, db, bucket };