const {createLogger, format, transports} = require('winston');
const {timestamp, combine, printf, colorize, errors} = format;


function buildDevLogger(){
    const customLogFormat = printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${stack || message}`;
      });
    
    return createLogger({
        //level: 'error',
        format: combine(
            colorize(), 
            timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            errors({stack: true}),
            customLogFormat
        ),
        transports: [
            new transports.Console()
        ]
    });
}



module.exports = buildDevLogger;