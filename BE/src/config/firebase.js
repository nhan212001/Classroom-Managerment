const admin = require("firebase-admin");
const path = require("path");
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require(path.join(__dirname, "key.json"));

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore().collection("classrooms").where;


module.exports = { db };