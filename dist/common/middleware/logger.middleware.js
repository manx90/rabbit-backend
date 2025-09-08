"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoggerMiddleware", {
    enumerable: true,
    get: function() {
        return LoggerMiddleware;
    }
});
const _loggerservice = require("../utils/logger.service");
function LoggerMiddleware(req, res, next) {
    const logger = new _loggerservice.LoggerService();
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    logger.info(`${method} ${originalUrl} - ${ip} - ${userAgent}`, 'REQUEST');
    const start = Date.now();
    res.on('finish', ()=>{
        const duration = Date.now() - start;
        logger.info(`${method} ${originalUrl} - ${res.statusCode} - ${duration}ms`, 'RESPONSE');
    });
    next();
}

//# sourceMappingURL=logger.middleware.js.map