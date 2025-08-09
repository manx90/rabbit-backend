"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _productcollectionservice = require("./product-collection.service");
const _productcollectionentity = require("./entities/product-collection.entity");
const _productentity = require("./entities/product.entity");
const _Categoryentity = require("./entities/Category.entity");
const _common = require("@nestjs/common");
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
describe('ProductCollectionService', ()=>{
    let service;
    let collectionRepo;
    let productRepo;
    let categoryRepo;
    let subCategoryRepo;
    const mockCollectionRepo = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        remove: jest.fn(),
        createQueryBuilder: jest.fn()
    };
    const mockProductRepo = {
        find: jest.fn(),
        createQueryBuilder: jest.fn()
    };
    const mockCategoryRepo = {
        find: jest.fn()
    };
    const mockSubCategoryRepo = {
        find: jest.fn()
    };
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _productcollectionservice.ProductCollectionService,
                {
                    provide: (0, _typeorm.getRepositoryToken)(_productcollectionentity.ProductCollection),
                    useValue: mockCollectionRepo
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_productentity.product),
                    useValue: mockProductRepo
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_Categoryentity.category),
                    useValue: mockCategoryRepo
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_Categoryentity.subCategory),
                    useValue: mockSubCategoryRepo
                }
            ]
        }).compile();
        service = module.get(_productcollectionservice.ProductCollectionService);
        collectionRepo = module.get((0, _typeorm.getRepositoryToken)(_productcollectionentity.ProductCollection));
        productRepo = module.get((0, _typeorm.getRepositoryToken)(_productentity.product));
        categoryRepo = module.get((0, _typeorm.getRepositoryToken)(_Categoryentity.category));
        subCategoryRepo = module.get((0, _typeorm.getRepositoryToken)(_Categoryentity.subCategory));
    });
    afterEach(()=>{
        jest.clearAllMocks();
    });
    describe('create', ()=>{
        const mockUser = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword',
            role: 'admin',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        it('should throw error when no categories, subcategories, or products are provided', async ()=>{
            const createDto = {
                name: 'Test Collection',
                type: 'mixed'
            };
            await expect(service.create(createDto, mockUser)).rejects.toThrow(_common.BadRequestException);
            await expect(service.create(createDto, mockUser)).rejects.toThrow('At least one category, subcategory, or product must be provided');
        });
        it('should throw error when categories are not found', async ()=>{
            const createDto = {
                name: 'Test Collection',
                categoryIds: [
                    1,
                    2,
                    3
                ]
            };
            mockCategoryRepo.find.mockResolvedValue([]);
            await expect(service.create(createDto, mockUser)).rejects.toThrow(_common.NotFoundException);
            await expect(service.create(createDto, mockUser)).rejects.toThrow('Categories with IDs [1, 2, 3] not found');
        });
        it('should throw error when subcategories are not found', async ()=>{
            const createDto = {
                name: 'Test Collection',
                subCategoryIds: [
                    1,
                    2,
                    3
                ]
            };
            mockSubCategoryRepo.find.mockResolvedValue([]);
            await expect(service.create(createDto, mockUser)).rejects.toThrow(_common.NotFoundException);
            await expect(service.create(createDto, mockUser)).rejects.toThrow('Subcategories with IDs [1, 2, 3] not found');
        });
        it('should throw error when products are not found', async ()=>{
            const createDto = {
                name: 'Test Collection',
                productIds: [
                    1,
                    2,
                    3
                ]
            };
            mockProductRepo.find.mockResolvedValue([]);
            await expect(service.create(createDto, mockUser)).rejects.toThrow(_common.NotFoundException);
            await expect(service.create(createDto, mockUser)).rejects.toThrow('Products with IDs [1, 2, 3] not found');
        });
        it('should throw error when subcategories do not belong to specified categories', async ()=>{
            const createDto = {
                name: 'Test Collection',
                categoryIds: [
                    1
                ],
                subCategoryIds: [
                    2
                ]
            };
            const mockCategories = [
                {
                    id: 1,
                    name: 'Category 1',
                    isActive: true
                }
            ];
            const mockSubCategories = [
                {
                    id: 2,
                    name: 'SubCategory 2',
                    categoryId: 3,
                    isActive: true
                }
            ];
            mockCategoryRepo.find.mockResolvedValue(mockCategories);
            mockSubCategoryRepo.find.mockResolvedValue(mockSubCategories);
            await expect(service.create(createDto, mockUser)).rejects.toThrow(_common.BadRequestException);
            await expect(service.create(createDto, mockUser)).rejects.toThrow('Subcategories with IDs [2] do not belong to any of the specified categories [1]');
        });
        it('should throw error when products do not belong to specified categories/subcategories', async ()=>{
            const createDto = {
                name: 'Test Collection',
                categoryIds: [
                    1
                ],
                productIds: [
                    2
                ]
            };
            const mockCategories = [
                {
                    id: 1,
                    name: 'Category 1',
                    isActive: true
                }
            ];
            const mockProducts = [
                {
                    id: 2,
                    name: 'Product 2',
                    category: {
                        id: 3
                    },
                    subCategory: {
                        id: 4
                    },
                    isDeleted: false
                }
            ];
            mockCategoryRepo.find.mockResolvedValue(mockCategories);
            mockProductRepo.find.mockResolvedValue(mockProducts);
            await expect(service.create(createDto, mockUser)).rejects.toThrow(_common.BadRequestException);
            await expect(service.create(createDto, mockUser)).rejects.toThrow('Products with IDs [2] do not belong to the specified categories [1]');
        });
        it('should create collection successfully with valid data', async ()=>{
            const createDto = {
                name: 'Test Collection',
                categoryIds: [
                    1
                ],
                subCategoryIds: [
                    2
                ],
                productIds: [
                    3
                ]
            };
            const mockCategories = [
                {
                    id: 1,
                    name: 'Category 1',
                    isActive: true
                }
            ];
            const mockSubCategories = [
                {
                    id: 2,
                    name: 'SubCategory 2',
                    categoryId: 1,
                    isActive: true
                }
            ];
            const mockProducts = [
                {
                    id: 3,
                    name: 'Product 3',
                    category: {
                        id: 1
                    },
                    subCategory: {
                        id: 2
                    },
                    isDeleted: false
                }
            ];
            const mockCollection = {
                id: 1,
                name: 'Test Collection',
                categories: mockCategories,
                subCategories: mockSubCategories,
                products: mockProducts
            };
            mockCategoryRepo.find.mockResolvedValue(mockCategories);
            mockSubCategoryRepo.find.mockResolvedValue(mockSubCategories);
            mockProductRepo.find.mockResolvedValue(mockProducts);
            mockCollectionRepo.create.mockReturnValue(mockCollection);
            mockCollectionRepo.save.mockResolvedValue(mockCollection);
            const result = await service.create(createDto, mockUser);
            expect(result).toEqual(mockCollection);
            expect(mockCollectionRepo.create).toHaveBeenCalledWith(_object_spread_props(_object_spread({}, createDto), {
                createdBy: mockUser,
                categories: mockCategories,
                subCategories: mockSubCategories,
                products: mockProducts
            }));
            expect(mockCollectionRepo.save).toHaveBeenCalledWith(mockCollection);
        });
    });
});

//# sourceMappingURL=product-collection.service.spec.js.map