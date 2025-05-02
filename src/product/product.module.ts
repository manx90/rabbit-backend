import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, User } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product, User])],
})
export class ProductModule {}
