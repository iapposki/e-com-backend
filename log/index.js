const {createLogger, transports, format} = require('winston');

const logLevels = {
    fatal : 0,
    error : 1,
    warn  : 2,
    info  : 3,
    debug : 4,
}

const logger = createLogger({
    levels : logLevels,
    transports : [new transports.Console()],
    format : format.combine(format.timestamp(), format.json(), format.prettyPrint()),
})

module.exports = logger;