"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthModule", {
    enumerable: true,
    get: function() {
        return AuthModule;
    }
});
const _common = require("@nestjs/common");
const _passport = require("@nestjs/passport");
const _typeorm = require("@nestjs/typeorm");
const _jwt = require("@nestjs/jwt");
const _authcontroller = require("./auth.controller");
const _authservice = require("./auth.service");
const _authrepository = require("../common/Repositories/auth.repository");
const _authentity = require("./entities/auth.entity");
const _localstrategy = require("../common/strategies/local.strategy");
const _jwtstrategy = require("../common/strategies/jwt.strategy");
const _rolesguard = require("../common/guards/roles.guard");
const _configmodule = require("../config/config.module");
const _configservice = require("../config/config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _passport.PassportModule.register({
                defaultStrategy: 'jwt'
            }),
            _configmodule.AppConfigModule,
            _typeorm.TypeOrmModule.forFeature([
                _authentity.auth
            ]),
            _jwt.JwtModule.registerAsync({
                imports: [
                    _configmodule.AppConfigModule
                ],
                inject: [
                    _configservice.AppConfigService
                ],
                useFactory: (config)=>({
                        secret: config.jwtAccessToken,
                        signOptions: {
                            expiresIn: config.jwtExpiration
                        }
                    })
            })
        ],
        controllers: [
            _authcontroller.AuthController
        ],
        providers: [
            _authservice.AuthService,
            _authrepository.AuthRepository,
            _localstrategy.LocalStrategy,
            _jwtstrategy.JwtStrategy,
            _rolesguard.RolesGuard
        ],
        exports: [
            _authservice.AuthService
        ]
    })
], AuthModule);

//# sourceMappingURL=auth.module.js.map