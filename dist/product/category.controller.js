/* eslint-disable @typescript-eslint/no-unsafe-member-access */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CategoryController", {
    enumerable: true,
    get: function() {
        return CategoryController;
    }
});
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _express = require("express");
const _qs = require("qs");
const _rolesconstant = require("../common/constants/roles.constant");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _jwtauthguard = require("../common/guards/jwt-auth.guard");
const _rolesguard = require("../common/guards/roles.guard");
const _categoryservice = require("./category.service");
const _categorydto = require("./dto/category.dto");
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
let CategoryController = class CategoryController {
    async getSubCategories() {
        return this.categoryService.getSubCategories();
    }
    async getSubCategoryById(id) {
        return this.categoryService.getSubCategoryById(Number(id));
    }
    async getAllCategories(query, req) {
        return this.categoryService.getAllCategories(query, req);
    }
    async getAllActiveCategories(query, req) {
        return this.categoryService.getAllActiveCategories(query, req);
    }
    async createCategory(files, dto) {
        try {
            var _files_iconCat;
            // Build UploadIcon object from uploaded files
            const uploadIcon = {
                iconCat: (_files_iconCat = files.iconCat) === null || _files_iconCat === void 0 ? void 0 : _files_iconCat[0]
            };
            const result = await this.categoryService.createCategory(uploadIcon, dto);
            return {
                message: 'Category created successfully',
                data: result
            };
        } catch (error) {
            throw new _common.HttpException(error.message, _common.HttpStatus.BAD_REQUEST);
        }
    }
    async getCategoryById(id) {
        try {
            return await this.categoryService.getCategoryById(Number(id));
        } catch (error) {
            throw new _common.HttpException(error.message, _common.HttpStatus.NOT_FOUND);
        }
    }
    async updateCategory(id, dto, files) {
        const category = await this.categoryService.getCategoryById(Number(id));
        try {
            const uploadIcon = files && files.iconCat && files.iconCat[0] ? {
                iconCat: files.iconCat[0]
            } : undefined;
            // If no icon file is provided, don't update the icon (pass undefined)
            return await this.categoryService.updateCategory(Number(id), dto, uploadIcon);
        } catch (error) {
            throw new _common.HttpException(error.message, _common.HttpStatus.BAD_REQUEST);
        }
    }
    async createSubCategory(files, dto) {
        try {
            var _files_iconSubCat;
            const uploadIcon = {
                iconSubCat: (_files_iconSubCat = files.iconSubCat) === null || _files_iconSubCat === void 0 ? void 0 : _files_iconSubCat[0]
            };
            const result = await this.categoryService.createSubCategory(uploadIcon, dto);
            return {
                message: 'SubCategory created successfully',
                data: result
            };
        } catch (error) {
            throw new _common.HttpException(error.message, _common.HttpStatus.BAD_REQUEST);
        }
    }
    async updateSubCategory(categoryId, id, files, dto) {
        try {
            const uploadIcon = files && files.iconSubCat && files.iconSubCat[0] ? {
                iconSubCat: files.iconSubCat[0]
            } : undefined;
            return await this.categoryService.updateSubCategory(Number(categoryId), Number(id), dto, uploadIcon);
        } catch (error) {
            throw new _common.HttpException(error.message, _common.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteAllCategories() {
        await this.categoryService.deleteAll();
        return {
            message: 'All categories deleted successfully'
        };
    }
    async deleteCategory(id) {
        try {
            await this.categoryService.deleteCategory(Number(id));
            return {
                message: 'Category deleted successfully'
            };
        } catch (error) {
            throw new _common.HttpException(error.message, _common.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteSubCategory(id) {
        try {
            await this.categoryService.deleteSubCategory(Number(id));
            return {
                message: 'SubCategory deleted successfully'
            };
        } catch (error) {
            throw new _common.HttpException(error.message, _common.HttpStatus.BAD_REQUEST);
        }
    }
    async UpdateState(id) {
        const UpdateOne = await this.categoryService.updateState(id);
        return UpdateOne;
    }
    async UpdateStateSub(id) {
        const UpdateOne = await this.categoryService.updateStateSub(id);
        return UpdateOne;
    }
    constructor(categoryService){
        this.categoryService = categoryService;
    }
};
_ts_decorate([
    (0, _common.Get)('subcategory'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "getSubCategories", null);
_ts_decorate([
    (0, _common.Get)('subcategory/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "getSubCategoryById", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Query)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _qs.ParsedQs === "undefined" ? Object : _qs.ParsedQs,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "getAllCategories", null);
_ts_decorate([
    (0, _common.Get)('active'),
    _ts_param(0, (0, _common.Query)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _qs.ParsedQs === "undefined" ? Object : _qs.ParsedQs,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "getAllActiveCategories", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    (0, _common.UseInterceptors)((0, _platformexpress.FileFieldsInterceptor)([
        {
            name: 'iconCat',
            maxCount: 1
        }
    ])),
    _ts_param(0, (0, _common.UploadedFiles)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _categorydto.CreateCategoryDto === "undefined" ? Object : _categorydto.CreateCategoryDto
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "createCategory", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategoryById", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _common.UseInterceptors)((0, _platformexpress.FileFieldsInterceptor)([
        {
            name: 'iconCat',
            maxCount: 1
        }
    ])),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.UploadedFiles)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _categorydto.UpdateCategoryDto === "undefined" ? Object : _categorydto.UpdateCategoryDto,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "updateCategory", null);
_ts_decorate([
    (0, _common.Post)('subcategory'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    (0, _common.UseInterceptors)((0, _platformexpress.FileFieldsInterceptor)([
        {
            name: 'iconSubCat',
            maxCount: 1
        }
    ])),
    _ts_param(0, (0, _common.UploadedFiles)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _categorydto.CreateSubCategoryDto === "undefined" ? Object : _categorydto.CreateSubCategoryDto
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "createSubCategory", null);
_ts_decorate([
    (0, _common.Put)(':categoryId/subCategory/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _common.UseInterceptors)((0, _platformexpress.FileFieldsInterceptor)([
        {
            name: 'iconSubCat',
            maxCount: 1
        }
    ])),
    _ts_param(0, (0, _common.Param)('categoryId')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.UploadedFiles)()),
    _ts_param(3, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Object,
        typeof _categorydto.UpdateSubCategoryDto === "undefined" ? Object : _categorydto.UpdateSubCategoryDto
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "updateSubCategory", null);
_ts_decorate([
    (0, _common.Delete)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteAllCategories", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteCategory", null);
_ts_decorate([
    (0, _common.Delete)('subcategory/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteSubCategory", null);
_ts_decorate([
    (0, _common.Put)('update-state/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "UpdateState", null);
_ts_decorate([
    (0, _common.Put)('update-state-subcategory/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "UpdateStateSub", null);
CategoryController = _ts_decorate([
    (0, _common.Controller)('category'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _categoryservice.CategoryService === "undefined" ? Object : _categoryservice.CategoryService
    ])
], CategoryController);

//# sourceMappingURL=category.controller.js.map