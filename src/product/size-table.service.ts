/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { SizeTableCrud } from './size-table.crud';
import {
  CreateSizeTableDto,
  UpdateSizeTableDto,
  AddSizeDimensionDto,
  SizeTableResponseDto,
  SizeDimensionResponseDto,
} from './dto/size-table.dto';

@Injectable()
export class SizeTableService {
  constructor(private readonly sizeTableCrud: SizeTableCrud) {}

  async createSizeTable(
    createDto: CreateSizeTableDto,
  ): Promise<SizeTableResponseDto | null> {
    return await this.sizeTableCrud.createSizeTable(createDto);
  }

  async getAllSizeTables(): Promise<SizeTableResponseDto[]> {
    return await this.sizeTableCrud.getAllSizeTables();
  }

  async getSizeTableById(id: number): Promise<SizeTableResponseDto> {
    return await this.sizeTableCrud.getSizeTableById(id);
  }

  async updateSizeTable(
    id: number,
    updateDto: UpdateSizeTableDto,
  ): Promise<SizeTableResponseDto> {
    return await this.sizeTableCrud.updateSizeTable(id, updateDto);
  }

  async deleteSizeTable(id: number): Promise<void> {
    return await this.sizeTableCrud.deleteSizeTable(id);
  }

  async addSizeDimension(
    tableId: number,
    addDto: AddSizeDimensionDto,
  ): Promise<SizeDimensionResponseDto | null> {
    return await this.sizeTableCrud.addSizeDimension(tableId, addDto);
  }
}
