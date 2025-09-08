/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { auth } from 'src/auth/entities/auth.entity';
import { Role } from '../common/constants/roles.constant';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ParseFormJsonPipe } from '../common/pipes/parse-form-json.pipe';
import { LoggerService } from '../common/utils/logger.service';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';
import { ProductCrud } from './product.crud';
import { ProductService } from './product.service';
@Controller('product')
export class ProductController {
  constructor(
    private readonly productcrud: ProductCrud,
    private readonly productservice: ProductService,
    private readonly logger: LoggerService,
  ) {}
  @Get()
  async getAllProducts(@Req() req: Request) {
    const startTime = Date.now();
    try {
      this.logger.logApiRequest(
        'GET',
        '/product',
        req.query,
        null,
        'ProductController',
      );

      const result = await this.productcrud.getAllProducts(req.query);

      const responseTime = Date.now() - startTime;
      this.logger.logApiResponse(
        'GET',
        '/product',
        200,
        responseTime,
        'ProductController',
      );
      this.logger.info(
        `getAllProducts completed successfully. Found ${result.results} products`,
        'ProductController',
      );

      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.logApiResponse(
        'GET',
        '/product',
        500,
        responseTime,
        'ProductController',
      );
      this.logger.logError(error, 'ProductController', { query: req.query });
      throw error;
    }
  }
  // @Get()
  // async getAllProducts(@Req() req: Request) {
  //   return await this.productcrud.getAllProducts(req.query, req);
  // }

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
    if (!files.imgCover || !files.imgColors) {
      throw new BadRequestException('imgCover and imgColors must be upload!');
    }
    const poster = req.user as auth;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.productcrud.create(createProductDto, files, poster, req);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productcrud.findOne(+id);
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
    return this.productcrud.update(+id, updateProductDto, files, req);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async remove(@Param('id') id: number, @Req() req: Request) {
    const start = Date.now();
    this.logger.logApiRequest(
      'DELETE',
      `/product/${id}`,
      undefined,
      undefined,
      'ProductController',
    );
    try {
      const result = await this.productcrud.remove(+id);
      const duration = Date.now() - start;
      this.logger.logApiResponse(
        'DELETE',
        `/product/${id}`,
        200,
        duration,
        'ProductController',
      );
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.logger.logApiResponse(
        'DELETE',
        `/product/${id}`,
        500,
        duration,
        'ProductController',
      );
      this.logger.logError(error, 'ProductController', { id });
      throw error;
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  deleteall() {
    return this.productcrud.deleteAll();
  }

  @Post('connectProductIds')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  connectProduct(@Body() body: { productIds: number[] }) {
    const ProductsIds = body.productIds?.map((id) =>
      Number(id.toString().trim()),
    );
    return this.productcrud.ConnectProduct(ProductsIds);
  }

  @Get(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async updatePublishState(@Param('id') id: number) {
    console.log('run this api publish', id);
    return this.productservice.UpdateStatus(+id);
  }
  @Put('ShowSeason/spring')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async showSeasonSpring() {
    const season = 'spring_autumn';
    const count = await this.productservice.ShowSeason(season);
    return { message: `Published ${count} products for (spring)` };
  }
  @Put('ShowSeason/summer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async showSeasonSummer() {
    const season = 'summer';
    const count = await this.productservice.ShowSeason(season);
    return { message: `Published ${count} products for (summer)` };
  }
  @Put('ShowSeason/winter')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async showSeasonWinter() {
    const season = 'winter';
    const count = await this.productservice.ShowSeason(season);
    return { message: `Published ${count} products for  (winter)` };
  }
  @Put('hideseason/winter')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async hideSeasonWinter() {
    const season = 'winter';
    const count = await this.productservice.HiddenSeason(season);
    return { message: `Draft ${count} products for  (winter)` };
  }
  @Put('hideseason/summer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async hideSeasonSummer() {
    const season = 'winter';
    const count = await this.productservice.HiddenSeason(season);
    return { message: `Draft ${count} products for  (winter)` };
  }
  @Put('hideseason/spring')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async hideSeasonSpring() {
    const season = 'winter';
    const count = await this.productservice.HiddenSeason(season);
    return { message: `Draft ${count} products for  (winter)` };
  }

  // ========== STATISTICS ENDPOINTS ==========

  @Get('stats/overview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getProductStatsOverview() {
    return await this.productservice.getComprehensiveStats();
  }

  @Get('stats/total')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getTotalProductsCount() {
    const count = await this.productservice.getTotalProductsCount();
    return { totalProducts: count };
  }

  @Get('stats/publish-state')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getProductsCountByPublishState() {
    return await this.productservice.getProductsCountByPublishState();
  }

  @Get('stats/season')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getProductsCountBySeason() {
    return await this.productservice.getProductsCountBySeason();
  }

  @Get('stats/flags')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getProductsCountByFlags() {
    return await this.productservice.getProductsCountByFlags();
  }

  @Get('stats/recent/:days')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getProductsCreatedInLastDays(@Param('days') days: number) {
    const count = await this.productservice.getProductsCreatedInLastDays(days);
    return {
      days: days,
      count: count,
      message: `${count} products created in the last ${days} days`,
    };
  }

  @Get('stats/category')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getProductsCountByCategory() {
    return await this.productservice.getProductsCountByCategory();
  }

  @Get('stats/subcategory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getProductsCountBySubCategory() {
    return await this.productservice.getProductsCountBySubCategory();
  }

  @Get('stats/top-selling')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getTopSellingProducts(@Query('limit') limit?: number) {
    const limitNum = limit ? parseInt(limit.toString()) : 10;
    return await this.productservice.getTopSellingProducts(limitNum);
  }

  @Get('stats/low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getLowStockProducts(@Query('threshold') threshold?: number) {
    const thresholdNum = threshold ? parseInt(threshold.toString()) : 10;
    return await this.productservice.getLowStockProducts(thresholdNum);
  }

  @Get('stats/missing-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getProductsWithoutImages() {
    return await this.productservice.getProductsWithoutImages();
  }

  @Get('stats/creators')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getProductsCountByCreator() {
    return await this.productservice.getProductsCountByCreator();
  }

  @Get('stats/scheduled')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getScheduledProducts() {
    return await this.productservice.getScheduledProducts();
  }

  @Get('stats/date-range')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getProductsCreatedInDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const count = await this.productservice.getProductsCreatedInDateRange(
      start,
      end,
    );
    return {
      startDate: start,
      endDate: end,
      count: count,
      message: `${count} products created between ${startDate} and ${endDate}`,
    };
  }
}
