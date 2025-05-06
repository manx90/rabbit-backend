import { Controller, Post, Body, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/Product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @UseInterceptors(FilesInterceptor('imgColors'))
  @UseInterceptors(FileInterceptor('imgSize'))
  @UseInterceptors(FileInterceptor('imgMeasure'))
  @UseInterceptors(FileInterceptor('imgCover'))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: {
      images?: Express.Multer.File[],
      imgColors?: Express.Multer.File[],
      imgSize?: Express.Multer.File[],
      imgMeasure?: Express.Multer.File[],
      imgCover?: Express.Multer.File[]
    }
  ) {
    return this.productService.createProduct(createProductDto, files);
  }
}
