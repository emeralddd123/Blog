const winston = require('winston');
const { combine, timestamp, printf, colorize, align, json } = winston.format;

const errorFilter = winston.format((info, opts) => {
    return info.level === 'error' ? info : false;
});

const infoFilter = winston.format((info, opts) => {
    return info.level === 'info' ? info : false;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.File({
            filename: 'combined.log',
        }),
        new winston.transports.File({
            filename: 'app-error.log',
            level: 'error',
            format: combine(errorFilter(), timestamp(), json()),
        }),
        new winston.transports.File({
            filename: 'app-info.log',
            level: 'info',
            format: combine(infoFilter(), timestamp(), json()),
        }),
    ],
});


module.exports = logger





