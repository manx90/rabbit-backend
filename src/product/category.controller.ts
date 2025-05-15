import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() body: { category: string }) {
    try {
      return await this.categoryService.createCategory(body.category);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('subcategory')
  async createSubCategory(@Body() body: { categoryId: number; name: string }) {
    try {
      return await this.categoryService.createSubCategory(
        body.categoryId,
        body.name,
      );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    try {
      return await this.categoryService.getCategoryById(Number(id));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    try {
      await this.categoryService.deleteCategory(Number(id));
      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('subcategory/:id')
  async deleteSubCategory(@Param('id') id: string) {
    try {
      await this.categoryService.deleteSubCategory(Number(id));
      return { message: 'SubCategory deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { category: string },
  ) {
    try {
      return await this.categoryService.updateCategory(
        Number(id),
        body.category,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('subcategory/:id')
  async updateSubCategory(
    @Param('id') id: string,
    @Body() body: { name: string },
  ) {
    try {
      return await this.categoryService.updateSubCategory(
        Number(id),
        body.name,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
