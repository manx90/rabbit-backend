import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category, SubCategory, ProductSize , Product } from './entities/product.entity';
import { CreateProductDto } from './dto/Product.dto';

@Injectable()
export class ProductService {

  constructor(
      @InjectRepository(Product)
      private productRepository: Repository<Product>,
      @InjectRepository(Category)
      private categoryRepository: Repository<Category>,
      @InjectRepository(SubCategory)
      private subCategoryRepository: Repository<SubCategory>,
      @InjectRepository(ProductSize)
      private productSizeRepository: Repository<ProductSize>,
  ) {}
  async createProduct(createProductDto: CreateProductDto, files: { 
    images?: Express.Multer.File[],
    imgColors?: Express.Multer.File[],
    imgSize?: Express.Multer.File[],
    imgMeasure?: Express.Multer.File[],
    imgCover?: Express.Multer.File[]
  }): Promise<Product> {
    const product = new Product();
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.priceCover = createProductDto.priceCover;
    
    // Handle file uploads
    if (files.images) {
      product.images = files.images.map(file => file.buffer);
    }
    if (files.imgColors) {
      product.imgColors = files.imgColors.map(file => file.buffer);
    }
    if (files.imgSize?.[0]) {
      product.imgSize = files.imgSize[0].buffer;
    }
    if (files.imgMeasure?.[0]) {
      product.imgMeasure = files.imgMeasure[0].buffer;
    }
    if (files.imgCover?.[0]) {
      product.imgCover = files.imgCover[0].buffer;
    }
    if (createProductDto.sizes) {
      product.sizes = createProductDto.sizes.map(sizeDto => {
        const size = new ProductSize();
        size.size = sizeDto.size;
        size.price = sizeDto.price;
        size.quantity = sizeDto.quantity;
        size.imgColorIndex = sizeDto.imgColorIndex;
        return size;
      });
    }

    return await this.productRepository.save(product);
  }
}
