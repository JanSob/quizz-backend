const express = require('express');
const router = express.Router();

const cors = require('cors');
const bodyParser = require('body-parser');
const apiErrorHandler = require('./error/api-error-handler');
require('dotenv/config');
// Imports Routes
const adminRoute = require('./routes/admin/adminRoute');
const multipleChoiceRoute = require('./routes/admin/multipleChoiceRoute');
const sessionGeneratorRoute = require('./routes/users/sessionGeneratorRoute');

function createServer(){
    var corsOptions = {
        exposedHeaders: 'auth-token'
      }

    const app = express();
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use('/admin', adminRoute);
    app.use('/multiple-choices', multipleChoiceRoute);
    app.use('/session-generator', sessionGeneratorRoute);
    // apiErrorHandler must be positioned AFTER the routes
    app.use(apiErrorHandler);
    return app;
}

module.exports = createServer;