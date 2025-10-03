/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SizeTableService } from './size-table.service';
import {
  CreateSizeTableDto,
  UpdateSizeTableDto,
  AddSizeDimensionDto,
} from './dto/size-table.dto';
import { SizeTable, SizeDimension } from './entities/sizeTable';

@ApiTags('Size Tables')
@Controller('size-tables')
export class SizeTableController {
  constructor(private readonly sizeTableService: SizeTableService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new size table' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Size table created successfully',
    type: SizeTable,
  })
  async createSizeTable(
    @Body() createDto: CreateSizeTableDto,
  ): Promise<SizeTable | null> {
    return await this.sizeTableService.createSizeTable(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all size tables' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Size tables retrieved successfully',
    type: [SizeTable],
  })
  async getAllSizeTables(): Promise<SizeTable[]> {
    return await this.sizeTableService.getAllSizeTables();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get size table by ID' })
  @ApiParam({ name: 'id', description: 'Size table ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Size table retrieved successfully',
    type: SizeTable,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Size table not found',
  })
  async getSizeTableById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SizeTable> {
    return await this.sizeTableService.getSizeTableById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update size table' })
  @ApiParam({ name: 'id', description: 'Size table ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Size table updated successfully',
    type: SizeTable,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Size table not found',
  })
  async updateSizeTable(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSizeTableDto,
  ): Promise<SizeTable> {
    return await this.sizeTableService.updateSizeTable(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete size table' })
  @ApiParam({ name: 'id', description: 'Size table ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Size table deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Size table not found',
  })
  async deleteSizeTable(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.sizeTableService.deleteSizeTable(id);
  }

  @Post(':id/size-dimensions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a size dimension to a size table' })
  @ApiParam({ name: 'id', description: 'Size table ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Size dimension added successfully',
    type: SizeDimension,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Size table not found',
  })
  async addSizeDimension(
    @Param('id', ParseIntPipe) tableId: number,
    @Body() addDto: AddSizeDimensionDto,
  ): Promise<SizeDimension | null> {
    return await this.sizeTableService.addSizeDimension(tableId, addDto);
  }
}
