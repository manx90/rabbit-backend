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
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule);
    // Configure static file serving for uploads
    app.useStaticAssets((0, _path.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads'
    });
    // await dataSource.initialize();
    // await dataSource.runMigrations();
    const config = new _swagger.DocumentBuilder().setTitle('rabbit').setDescription('The rabbit API description').setVersion('1.0').addBearerAuth() // Add Bearer Auth to Swagger
    .build();
    const documentFactory = ()=>_swagger.SwaggerModule.createDocument(app, config);
    _swagger.SwaggerModule.setup('api', app, documentFactory);
    app.use(_bodyparser.json({
        limit: '50mb'
    }));
    app.use(_bodyparser.urlencoded({
        extended: true,
        limit: '50mb'
    }));
    app.use(_loggermiddleware.LoggerMiddleware);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true
    });
    app.useGlobalPipes(new _common.ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));
    var _process_env_PORT;
    await app.listen((_process_env_PORT = process.env.PORT) !== null && _process_env_PORT !== void 0 ? _process_env_PORT : 3000);
}
bootstrap();

//# sourceMappingURL=main.js.map