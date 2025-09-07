"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _typeorm = require("@nestjs/typeorm");
const _authmodule = require("./auth/auth.module");
const _configmodule = require("./config/config.module");
const _configservice = require("./config/config.service");
const _filestoragemodule = require("./file-storage/file-storage.module");
const _optosmodule = require("./optos/optos.module");
const _ordermodule = require("./order/order.module");
const _productmodule = require("./product/product.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _configmodule.AppConfigModule,
            _jwt.JwtModule.registerAsync({
                imports: [
                    _configmodule.AppConfigModule
                ],
                inject: [
                    _configservice.AppConfigService
                ],
                useFactory: (config)=>({
                        global: true,
                        secret: config.jwtAccessToken,
                        signOptions: {
                            expiresIn: config.jwtExpiration
                        }
                    })
            }),
            _typeorm.TypeOrmModule.forRootAsync({
                imports: [
                    _configmodule.AppConfigModule
                ],
                inject: [
                    _configservice.AppConfigService
                ],
                useFactory: (config)=>({
                        type: 'mysql',
                        host: config.host,
                        port: config.port,
                        username: config.user,
                        password: config.pass,
                        database: config.db,
                        entities: [
                            __dirname + '/**/*.entity{.ts,.js}'
                        ],
                        synchronize: process.env.NODE_ENV !== 'production',
                        migrationsRun: true,
                        // Memory optimization for cPanel
                        extra: {
                            connectionLimit: process.env.NODE_ENV === 'production' ? 3 : 10,
                            // Reduce memory usage
                            maxIdle: 10000,
                            idleTimeout: 60000
                        },
                        // Disable logging in production to save memory
                        logging: false
                    })
            }),
            _authmodule.AuthModule,
            _ordermodule.OrderModule,
            _productmodule.ProductModule,
            _optosmodule.OptosModule,
            _filestoragemodule.FileStorageModule
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map