"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductCollectionService", {
    enumerable: true,
    get: function() {
        return ProductCollectionService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _productcollectionentity = require("./entities/product-collection.entity");
const _productentity = require("./entities/product.entity");
const _Categoryentity = require("./entities/Category.entity");
const _apifeatures = require("../common/utils/api-features");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
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
let ProductCollectionService = class ProductCollectionService {
    /**
   * Create a new product collection with comprehensive validation
   */ async create(createDto, user) {
        // Validate and fetch categories
        let categories = [];
        if (createDto.categoryIds && createDto.categoryIds.length > 0) {
            categories = await this.validateAndFetchCategories(createDto.categoryIds);
        }
        // Validate and fetch subcategories
        let subCategories = [];
        if (createDto.subCategoryIds && createDto.subCategoryIds.length > 0) {
            subCategories = await this.validateAndFetchSubCategories(createDto.subCategoryIds, categories);
        }
        // Validate and fetch products
        let products = [];
        if (createDto.productIds && createDto.productIds.length > 0) {
            // Limit to first 10 products
            const limitedProductIds = createDto.productIds.slice(0, 10);
            products = await this.validateAndFetchProducts(limitedProductIds, categories, subCategories);
        }
        // Validate that at least one of categories, subcategories, or products is provided
        if (categories.length === 0 && subCategories.length === 0 && products.length === 0) {
            throw new _common.BadRequestException('At least one category, subcategory, or product must be provided');
        }
        const collection = this.collectionRepo.create(_object_spread_props(_object_spread({}, createDto), {
            createdBy: user,
            categories,
            subCategories,
            products
        }));
        // Auto-generate name if not provided
        if (!createDto.name) {
            collection.name = await this.generateCollectionName(collection);
        }
        return await this.collectionRepo.save(collection);
    }
    /**
   * Validate and fetch categories
   */ async validateAndFetchCategories(categoryIds) {
        const categories = await this.categoryRepo.find({
            where: {
                id: (0, _typeorm1.In)(categoryIds)
            }
        });
        if (categories.length !== categoryIds.length) {
            const foundIds = categories.map((cat)=>cat.id);
            const missingIds = categoryIds.filter((id)=>!foundIds.includes(id));
            throw new _common.NotFoundException(`Categories with IDs [${missingIds.join(', ')}] not found`);
        }
        // Check if all categories are active
        const inactiveCategories = categories.filter((cat)=>!cat.isActive);
        if (inactiveCategories.length > 0) {
            const inactiveIds = inactiveCategories.map((cat)=>cat.id);
            throw new _common.BadRequestException(`Categories with IDs [${inactiveIds.join(', ')}] are inactive`);
        }
        return categories;
    }
    /**
   * Validate and fetch subcategories
   */ async validateAndFetchSubCategories(subCategoryIds, categories) {
        const subCategories = await this.subCategoryRepo.find({
            where: {
                id: (0, _typeorm1.In)(subCategoryIds)
            },
            relations: [
                'category'
            ]
        });
        if (subCategories.length !== subCategoryIds.length) {
            const foundIds = subCategories.map((sub)=>sub.id);
            const missingIds = subCategoryIds.filter((id)=>!foundIds.includes(id));
            throw new _common.NotFoundException(`Subcategories with IDs [${missingIds.join(', ')}] not found`);
        }
        // Check if all subcategories are active
        const inactiveSubCategories = subCategories.filter((sub)=>!sub.isActive);
        if (inactiveSubCategories.length > 0) {
            const inactiveIds = inactiveSubCategories.map((sub)=>sub.id);
            throw new _common.BadRequestException(`Subcategories with IDs [${inactiveIds.join(', ')}] are inactive`);
        }
        // Validate relationships with categories if categories are provided
        if (categories.length > 0) {
            const categoryIds = categories.map((cat)=>cat.id);
            const invalidSubCategories = subCategories.filter((sub)=>!categoryIds.includes(sub.categoryId));
            if (invalidSubCategories.length > 0) {
                const invalidIds = invalidSubCategories.map((sub)=>sub.id);
                const validCategoryIds = categoryIds.join(', ');
                throw new _common.BadRequestException(`Subcategories with IDs [${invalidIds.join(', ')}] do not belong to any of the specified categories [${validCategoryIds}]`);
            }
        }
        return subCategories;
    }
    /**
   * Validate and fetch products
   */ async validateAndFetchProducts(productIds, categories, subCategories) {
        const products = await this.productRepo.find({
            where: {
                id: (0, _typeorm1.In)(productIds)
            },
            relations: [
                'category',
                'subCategory'
            ]
        });
        if (products.length !== productIds.length) {
            const foundIds = products.map((prod)=>prod.id);
            const missingIds = productIds.filter((id)=>!foundIds.includes(id));
            throw new _common.NotFoundException(`Products with IDs [${missingIds.join(', ')}] not found`);
        }
        // Check if all products are not deleted
        const deletedProducts = products.filter((prod)=>prod.isDeleted);
        if (deletedProducts.length > 0) {
            const deletedIds = deletedProducts.map((prod)=>prod.id);
            throw new _common.BadRequestException(`Products with IDs [${deletedIds.join(', ')}] are deleted`);
        }
        // Validate relationships with categories and subcategories if they are provided
        if (categories.length > 0 || subCategories.length > 0) {
            const categoryIds = categories.map((cat)=>cat.id);
            const subCategoryIds = subCategories.map((sub)=>sub.id);
            const invalidProducts = products.filter((prod)=>{
                // If categories are specified, product must belong to one of them
                if (categories.length > 0 && !categoryIds.includes(prod.category.id)) {
                    return true;
                }
                // If subcategories are specified, product must belong to one of them
                if (subCategories.length > 0 && !subCategoryIds.includes(prod.subCategory.id)) {
                    return true;
                }
                return false;
            });
            if (invalidProducts.length > 0) {
                const invalidIds = invalidProducts.map((prod)=>prod.id);
                let errorMessage = `Products with IDs [${invalidIds.join(', ')}] do not belong to the specified `;
                if (categories.length > 0 && subCategories.length > 0) {
                    errorMessage += `categories [${categoryIds.join(', ')}] or subcategories [${subCategoryIds.join(', ')}]`;
                } else if (categories.length > 0) {
                    errorMessage += `categories [${categoryIds.join(', ')}]`;
                } else {
                    errorMessage += `subcategories [${subCategoryIds.join(', ')}]`;
                }
                throw new _common.BadRequestException(errorMessage);
            }
        }
        return products;
    }
    /**
   * Generate collection name based on categories, subcategories, or products
   */ async generateCollectionName(collection) {
        // If single category
        if (collection.categories && collection.categories.length === 1) {
            return `${collection.categories[0].name}`;
        }
        // If single subcategory
        if (collection.subCategories && collection.subCategories.length === 1) {
            return `${collection.subCategories[0].name}`;
        }
        // If single product
        if (collection.products && collection.products.length === 1) {
            return `${collection.products[0].name}`;
        }
        // If multiple categories
        if (collection.categories && collection.categories.length > 1) {
            const categoryNames = collection.categories.map((cat)=>cat.name).join(' & ');
            return `${categoryNames}`;
        }
        // If multiple subcategories
        if (collection.subCategories && collection.subCategories.length > 1) {
            const subCategoryNames = collection.subCategories.map((sub)=>sub.name).join(' & ');
            return `${subCategoryNames}`;
        }
        // If multiple products
        if (collection.products && collection.products.length > 1) {
            const productNames = collection.products.map((prod)=>prod.name).join(' & ');
            return `${productNames}`;
        }
        // If mixed (categories + subcategories + products)
        const parts = [];
        if (collection.categories && collection.categories.length > 0) {
            parts.push(`${collection.categories.length} Categories`);
        }
        if (collection.subCategories && collection.subCategories.length > 0) {
            parts.push(`${collection.subCategories.length} Subcategories`);
        }
        if (collection.products && collection.products.length > 0) {
            parts.push(`${collection.products.length} Products`);
        }
        if (parts.length > 0) {
            return `${parts.join(' + ')}`;
        }
        // Fallback
        return 'Custom Collection';
    }
    /**
   * Get all collections with pagination and filtering
   */ async getAllCollections(query) {
        const queryBuilder = this.collectionRepo.createQueryBuilder('collection').leftJoinAndSelect('collection.categories', 'categories').leftJoinAndSelect('collection.subCategories', 'subCategories').leftJoinAndSelect('collection.products', 'products').leftJoinAndSelect('collection.createdBy', 'createdBy').select([
            'collection',
            'categories.id',
            'categories.name',
            'subCategories.id',
            'subCategories.name',
            'products.id',
            'products.name',
            'createdBy.username'
        ]);
        const features = new _apifeatures.ApiFeatures(queryBuilder, query || {}, this.collectionRepo.metadata).filter().sort().paginate();
        const [data, total] = await features.getManyAndCount();
        const pagination = features.getPaginationInfo();
        // Add product count and sample products to each collection
        for (const collection of data){
            const productCount = await this.getCollectionProductCount(collection);
            collection.productCount = productCount;
            const sampleProducts = await this.getCollectionSampleProducts(collection, 10);
            collection.sampleProducts = sampleProducts;
        }
        return {
            status: 'success',
            results: data.length,
            total,
            currentPage: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
            lastPage: Math.ceil(total / pagination.limit),
            data
        };
    }
    /**
   * Get a single collection by ID
   */ async findOne(id) {
        const collection = await this.collectionRepo.findOne({
            where: {
                id
            },
            relations: [
                'categories',
                'subCategories',
                'products',
                'createdBy'
            ]
        });
        if (!collection) {
            throw new _common.NotFoundException(`Collection with ID ${id} not found`);
        }
        // Add product count and sample products
        const productCount = await this.getCollectionProductCount(collection);
        collection.productCount = productCount;
        const sampleProducts = await this.getCollectionSampleProducts(collection, 5);
        collection.sampleProducts = sampleProducts;
        return collection;
    }
    /**
   * Update a collection with comprehensive validation
   */ async update(id, updateDto) {
        var _collection_categories, _collection_subCategories, _collection_products;
        const collection = await this.findOne(id);
        // Update basic fields
        Object.assign(collection, updateDto);
        // Validate and fetch categories
        if (updateDto.categoryIds !== undefined) {
            if (updateDto.categoryIds.length > 0) {
                const categories = await this.validateAndFetchCategories(updateDto.categoryIds);
                collection.categories = categories;
            } else {
                collection.categories = [];
            }
        }
        // Validate and fetch subcategories
        if (updateDto.subCategoryIds !== undefined) {
            if (updateDto.subCategoryIds.length > 0) {
                const subCategories = await this.validateAndFetchSubCategories(updateDto.subCategoryIds, collection.categories || []);
                collection.subCategories = subCategories;
            } else {
                collection.subCategories = [];
            }
        }
        // Validate and fetch products
        if (updateDto.productIds !== undefined) {
            if (updateDto.productIds.length > 0) {
                // Limit to first 10 products
                const limitedProductIds = updateDto.productIds.slice(0, 10);
                const products = await this.validateAndFetchProducts(limitedProductIds, collection.categories || [], collection.subCategories || []);
                collection.products = products;
            } else {
                collection.products = [];
            }
        }
        // Validate that at least one of categories, subcategories, or products is provided
        if ((((_collection_categories = collection.categories) === null || _collection_categories === void 0 ? void 0 : _collection_categories.length) || 0) === 0 && (((_collection_subCategories = collection.subCategories) === null || _collection_subCategories === void 0 ? void 0 : _collection_subCategories.length) || 0) === 0 && (((_collection_products = collection.products) === null || _collection_products === void 0 ? void 0 : _collection_products.length) || 0) === 0) {
            throw new _common.BadRequestException('At least one category, subcategory, or product must be provided');
        }
        // Auto-regenerate name if name is not provided and content changed
        if (!updateDto.name && (updateDto.categoryIds !== undefined || updateDto.subCategoryIds !== undefined || updateDto.productIds !== undefined)) {
            collection.name = await this.generateCollectionName(collection);
        }
        return await this.collectionRepo.save(collection);
    }
    /**
   * Delete a collection
   */ async remove(id) {
        const collection = await this.findOne(id);
        await this.collectionRepo.remove(collection);
    }
    /**
   * Get products from a collection (for client API)
   */ async getCollectionProducts(id, query, req) {
        var _collection_metadata, _collection_metadata1, _collection_settings, _collection_settings1, _collection_settings2, _collection_settings3, _collection_settings4, _collection_settings5;
        const collection = await this.findOne(id);
        // Check if collection is active
        if (collection.status !== _productcollectionentity.CollectionStatus.ACTIVE) {
            throw new _common.BadRequestException('Collection is not active');
        }
        // Check validity dates
        if (((_collection_metadata = collection.metadata) === null || _collection_metadata === void 0 ? void 0 : _collection_metadata.validFrom) && ((_collection_metadata1 = collection.metadata) === null || _collection_metadata1 === void 0 ? void 0 : _collection_metadata1.validTo)) {
            const now = new Date();
            const validFrom = new Date(collection.metadata.validFrom);
            const validTo = new Date(collection.metadata.validTo);
            if (now < validFrom || now > validTo) {
                throw new _common.BadRequestException('Collection is not valid at this time');
            }
        }
        let queryBuilder = this.productRepo.createQueryBuilder('product').leftJoinAndSelect('product.category', 'category').leftJoinAndSelect('product.subCategory', 'subCategory').leftJoinAndSelect('product.poster', 'auth').select([
            'product',
            'category.id',
            'category.name',
            'subCategory.name',
            'subCategory.id',
            'auth.username'
        ]);
        // If collection has specific products, show only those
        if (collection.products && collection.products.length > 0) {
            const productIds = collection.products.map((prod)=>prod.id);
            queryBuilder = queryBuilder.where('product.id IN (:...productIds)', {
                productIds
            });
        } else {
            // If no specific products, show all products from categories/subcategories
            // Apply collection logic based on type
            switch(collection.type){
                case 'category_based':
                    if (collection.categories && collection.categories.length > 0) {
                        var _collection_settings6;
                        const categoryIds = collection.categories.map((cat)=>cat.id);
                        queryBuilder = queryBuilder.where('category.id IN (:...categoryIds)', {
                            categoryIds
                        });
                        if ((_collection_settings6 = collection.settings) === null || _collection_settings6 === void 0 ? void 0 : _collection_settings6.includeSubcategories) {
                            const subCategoryIds = await this.getSubCategoryIdsFromCategories(categoryIds);
                            if (subCategoryIds.length > 0) {
                                queryBuilder = queryBuilder.orWhere('subCategory.id IN (:...subCategoryIds)', {
                                    subCategoryIds
                                });
                            }
                        }
                    }
                    break;
                case 'product_based':
                    break;
                case 'mixed':
                    const conditions = [];
                    const params = {};
                    if (collection.categories && collection.categories.length > 0) {
                        const categoryIds = collection.categories.map((cat)=>cat.id);
                        conditions.push('category.id IN (:...categoryIds)');
                        params['categoryIds'] = categoryIds;
                    }
                    if (collection.subCategories && collection.subCategories.length > 0) {
                        const subCategoryIds = collection.subCategories.map((sub)=>sub.id);
                        conditions.push('subCategory.id IN (:...subCategoryIds)');
                        params['subCategoryIds'] = subCategoryIds;
                    }
                    if (conditions.length > 0) {
                        queryBuilder = queryBuilder.where(`(${conditions.join(' OR ')})`, params);
                    }
                    break;
            }
        }
        // Apply collection settings
        if (((_collection_settings = collection.settings) === null || _collection_settings === void 0 ? void 0 : _collection_settings.showOutOfStock) === false) {
            queryBuilder = queryBuilder.andWhere('product.quantity > 0');
        }
        if ((_collection_settings1 = collection.settings) === null || _collection_settings1 === void 0 ? void 0 : _collection_settings1.sortBy) {
            const sortOrder = collection.settings.sortOrder || 'ASC';
            queryBuilder = queryBuilder.orderBy(`product.${collection.settings.sortBy}`, sortOrder);
        } else {
            queryBuilder = queryBuilder.orderBy('collection.sortOrder', 'ASC');
        }
        // Apply API features (pagination, filtering, etc.)
        const features = new _apifeatures.ApiFeatures(queryBuilder, query || {}, this.productRepo.metadata).filter().sort().paginate();
        const [data, total] = await features.getManyAndCount();
        const pagination = features.getPaginationInfo();
        // Apply max products limit from settings
        let finalData = data;
        if (((_collection_settings2 = collection.settings) === null || _collection_settings2 === void 0 ? void 0 : _collection_settings2.maxProducts) && finalData.length > collection.settings.maxProducts) {
            finalData = finalData.slice(0, collection.settings.maxProducts);
        }
        // Transform URLs if request object is provided
        if (req) {
            finalData = this.transformProductUrls(finalData, req);
        }
        return {
            status: 'success',
            results: finalData.length,
            total: Math.min(total, ((_collection_settings3 = collection.settings) === null || _collection_settings3 === void 0 ? void 0 : _collection_settings3.maxProducts) || total),
            currentPage: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(Math.min(total, ((_collection_settings4 = collection.settings) === null || _collection_settings4 === void 0 ? void 0 : _collection_settings4.maxProducts) || total) / pagination.limit),
            lastPage: Math.ceil(Math.min(total, ((_collection_settings5 = collection.settings) === null || _collection_settings5 === void 0 ? void 0 : _collection_settings5.maxProducts) || total) / pagination.limit),
            data: finalData,
            collection: {
                id: collection.id,
                name: collection.name,
                description: collection.description,
                type: collection.type,
                status: collection.status,
                isFeatured: collection.isFeatured,
                sortOrder: collection.sortOrder,
                settings: collection.settings,
                metadata: collection.metadata,
                createdAt: collection.createdAt,
                updatedAt: collection.updatedAt
            }
        };
    }
    /**
   * Get active collections for client API
   */ async getActiveCollections() {
        const collections = await this.collectionRepo.find({
            where: {
                status: _productcollectionentity.CollectionStatus.ACTIVE
            },
            relations: [
                'categories',
                'subCategories',
                'products'
            ],
            order: {
                displayPriority: 'DESC',
                isPriority: 'DESC',
                sortOrder: 'ASC',
                createdAt: 'DESC'
            }
        });
        // Add product count and sample products to each collection
        for (const collection of collections){
            const productCount = await this.getCollectionProductCount(collection);
            collection.productCount = productCount;
            // Get first 3 products as sample
            const sampleProducts = await this.getCollectionSampleProducts(collection, 3);
            collection.sampleProducts = sampleProducts;
        }
        return collections;
    }
    /**
   * Get collection with its products (paginated)
   */ async getCollectionWithProducts(id, page = 1, limit = 10, req) {
        const collection = await this.findOne(id);
        // Get products for this collection
        const productsResult = await this.getCollectionProducts(id, {
            page: page.toString(),
            limit: limit.toString()
        }, req);
        return {
            collection,
            products: {
                data: productsResult.data,
                total: productsResult.total,
                currentPage: productsResult.currentPage,
                totalPages: productsResult.totalPages,
                hasMore: productsResult.currentPage < productsResult.totalPages
            }
        };
    }
    /**
   * Get total product count for a collection
   */ async getCollectionProductCount(collection) {
        let queryBuilder = this.productRepo.createQueryBuilder('product');
        // If collection has specific products, count only those
        if (collection.products && collection.products.length > 0) {
            const productIds = collection.products.map((prod)=>prod.id);
            return await queryBuilder.where('product.id IN (:...productIds)', {
                productIds
            }).getCount();
        }
        // If no specific products, count all products from categories/subcategories
        const conditions = [];
        const params = {};
        if (collection.categories && collection.categories.length > 0) {
            const categoryIds = collection.categories.map((cat)=>cat.id);
            conditions.push('product.categoryId IN (:...categoryIds)');
            params['categoryIds'] = categoryIds;
        }
        if (collection.subCategories && collection.subCategories.length > 0) {
            const subCategoryIds = collection.subCategories.map((sub)=>sub.id);
            conditions.push('product.subCategoryId IN (:...subCategoryIds)');
            params['subCategoryIds'] = subCategoryIds;
        }
        if (conditions.length > 0) {
            queryBuilder = queryBuilder.where(`(${conditions.join(' OR ')})`, params);
        }
        return await queryBuilder.getCount();
    }
    /**
   * Get sample products for a collection
   */ async getCollectionSampleProducts(collection, limit = 10) {
        // If collection has specific products, return ONLY those products (no sample)
        if (collection.products && collection.products.length > 0) {
            // Return the actual products added to the collection
            return collection.products.slice(0, limit);
        }
        // If no specific products, get sample products from categories/subcategories
        let queryBuilder = this.productRepo.createQueryBuilder('product').leftJoinAndSelect('product.category', 'category').leftJoinAndSelect('product.subCategory', 'subCategory').select([
            'product.id',
            'product.name',
            'product.description',
            'product.images',
            'product.imgCover',
            'product.quantity',
            'product.sizeDetails',
            'product.colors',
            'category.id',
            'category.name',
            'subCategory.id',
            'subCategory.name'
        ]).limit(limit);
        const conditions = [];
        const params = {};
        if (collection.categories && collection.categories.length > 0) {
            const categoryIds = collection.categories.map((cat)=>cat.id);
            conditions.push('product.categoryId IN (:...categoryIds)');
            params['categoryIds'] = categoryIds;
        }
        if (collection.subCategories && collection.subCategories.length > 0) {
            const subCategoryIds = collection.subCategories.map((sub)=>sub.id);
            conditions.push('product.subCategoryId IN (:...subCategoryIds)');
            params['subCategoryIds'] = subCategoryIds;
        }
        if (conditions.length > 0) {
            queryBuilder = queryBuilder.where(`(${conditions.join(' OR ')})`, params);
        }
        return await queryBuilder.getMany();
    }
    /**
   * Get priority collections (collections marked as priority)
   */ async getPriorityCollections() {
        return await this.collectionRepo.find({
            where: {
                status: _productcollectionentity.CollectionStatus.ACTIVE,
                isPriority: true
            },
            relations: [
                'categories',
                'subCategories'
            ],
            order: {
                displayPriority: 'DESC',
                sortOrder: 'ASC',
                createdAt: 'DESC'
            }
        });
    }
    /**
   * Get collections by priority range
   */ async getCollectionsByPriority(minPriority, maxPriority) {
        const queryBuilder = this.collectionRepo.createQueryBuilder('collection').leftJoinAndSelect('collection.categories', 'categories').leftJoinAndSelect('collection.subCategories', 'subCategories').where('collection.status = :status', {
            status: _productcollectionentity.CollectionStatus.ACTIVE
        });
        if (maxPriority !== undefined) {
            queryBuilder.andWhere('collection.displayPriority >= :minPriority AND collection.displayPriority <= :maxPriority', {
                minPriority,
                maxPriority
            });
        } else {
            queryBuilder.andWhere('collection.displayPriority >= :minPriority', {
                minPriority
            });
        }
        return await queryBuilder.orderBy('collection.displayPriority', 'DESC').addOrderBy('collection.sortOrder', 'ASC').addOrderBy('collection.createdAt', 'DESC').getMany();
    }
    /**
   * Helper method to get subcategory IDs from category IDs
   */ async getSubCategoryIdsFromCategories(categoryIds) {
        const subCategories = await this.subCategoryRepo.find({
            where: {
                categoryId: (0, _typeorm1.In)(categoryIds)
            },
            select: [
                'id'
            ]
        });
        return subCategories.map((sub)=>sub.id);
    }
    /**
   * Transform product file paths to full URLs
   */ transformProductUrls(products, req) {
        const protocol = req.protocol || 'http';
        const host = req.get('host') || 'localhost:3000';
        const baseUrl = `${protocol}://${host}`;
        return products.map((product)=>{
            const transformed = Object.create(Object.getPrototypeOf(product), Object.getOwnPropertyDescriptors(product));
            if (transformed.imgCover && !transformed.imgCover.startsWith('http')) {
                transformed.imgCover = `${baseUrl}/uploads/${transformed.imgCover}`;
            }
            if (transformed.imgSizeChart && !transformed.imgSizeChart.startsWith('http')) {
                transformed.imgSizeChart = `${baseUrl}/uploads/${transformed.imgSizeChart}`;
            }
            if (transformed.imgMeasure && !transformed.imgMeasure.startsWith('http')) {
                transformed.imgMeasure = `${baseUrl}/uploads/${transformed.imgMeasure}`;
            }
            if (transformed.images && Array.isArray(transformed.images)) {
                transformed.images = transformed.images.map((img)=>img && !img.startsWith('http') ? `${baseUrl}/uploads/${img}` : img);
            }
            if (transformed.colors && Array.isArray(transformed.colors)) {
                transformed.colors = transformed.colors.map((color)=>_object_spread_props(_object_spread({}, color), {
                        imgColor: color.imgColor && !color.imgColor.startsWith('http') ? `${baseUrl}/uploads/${color.imgColor}` : color.imgColor
                    }));
            }
            return transformed;
        });
    }
    constructor(collectionRepo, productRepo, categoryRepo, subCategoryRepo){
        this.collectionRepo = collectionRepo;
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.subCategoryRepo = subCategoryRepo;
    }
};
ProductCollectionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_productcollectionentity.ProductCollection)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_productentity.product)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_Categoryentity.category)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_Categoryentity.subCategory)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ProductCollectionService);

//# sourceMappingURL=product-collection.service.js.map