import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from '../entities/sub-category.entity';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
  ) {}

  async create(name: string, categoryId: number) {
    const subCategory = this.subCategoryRepository.create({
      name,
      category: { id: categoryId },
    });
    return this.subCategoryRepository.save(subCategory);
  }

  async findAll() {
    return this.subCategoryRepository.find({
      relations: ['category'],
    });
  }

  async findOne(id: number) {
    return this.subCategoryRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async update(id: number, name: string, categoryId: number) {
    await this.subCategoryRepository.update(id, {
      name,
      category: { id: categoryId },
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    const subCategory = await this.findOne(id);
    if (subCategory) {
      await this.subCategoryRepository.remove(subCategory);
    }
    return subCategory;
  }
}
