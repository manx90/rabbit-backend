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
function LoggerMiddleware(req, res, next) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${ip} - ${userAgent}`);
    // Track response time
    const start = Date.now();
    res.on('finish', ()=>{
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    next();
}

//# sourceMappingURL=logger.middleware.js.map