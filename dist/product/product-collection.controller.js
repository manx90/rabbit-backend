"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductCollectionController", {
    enumerable: true,
    get: function() {
        return ProductCollectionController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _productcollectionservice = require("./product-collection.service");
const _productcollectiondto = require("./dto/product-collection.dto");
const _jwtauthguard = require("../common/guards/jwt-auth.guard");
const _rolesguard = require("../common/guards/roles.guard");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _rolesconstant = require("../common/constants/roles.constant");
const _express = require("express");
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
let ProductCollectionController = class ProductCollectionController {
    // ==================== ADMIN ENDPOINTS ====================
    async createCollection(createDto, req) {
        try {
            const user = req.user;
            return await this.collectionService.create(createDto, user);
        } catch (error) {
            if (error instanceof _common.HttpException) {
                throw error;
            }
            throw new _common.HttpException('Failed to create collection', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllCollections(query) {
        try {
            return await this.collectionService.getAllCollections(query);
        } catch (error) {
            throw new _common.HttpException('Failed to retrieve collections', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCollectionById(id) {
        try {
            return await this.collectionService.findOne(+id);
        } catch (error) {
            if (error instanceof _common.HttpException) {
                throw error;
            }
            throw new _common.HttpException('Failed to retrieve collection', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCollection(id, updateDto) {
        try {
            return await this.collectionService.update(+id, updateDto);
        } catch (error) {
            if (error instanceof _common.HttpException) {
                throw error;
            }
            throw new _common.HttpException('Failed to update collection', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCollection(id) {
        try {
            await this.collectionService.remove(+id);
            return {
                message: 'Collection deleted successfully'
            };
        } catch (error) {
            if (error instanceof _common.HttpException) {
                throw error;
            }
            throw new _common.HttpException('Failed to delete collection', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // ==================== CLIENT ENDPOINTS ====================
    async getActiveCollections() {
        try {
            return await this.collectionService.getActiveCollections();
        } catch (error) {
            throw new _common.HttpException('Failed to retrieve active collections', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPriorityCollections() {
        try {
            return await this.collectionService.getPriorityCollections();
        } catch (error) {
            throw new _common.HttpException('Failed to retrieve priority collections', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCollectionsByMinPriority(minPriority) {
        try {
            if (isNaN(+minPriority) || +minPriority < 0) {
                throw new _common.BadRequestException('Invalid priority parameter');
            }
            return await this.collectionService.getCollectionsByPriority(+minPriority);
        } catch (error) {
            if (error instanceof _common.HttpException) {
                throw error;
            }
            throw new _common.HttpException('Failed to retrieve collections by priority', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCollectionsByPriorityQuery(minPriority, maxPriority) {
        try {
            if (isNaN(+minPriority) || +minPriority < 0) {
                throw new _common.BadRequestException('Invalid minPriority parameter');
            }
            if (maxPriority && (isNaN(+maxPriority) || +maxPriority < +minPriority)) {
                throw new _common.BadRequestException('Invalid maxPriority parameter');
            }
            return await this.collectionService.getCollectionsByPriority(+minPriority, maxPriority ? +maxPriority : undefined);
        } catch (error) {
            if (error instanceof _common.HttpException) {
                throw error;
            }
            throw new _common.HttpException('Failed to retrieve collections by priority range', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCollectionsByPriorityRange(minPriority, maxPriority) {
        try {
            if (isNaN(+minPriority) || +minPriority < 0) {
                throw new _common.BadRequestException('Invalid minPriority parameter');
            }
            if (isNaN(+maxPriority) || +maxPriority < +minPriority) {
                throw new _common.BadRequestException('Invalid maxPriority parameter');
            }
            return await this.collectionService.getCollectionsByPriority(+minPriority, +maxPriority);
        } catch (error) {
            if (error instanceof _common.HttpException) {
                throw error;
            }
            throw new _common.HttpException('Failed to retrieve collections by priority range', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCollectionProducts(id, query, req) {
        try {
            if (isNaN(+id) || +id <= 0) {
                throw new _common.BadRequestException('Invalid collection ID');
            }
            return await this.collectionService.getCollectionProducts(+id, query, req);
        } catch (error) {
            if (error instanceof _common.HttpException) {
                throw error;
            }
            throw new _common.HttpException('Failed to retrieve collection products', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCollectionWithProducts(id, page = 1, limit = 10, req) {
        try {
            if (isNaN(+id) || +id <= 0) {
                throw new _common.BadRequestException('Invalid collection ID');
            }
            if (isNaN(+page) || +page < 1) {
                throw new _common.BadRequestException('Invalid page parameter');
            }
            if (isNaN(+limit) || +limit < 1 || +limit > 100) {
                throw new _common.BadRequestException('Invalid limit parameter (1-100)');
            }
            return await this.collectionService.getCollectionWithProducts(+id, +page, +limit, req);
        } catch (error) {
            if (error instanceof _common.HttpException) {
                throw error;
            }
            throw new _common.HttpException('Failed to retrieve collection with products', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // ==================== UTILITY ENDPOINTS ====================
    async getFeaturedCollectionProducts(query, req) {
        try {
            // This endpoint will get products from all featured collections
            const activeCollections = await this.collectionService.getActiveCollections();
            const featuredCollections = activeCollections.filter((collection)=>collection.isFeatured);
            if (featuredCollections.length === 0) {
                throw new _common.BadRequestException('No featured collections found');
            }
            // For now, return products from the first featured collection
            // You can enhance this to combine products from multiple featured collections
            const firstFeatured = featuredCollections[0];
            return await this.collectionService.getCollectionProducts(firstFeatured.id, query, req);
        } catch (error) {
            if (error instanceof _common.HttpException) {
                throw error;
            }
            throw new _common.HttpException('Failed to retrieve featured collection products', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    constructor(collectionService){
        this.collectionService = collectionService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new product collection (Admin only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Collection created successfully',
        type: _productcollectiondto.ProductCollectionResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Not found - categories, subcategories, or products not found'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _productcollectiondto.CreateProductCollectionDto === "undefined" ? Object : _productcollectiondto.CreateProductCollectionDto,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductCollectionController.prototype, "createCollection", null);
_ts_decorate([
    (0, _common.Get)('admin'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all collections with pagination (Admin only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Collections retrieved successfully'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductCollectionController.prototype, "getAllCollections", null);
_ts_decorate([
    (0, _common.Get)('admin/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get a specific collection by ID (Admin only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Collection retrieved successfully',
        type: _productcollectiondto.ProductCollectionResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Collection not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductCollectionController.prototype, "getCollectionById", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Update a collection (Admin only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Collection updated successfully',
        type: _productcollectiondto.ProductCollectionResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Collection, categories, subcategories, or products not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _productcollectiondto.UpdateProductCollectionDto === "undefined" ? Object : _productcollectiondto.UpdateProductCollectionDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductCollectionController.prototype, "updateCollection", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Delete a collection (Admin only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Collection deleted successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Collection not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductCollectionController.prototype, "deleteCollection", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all active collections (Public)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Active collections retrieved successfully'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductCollectionController.prototype, "getActiveCollections", null);
_ts_decorate([
    (0, _common.Get)('priority'),
    (0, _swagger.ApiOperation)({
        summary: 'Get priority collections (Public)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Priority collections retrieved successfully'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductCollectionController.prototype, "getPriorityCollections", null);
_ts_decorate([
    (0, _common.Get)('priority/:minPriority'),
    (0, _swagger.ApiOperation)({
        summary: 'Get collections with minimum priority (Public)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Collections with minimum priority retrieved successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid priority parameter'
    }),
    _ts_param(0, (0, _common.Param)('minPriority')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductCollectionController.prototype, "getCollectionsByMinPriority", null);
_ts_decorate([
    (0, _common.Get)('priority-range'),
    (0, _swagger.ApiOperation)({
        summary: 'Get collections by priority range using query parameters (Public)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Collections by priority range retrieved successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid priority parameters'
    }),
    _ts_param(0, (0, _common.Query)('minPriority')),
    _ts_param(1, (0, _common.Query)('maxPriority')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductCollectionController.prototype, "getCollectionsByPriorityQuery", null);
_ts_decorate([
    (0, _common.Get)('priority/:minPriority/:maxPriority'),
    (0, _swagger.ApiOperation)({
        summary: 'Get collections by priority range (Public)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Collections by priority range retrieved successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid priority parameters'
    }),
    _ts_param(0, (0, _common.Param)('minPriority')),
    _ts_param(1, (0, _common.Param)('maxPriority')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductCollectionController.prototype, "getCollectionsByPriorityRange", null);
_ts_decorate([
    (0, _common.Get)(':id/products'),
    (0, _swagger.ApiOperation)({
        summary: 'Get products from a specific collection (Public)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Collection products retrieved successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Collection not found'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Collection is not active or valid'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Query)()),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Object,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductCollectionController.prototype, "getCollectionProducts", null);
_ts_decorate([
    (0, _common.Get)(':id/with-products'),
    (0, _swagger.ApiOperation)({
        summary: 'Get collection with its products (paginated, 10 per page)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Collection with products retrieved successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Collection not found'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid parameters'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Query)('page')),
    _ts_param(2, (0, _common.Query)('limit')),
    _ts_param(3, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number,
        Number,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductCollectionController.prototype, "getCollectionWithProducts", null);
_ts_decorate([
    (0, _common.Get)('featured/products'),
    (0, _swagger.ApiOperation)({
        summary: 'Get products from featured collections (Public)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Featured collection products retrieved successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'No featured collections found'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductCollectionController.prototype, "getFeaturedCollectionProducts", null);
ProductCollectionController = _ts_decorate([
    (0, _swagger.ApiTags)('Product Collections'),
    (0, _common.Controller)('collections'),
    (0, _common.UseInterceptors)(_common.ClassSerializerInterceptor),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _productcollectionservice.ProductCollectionService === "undefined" ? Object : _productcollectionservice.ProductCollectionService
    ])
], ProductCollectionController);

//# sourceMappingURL=product-collection.controller.js.map