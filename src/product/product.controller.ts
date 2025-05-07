import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Get,
  Delete,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './Product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'imgColor', maxCount: 10 },
      { name: 'imgSize', maxCount: 1 },
      { name: 'imgMeasure', maxCount: 1 },
      { name: 'imgCover', maxCount: 1 },
    ]),
  )
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      imgColor?: Express.Multer.File[];
      imgSize?: Express.Multer.File[];
      imgMeasure?: Express.Multer.File[];
      imgCover?: Express.Multer.File[];
    },
  ) {
    return this.productService.createProduct(createProductDto, files);
  }

  @Get()
  findProduct() {
    return this.productService.Getall();
  }

  @Delete()
  deleteAll() {
    return this.productService.Deleteall();
  }
}
