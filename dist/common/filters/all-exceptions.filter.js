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
        const message = isHttpException ? exception.message : 'Internal server error';
        const stack = exception instanceof Error ? exception.stack : undefined;
        this.logger.logError(new Error(message, {
            cause: exception instanceof Error ? exception : undefined
        }), 'ALL_EXCEPTIONS', {
            method: request.method,
            url: request.originalUrl,
            status
        });
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