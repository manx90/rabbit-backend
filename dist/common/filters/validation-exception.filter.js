"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ValidationExceptionFilter", {
    enumerable: true,
    get: function() {
        return ValidationExceptionFilter;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ValidationExceptionFilter = class ValidationExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        let message = 'Validation failed';
        let errors = [];
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            if ('message' in exceptionResponse) {
                if (Array.isArray(exceptionResponse.message)) {
                    message = 'Validation failed';
                    errors = exceptionResponse.message;
                } else {
                    message = exceptionResponse.message;
                }
            }
        } else {
            message = exception.message;
        }
        response.status(status).json({
            statusCode: status,
            message,
            errors,
            timestamp: new Date().toISOString(),
            path: ctx.getRequest().url
        });
    }
};
ValidationExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_common.BadRequestException)
], ValidationExceptionFilter);

//# sourceMappingURL=validation-exception.filter.js.map