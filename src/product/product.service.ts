import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category, SubCategory } from './entities/Category.entity';
import { CreateProductDto } from './dto/Product.dto';
import { ErrorResponse, ProductResponse } from './interface/product.interface';
import { ColorWithSizes } from './interface/entity.interface';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
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
    console.log('here');
    const product = new Product();
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.priceCover = createProductDto.priceCover || 0;
    // Handle file uploads
    if (files.images) {
      product.images = files.images.map((file) =>
        file.buffer.toString('base64'),
      );
    }
    // Handle image size
    if (files.imgSize) {
      product.imgSize = files.imgSize[0].buffer.toString('base64');
    }
    // Handle image measure
    if (files.imgMeasure) {
      product.imgMeasure = files.imgMeasure[0].buffer.toString('base64');
    }
    // Handle image cover
    if (files.imgCover) {
      product.imgCover = files.imgCover[0].buffer.toString('base64');
    }

    // Handle colorsWithSizes
    const colorsWithSizes: ColorWithSizes[] = [];
    let colorIndex = 0;

    while (createProductDto[`colorsWithSizes[${colorIndex}].name`]) {
      const color: ColorWithSizes = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        name: createProductDto[`colorsWithSizes[${colorIndex}].name`],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        imgColor:
          files.imgColor?.[colorIndex] && files.imgColor[colorIndex].buffer
            ? files.imgColor[colorIndex].buffer.toString('base64')
            : createProductDto[`colorsWithSizes[${colorIndex}].imgColor`],
        sizes: [],
      };

      let sizeIndex = 0;
      while (
        createProductDto[
          `colorsWithSizes[${colorIndex}].sizes[${sizeIndex}].size`
        ]
      ) {
        color.sizes.push({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          size: createProductDto[
            `colorsWithSizes[${colorIndex}].sizes[${sizeIndex}].size`
          ],
          quantity: Number(
            createProductDto[
              `colorsWithSizes[${colorIndex}].sizes[${sizeIndex}].quantity`
            ],
          ),
        });
        sizeIndex++;
      }

      colorsWithSizes.push(color);
      colorIndex++;
    }

    product.colorsWithSizes = colorsWithSizes;

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

    product.quantity = colorsWithSizes.reduce((total, color) => {
      return (
        total +
        color.sizes.reduce((colorTotal, size) => colorTotal + size.quantity, 0)
      );
    }, 0);
    // Save product
    return await this.productRepository.save(product);
  }

  async updateProduct(
    id: number,
    updateProductDto: Partial<CreateProductDto>,
    files?: {
      images?: Express.Multer.File[];
      imgColor?: Express.Multer.File[];
      imgSize?: Express.Multer.File[];
      imgMeasure?: Express.Multer.File[];
      imgCover?: Express.Multer.File[];
    },
  ): Promise<ProductResponse | ErrorResponse> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      return {
        statusCode: 404,
        message: 'Product not found',
      } as ErrorResponse;
    }

    // Update basic product information
    if (updateProductDto.name) product.name = updateProductDto.name;
    if (updateProductDto.description)
      product.description = updateProductDto.description;
    if (updateProductDto.priceCover)
      product.priceCover = updateProductDto.priceCover;

    // Handle file uploads
    if (files?.images) {
      product.images = files.images.map((file) =>
        file.buffer.toString('base64'),
      );
    }
    if (files?.imgSize) {
      product.imgSize = files.imgSize[0].buffer.toString('base64');
    }
    if (files?.imgMeasure) {
      product.imgMeasure = files.imgMeasure[0].buffer.toString('base64');
    }
    if (files?.imgCover) {
      product.imgCover = files.imgCover[0].buffer.toString('base64');
    }

    // Handle colorsWithSizes if provided
    if (updateProductDto['colorsWithSizes[0].name']) {
      const colorsWithSizes: ColorWithSizes[] = [];
      let colorIndex = 0;

      while (updateProductDto[`colorsWithSizes[${colorIndex}].name`]) {
        const color: ColorWithSizes = {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          name: updateProductDto[`colorsWithSizes[${colorIndex}].name`],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          imgColor:
            files?.imgColor?.[colorIndex] && files.imgColor[colorIndex].buffer
              ? files.imgColor[colorIndex].buffer.toString('base64')
              : updateProductDto[`colorsWithSizes[${colorIndex}].imgColor`],
          sizes: [],
        };

        let sizeIndex = 0;
        while (
          updateProductDto[
            `colorsWithSizes[${colorIndex}].sizes[${sizeIndex}].size`
          ]
        ) {
          color.sizes.push({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            size: updateProductDto[
              `colorsWithSizes[${colorIndex}].sizes[${sizeIndex}].size`
            ],
            quantity: Number(
              updateProductDto[
                `colorsWithSizes[${colorIndex}].sizes[${sizeIndex}].quantity`
              ],
            ),
          });
          sizeIndex++;
        }

        colorsWithSizes.push(color);
        colorIndex++;
      }

      product.colorsWithSizes = colorsWithSizes;
      product.quantity = colorsWithSizes.reduce((total, color) => {
        return (
          total +
          color.sizes.reduce(
            (colorTotal, size) => colorTotal + size.quantity,
            0,
          )
        );
      }, 0);
    }

    // Handle category updates
    if (updateProductDto.category) {
      const category = await this.categoryRepository.findOne({
        where: { category: updateProductDto.category },
      });
      if (!category) {
        throw new Error('Category not found');
      }
      product.category = category;
    }

    // Handle subcategory updates
    if (updateProductDto.subCategory) {
      const subCategory = await this.subCategoryRepository.findOne({
        where: { name: updateProductDto.subCategory },
      });
      if (!subCategory) {
        throw new Error('SubCategory not found');
      }
      product.subCategory = subCategory;
    }

    const updatedProduct = await this.productRepository.save(product);

    // const response: ProductResponse = {
    //   ...updatedProduct,
    //   images: updatedProduct.images || undefined,
    //   imgCover: updatedProduct.imgCover || undefined,
    //   imgSize: updatedProduct.imgSize || undefined,
    //   imgMeasure: updatedProduct.imgMeasure || undefined,
    //   colorsWithSizes: updatedProduct.colorsWithSizes,
    //   isActive: updatedProduct.isActive,
    // };

    return updatedProduct;
  }

  async DeletOne(id: number): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { id: Number(id) },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.remove(product);
  }

  async GetOne(id: number): Promise<ProductResponse | ErrorResponse> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    // const response: ProductResponse = {
    //   ...product!,
    //   images: product!.images || undefined,
    //   imgCover: product!.imgCover || undefined,
    //   imgSize: product!.imgSize || undefined,
    //   imgMeasure: product!.imgMeasure || undefined,
    //   colorsWithSizes: product!.colorsWithSizes,
    //   isActive: product!.isActive,
    // };
    return product;
  }

  async Getall(): Promise<ProductResponse[]> {
    const products = await this.productRepository.find();
    // return products.map((product) => {
    //   const response: ProductResponse = {
    //     ...product,
    //     images: product.images || undefined,
    //     imgCover: product.imgCover || undefined,
    //     imgSize: product.imgSize || undefined,
    //     imgMeasure: product.imgMeasure || undefined,
    //     colorsWithSizes: product.colorsWithSizes,
    //     isActive: product.isActive,
    //   };
    //   return response;
    // });
    return products;
  }

  async GetOneByName(name: string): Promise<ProductResponse | ErrorResponse> {
    const product = await this.productRepository.findOne({ where: { name } });
    if (!product) {
      return {
        statusCode: 404,
        message: 'Product not found',
      } as ErrorResponse;
    }
    // const response: ProductResponse = {
    //   ...product,
    //   images: product.images || undefined,
    //   imgCover: product.imgCover || undefined,
    //   imgSize: product.imgSize || undefined,
    //   imgMeasure: product.imgMeasure || undefined,
    //   colorsWithSizes: product.colorsWithSizes,
    //   isActive: product.isActive,
    // };
    return product;
  }

  async Deleteall() {
    return this.productRepository.delete({});
  }
}
