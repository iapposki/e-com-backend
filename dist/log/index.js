"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston = require("winston");
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
};
exports.logger = winston.createLogger({
    levels: logLevels,
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.prettyPrint()),
});
