"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OptosController", {
    enumerable: true,
    get: function() {
        return OptosController;
    }
});
const _common = require("@nestjs/common");
const _optostokenservice = require("./optos.token.service");
const _optosshipmentservice = require("./optos.shipment.service");
const _optosapiservices = require("./optos.api.services");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let OptosController = class OptosController {
    async getToken() {
        try {
            return await this.optosService.Login();
        } catch (error) {
            this.handleError(error);
        }
    }
    async getInfo(token) {
        try {
            if (!token) {
                throw new _common.HttpException('Access token is required', _common.HttpStatus.BAD_REQUEST);
            }
            return await this.optosService.userInfo(token);
        } catch (error) {
            this.handleError(error);
        }
    }
    async createShipment(createshipment) {
        try {
            return await this.optosShipmentService.createShipment(createshipment);
        } catch (error) {
            this.handleError(error);
        }
    }
    async getCities() {
        try {
            return await this.optosApiService.Cities();
        } catch (error) {
            this.handleError(error);
        }
    }
    async getBusinesses() {
        try {
            return await this.optosApiService.Businesses();
        } catch (error) {
            this.handleError(error);
        }
    }
    async getBusinessesAddress() {
        try {
            return await this.optosApiService.BusinessesAddress();
        } catch (error) {
            this.handleError(error);
        }
    }
    async getArea(area) {
        try {
            return this.optosApiService.Area(area);
        } catch (error) {
            this.handleError(error);
        }
    }
    async getShipment() {
        try {
            return this.optosShipmentService.getShipment();
        } catch (error) {
            this.handleError(error);
        }
    }
    async getShipmentType() {
        try {
            return this.optosShipmentService.getShipmentType();
        } catch (error) {
            this.handleError(error);
        }
    }
    async getPendingTypes() {
        try {
            return this.optosShipmentService.getPendingTypes();
        } catch (error) {
            this.handleError(error);
        }
    }
    handleError(error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const message = error.message || 'Failed to get pending types';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const status = error.status || _common.HttpStatus.INTERNAL_SERVER_ERROR;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
        throw new _common.HttpException({
            message,
            status
        }, status);
    }
    constructor(optosService, optosApiService, optosShipmentService){
        this.optosService = optosService;
        this.optosApiService = optosApiService;
        this.optosShipmentService = optosShipmentService;
    }
};
_ts_decorate([
    (0, _common.Get)('token'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], OptosController.prototype, "getToken", null);
_ts_decorate([
    (0, _common.Post)('token'),
    _ts_param(0, (0, _common.Body)('access-token')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], OptosController.prototype, "getInfo", null);
_ts_decorate([
    (0, _common.Post)('Shipment'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], OptosController.prototype, "createShipment", null);
_ts_decorate([
    (0, _common.Get)('city'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], OptosController.prototype, "getCities", null);
_ts_decorate([
    (0, _common.Get)('businesses'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], OptosController.prototype, "getBusinesses", null);
_ts_decorate([
    (0, _common.Get)('BusinessesAddress'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], OptosController.prototype, "getBusinessesAddress", null);
_ts_decorate([
    (0, _common.Get)('city/:area'),
    _ts_param(0, (0, _common.Param)('area')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], OptosController.prototype, "getArea", null);
_ts_decorate([
    (0, _common.Get)('shipment'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], OptosController.prototype, "getShipment", null);
_ts_decorate([
    (0, _common.Get)('shipmentType'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], OptosController.prototype, "getShipmentType", null);
_ts_decorate([
    (0, _common.Get)('pendingTypes'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], OptosController.prototype, "getPendingTypes", null);
OptosController = _ts_decorate([
    (0, _common.Controller)('optos'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _optostokenservice.OptosService === "undefined" ? Object : _optostokenservice.OptosService,
        typeof _optosapiservices.OptosApiService === "undefined" ? Object : _optosapiservices.OptosApiService,
        typeof _optosshipmentservice.OptosShipmentService === "undefined" ? Object : _optosshipmentservice.OptosShipmentService
    ])
], OptosController);

//# sourceMappingURL=optos.controller.js.map