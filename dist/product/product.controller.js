"use strict";
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
const _parseformjsonpipe = require("../common/pipes/parse-form-json.pipe");
const _productservice = require("./product.service");
const _Productdto = require("./dto/Product.dto");
const _express = require("express");
const _rolesguard = require("../common/guards/roles.guard");
const _jwtauthguard = require("../common/guards/jwt-auth.guard");
const _rolesconstant = require("../common/constants/roles.constant");
const _rolesdecorator = require("../common/decorators/roles.decorator");
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
        return await this.productService.getAllProducts(req.query);
    }
    async createProduct(createProductDto, files, req) {
        if (!files.imgCover || !files.imgColors) {
            throw new _common.BadRequestException('imgCover and ImgColors must be upload!');
        }
        const poster = req.user;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.productService.create(createProductDto, files, poster, req);
    }
    // @Get()
    // findAll() {
    //   return this.productService.findAll();
    // }
    findOne(id) {
        return this.productService.findOne(+id);
    }
    async updateProduct(id, updateProductDto, files, req) {
        return this.productService.update(+id, updateProductDto, files, req);
    }
    remove(id) {
        return this.productService.remove(+id);
    }
    deleteall() {
        return this.productService.deleteAll();
    }
    constructor(productService){
        this.productService = productService;
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
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductController.prototype, "remove", null);
_ts_decorate([
    (0, _common.Delete)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ProductController.prototype, "deleteall", null);
ProductController = _ts_decorate([
    (0, _common.Controller)('product'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _productservice.ProductService === "undefined" ? Object : _productservice.ProductService
    ])
], ProductController);

//# sourceMappingURL=product.controller.js.map