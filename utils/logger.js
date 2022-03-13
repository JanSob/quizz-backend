const buildDevLogger = require('./dev-logger');
const buildProdLogger = require('./prod-logger');
require('dotenv/config');

let Logger = null;
if(process.env.NODE_ENV === 'development'){
    Logger = buildDevLogger();
    Logger.info('dev-logger instantiated');
} else {
    Logger = buildProdLogger();
    Logger.info('prod-logger instantiated');
}
module.exports = Logger;