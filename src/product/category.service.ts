import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request as ExpressRequest } from 'express';
import { ParsedQs } from 'qs';
import { PublishState } from 'src/common/interfaces/entity.interface';
import { CategoryApiFeatures } from 'src/common/utils/category-api-features';
import { FileStorageService } from 'src/file-storage/file-storage.service';
import { Repository } from 'typeorm';
import {
  CreateCategoryDto,
  CreateSubCategoryDto,
  UpdateCategoryDto,
  UpdateSubCategoryDto,
  UploadIcon,
} from './dto/category.dto';
import { category, subCategory } from './entities/Category.entity';
import { product } from './entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(category)
    private categoryRepository: Repository<category>,
    @InjectRepository(subCategory)
    private subCategoryRepository: Repository<subCategory>,
    @InjectRepository(product)
    private productRepository: Repository<product>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  private async saveFiles(
    files: Express.Multer.File[] = [],
    mainDirectory: string,
    categoryName: string,
    subDirectory?: string,
  ): Promise<string[]> {
    const categoryPath = `${mainDirectory}/${categoryName.replace(/\s+/g, '_').toLowerCase()}/${subDirectory}`;
    console.log('categoryPath', categoryPath);
    return await this.fileStorageService.saveFiles(files, categoryPath);
  }
  async createCategory(
    file: UploadIcon,
    dto: CreateCategoryDto,
  ): Promise<category> {
    // Check if a category with the same name already exists
    const existing = await this.categoryRepository.findOne({
      where: { name: dto.name },
    });
    if (existing)
      throw new HttpException(
        'Category already exists',
        HttpStatus.BAD_REQUEST,
      );
    let icon: string | undefined = undefined;
    console.log('icon file uploaded', file);
    // If an icon file is provided, save it and get its path
    if (file.iconCat) {
      icon = (
        await this.saveFiles(
          [file.iconCat],
          'categoriesIcons',
          dto.name,
          'iconCat',
        )
      )[0];
    }
    // Create a new category entity
    const category = this.categoryRepository.create({
      name: dto.name,
      icon: icon,
      isActive: true,
    });
    // Save the new category to the database and return it
    return this.categoryRepository.save(category);
  }
  async createSubCategory(
    file: UploadIcon,
    dto: CreateSubCategoryDto,
  ): Promise<subCategory> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { name: dto.name, category: { id: dto.categoryId } },
    });
    if (subCategory)
      throw new HttpException(
        'SubCategory already exists',
        HttpStatus.BAD_REQUEST,
      );
    const parent = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });
    if (!parent)
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

    if (!dto.name.trim()) {
      throw new HttpException(
        'SubCategory name is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const exists = await this.subCategoryRepository.findOne({
      where: { name: dto.name, category: { id: dto.categoryId } },
    });
    if (exists)
      throw new HttpException(
        'SubCategory already exists',
        HttpStatus.BAD_REQUEST,
      );

    let icon: string | undefined = undefined;
    if (file.iconSubCat) {
      icon = (
        await this.saveFiles(
          [file.iconSubCat],
          'subCategoriesIcons',
          parent.name,
          dto.name,
        )
      )[0];
    }
    const sub = this.subCategoryRepository.create({
      name: dto.name,
      category: { id: parent.id, name: parent.name },
      isActive: true,
      icon: icon,
    });
    return this.subCategoryRepository.save(sub);
  }
  private transformCategoryUrls(
    categories: category[],
    req: ExpressRequest,
  ): any[] {
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    return categories.map((category) => {
      // Create a clone of the category to avoid modifying the original
      const transformed = Object.create(
        Object.getPrototypeOf(category),
        Object.getOwnPropertyDescriptors(category),
      );

      // Transform category icon URL
      if (transformed.icon && !transformed.icon.startsWith('http')) {
        transformed.icon = `${baseUrl}/uploads/${transformed.icon}`;
      }

      // Transform subcategory icon URLs
      if (
        transformed.subCategories &&
        Array.isArray(transformed.subCategories)
      ) {
        transformed.subCategories = transformed.subCategories.map(
          (subCat: any) => ({
            ...subCat,
            icon:
              subCat.icon && !subCat.icon.startsWith('http')
                ? `${baseUrl}/uploads/${subCat.icon}`
                : subCat.icon,
          }),
        );
      }

      return transformed;
    });
  }
  async getAllCategories(
    query?: ParsedQs,
    req?: ExpressRequest,
  ): Promise<{
    status: string;
    results: number;
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
    lastPage: number;
    data: category[];
  }> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subCategories', 'subCategory')
      .select([
        'category.id',
        'category.name',
        'category.icon',
        'category.isActive',
        'category.createdAt',
        'category.updatedAt',
        'subCategory.id',
        'subCategory.name',
        'subCategory.icon',
        'subCategory.isActive',
        'subCategory.categoryId',
      ]);

    const features = new CategoryApiFeatures(
      queryBuilder,
      query || {},
      this.categoryRepository.metadata,
    )
      .filter()
      .sort()
      .paginate();

    const [data, total] = await features.getManyAndCount();
    const transformedData = req ? this.transformCategoryUrls(data, req) : data;
    const pagination = features.getPaginationInfo();

    return {
      status: 'success',
      results: transformedData.length,
      total,
      currentPage: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
      lastPage: Math.ceil(total / pagination.limit),
      data: transformedData,
    };
  }
  async getCategoryById(id: number): Promise<category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['subCategories'],
    });
    if (!category)
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    return category;
  }
  async updateCategory(
    id: number,
    dto: UpdateCategoryDto,
    file?: UploadIcon,
  ): Promise<category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category)
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

    if (dto.name && dto.name !== category.name) {
      const dup = await this.categoryRepository.findOne({
        where: { name: dto.name },
      });
      if (dup)
        throw new HttpException(
          'Category name already exists',
          HttpStatus.BAD_REQUEST,
        );
      category.name = dto.name;
    }
    if (dto.isActive !== undefined) category.isActive = dto.isActive;
    if (file?.iconCat) {
      category.icon = (
        await this.saveFiles(
          [file.iconCat],
          'categoriesIcons',
          category.name,
          'iconCat',
        )
      )[0];
    }
    return this.categoryRepository.save(category);
  }
  async updateSubCategory(
    categoryId: number,
    id: number,
    dto: UpdateSubCategoryDto,
    file?: UploadIcon,
  ): Promise<subCategory> {
    const sub = await this.subCategoryRepository.findOne({
      where: { id, categoryId: categoryId },
      relations: ['category'],
    });
    if (!sub)
      throw new HttpException('SubCategory not found', HttpStatus.NOT_FOUND);

    if (dto.name && dto.name !== sub.name) {
      const dup = await this.subCategoryRepository.findOne({
        where: { name: dto.name },
      });
      if (dup)
        throw new HttpException(
          'SubCategory name already exists',
          HttpStatus.BAD_REQUEST,
        );
      sub.name = dto.name;
    }
    if (dto.isActive !== undefined) sub.isActive = dto.isActive;
    if (file?.iconSubCat) {
      sub.icon = (
        await this.saveFiles(
          [file.iconSubCat],
          'subCategoriesIcons',
          sub.category.name,
          dto.name ?? sub.name,
        )
      )[0];
    }
    return this.subCategoryRepository.save(sub);
  }
  async deleteCategory(id: number): Promise<void> {
    const category = await this.getCategoryById(id);
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    if (category.icon && category.icon !== '') {
      // Icons are stored under categoriesIcons/<categoryName>
      this.fileStorageService.deleteDirectory(
        `categoriesIcons/${category.name.replace(/\s+/g, '_').toLowerCase()}`,
      );
    }
    if (category.subCategories && category.subCategories.length > 0) {
      for (const sub of category.subCategories) {
        if (sub.icon && sub.icon !== '') {
          // Use parent category name from outer scope to avoid missing relation on sub
          this.fileStorageService.deleteDirectory(
            `subCategoriesIcons/${category.name
              .replace(/\s+/g, '_')
              .toLowerCase()}/${sub.name.replace(/\s+/g, '_').toLowerCase()}`,
          );
        }
      }
    }
    await this.subCategoryRepository.remove(category.subCategories);
    await this.categoryRepository.remove(category);
  }
  async deleteSubCategory(id: number): Promise<void> {
    const sub = await this.subCategoryRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!sub)
      throw new HttpException('SubCategory not found', HttpStatus.NOT_FOUND);
    if (sub.icon && sub.icon !== '' && sub.category) {
      this.fileStorageService.deleteDirectory(
        `subCategoriesIcons/${sub.category.name
          .replace(/\s+/g, '_')
          .toLowerCase()}/${sub.name.replace(/\s+/g, '_').toLowerCase()}`,
      );
    }
    await this.subCategoryRepository.remove(sub);
  }
  async deleteAll(): Promise<void> {
    await this.productRepository.delete({});
    await this.subCategoryRepository.delete({});
    await this.categoryRepository.delete({});
  }
  async getSubCategories() {
    return this.subCategoryRepository.find();
  }
  async getSubCategoryById(id: number): Promise<subCategory> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
    });
    if (!subCategory)
      throw new HttpException('SubCategory not found', HttpStatus.NOT_FOUND);
    return subCategory;
  }
  async updateState(id: number): Promise<category> {
    const categoryEntity = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!categoryEntity) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    const products = await this.productRepository.find({
      where: { category: { id } },
      relations: ['category', 'subCategory'],
    });
    categoryEntity.isActive = !categoryEntity.isActive;
    await this.categoryRepository.save(categoryEntity);
    const newPublishState = categoryEntity.isActive
      ? PublishState.PUBLISHED
      : PublishState.DRAFT;

    for (const product of products) {
      if (product.publishState !== newPublishState) {
        product.publishState = newPublishState;
        product.isManualPublishState = true;
        await this.productRepository.save(product);
        console.log(`Updated product ${product.id} to ${newPublishState}`);
      }
    }
    return categoryEntity;
  }
  async updateStateSub(id: number): Promise<subCategory> {
    const subcategoryEntity = await this.subCategoryRepository.findOne({
      where: { id },
    });
    if (!subcategoryEntity) {
      throw new HttpException('subcateogry not found', HttpStatus.NOT_FOUND);
    }
    const products = await this.productRepository.find({
      where: { subCategory: { id } },
      relations: ['category', 'subCategory'],
    });
    subcategoryEntity.isActive = !subcategoryEntity.isActive;
    await this.subCategoryRepository.save(subcategoryEntity);
    const newPublishState = subcategoryEntity.isActive
      ? PublishState.PUBLISHED
      : PublishState.DRAFT;

    for (const product of products) {
      if (product.publishState !== newPublishState) {
        product.publishState = newPublishState;
        product.isManualPublishState = true;
        await this.productRepository.save(product);
        console.log(`Updated product ${product.id} to ${newPublishState}`);
      }
    }
    return subcategoryEntity;
  }
}
