import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Product } from './entities/product.entity';
import { Category, SubCategory } from './entities/Category.entity';
import { AuthMiddleware } from 'src/auth/auth.middleware';
@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, SubCategory])],
  controllers: [ProductController, CategoryController],
  providers: [ProductService, CategoryService],
  exports: [ProductService, CategoryService],
})
export class AuthMiddlewareProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProductController);
  }
}
export class ProductModule {}
