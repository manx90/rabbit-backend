import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { SubCategoryService } from './services/sub-category.service';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Post()
  create(@Body() data: { name: string; categoryId: number }) {
    return this.subCategoryService.create(data.name, data.categoryId);
  }

  @Get()
  findAll() {
    return this.subCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: { name: string; categoryId: number }) {
    return this.subCategoryService.update(+id, data.name, data.categoryId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subCategoryService.remove(+id);
  }
} 