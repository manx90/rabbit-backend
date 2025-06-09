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
const _categoryservice = require("./category.service");
const _jwtauthguard = require("../common/guards/jwt-auth.guard");
const _rolesguard = require("../common/guards/roles.guard");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _rolesconstant = require("../common/constants/roles.constant");
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
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }
    async createCategory(dto) {
        try {
            const result = await this.categoryService.createCategory(dto);
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
    async updateCategory(id, dto) {
        try {
            return await this.categoryService.updateCategory(Number(id), dto);
        } catch (error) {
            throw new _common.HttpException(error.message, _common.HttpStatus.BAD_REQUEST);
        }
    }
    async createSubCategory(dto) {
        try {
            const result = await this.categoryService.createSubCategory(dto);
            return {
                message: 'SubCategory created successfully',
                data: result
            };
        } catch (error) {
            throw new _common.HttpException(error.message, _common.HttpStatus.BAD_REQUEST);
        }
    }
    async updateSubCategory(id, dto) {
        try {
            return await this.categoryService.updateSubCategory(Number(id), dto);
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
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "getAllCategories", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
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
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _categorydto.UpdateCategoryDto === "undefined" ? Object : _categorydto.UpdateCategoryDto
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "updateCategory", null);
_ts_decorate([
    (0, _common.Post)('subcategory'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _categorydto.CreateSubCategoryDto === "undefined" ? Object : _categorydto.CreateSubCategoryDto
    ]),
    _ts_metadata("design:returntype", Promise)
], CategoryController.prototype, "createSubCategory", null);
_ts_decorate([
    (0, _common.Put)('subcategory/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
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
CategoryController = _ts_decorate([
    (0, _common.Controller)('category'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _categoryservice.CategoryService === "undefined" ? Object : _categoryservice.CategoryService
    ])
], CategoryController);

//# sourceMappingURL=category.controller.js.map