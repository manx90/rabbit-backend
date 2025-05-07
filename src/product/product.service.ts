import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category, SubCategory, ProductSize, Product } from './product.entity';
import { CreateProductDto } from './Product.dto';

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
  async createProduct(
    createProductDto: CreateProductDto,
    files: {
      images?: Express.Multer.File[];
      imgColor?: Express.Multer.File[];
      imgSize?: Express.Multer.File[];
      imgMeasure?: Express.Multer.File[];
      imgCover?: Express.Multer.File[];
    },
  ): Promise<Product> {
    const product = new Product();
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.priceCover = createProductDto.priceCover;

    // Handle file uploads
    if (files.images) {
      product.images = files.images.map((file) => file.buffer);
    }
    // Handle image size
    if (files.imgSize) {
      product.imgSize = files.imgSize[0].buffer;
    }
    // Handle image measure
    if (files.imgMeasure) {
      product.imgMeasure = files.imgMeasure[0].buffer;
    }
    // Handle image cover
    if (files.imgCover) {
      product.imgCover = files.imgCover[0].buffer;
    }

    // Handle product colors
    if (files.imgColor && createProductDto.colorName !== null) {
      product.imgColors = files.imgColor.map((file, index) => ({
        colorName: createProductDto.colorName[index],
        imgColor: file.buffer,
      }));
    }
    // Handle product sizes
    if (typeof createProductDto.sizeName === 'string') {
      createProductDto.sizeName = JSON.parse(
        createProductDto.sizeName,
      ) as string[];
    }
    if (typeof createProductDto.sizePrice === 'string') {
      const parsed = JSON.parse(createProductDto.sizePrice);
      createProductDto.sizePrice = parsed.map((val) => Number(val));
    }

    if (typeof createProductDto.sizeColor === 'string') {
      createProductDto.sizeColor = JSON.parse(
        createProductDto.sizeColor,
      ) as string[];
    }

    if (typeof createProductDto.sizeColorQuantity === 'string') {
      const parsed = JSON.parse(createProductDto.sizeColorQuantity);
      createProductDto.sizeColorQuantity = parsed.map((arr: any[]) =>
        arr.map((val) => Number(val)),
      );
    }

    product.sizes = createProductDto.sizeName.map((size, i) => {
      const sizeEntity = new ProductSize();
      sizeEntity.sizeName = size;
      sizeEntity.Price = createProductDto.sizePrice[i];
      sizeEntity.Colors = createProductDto.sizeColor.map((color, j) => ({
        colorName: color,
        quantity: createProductDto.sizeColorQuantity[i][j], // الكمية المناسبة للمقاس واللون
      }));
      return sizeEntity;
    });

    // Handle product category
    if (createProductDto.category) {
      const category = await this.categoryRepository.findOne({
        where: { category: createProductDto.category },
      });
      if (!category) {
        throw new Error('Category not found');
      }
      product.category = category;
    }
    if (createProductDto.subCategory) {
      const subCategory = await this.subCategoryRepository.findOne({
        where: { name: createProductDto.subCategory },
      });
      if (!subCategory) {
        throw new Error('SubCategory not found');
      }
      product.subCategory = subCategory;
    }

    product.quantity = createProductDto.sizeColorQuantity.reduce(
      (acc, curr) => acc + curr.reduce((a, b) => a + b, 0),
      0,
    );
    // Save product
    return await this.productRepository.save(product);
  }

  async Getall() {
    return this.productRepository.find();
  }

  async Deleteall() {
    return this.productRepository.delete({});
  }
}
