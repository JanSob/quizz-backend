const firebaseAdmin = require("firebase-admin");
require('dotenv/config');
const auth = require('firebase-admin/auth');


// This function uses FirebaseAuth to check if the token is valid.
// If it is valid, it will put the id to req.user (extracted from the token),
// and if it's invalid it will return a res.status(401).send('Authorization failed, access denied');

module.exports = async function(req, res, next){
    try {
        const token = req.header('auth-token');
        if(!token) return res.status(401).send('Authorization failed, access denied');
        // idToken comes from the client app
        const decodedToken = await auth.getAuth().verifyIdToken(token);
        const uid = decodedToken.uid;
        console.log("uid: " + uid);
        req.studentId = uid;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
} 