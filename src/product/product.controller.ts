import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Get,
  Delete,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/Product.dto';
import { SuperAdminGuard } from 'src/auth/guards';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  // @UseGuards(SuperAdminGuard)
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
  getAll(): Promise<any> {
    return this.productService.Getall();
  }

  @Delete()
  @UseGuards(SuperAdminGuard)
  Deleteall() {
    return this.productService.Deleteall();
  }

  @Get(':id')
  GetOne(@Param('id') id: number): Promise<any> {
    return this.productService.GetOne(id);
  }

  @Get('name/:name')
  GetByName(@Param('name') name: string): Promise<any> {
    return this.productService.GetOneByName(name);
  }

  @Put(':id')
  @UseGuards(SuperAdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'imgColor', maxCount: 10 },
      { name: 'imgSize', maxCount: 1 },
      { name: 'imgMeasure', maxCount: 1 },
      { name: 'imgCover', maxCount: 1 },
    ]),
  )
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: Partial<CreateProductDto>,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      imgColor?: Express.Multer.File[];
      imgSize?: Express.Multer.File[];
      imgMeasure?: Express.Multer.File[];
      imgCover?: Express.Multer.File[];
    },
  ): Promise<any> {
    return this.productService.updateProduct(id, updateProductDto, files);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: number): Promise<any> {
    return this.productService.DeletOne(id);
  }
}
