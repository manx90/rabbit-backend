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
import { SizeTableController } from './size-table.controller';
import { SizeTableService } from './size-table.service';
import { SizeTableCrud } from './size-table.crud';
import { SizeTable, SizeDimension, SizeField } from './entities/sizeTable';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      product,
      category,
      subCategory,
      ProductCollection,
      ProductService,
      SizeTable,
      SizeDimension,
      SizeField,
    ]),
    FileStorageModule,
  ],
  controllers: [
    ProductController,
    CategoryController,
    ProductCollectionController,
    SizeTableController,
  ],
  providers: [
    ProductService,
    ProductCrud,
    CategoryService,
    ProductCollectionService,
    LoggerService,
    SizeTableService,
    SizeTableCrud,
  ],
  exports: [
    ProductService,
    ProductCrud,
    CategoryService,
    ProductCollectionService,
    SizeTableService,
    SizeTableCrud,
  ],
})
export class ProductModule {}
