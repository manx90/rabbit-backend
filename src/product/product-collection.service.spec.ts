import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCollectionService } from './product-collection.service';
import { ProductCollection } from './entities/product-collection.entity';
import { product } from './entities/product.entity';
import { category, subCategory } from './entities/Category.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { auth } from '../auth/entities/auth.entity';

describe('ProductCollectionService', () => {
  let service: ProductCollectionService;
  let collectionRepo: Repository<ProductCollection>;
  let productRepo: Repository<product>;
  let categoryRepo: Repository<category>;
  let subCategoryRepo: Repository<subCategory>;

  const mockCollectionRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockProductRepo = {
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockCategoryRepo = {
    find: jest.fn(),
  };

  const mockSubCategoryRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCollectionService,
        {
          provide: getRepositoryToken(ProductCollection),
          useValue: mockCollectionRepo,
        },
        {
          provide: getRepositoryToken(product),
          useValue: mockProductRepo,
        },
        {
          provide: getRepositoryToken(category),
          useValue: mockCategoryRepo,
        },
        {
          provide: getRepositoryToken(subCategory),
          useValue: mockSubCategoryRepo,
        },
      ],
    }).compile();

    service = module.get<ProductCollectionService>(ProductCollectionService);
    collectionRepo = module.get<Repository<ProductCollection>>(
      getRepositoryToken(ProductCollection),
    );
    productRepo = module.get<Repository<product>>(getRepositoryToken(product));
    categoryRepo = module.get<Repository<category>>(
      getRepositoryToken(category),
    );
    subCategoryRepo = module.get<Repository<subCategory>>(
      getRepositoryToken(subCategory),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockUser: auth = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should throw error when no categories, subcategories, or products are provided', async () => {
      const createDto = {
        name: 'Test Collection',
        type: 'mixed' as any,
      };

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        'At least one category, subcategory, or product must be provided',
      );
    });

    it('should throw error when categories are not found', async () => {
      const createDto = {
        name: 'Test Collection',
        categoryIds: [1, 2, 3],
      };

      mockCategoryRepo.find.mockResolvedValue([]);

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        'Categories with IDs [1, 2, 3] not found',
      );
    });

    it('should throw error when subcategories are not found', async () => {
      const createDto = {
        name: 'Test Collection',
        subCategoryIds: [1, 2, 3],
      };

      mockSubCategoryRepo.find.mockResolvedValue([]);

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        'Subcategories with IDs [1, 2, 3] not found',
      );
    });

    it('should throw error when products are not found', async () => {
      const createDto = {
        name: 'Test Collection',
        productIds: [1, 2, 3],
      };

      mockProductRepo.find.mockResolvedValue([]);

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        'Products with IDs [1, 2, 3] not found',
      );
    });

    it('should throw error when subcategories do not belong to specified categories', async () => {
      const createDto = {
        name: 'Test Collection',
        categoryIds: [1],
        subCategoryIds: [2],
      };

      const mockCategories = [{ id: 1, name: 'Category 1', isActive: true }];
      const mockSubCategories = [
        { id: 2, name: 'SubCategory 2', categoryId: 3, isActive: true },
      ];

      mockCategoryRepo.find.mockResolvedValue(mockCategories);
      mockSubCategoryRepo.find.mockResolvedValue(mockSubCategories);

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        'Subcategories with IDs [2] do not belong to any of the specified categories [1]',
      );
    });

    it('should throw error when products do not belong to specified categories/subcategories', async () => {
      const createDto = {
        name: 'Test Collection',
        categoryIds: [1],
        productIds: [2],
      };

      const mockCategories = [{ id: 1, name: 'Category 1', isActive: true }];
      const mockProducts = [
        {
          id: 2,
          name: 'Product 2',
          category: { id: 3 },
          subCategory: { id: 4 },
          isDeleted: false,
        },
      ];

      mockCategoryRepo.find.mockResolvedValue(mockCategories);
      mockProductRepo.find.mockResolvedValue(mockProducts);

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        'Products with IDs [2] do not belong to the specified categories [1]',
      );
    });

    it('should create collection successfully with valid data', async () => {
      const createDto = {
        name: 'Test Collection',
        categoryIds: [1],
        subCategoryIds: [2],
        productIds: [3],
      };

      const mockCategories = [{ id: 1, name: 'Category 1', isActive: true }];
      const mockSubCategories = [
        { id: 2, name: 'SubCategory 2', categoryId: 1, isActive: true },
      ];
      const mockProducts = [
        {
          id: 3,
          name: 'Product 3',
          category: { id: 1 },
          subCategory: { id: 2 },
          isDeleted: false,
        },
      ];

      const mockCollection = {
        id: 1,
        name: 'Test Collection',
        categories: mockCategories,
        subCategories: mockSubCategories,
        products: mockProducts,
      };

      mockCategoryRepo.find.mockResolvedValue(mockCategories);
      mockSubCategoryRepo.find.mockResolvedValue(mockSubCategories);
      mockProductRepo.find.mockResolvedValue(mockProducts);
      mockCollectionRepo.create.mockReturnValue(mockCollection);
      mockCollectionRepo.save.mockResolvedValue(mockCollection);

      const result = await service.create(createDto, mockUser);

      expect(result).toEqual(mockCollection);
      expect(mockCollectionRepo.create).toHaveBeenCalledWith({
        ...createDto,
        createdBy: mockUser,
        categories: mockCategories,
        subCategories: mockSubCategories,
        products: mockProducts,
      });
      expect(mockCollectionRepo.save).toHaveBeenCalledWith(mockCollection);
    });
  });
});
