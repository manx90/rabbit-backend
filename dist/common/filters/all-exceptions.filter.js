"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AllExceptionsFilter", {
    enumerable: true,
    get: function() {
        return AllExceptionsFilter;
    }
});
const _common = require("@nestjs/common");
const _loggerservice = require("../utils/logger.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const isHttpException = exception instanceof _common.HttpException;
        const status = isHttpException ? exception.getStatus() : _common.HttpStatus.INTERNAL_SERVER_ERROR;
        // Build a rich error payload for logs
        let errorResponse;
        if (isHttpException) {
            errorResponse = exception.getResponse();
        } else if (exception instanceof Error) {
            errorResponse = {
                name: exception.name,
                message: exception.message,
                stack: exception.stack
            };
        } else {
            errorResponse = {
                message: 'Unknown error',
                value: String(exception)
            };
        }
        // Log with request context
        this.logger.error(`Unhandled exception at ${request.method} ${request.originalUrl}`, 'ALL_EXCEPTIONS', typeof errorResponse === 'string' ? errorResponse : JSON.stringify({
            status,
            error: errorResponse,
            params: request.params,
            query: request.query,
            body: request.body
        }));
        // Prepare client-safe body
        const message = isHttpException ? exception.message : 'Internal server error';
        const errorBody = isHttpException ? exception.getResponse() : {
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url
        };
        response.status(status).json(errorBody);
    }
    constructor(logger = new _loggerservice.LoggerService()){
        this.logger = logger;
    }
};
AllExceptionsFilter = _ts_decorate([
    (0, _common.Catch)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _loggerservice.LoggerService === "undefined" ? Object : _loggerservice.LoggerService
    ])
], AllExceptionsFilter);

//# sourceMappingURL=all-exceptions.filter.js.map