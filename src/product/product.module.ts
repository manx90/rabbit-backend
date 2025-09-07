import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService } from '../common/utils/logger.service';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { category, subCategory } from './entities/Category.entity';
import { ProductCollection } from './entities/product-collection.entity';
import { product } from './entities/product.entity';
import { ProductCollectionController } from './product-collection.controller';
import { ProductCollectionService } from './product-collection.service';
import { ProductController } from './product.controller';
import { ProductCrud } from './product.crud';
import { ProductService } from './product.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      product,
      category,
      subCategory,
      ProductCollection,
      ProductService,
    ]),
    FileStorageModule,
  ],
  controllers: [
    ProductController,
    CategoryController,
    ProductCollectionController,
  ],
  providers: [
    ProductService,
    ProductCrud,
    CategoryService,
    ProductCollectionService,
    LoggerService,
  ],
  exports: [
    ProductService,
    ProductCrud,
    CategoryService,
    ProductCollectionService,
  ],
})
export class ProductModule {}
