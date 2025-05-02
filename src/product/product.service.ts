import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  deleteAll() {
    return this.productRepository.clear();
  }
  create({ images, ...createProductDto }: CreateProductDto) {
    const product = this.productRepository.create({
      images,
      ...createProductDto,
    });
    return this.productRepository.save(product);
  }

  async findAll() {
    return this.productRepository.find();
  }

  delete(id: number) {
    return this.productRepository.delete(id);
  }
}
