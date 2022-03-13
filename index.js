const mongoose = require('mongoose');
const initFirebaseAdmin = require('./firebaseAdminInit');
const dbConnectAndListen = require('./mongoDBInit');
const createServer = require('./server');
const buildDevLogger = require('./utils/dev-logger');
const Logger = require('./utils/logger');
const buildProdLogger = require('./utils/prod-logger');
require('dotenv/config');



// Initialize Firebase-Admin-SDK
initFirebaseAdmin.initFirebaseAdmin();
// Middlewares
const app = createServer();


// Start the server
dbConnectAndListen(app);