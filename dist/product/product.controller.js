/* eslint-disable prettier/prettier */ /* eslint-disable @typescript-eslint/no-unsafe-member-access */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductController", {
    enumerable: true,
    get: function() {
        return ProductController;
    }
});
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _express = require("express");
const _rolesconstant = require("../common/constants/roles.constant");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _jwtauthguard = require("../common/guards/jwt-auth.guard");
const _rolesguard = require("../common/guards/roles.guard");
const _parseformjsonpipe = require("../common/pipes/parse-form-json.pipe");
const _loggerservice = require("../common/utils/logger.service");
const _Productdto = require("./dto/Product.dto");
const _productcrud = require("./product.crud");
const _productservice = require("./product.service");
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
let ProductController = class ProductController {
    async getAllProducts(req) {
        const startTime = Date.now();
        try {
            this.logger.logApiRequest('GET', '/product', req.query, null, 'ProductController');
            const result = await this.productcrud.getAllProducts(req.query);
            const responseTime = Date.now() - startTime;
            this.logger.logApiResponse('GET', '/product', 200, responseTime, 'ProductController');
            this.logger.info(`getAllProducts completed successfully. Found ${result.results} products`, 'ProductController');
            return result;
        } catch (error) {
            const responseTime = Date.now() - startTime;
            this.logger.logApiResponse('GET', '/product', 500, responseTime, 'ProductController');
            this.logger.logError(error, 'ProductController', {
                query: req.query
            });
            throw error;
        }
    }
    // @Get()
    // async getAllProducts(@Req() req: Request) {
    //   return await this.productcrud.getAllProducts(req.query, req);
    // }
    async createProduct(createProductDto, files, req) {
        if (!files.imgCover || !files.imgColors) {
            throw new _common.BadRequestException('imgCover and imgColors must be upload!');
        }
        const poster = req.user;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.productcrud.create(createProductDto, files, poster, req);
    }
    findOne(id) {
        return this.productcrud.findOne(+id);
    }
    async updateProduct(id, updateProductDto, files, req) {
        return this.productcrud.update(+id, updateProductDto, files, req);
    }
    async remove(id, req) {
        const start = Date.now();
        this.logger.logApiRequest('DELETE', `/product/${id}`, undefined, undefined, 'ProductController');
        try {
            const result = await this.productcrud.remove(+id);
            const duration = Date.now() - start;
            this.logger.logApiResponse('DELETE', `/product/${id}`, 200, duration, 'ProductController');
            return result;
        } catch (error) {
            const duration = Date.now() - start;
            this.logger.logApiResponse('DELETE', `/product/${id}`, 500, duration, 'ProductController');
            this.logger.logError(error, 'ProductController', {
                id
            });
            throw error;
        }
    }
    deleteall() {
        return this.productcrud.deleteAll();
    }
    connectProduct(body) {
        var _body_productIds;
        const ProductsIds = (_body_productIds = body.productIds) === null || _body_productIds === void 0 ? void 0 : _body_productIds.map((id)=>Number(id.toString().trim()));
        return this.productcrud.ConnectProduct(ProductsIds);
    }
    async updatePublishState(id) {
        console.log('run this api publish', id);
        return this.productservice.UpdateStatus(+id);
    }
    async showSeasonSpring() {
        const season = 'spring_autumn';
        const count = await this.productservice.ShowSeason(season);
        return {
            message: `Published ${count} products for (spring)`
        };
    }
    async showSeasonSummer() {
        const season = 'summer';
        const count = await this.productservice.ShowSeason(season);
        return {
            message: `Published ${count} products for (summer)`
        };
    }
    async showSeasonWinter() {
        const season = 'winter';
        const count = await this.productservice.ShowSeason(season);
        return {
            message: `Published ${count} products for  (winter)`
        };
    }
    async hideSeasonWinter() {
        const season = 'winter';
        const count = await this.productservice.HiddenSeason(season);
        return {
            message: `Draft ${count} products for  (winter)`
        };
    }
    async hideSeasonSummer() {
        const season = 'winter';
        const count = await this.productservice.HiddenSeason(season);
        return {
            message: `Draft ${count} products for  (winter)`
        };
    }
    async hideSeasonSpring() {
        const season = 'winter';
        const count = await this.productservice.HiddenSeason(season);
        return {
            message: `Draft ${count} products for  (winter)`
        };
    }
    // ========== STATISTICS ENDPOINTS ==========
    async getProductStatsOverview() {
        return await this.productservice.getComprehensiveStats();
    }
    async getTotalProductsCount() {
        const count = await this.productservice.getTotalProductsCount();
        return {
            totalProducts: count
        };
    }
    async getProductsCountByPublishState() {
        return await this.productservice.getProductsCountByPublishState();
    }
    async getProductsCountBySeason() {
        return await this.productservice.getProductsCountBySeason();
    }
    async getProductsCountByFlags() {
        return await this.productservice.getProductsCountByFlags();
    }
    async getProductsCreatedInLastDays(days) {
        const count = await this.productservice.getProductsCreatedInLastDays(days);
        return {
            days: days,
            count: count,
            message: `${count} products created in the last ${days} days`
        };
    }
    async getProductsCountByCategory() {
        return await this.productservice.getProductsCountByCategory();
    }
    async getProductsCountBySubCategory() {
        return await this.productservice.getProductsCountBySubCategory();
    }
    async getTopSellingProducts(limit) {
        const limitNum = limit ? parseInt(limit.toString()) : 10;
        return await this.productservice.getTopSellingProducts(limitNum);
    }
    async getLowStockProducts(threshold) {
        const thresholdNum = threshold ? parseInt(threshold.toString()) : 10;
        return await this.productservice.getLowStockProducts(thresholdNum);
    }
    async getProductsWithoutImages() {
        return await this.productservice.getProductsWithoutImages();
    }
    async getProductsCountByCreator() {
        return await this.productservice.getProductsCountByCreator();
    }
    async getScheduledProducts() {
        return await this.productservice.getScheduledProducts();
    }
    async getProductsCreatedInDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const count = await this.productservice.getProductsCreatedInDateRange(start, end);
        return {
            startDate: start,
            endDate: end,
            count: count,
            message: `${count} products created between ${startDate} and ${endDate}`
        };
    }
    constructor(productcrud, productservice, logger){
        this.productcrud = productcrud;
        this.productservice = productservice;
        this.logger = logger;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProducts", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _common.UseInterceptors)((0, _platformexpress.FileFieldsInterceptor)([
        {
            name: 'images',
            maxCount: 10
        },
        {
            name: 'imgCover',
            maxCount: 1
        },
        {
            name: 'imgSizeChart',
            maxCount: 1
        },
        {
            name: 'imgMeasure',
            maxCount: 1
        },
        {
            name: 'imgColors',
            maxCount: 10
        }
    ]), _common.ClassSerializerInterceptor),
    _ts_param(0, (0, _common.Body)(new _parseformjsonpipe.ParseFormJsonPipe())),
    _ts_param(1, (0, _common.UploadedFiles)()),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Productdto.CreateProductDto === "undefined" ? Object : _Productdto.CreateProductDto,
        Object,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "createProduct", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _common.UseInterceptors)((0, _platformexpress.FileFieldsInterceptor)([
        {
            name: 'images',
            maxCount: 10
        },
        {
            name: 'imgCover',
            maxCount: 1
        },
        {
            name: 'imgSizeChart',
            maxCount: 1
        },
        {
            name: 'imgMeasure',
            maxCount: 1
        },
        {
            name: 'imgColors',
            maxCount: 10
        }
    ]), _common.ClassSerializerInterceptor),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)(new _parseformjsonpipe.ParseFormJsonPipe())),
    _ts_param(2, (0, _common.UploadedFiles)()),
    _ts_param(3, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _Productdto.UpdateProductDto === "undefined" ? Object : _Productdto.UpdateProductDto,
        Object,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "updateProduct", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "remove", null);
_ts_decorate([
    (0, _common.Delete)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ProductController.prototype, "deleteall", null);
_ts_decorate([
    (0, _common.Post)('connectProductIds'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductController.prototype, "connectProduct", null);
_ts_decorate([
    (0, _common.Get)(':id/publish'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "updatePublishState", null);
_ts_decorate([
    (0, _common.Put)('ShowSeason/spring'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "showSeasonSpring", null);
_ts_decorate([
    (0, _common.Put)('ShowSeason/summer'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "showSeasonSummer", null);
_ts_decorate([
    (0, _common.Put)('ShowSeason/winter'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "showSeasonWinter", null);
_ts_decorate([
    (0, _common.Put)('hideseason/winter'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "hideSeasonWinter", null);
_ts_decorate([
    (0, _common.Put)('hideseason/summer'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "hideSeasonSummer", null);
_ts_decorate([
    (0, _common.Put)('hideseason/spring'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "hideSeasonSpring", null);
_ts_decorate([
    (0, _common.Get)('stats/overview'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getProductStatsOverview", null);
_ts_decorate([
    (0, _common.Get)('stats/total'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getTotalProductsCount", null);
_ts_decorate([
    (0, _common.Get)('stats/publish-state'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsCountByPublishState", null);
_ts_decorate([
    (0, _common.Get)('stats/season'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsCountBySeason", null);
_ts_decorate([
    (0, _common.Get)('stats/flags'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsCountByFlags", null);
_ts_decorate([
    (0, _common.Get)('stats/recent/:days'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('days')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsCreatedInLastDays", null);
_ts_decorate([
    (0, _common.Get)('stats/category'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsCountByCategory", null);
_ts_decorate([
    (0, _common.Get)('stats/subcategory'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsCountBySubCategory", null);
_ts_decorate([
    (0, _common.Get)('stats/top-selling'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getTopSellingProducts", null);
_ts_decorate([
    (0, _common.Get)('stats/low-stock'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Query)('threshold')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getLowStockProducts", null);
_ts_decorate([
    (0, _common.Get)('stats/missing-images'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsWithoutImages", null);
_ts_decorate([
    (0, _common.Get)('stats/creators'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsCountByCreator", null);
_ts_decorate([
    (0, _common.Get)('stats/scheduled'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getScheduledProducts", null);
_ts_decorate([
    (0, _common.Get)('stats/date-range'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Query)('startDate')),
    _ts_param(1, (0, _common.Query)('endDate')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsCreatedInDateRange", null);
ProductController = _ts_decorate([
    (0, _common.Controller)('product'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _productcrud.ProductCrud === "undefined" ? Object : _productcrud.ProductCrud,
        typeof _productservice.ProductService === "undefined" ? Object : _productservice.ProductService,
        typeof _loggerservice.LoggerService === "undefined" ? Object : _loggerservice.LoggerService
    ])
], ProductController);

//# sourceMappingURL=product.controller.js.map