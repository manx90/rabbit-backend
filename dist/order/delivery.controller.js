"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DeliveryController", {
    enumerable: true,
    get: function() {
        return DeliveryController;
    }
});
const _common = require("@nestjs/common");
const _deliveryrepository = require("./delivery.repository");
const _deliverydto = require("./delivery.dto");
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
let DeliveryController = class DeliveryController {
    async createDelivery(createDeliveryDto) {
        try {
            const delivery = await this.deliveryRepository.createDelivery(createDeliveryDto);
            return {
                success: true,
                message: 'Delivery created successfully',
                data: delivery
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
    async getAllDeliveries() {
        try {
            const deliveries = await this.deliveryRepository.getAllDeliveries();
            return {
                success: true,
                message: 'Deliveries retrieved successfully',
                data: deliveries,
                count: deliveries.length
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
    async getDeliveryById(id) {
        try {
            const delivery = await this.deliveryRepository.getDeliveryById(id);
            return {
                success: true,
                message: 'Delivery retrieved successfully',
                data: delivery
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
    async getDeliveryByCity(cityName) {
        try {
            const delivery = await this.deliveryRepository.getDeliveryByCity(cityName);
            return {
                success: true,
                message: 'Delivery retrieved successfully',
                data: delivery
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
    async getDeliveryByOptusId(optusId) {
        try {
            const delivery = await this.deliveryRepository.getDeliveryByOptusId(optusId);
            return {
                success: true,
                message: 'Delivery retrieved successfully',
                data: delivery
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
    async getDeliveryPriceByCity(cityName) {
        try {
            const price = await this.deliveryRepository.getDeliveryPriceByCity(cityName);
            return {
                success: true,
                message: 'Delivery price retrieved successfully',
                data: {
                    cityName,
                    price
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
    async getDeliveryPriceByOptusId(optusId) {
        try {
            const price = await this.deliveryRepository.getDeliveryPriceByOptusId(optusId);
            return {
                success: true,
                message: 'Delivery price retrieved successfully',
                data: {
                    optusId,
                    price
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
    async updateDelivery(id, updateDeliveryDto) {
        try {
            const delivery = await this.deliveryRepository.updateDelivery(id, updateDeliveryDto);
            return {
                success: true,
                message: 'Delivery updated successfully',
                data: delivery
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
    async deleteDelivery(id) {
        try {
            await this.deliveryRepository.deleteDelivery(id);
            return {
                success: true,
                message: 'Delivery deleted successfully',
                data: null
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
    async searchDeliveries(searchTerm) {
        try {
            const deliveries = await this.deliveryRepository.searchDeliveries(searchTerm);
            return {
                success: true,
                message: 'Search completed successfully',
                data: deliveries,
                count: deliveries.length
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
    async getDeliveryCount() {
        try {
            const count = await this.deliveryRepository.countDeliveries();
            return {
                success: true,
                message: 'Delivery count retrieved successfully',
                data: {
                    count
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
    async bulkCreateDeliveries(deliveries) {
        try {
            const createdDeliveries = await this.deliveryRepository.bulkCreateDeliveries(deliveries);
            return {
                success: true,
                message: `Bulk created ${createdDeliveries.length} deliveries successfully`,
                data: createdDeliveries,
                count: createdDeliveries.length
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
    constructor(deliveryRepository){
        this.deliveryRepository = deliveryRepository;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _deliverydto.CreateDeliveryDto === "undefined" ? Object : _deliverydto.CreateDeliveryDto
    ]),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "createDelivery", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "getAllDeliveries", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "getDeliveryById", null);
_ts_decorate([
    (0, _common.Get)('city/:cityName'),
    _ts_param(0, (0, _common.Param)('cityName')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "getDeliveryByCity", null);
_ts_decorate([
    (0, _common.Get)('optus/:optusId'),
    _ts_param(0, (0, _common.Param)('optusId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "getDeliveryByOptusId", null);
_ts_decorate([
    (0, _common.Get)('price/city/:cityName'),
    _ts_param(0, (0, _common.Param)('cityName')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "getDeliveryPriceByCity", null);
_ts_decorate([
    (0, _common.Get)('price/optus/:optusId'),
    _ts_param(0, (0, _common.Param)('optusId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "getDeliveryPriceByOptusId", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _deliverydto.UpdateDeliveryDto === "undefined" ? Object : _deliverydto.UpdateDeliveryDto
    ]),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "updateDelivery", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.HttpCode)(_common.HttpStatus.NO_CONTENT),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "deleteDelivery", null);
_ts_decorate([
    (0, _common.Get)('search/:term'),
    _ts_param(0, (0, _common.Param)('term')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "searchDeliveries", null);
_ts_decorate([
    (0, _common.Get)('stats/count'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "getDeliveryCount", null);
_ts_decorate([
    (0, _common.Post)('bulk'),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "bulkCreateDeliveries", null);
DeliveryController = _ts_decorate([
    (0, _common.Controller)('delivery'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _deliveryrepository.DeliveryRepository === "undefined" ? Object : _deliveryrepository.DeliveryRepository
    ])
], DeliveryController);

//# sourceMappingURL=delivery.controller.js.map