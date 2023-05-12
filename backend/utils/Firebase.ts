import admin from 'firebase-admin';
// import ServiceAccount from "../serviceAccountKey"
const serviceAccount = require('../../serviceAccountKey.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export {admin, db};