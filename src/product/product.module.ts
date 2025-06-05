import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { product } from './entities/product.entity';
import { category, subCategory } from './entities/Category.entity';
import { FileStorageModule } from '../file-storage/file-storage.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([product, category, subCategory]),
    FileStorageModule,
  ],
  controllers: [ProductController, CategoryController],
  providers: [ProductService, CategoryService],
  exports: [ProductService, CategoryService],
})
export class ProductModule {}
