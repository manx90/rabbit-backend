"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoggerService", {
    enumerable: true,
    get: function() {
        return LoggerService;
    }
});
const _common = require("@nestjs/common");
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
const _path = /*#__PURE__*/ _interop_require_wildcard(require("path"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let LoggerService = class LoggerService {
    ensureLogDirectory() {
        if (!_fs.existsSync(this.logDir)) {
            _fs.mkdirSync(this.logDir, {
                recursive: true
            });
        }
    }
    formatLogMessage(level, message, context, stack) {
        const timestamp = new Date().toISOString();
        const contextStr = context ? ` [${context}]` : '';
        const stackStr = stack ? `\nStack: ${stack}` : '';
        return `${timestamp} [${level}]${contextStr} ${message}${stackStr}\n`;
    }
    writeToFile(filePath, message) {
        try {
            _fs.appendFileSync(filePath, message);
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }
    log(message, context) {
        const formattedMessage = this.formatLogMessage('LOG', message, context);
        console.log(message);
        this.writeToFile(this.appLogFile, formattedMessage);
    }
    error(message, context, stack) {
        const formattedMessage = this.formatLogMessage('ERROR', message, context, stack);
        console.error(message);
        this.writeToFile(this.errorLogFile, formattedMessage);
    }
    warn(message, context) {
        const formattedMessage = this.formatLogMessage('WARN', message, context);
        console.warn(message);
        this.writeToFile(this.appLogFile, formattedMessage);
    }
    debug(message, context) {
        const formattedMessage = this.formatLogMessage('DEBUG', message, context);
        console.debug(message);
        this.writeToFile(this.debugLogFile, formattedMessage);
    }
    info(message, context) {
        const formattedMessage = this.formatLogMessage('INFO', message, context);
        console.info(message);
        this.writeToFile(this.appLogFile, formattedMessage);
    }
    // Method to log API requests and responses
    logApiRequest(method, url, query, body, context) {
        const message = `API Request: ${method} ${url}${query ? ` | Query: ${JSON.stringify(query)}` : ''}${body ? ` | Body: ${JSON.stringify(body)}` : ''}`;
        this.info(message, context || 'API');
    }
    logApiResponse(method, url, statusCode, responseTime, context) {
        const message = `API Response: ${method} ${url} | Status: ${statusCode}${responseTime ? ` | Time: ${responseTime}ms` : ''}`;
        this.info(message, context || 'API');
    }
    // Method to log database operations
    logDatabaseOperation(operation, table, details, context) {
        const message = `DB Operation: ${operation} on ${table}${details ? ` | Details: ${JSON.stringify(details)}` : ''}`;
        this.debug(message, context || 'DATABASE');
    }
    // Method to log errors with full context
    logError(error, context, additionalInfo) {
        const message = `Error: ${error.message}${additionalInfo ? ` | Info: ${JSON.stringify(additionalInfo)}` : ''}`;
        this.error(message, context, error.stack);
    }
    // Method to clean old log files (optional)
    cleanOldLogs(daysToKeep = 7) {
        try {
            const files = _fs.readdirSync(this.logDir);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
            files.forEach((file)=>{
                const filePath = _path.join(this.logDir, file);
                const stats = _fs.statSync(filePath);
                if (stats.mtime < cutoffDate) {
                    _fs.unlinkSync(filePath);
                    this.info(`Deleted old log file: ${file}`, 'LOGGER');
                }
            });
        } catch (error) {
            this.error('Failed to clean old logs', 'LOGGER', error.stack);
        }
    }
    constructor(){
        this.logDir = _path.join(process.cwd(), 'logs');
        this.errorLogFile = _path.join(this.logDir, 'error.log');
        this.appLogFile = _path.join(this.logDir, 'app.log');
        this.debugLogFile = _path.join(this.logDir, 'debug.log');
        this.ensureLogDirectory();
    }
};
LoggerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], LoggerService);

//# sourceMappingURL=logger.service.js.map