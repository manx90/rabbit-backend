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
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';
import { Request } from 'express';
import { Auth } from 'src/auth/entities/auth.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Role } from '../common/constants/roles.constant';
import { Roles } from '../common/decorators/roles.decorator';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'imgCover', maxCount: 1 },
      { name: 'imgSizeChart', maxCount: 1 },
      { name: 'imgMeasure', maxCount: 1 },
    ]),
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      imgCover?: Express.Multer.File[];
      imgSizeChart?: Express.Multer.File[];
      imgMeasure?: Express.Multer.File[];
    },
    @Req() req: Request,
  ) {
    const poster = req.user as Auth; // assumes Auth guard populates req.user
    return this.productService.create(createProductDto, files, poster);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'imgCover', maxCount: 1 },
      { name: 'imgSizeChart', maxCount: 1 },
      { name: 'imgMeasure', maxCount: 1 },
    ]),
  )
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      imgCover?: Express.Multer.File[];
      imgSizeChart?: Express.Multer.File[];
      imgMeasure?: Express.Multer.File[];
    },
  ) {
    return this.productService.update(+id, updateProductDto, files);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: number) {
    return this.productService.remove(+id);
  }
}
