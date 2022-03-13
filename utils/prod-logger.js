const {createLogger, format, transports} = require('winston');
const {timestamp, combine, errors, json} = format;


function buildProdLogger(){
    return createLogger({
        //level: 'error',
        format: combine(
            timestamp(),
            errors({stack: true}),
            json()
        ),
        defaultMeta: {service: 'quizz-backend'},
        transports: [
            new transports.Console(),
            new transports.File({ filename: 'logs/error.log', level: 'error' }),
            new transports.File({ filename: 'logs/combined.log' }),
        ]
    });
}



module.exports = buildProdLogger;