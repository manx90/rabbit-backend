import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ProductCollectionController } from './product-collection.controller';
import { ProductCollectionService } from './product-collection.service';
import { product } from './entities/product.entity';
import { category, subCategory } from './entities/Category.entity';
import { ProductCollection } from './entities/product-collection.entity';
import { FileStorageModule } from '../file-storage/file-storage.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      product,
      category,
      subCategory,
      ProductCollection,
    ]),
    FileStorageModule,
  ],
  controllers: [
    ProductController,
    CategoryController,
    ProductCollectionController,
  ],
  providers: [ProductService, CategoryService, ProductCollectionService],
  exports: [ProductService, CategoryService, ProductCollectionService],
})
export class ProductModule {}
