import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category, SubCategory } from './entities/Category.entity';

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

  async createCategory(categoryName: string): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { category: categoryName },
    });
    if (existingCategory) {
      throw new Error('Category already exists');
    }
    const category = new Category();
    category.category = categoryName;
    category.isActive = true;
    return await this.categoryRepository.save(category);
  }

  async createSubCategory(
    categoryId: number,
    subCategoryName: string,
  ): Promise<SubCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    if (
      subCategoryName == null ||
      subCategoryName == undefined ||
      subCategoryName.trim() === ''
    ) {
      throw new HttpException(
        'SubCategory name is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existSubOnCategory = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['subCategories']
    });

    const existingSubCategory = existSubOnCategory?.subCategories?.find(
      sub => sub.name.toLowerCase() === subCategoryName.toLowerCase()
    );

    if (existingSubCategory) {
      throw new HttpException(
        'SubCategory already exists in this category',
        HttpStatus.BAD_REQUEST,
      );
    }

    const subCategory = new SubCategory();
    subCategory.name = subCategoryName;
    subCategory.category = category;

    return await this.subCategoryRepository.save(subCategory);
  }

  async getAllCategories(): Promise<any> {
    return await this.categoryRepository.find({
      relations: ['subCategories'],
    });
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['subCategories'],
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['subCategories'],
    });

    if (!category) {
      throw new Error('Category not found');
    }

    // Delete all subcategories first
    if (category.subCategories) {
      await this.subCategoryRepository.remove(category.subCategories);
    }

    // Then delete the category
    await this.categoryRepository.remove(category);
  }

  async deleteSubCategory(id: number): Promise<void> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
    });

    if (!subCategory) {
      throw new Error('SubCategory not found');
    }

    await this.subCategoryRepository.remove(subCategory);
  }

  async updateCategory(id: number, newName: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const existingCategory = await this.categoryRepository.findOne({
      where: { category: newName },
    });

    if (existingCategory && existingCategory.id !== id) {
      throw new Error('Category name already exists');
    }

    category.category = newName;
    return await this.categoryRepository.save(category);
  }

  async updateSubCategory(id: number, newName: string): Promise<SubCategory> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
    });

    if (!subCategory) {
      throw new Error('SubCategory not found');
    }

    const existingSubCategory = await this.subCategoryRepository.findOne({
      where: { name: newName },
    });

    if (existingSubCategory && existingSubCategory.id !== id) {
      throw new Error('SubCategory name already exists');
    }

    subCategory.name = newName;
    return await this.subCategoryRepository.save(subCategory);
  }

  async deleteAll(): Promise<void> {
    // 1. حذف جميع المنتجات أولاً
    await this.productRepository.delete({});
    // 2. ثم حذف جميع الـ SubCategories
    await this.subCategoryRepository.delete({});

    // 3. وأخيراً حذف الـ Categories
    await this.categoryRepository.delete({});
  }
}
