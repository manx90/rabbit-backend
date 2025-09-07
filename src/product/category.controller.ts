/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
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
import { Request as ExpressRequest } from 'express';
import { ParsedQs } from 'qs';
import { Role } from '../common/constants/roles.constant';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CategoryService } from './category.service';
import {
  CategoryResponseDto,
  CreateCategoryDto,
  CreateSubCategoryDto,
  SubCategoryResponseDto,
  UpdateCategoryDto,
  UpdateSubCategoryDto,
  UploadIcon,
} from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get('subcategory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getSubCategories() {
    return this.categoryService.getSubCategories();
  }

  @Get('subcategory/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getSubCategoryById(
    @Param('id') id: string,
  ): Promise<SubCategoryResponseDto> {
    return this.categoryService.getSubCategoryById(Number(id));
  }

  @Get()
  async getAllCategories(
    @Query() query: ParsedQs,
    @Req() req: ExpressRequest,
  ): Promise<{
    status: string;
    results: number;
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
    lastPage: number;
    data: CategoryResponseDto[];
  }> {
    return this.categoryService.getAllCategories(query, req);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'iconCat', maxCount: 1 }]))
  async createCategory(
    @UploadedFiles() files: { iconCat?: Express.Multer.File[] },
    @Body() dto: CreateCategoryDto,
  ): Promise<{ message: string; data: CategoryResponseDto }> {
    try {
      // Build UploadIcon object from uploaded files
      const uploadIcon: UploadIcon = {
        iconCat: files.iconCat?.[0],
      };
      const result = await this.categoryService.createCategory(uploadIcon, dto);
      return { message: 'Category created successfully', data: result };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<CategoryResponseDto> {
    try {
      return await this.categoryService.getCategoryById(Number(id));
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'iconCat', maxCount: 1 }]))
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @UploadedFiles() files: { iconCat?: Express.Multer.File[] },
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.getCategoryById(Number(id));
    try {
      const uploadIcon: UploadIcon | undefined =
        files && files.iconCat && files.iconCat[0]
          ? { iconCat: files.iconCat[0] }
          : undefined;
      // If no icon file is provided, don't update the icon (pass undefined)
      return await this.categoryService.updateCategory(
        Number(id),
        dto,
        uploadIcon,
      );
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('subcategory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'iconSubCat', maxCount: 1 }]))
  async createSubCategory(
    @UploadedFiles() files: { iconSubCat?: Express.Multer.File[] },
    @Body() dto: CreateSubCategoryDto,
  ): Promise<{ message: string; data: SubCategoryResponseDto }> {
    try {
      const uploadIcon: UploadIcon = {
        iconSubCat: files.iconSubCat?.[0],
      };
      const result = await this.categoryService.createSubCategory(
        uploadIcon,
        dto,
      );
      return { message: 'SubCategory created successfully', data: result };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':categoryId/subCategory/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'iconSubCat', maxCount: 1 }]))
  async updateSubCategory(
    @Param('categoryId') categoryId: string,
    @Param('id') id: string,
    @UploadedFiles() files: { iconSubCat?: Express.Multer.File[] },
    @Body() dto: UpdateSubCategoryDto,
  ): Promise<SubCategoryResponseDto> {
    try {
      const uploadIcon: UploadIcon | undefined =
        files && files.iconSubCat && files.iconSubCat[0]
          ? { iconSubCat: files.iconSubCat[0] }
          : undefined;
      return await this.categoryService.updateSubCategory(
        Number(categoryId),
        Number(id),
        dto,
        uploadIcon,
      );
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async deleteAllCategories() {
    await this.categoryService.deleteAll();
    return { message: 'All categories deleted successfully' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async deleteCategory(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.categoryService.deleteCategory(Number(id));
      return { message: 'Category deleted successfully' };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('subcategory/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async deleteSubCategory(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    try {
      await this.categoryService.deleteSubCategory(Number(id));
      return { message: 'SubCategory deleted successfully' };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('update-state/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async UpdateState(@Param('id') id: number): Promise<any> {
    const UpdateOne = await this.categoryService.updateState(id);
    return UpdateOne;
  }
  @Put('update-state-subcategory/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async UpdateStateSub(@Param('id') id: number): Promise<any> {
    const UpdateOne = await this.categoryService.updateStateSub(id);
    return UpdateOne;
  }
}
