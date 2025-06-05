"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OptosModule", {
    enumerable: true,
    get: function() {
        return OptosModule;
    }
});
const _common = require("@nestjs/common");
const _optoscontroller = require("./optos.controller");
const _optostokenservice = require("./optos.token.service");
const _optosshipmentservice = require("./optos.shipment.service");
const _optosapiservices = require("./optos.api.services");
const _axios = require("@nestjs/axios");
const _config = require("@nestjs/config");
const _configservice = require("../config/config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OptosModule = class OptosModule {
};
OptosModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _axios.HttpModule,
            _config.ConfigModule
        ],
        controllers: [
            _optoscontroller.OptosController
        ],
        providers: [
            _optostokenservice.OptosService,
            _optosshipmentservice.OptosShipmentService,
            _optosapiservices.OptosApiService,
            _configservice.AppConfigService
        ],
        exports: [
            _optostokenservice.OptosService,
            _optosshipmentservice.OptosShipmentService,
            _optosapiservices.OptosApiService,
            _configservice.AppConfigService
        ]
    })
], OptosModule);

//# sourceMappingURL=optos.module.js.map