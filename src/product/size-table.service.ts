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
  SizeTableResponseDto,
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

  async getSizeTableById(id: string): Promise<SizeTableResponseDto> {
    return await this.sizeTableCrud.getSizeTableById(id);
  }

  async updateSizeTable(
    id: string,
    updateDto: UpdateSizeTableDto,
  ): Promise<SizeTableResponseDto> {
    return await this.sizeTableCrud.updateSizeTable(id, updateDto);
  }

  async deleteSizeTable(id: string): Promise<void> {
    return await this.sizeTableCrud.deleteSizeTable(id);
  }
}
