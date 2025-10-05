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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SizeTableService } from './size-table.service';
import {
  CreateSizeTableDto,
  UpdateSizeTableDto,
  SizeTableResponseDto,
} from './dto/size-table.dto';

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
    type: SizeTableResponseDto,
  })
  async createSizeTable(
    @Body() createDto: CreateSizeTableDto,
  ): Promise<SizeTableResponseDto | null> {
    return await this.sizeTableService.createSizeTable(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all size tables' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Size tables retrieved successfully',
    type: [SizeTableResponseDto],
  })
  async getAllSizeTables(): Promise<SizeTableResponseDto[]> {
    return await this.sizeTableService.getAllSizeTables();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get size table by ID' })
  @ApiParam({ name: 'id', description: 'Size table ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Size table retrieved successfully',
    type: SizeTableResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Size table not found',
  })
  async getSizeTableById(
    @Param('id') id: string,
  ): Promise<SizeTableResponseDto> {
    return await this.sizeTableService.getSizeTableById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update size table' })
  @ApiParam({ name: 'id', description: 'Size table ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Size table updated successfully',
    type: SizeTableResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Size table not found',
  })
  async updateSizeTable(
    @Param('id') id: string,
    @Body() updateDto: UpdateSizeTableDto,
  ): Promise<SizeTableResponseDto> {
    return await this.sizeTableService.updateSizeTable(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete size table' })
  @ApiParam({ name: 'id', description: 'Size table ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Size table deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Size table not found',
  })
  async deleteSizeTable(@Param('id') id: string): Promise<void> {
    return await this.sizeTableService.deleteSizeTable(id);
  }
}
