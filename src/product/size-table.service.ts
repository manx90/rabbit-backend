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
} from './dto/size-table.dto';
import { SizeTable, SizeDimension } from './entities/sizeTable';

@Injectable()
export class SizeTableService {
  constructor(private readonly sizeTableCrud: SizeTableCrud) {}

  async createSizeTable(
    createDto: CreateSizeTableDto,
  ): Promise<SizeTable | null> {
    return await this.sizeTableCrud.createSizeTable(createDto);
  }

  async getAllSizeTables(): Promise<SizeTable[]> {
    return await this.sizeTableCrud.getAllSizeTables();
  }

  async getSizeTableById(id: number): Promise<SizeTable> {
    return await this.sizeTableCrud.getSizeTableById(id);
  }

  async updateSizeTable(
    id: number,
    updateDto: UpdateSizeTableDto,
  ): Promise<SizeTable> {
    return await this.sizeTableCrud.updateSizeTable(id, updateDto);
  }

  async deleteSizeTable(id: number): Promise<void> {
    return await this.sizeTableCrud.deleteSizeTable(id);
  }

  async addSizeDimension(
    tableId: number,
    addDto: AddSizeDimensionDto,
  ): Promise<SizeDimension | null> {
    return await this.sizeTableCrud.addSizeDimension(tableId, addDto);
  }
}
