"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CategoryService", {
    enumerable: true,
    get: function() {
        return CategoryService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _productentity = require("./entities/product.entity");
const _Categoryentity = require("./entities/Category.entity");
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
let CategoryService = class CategoryService {
    async createCategory(dto) {
        const existing = await this.categoryRepository.findOne({
            where: {
                name: dto.name
            }
        });
        if (existing) throw new _common.HttpException('Category already exists', _common.HttpStatus.BAD_REQUEST);
        const category = this.categoryRepository.create({
            name: dto.name,
            isActive: true
        });
        return this.categoryRepository.save(category);
    }
    async createSubCategory(dto) {
        const parent = await this.categoryRepository.findOne({
            where: {
                id: dto.categoryId
            }
        });
        if (!parent) throw new _common.HttpException('Category not found', _common.HttpStatus.NOT_FOUND);
        if (!dto.name.trim()) {
            throw new _common.HttpException('SubCategory name is required', _common.HttpStatus.BAD_REQUEST);
        }
        const exists = await this.subCategoryRepository.findOne({
            where: {
                name: dto.name,
                category: {
                    id: dto.categoryId
                }
            },
            relations: [
                'category'
            ]
        });
        if (exists) throw new _common.HttpException('SubCategory already exists', _common.HttpStatus.BAD_REQUEST);
        const sub = this.subCategoryRepository.create({
            name: dto.name,
            category: parent,
            isActive: true
        });
        return this.subCategoryRepository.save(sub);
    }
    async getAllCategories() {
        return this.categoryRepository.find({
            relations: [
                'subCategories'
            ]
        });
    }
    async getCategoryById(id) {
        const category = await this.categoryRepository.findOne({
            where: {
                id
            },
            relations: [
                'subCategories'
            ]
        });
        if (!category) throw new _common.HttpException('Category not found', _common.HttpStatus.NOT_FOUND);
        return category;
    }
    async updateCategory(id, dto) {
        const category = await this.categoryRepository.findOne({
            where: {
                id
            }
        });
        if (!category) throw new _common.HttpException('Category not found', _common.HttpStatus.NOT_FOUND);
        if (dto.name && dto.name !== category.name) {
            const dup = await this.categoryRepository.findOne({
                where: {
                    name: dto.name
                }
            });
            if (dup) throw new _common.HttpException('Category name already exists', _common.HttpStatus.BAD_REQUEST);
            category.name = dto.name;
        }
        if (dto.isActive !== undefined) category.isActive = dto.isActive;
        return this.categoryRepository.save(category);
    }
    async updateSubCategory(id, dto) {
        const sub = await this.subCategoryRepository.findOne({
            where: {
                id
            },
            relations: [
                'category'
            ]
        });
        if (!sub) throw new _common.HttpException('SubCategory not found', _common.HttpStatus.NOT_FOUND);
        if (dto.name && dto.name !== sub.name) {
            const dup = await this.subCategoryRepository.findOne({
                where: {
                    name: dto.name
                }
            });
            if (dup) throw new _common.HttpException('SubCategory name already exists', _common.HttpStatus.BAD_REQUEST);
            sub.name = dto.name;
        }
        if (dto.isActive !== undefined) sub.isActive = dto.isActive;
        return this.subCategoryRepository.save(sub);
    }
    async deleteCategory(id) {
        const category = await this.getCategoryById(id);
        await this.subCategoryRepository.remove(category.subCategories);
        await this.categoryRepository.remove(category);
    }
    async deleteSubCategory(id) {
        const sub = await this.subCategoryRepository.findOne({
            where: {
                id
            }
        });
        if (!sub) throw new _common.HttpException('SubCategory not found', _common.HttpStatus.NOT_FOUND);
        await this.subCategoryRepository.remove(sub);
    }
    async deleteAll() {
        await this.productRepository.delete({});
        await this.subCategoryRepository.delete({});
        await this.categoryRepository.delete({});
    }
    constructor(categoryRepository, subCategoryRepository, productRepository){
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
        this.productRepository = productRepository;
    }
};
CategoryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_Categoryentity.category)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_Categoryentity.subCategory)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_productentity.product)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], CategoryService);

//# sourceMappingURL=category.service.js.map