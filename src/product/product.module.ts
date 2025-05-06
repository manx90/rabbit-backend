import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Product,
  Category,
  SubCategory,
  ProductSize,
} from './entities/product.entity';
import { ProductService } from './product.service';
@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    TypeOrmModule.forFeature([Product, Category, SubCategory, ProductSize]),
  ],
})
export class ProductModule {}
