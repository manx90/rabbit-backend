import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(name: string) {
    const category = this.categoryRepository.create({ name });
    return this.categoryRepository.save(category);
  }

  async findAll() {
    return this.categoryRepository.find({
      relations: ['subCategories'],
    });
  }

  async findOne(id: number) {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['subCategories'],
    });
  }

  async update(id: number, name: string) {
    await this.categoryRepository.update(id, { name });
    return this.findOne(id);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (category) {
      await this.categoryRepository.remove(category);
    }
    return category;
  }
}
