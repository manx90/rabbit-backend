import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductSize } from './entities/product-size.entity';
import { ProductColor } from './entities/product-color.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductSize)
    private productSizeRepository: Repository<ProductSize>,
    @InjectRepository(ProductColor)
    private productColorRepository: Repository<ProductColor>,
  ) {}

  async create(productData: {
    name: string;
    description: string;
    categoryId: number;
    subCategoryId: number;
    images: string[];
    sizes: Array<{
      size: string;
      price: number;
      colors: Array<{
        colorName: string;
        colorImage: string;
        quantity: number;
      }>;
    }>;
  }) {
    const { sizes, ...productInfo } = productData;

    const product = this.productRepository.create({
      ...productInfo,
      category: { id: productData.categoryId },
      subCategory: { id: productData.subCategoryId },
    });

    const savedProduct = await this.productRepository.save(product);

    // Create sizes and colors
    for (const sizeData of sizes) {
      const size = this.productSizeRepository.create({
        ...sizeData,
        product: savedProduct,
      });
      const savedSize = await this.productSizeRepository.save(size);

      for (const colorData of sizeData.colors) {
        const color = this.productColorRepository.create({
          ...colorData,
          size: savedSize,
        });
        await this.productColorRepository.save(color);
      }
    }

    return this.findOne(savedProduct.id);
  }

  async findAll() {
    return this.productRepository.find({
      relations: ['category', 'subCategory', 'sizes', 'sizes.colors'],
    });
  }

  async findOne(id: number) {
    return this.productRepository.findOne({
      where: { id },
      relations: ['category', 'subCategory', 'sizes', 'sizes.colors'],
    });
  }

  async update(id: number, productData: Partial<Product>) {
    await this.productRepository.update(id, productData);
    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (product) {
      await this.productRepository.remove(product);
    }
    return product;
  }

  async updateStock(colorId: number, quantity: number) {
    const color = await this.productColorRepository.findOne({
      where: { id: colorId },
    });
    if (color) {
      color.quantity = quantity;
      await this.productColorRepository.save(color);
    }
    return color;
  }
}
