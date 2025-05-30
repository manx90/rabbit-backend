import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category, SubCategory } from './entities/Category.entity';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepository.findOne({
      where: { name: dto.name },
    });
    if (existing)
      throw new HttpException(
        'Category already exists',
        HttpStatus.BAD_REQUEST,
      );

    const category = this.categoryRepository.create({
      name: dto.name,
      isActive: true,
    });

    return this.categoryRepository.save(category);
  }

  async createSubCategory(dto: CreateSubCategoryDto): Promise<SubCategory> {
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
      relations: ['category'],
    });
    if (exists)
      throw new HttpException(
        'SubCategory already exists',
        HttpStatus.BAD_REQUEST,
      );

    const sub = this.subCategoryRepository.create({
      name: dto.name,
      category: parent,
      isActive: true,
    });
    return this.subCategoryRepository.save(sub);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['subCategories'] });
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['subCategories'],
    });
    if (!category)
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    return category;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto): Promise<Category> {
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

    return this.categoryRepository.save(category);
  }

  async updateSubCategory(
    id: number,
    dto: UpdateSubCategoryDto,
  ): Promise<SubCategory> {
    const sub = await this.subCategoryRepository.findOne({
      where: { id },
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

    return this.subCategoryRepository.save(sub);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.getCategoryById(id);
    await this.subCategoryRepository.remove(category.subCategories);
    await this.categoryRepository.remove(category);
  }

  async deleteSubCategory(id: number): Promise<void> {
    const sub = await this.subCategoryRepository.findOne({ where: { id } });
    if (!sub)
      throw new HttpException('SubCategory not found', HttpStatus.NOT_FOUND);
    await this.subCategoryRepository.remove(sub);
  }

  async deleteAll(): Promise<void> {
    await this.productRepository.delete({});
    await this.subCategoryRepository.delete({});
    await this.categoryRepository.delete({});
  }
}
