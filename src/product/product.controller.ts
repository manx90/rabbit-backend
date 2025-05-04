import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createProductDto: {
      name: string;
      description: string;
      categoryId: number;
      subCategoryId: number;
      sizes: Array<{
        size: string;
        price: number;
        colors: Array<{
          colorName: string;
          colorImage: string;
          quantity: number;
        }>;
      }>;
    },
  ) {
    const base64images = images.map((image) =>
      image.buffer?.toString('base64'),
    );

    return this.productService.create({
      ...createProductDto,
      images: base64images,
    });
  }

  @Get()
  async findAll() {
    const products = await this.productService.findAll();
    return products.map((product) => ({
      ...product,
      images: Array.isArray(product.images)
        ? product.images.map((img) => `data:image/png;base64,${img}`)
        : [],
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(+id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      ...product,
      images: Array.isArray(product.images)
        ? product.images.map((img) => `data:image/png;base64,${img}`)
        : [],
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<{
      name: string;
      description: string;
      categoryId: number;
      subCategoryId: number;
    }>,
  ) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Patch('stock/:colorId')
  async updateStock(
    @Param('colorId') colorId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productService.updateStock(+colorId, quantity);
  }
}
