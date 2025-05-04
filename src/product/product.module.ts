import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryController } from './category.controller';
import { SubCategoryController } from './sub-category.controller';
import { CategoryService } from './services/category.service';
import { SubCategoryService } from './services/sub-category.service';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/sub-category.entity';
import { ProductSize } from './entities/product-size.entity';
import { ProductColor } from './entities/product-color.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      SubCategory,
      ProductSize,
      ProductColor,
    ]),
  ],
  controllers: [ProductController, CategoryController, SubCategoryController],
  providers: [ProductService, CategoryService, SubCategoryService],
  exports: [ProductService, CategoryService, SubCategoryService],
})
export class ProductModule {}
