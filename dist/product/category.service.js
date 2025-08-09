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
const _filestorageservice = require("../file-storage/file-storage.service");
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
    async saveFiles(files = [], mainDirectory, categoryName, subDirectory) {
        const categoryPath = `${mainDirectory}/${categoryName.replace(/\s+/g, '_').toLowerCase()}/${subDirectory}`;
        console.log('categoryPath', categoryPath);
        return await this.fileStorageService.saveFiles(files, categoryPath);
    }
    /**
   * Creates a new category.
   * @param file - UploadIcon object containing the icon file for the category.
   * @param dto - Data transfer object containing category details.
   * @returns The created category entity.
   * @throws HttpException if the category already exists.
   */ async createCategory(file, dto) {
        // Check if a category with the same name already exists
        const existing = await this.categoryRepository.findOne({
            where: {
                name: dto.name
            }
        });
        if (existing) throw new _common.HttpException('Category already exists', _common.HttpStatus.BAD_REQUEST);
        let icon = undefined;
        console.log('icon file uploaded', file);
        // If an icon file is provided, save it and get its path
        if (file.iconCat) {
            icon = (await this.saveFiles([
                file.iconCat
            ], 'categoriesIcons', dto.name, 'iconCat'))[0];
        }
        // Create a new category entity
        const category = this.categoryRepository.create({
            name: dto.name,
            icon: icon,
            isActive: true
        });
        // Save the new category to the database and return it
        return this.categoryRepository.save(category);
    }
    async createSubCategory(file, dto) {
        const subCategory = await this.subCategoryRepository.findOne({
            where: {
                name: dto.name,
                category: {
                    id: dto.categoryId
                }
            }
        });
        if (subCategory) throw new _common.HttpException('SubCategory already exists', _common.HttpStatus.BAD_REQUEST);
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
            }
        });
        if (exists) throw new _common.HttpException('SubCategory already exists', _common.HttpStatus.BAD_REQUEST);
        let icon = undefined;
        if (file.iconSubCat) {
            icon = (await this.saveFiles([
                file.iconSubCat
            ], 'subCategoriesIcons', parent.name, dto.name))[0];
        }
        const sub = this.subCategoryRepository.create({
            name: dto.name,
            category: {
                id: parent.id,
                name: parent.name
            },
            isActive: true,
            icon: icon
        });
        return this.subCategoryRepository.save(sub);
    }
    async getAllCategories() {
        const categories = await this.categoryRepository.find({
            select: [
                'id',
                'name',
                'icon',
                'subCategories'
            ],
            relations: [
                'subCategories'
            ],
            loadEagerRelations: false
        });
        return categories;
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
    async updateCategory(id, dto, file) {
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
        if (file === null || file === void 0 ? void 0 : file.iconCat) {
            category.icon = (await this.saveFiles([
                file.iconCat
            ], 'categoriesIcons', category.name, 'iconCat'))[0];
        }
        return this.categoryRepository.save(category);
    }
    async updateSubCategory(categoryId, id, dto, file) {
        const sub = await this.subCategoryRepository.findOne({
            where: {
                id,
                categoryId: categoryId
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
        if (file === null || file === void 0 ? void 0 : file.iconSubCat) {
            var _dto_name;
            sub.icon = (await this.saveFiles([
                file.iconSubCat
            ], 'subCategoriesIcons', sub.category.name, (_dto_name = dto.name) !== null && _dto_name !== void 0 ? _dto_name : sub.name))[0];
        }
        return this.subCategoryRepository.save(sub);
    }
    async deleteCategory(id) {
        const category = await this.getCategoryById(id);
        if (!category) {
            throw new _common.HttpException('Category not found', _common.HttpStatus.NOT_FOUND);
        }
        if (category.icon && category.icon !== '') {
            // Icons are stored under categoriesIcons/<categoryName>
            this.fileStorageService.deleteDirectory(`categoriesIcons/${category.name.replace(/\s+/g, '_').toLowerCase()}`);
        }
        if (category.subCategories && category.subCategories.length > 0) {
            for (const sub of category.subCategories){
                if (sub.icon && sub.icon !== '') {
                    // Use parent category name from outer scope to avoid missing relation on sub
                    this.fileStorageService.deleteDirectory(`subCategoriesIcons/${category.name.replace(/\s+/g, '_').toLowerCase()}/${sub.name.replace(/\s+/g, '_').toLowerCase()}`);
                }
            }
        }
        await this.subCategoryRepository.remove(category.subCategories);
        await this.categoryRepository.remove(category);
    }
    async deleteSubCategory(id) {
        const sub = await this.subCategoryRepository.findOne({
            where: {
                id
            },
            relations: [
                'category'
            ]
        });
        if (!sub) throw new _common.HttpException('SubCategory not found', _common.HttpStatus.NOT_FOUND);
        if (sub.icon && sub.icon !== '' && sub.category) {
            this.fileStorageService.deleteDirectory(`subCategoriesIcons/${sub.category.name.replace(/\s+/g, '_').toLowerCase()}/${sub.name.replace(/\s+/g, '_').toLowerCase()}`);
        }
        await this.subCategoryRepository.remove(sub);
    }
    async deleteAll() {
        await this.productRepository.delete({});
        await this.subCategoryRepository.delete({});
        await this.categoryRepository.delete({});
    }
    async getSubCategories() {
        return this.subCategoryRepository.find();
    }
    async getSubCategoryById(id) {
        const subCategory = await this.subCategoryRepository.findOne({
            where: {
                id
            }
        });
        if (!subCategory) throw new _common.HttpException('SubCategory not found', _common.HttpStatus.NOT_FOUND);
        return subCategory;
    }
    constructor(categoryRepository, subCategoryRepository, productRepository, fileStorageService){
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
        this.productRepository = productRepository;
        this.fileStorageService = fileStorageService;
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
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService
    ])
], CategoryService);

//# sourceMappingURL=category.service.js.map