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
  ClassSerializerInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ParseFormJsonPipe } from '../common/pipes/parse-form-json.pipe';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';
import { Request } from 'express';
import { auth } from 'src/auth/entities/auth.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Role } from '../common/constants/roles.constant';
import { Roles } from '../common/decorators/roles.decorator';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  async getAllProducts(@Req() req: Request) {
    return await this.productService.getAllProducts(req.query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'imgCover', maxCount: 1 },
      { name: 'imgSizeChart', maxCount: 1 },
      { name: 'imgMeasure', maxCount: 1 },
      { name: 'imgColors', maxCount: 10 },
    ]),
    ClassSerializerInterceptor,
  )
  async createProduct(
    @Body(new ParseFormJsonPipe()) createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      imgCover?: Express.Multer.File[];
      imgSizeChart?: Express.Multer.File[];
      imgMeasure?: Express.Multer.File[];
      imgColors?: Express.Multer.File[];
    },
    @Req() req: Request,
  ) {
    if (
      !files.imgCover ||
      !files.imgColors
    ) {
      throw new BadRequestException('imgCover and ImgColors must be upload!');
    }
    const poster = req.user as auth;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.productService.create(createProductDto, files, poster, req);
  }

  // @Get()
  // findAll() {
  //   return this.productService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'imgCover', maxCount: 1 },
      { name: 'imgSizeChart', maxCount: 1 },
      { name: 'imgMeasure', maxCount: 1 },
      { name: 'imgColors', maxCount: 10 },
    ]),
    ClassSerializerInterceptor,
  )
  async updateProduct(
    @Param('id') id: number,
    @Body(new ParseFormJsonPipe()) updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      imgCover?: Express.Multer.File[];
      imgSizeChart?: Express.Multer.File[];
      imgMeasure?: Express.Multer.File[];
      imgColors?: Express.Multer.File[];
    },
    @Req() req: Request,
  ) {
    return this.productService.update(+id, updateProductDto, files, req);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  remove(@Param('id') id: number) {
    return this.productService.remove(+id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  deleteall() {
    return this.productService.deleteAll();
  }
}
