const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv/config');



// Imports Routes
const adminRoute = require('./routes/admin/adminRoute')
const multipleChoiceRoute = require('./routes/admin/multipleChoiceRoute')
const sessionGeneratorRoute = require('./routes/users/sessionGeneratorRoute')

var corsOptions = {
    exposedHeaders: 'auth-token'
  }

// Middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Import routes
app.use('/admin', adminRoute);
app.use('/multiple-choices', multipleChoiceRoute);
app.use('/session-generator', sessionGeneratorRoute);

// Initialize Firebase-Admin-SDK
const admin = require('firebase-admin');
const serviceAccount = require("./firebaseSecrets.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Connect to DB (retry every 30 seconds)
connectedToDB = false;
console.log('Trying to connect to DB');

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser:true}).then(
  () => {
      connectedToDB = true;
      console.log('Connected to DB:' + process.env.DB_CONNECTION);
  },
  err => {
      console.log('Error trying to connect to DB, retrying in 30 seconds, errosmessage: ' + err.reason);
      setTimeout(resolve, 30000);
  }
);


/* while(!connectedToDB){
        mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser:true}).then(
        () => {
            connectedToDB = true;
            console.log('Connected to DB:' + process.env.DB_CONNECTION);
        },
        err => {
            console.log('Error trying to connect to DB, retrying in 30 seconds, errosmessage: ' + err.reason);
            setTimeout(resolve, 30000);
        }
    );
} */

// The server starts listening
app.listen(process.env.PORT || 3000, () => console.log("Listening at port: 3000 (if undefined) or " + process.env.PORT ));


