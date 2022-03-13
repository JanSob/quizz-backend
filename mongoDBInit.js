const mongoose = require('mongoose');
const winston = require('winston');
const Logger = require('./utils/logger');

// 1. Connect to DB (retry every 30 seconds)
// 2. When connected to DB start the server
async function dbConnectAndListen(app) {
    connectedToDB = false;
    //console.log('Trying to connect to DB');
    while(!connectedToDB){
        await mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }).then(
        () => {
          connectedToDB = true;
          //console.log('Connected to DB:' + process.env.DB_CONNECTION);
        },
        err => {
          console.log('Error trying to connect to DB, retrying in 30 seconds, errosmessage: ' + err.reason);
          setTimeout(resolve, 30000);
        }
      );
    }
    // Start listening
    app.listen(process.env.PORT || 3000, () => Logger.info("Listening at port: 3000 (if undefined) or " + process.env.PORT ));
    
  }

  module.exports = dbConnectAndListen;