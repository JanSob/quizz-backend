const mongoose = require('mongoose');
const initFirebaseAdmin = require('./firebaseAdminInit');
const dbConnectAndListen = require('./mongoDBInit');
const createServer = require('./server');
const logger = require('./utils/dev-logger')();
require('dotenv/config');


// Initialize Firebase-Admin-SDK
initFirebaseAdmin.initFirebaseAdmin();
// Middlewares
const app = createServer();

// Start the server
dbConnectAndListen(app);