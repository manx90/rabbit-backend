"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appmodule = require("./app.module");
const _bodyparser = /*#__PURE__*/ _interop_require_wildcard(require("body-parser"));
const _swagger = require("@nestjs/swagger");
const _common = require("@nestjs/common");
const _loggermiddleware = require("./common/middleware/logger.middleware");
const _path = require("path");
const _validationexceptionfilter = require("./common/filters/validation-exception.filter");
const _notfoundexceptionfilter = require("./common/filters/not-found-exception.filter");
const _allexceptionsfilter = require("./common/filters/all-exceptions.filter");
const _loggerservice = require("./common/utils/logger.service");
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
// import dataSource from './data-source';
const logger = new _loggerservice.LoggerService();
// Memory optimization for cPanel hosting
if (process.env.NODE_ENV === 'production') {
    // Force garbage collection more frequently
    setInterval(()=>{
        if (global.gc) {
            global.gc();
        }
    }, 30000); // Every 30 seconds
    // Monitor memory usage
    setInterval(()=>{
        const memUsage = process.memoryUsage();
        const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
        if (memUsageMB > 50) {
            // If using more than 50MB
            logger.warn(`High memory usage: ${memUsageMB}MB`, 'MEMORY');
            if (global.gc) {
                global.gc();
                const newUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
                logger.info(`Memory after GC: ${newUsage}MB`, 'MEMORY');
            }
        }
    }, 60000); // Check every minute
}
// Global error handlers for uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (error)=>{
    logger.logError(error, 'UNCAUGHT_EXCEPTION', {
        type: 'uncaughtException',
        timestamp: new Date().toISOString(),
        pid: process.pid
    });
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise)=>{
    const error = reason instanceof Error ? reason : new Error(String(reason));
    logger.logError(error, 'UNHANDLED_REJECTION', {
        type: 'unhandledRejection',
        timestamp: new Date().toISOString(),
        pid: process.pid,
        promise: promise.toString()
    });
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});
process.on('SIGTERM', ()=>{
    logger.info('SIGTERM received, shutting down gracefully', 'PROCESS');
    process.exit(0);
});
process.on('SIGINT', ()=>{
    logger.info('SIGINT received, shutting down gracefully', 'PROCESS');
    process.exit(0);
});
(async ()=>{
    try {
        logger.info('Starting application bootstrap...', 'Bootstrap');
        // Optimize for production environment
        const isProduction = process.env.NODE_ENV === 'production';
        const app = await _core.NestFactory.create(_appmodule.AppModule, {
            // Reduce memory usage for cPanel hosting
            logger: isProduction ? [
                'error',
                'warn'
            ] : [
                'log',
                'error',
                'warn',
                'debug'
            ],
            // Disable unnecessary features to save memory
            bufferLogs: false,
            abortOnError: false
        });
        logger.info('Application created successfully', 'Bootstrap');
        // Configure static file serving for uploads
        app.useStaticAssets((0, _path.join)(__dirname, '..', 'uploads'), {
            prefix: '/uploads'
        });
        // await dataSource.initialize();
        // await dataSource.runMigrations();
        // Only enable Swagger in development
        if (!isProduction) {
            const config = new _swagger.DocumentBuilder().setTitle('rabbit').setDescription('The rabbit API description').setVersion('1.0').addBearerAuth() // Add Bearer Auth to Swagger
            .build();
            const documentFactory = ()=>_swagger.SwaggerModule.createDocument(app, config);
            _swagger.SwaggerModule.setup('api', app, documentFactory);
        }
        // Reduce body parser limits to save memory for cPanel
        const bodyLimit = isProduction ? '5mb' : '50mb';
        app.use(_bodyparser.json({
            limit: bodyLimit,
            // Reduce memory usage
            verify: undefined,
            type: 'application/json'
        }));
        app.use(_bodyparser.urlencoded({
            extended: false,
            limit: bodyLimit,
            parameterLimit: 1000
        }));
        app.use(_loggermiddleware.LoggerMiddleware);
        app.enableCors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: false
        });
        app.useGlobalPipes(new _common.ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true
            },
            whitelist: true,
            forbidNonWhitelisted: true
        }));
        // Apply global exception filters
        app.useGlobalFilters(new _allexceptionsfilter.AllExceptionsFilter(new _loggerservice.LoggerService()), new _validationexceptionfilter.ValidationExceptionFilter(), new _notfoundexceptionfilter.NotFoundExceptionFilter());
        logger.info('Starting server...', 'Bootstrap');
        var _process_env_PORT;
        await app.listen((_process_env_PORT = process.env.PORT) !== null && _process_env_PORT !== void 0 ? _process_env_PORT : 3000, '0.0.0.0');
        var _process_env_PORT1;
        logger.info(`Application is running on: http://0.0.0.0:${(_process_env_PORT1 = process.env.PORT) !== null && _process_env_PORT1 !== void 0 ? _process_env_PORT1 : 3000}`, 'Bootstrap');
    } catch (error) {
        logger.logError(error, 'Bootstrap');
        process.exit(1);
    }
})();

//# sourceMappingURL=main.js.map