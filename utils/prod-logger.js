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
            new transports.Console()
        ]
    });
}



module.exports = buildProdLogger;