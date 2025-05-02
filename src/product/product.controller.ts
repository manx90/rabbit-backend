import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
  ) {
    const base64images = images.map((image) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      image.buffer?.toString('base64'),
    );

    console.log('Received Images:', base64images.length);
    console.log('DTO:', createProductDto);

    return this.productService.create({
      images: base64images,
      ...createProductDto,
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.delete(+id);
  }

  @Delete()
  deleteAll() {
    return this.productService.deleteAll();
  }
}
