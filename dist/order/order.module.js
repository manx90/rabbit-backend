"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrderModule", {
    enumerable: true,
    get: function() {
        return OrderModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _ordercontroller = require("./order.controller");
const _orderservice = require("./order.service");
const _orderentity = require("./order.entity");
const _productentity = require("../product/entities/product.entity");
const _authentity = require("../auth/entities/auth.entity");
const _orderrepository = require("./order.repository");
const _authrepository = require("../common/Repositories/auth.repository");
const _authmodule = require("../auth/auth.module");
const _jwt = require("@nestjs/jwt");
const _optosshipmentservice = require("../optos/optos.shipment.service");
const _optosmodule = require("../optos/optos.module");
const _optostokenservice = require("../optos/optos.token.service");
const _optosapiservices = require("../optos/optos.api.services");
const _axios = require("@nestjs/axios");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OrderModule = class OrderModule {
};
OrderModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _orderentity.order,
                _orderentity.orderitem,
                _productentity.product,
                _authentity.auth
            ]),
            _authmodule.AuthModule,
            _optosmodule.OptosModule,
            _axios.HttpModule,
            _jwt.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: '1h'
                }
            })
        ],
        controllers: [
            _ordercontroller.OrderController
        ],
        providers: [
            _orderservice.OrderService,
            _orderrepository.OrderRepository,
            _authrepository.AuthRepository,
            _optosshipmentservice.OptosShipmentService,
            _optostokenservice.OptosService,
            _optosapiservices.OptosApiService
        ],
        exports: [
            _orderservice.OrderService
        ]
    })
], OrderModule);

//# sourceMappingURL=order.module.js.map