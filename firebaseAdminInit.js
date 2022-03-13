const admin = require('firebase-admin');
const serviceAccount = require("./firebaseSecrets.json");
require('dotenv/config');

function initFirebaseAdmin(){
    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    });
}

async function createTestUserToken(){
    const fakeUid = 'yhZDw7z1OibLh7cQcjI23ZjfpmL2' 
    try {
        return await admin.auth().createCustomToken(fakeUid);
    } catch (error) {
        console.error(new Error(error));
    }
}

module.exports = {initFirebaseAdmin, createTestUserToken};