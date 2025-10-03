"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DeliveryRepository", {
    enumerable: true,
    get: function() {
        return DeliveryRepository;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _deliverymodel = require("./delivery.model");
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
let DeliveryRepository = class DeliveryRepository {
    async createDelivery(dto) {
        // Check if city already exists
        const existingDelivery = await this.deliveryRepo.findOne({
            where: {
                cityName: dto.cityName
            }
        });
        if (existingDelivery) {
            throw new _common.BadRequestException(`Delivery for city ${dto.cityName} already exists`);
        }
        const delivery = new _deliverymodel.DeliveryModel();
        delivery.cityName = dto.cityName;
        var _dto_optusId;
        delivery.optusId = (_dto_optusId = dto.optusId) !== null && _dto_optusId !== void 0 ? _dto_optusId : '';
        delivery.price = dto.price;
        return this.deliveryRepo.save(delivery);
    }
    async getAllDeliveries() {
        return this.deliveryRepo.find({
            order: {
                cityName: 'ASC'
            }
        });
    }
    async getDeliveries() {
        return this.deliveryRepo.find({
            order: {
                cityName: 'ASC'
            }
        });
    }
    async getDeliveryById(id) {
        const delivery = await this.deliveryRepo.findOne({
            where: {
                id
            }
        });
        if (!delivery) {
            throw new _common.NotFoundException(`Delivery with ID ${id} not found`);
        }
        return delivery;
    }
    async getDeliveryByCity(cityName) {
        const delivery = await this.deliveryRepo.findOne({
            where: {
                cityName
            }
        });
        if (!delivery) {
            throw new _common.NotFoundException(`Delivery for city ${cityName} not found`);
        }
        return delivery;
    }
    async getDeliveryByOptusId(optusId) {
        const delivery = await this.deliveryRepo.findOne({
            where: {
                optusId
            }
        });
        if (!delivery) {
            throw new _common.NotFoundException(`Delivery with Optus ID ${optusId} not found`);
        }
        return delivery;
    }
    async updateDelivery(id, dto) {
        const delivery = await this.getDeliveryById(id);
        // Check if city name is being changed and if it already exists
        if (dto.cityName && dto.cityName !== delivery.cityName) {
            const existingDelivery = await this.deliveryRepo.findOne({
                where: {
                    cityName: dto.cityName
                }
            });
            if (existingDelivery) {
                throw new _common.BadRequestException(`Delivery for city ${dto.cityName} already exists`);
            }
        }
        if (dto.cityName) delivery.cityName = dto.cityName;
        if (dto.optusId !== undefined) delivery.optusId = dto.optusId;
        if (dto.price !== undefined) delivery.price = dto.price;
        return this.deliveryRepo.save(delivery);
    }
    async deleteDelivery(id) {
        const delivery = await this.getDeliveryById(id);
        await this.deliveryRepo.remove(delivery);
    }
    async searchDeliveries(searchTerm) {
        return this.deliveryRepo.createQueryBuilder('delivery').where('delivery.cityName ILIKE :searchTerm', {
            searchTerm: `%${searchTerm}%`
        }).orWhere('delivery.optusId ILIKE :searchTerm', {
            searchTerm: `%${searchTerm}%`
        }).orderBy('delivery.cityName', 'ASC').getMany();
    }
    async getDeliveryPriceByCity(cityName) {
        const delivery = await this.getDeliveryByCity(cityName);
        return delivery.price;
    }
    async getDeliveryPriceByOptusId(optusId) {
        const delivery = await this.getDeliveryByOptusId(optusId);
        return delivery.price;
    }
    async countDeliveries() {
        return this.deliveryRepo.count();
    }
    async bulkCreateDeliveries(deliveries) {
        const createdDeliveries = [];
        for (const dto of deliveries){
            try {
                const delivery = await this.createDelivery(dto);
                createdDeliveries.push(delivery);
            } catch (error) {
                // Log error but continue with other deliveries
                console.error(`Failed to create delivery for city ${dto.cityName}:`, error.message);
            }
        }
        return createdDeliveries;
    }
    constructor(deliveryRepo){
        this.deliveryRepo = deliveryRepo;
    }
};
DeliveryRepository = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_deliverymodel.DeliveryModel)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], DeliveryRepository);

//# sourceMappingURL=delivery.repository.js.map