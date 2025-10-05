/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SizeTable } from './entities/sizeTable.entity';
import {
  CreateSizeTableDto,
  UpdateSizeTableDto,
  SizeTableResponseDto,
} from './dto/size-table.dto';

@Injectable()
export class SizeTableCrud {
  constructor(
    @InjectRepository(SizeTable)
    private readonly sizeTableRepo: Repository<SizeTable>,
  ) {}

  private sanitizeSizeTable(sizeTable: SizeTable): SizeTableResponseDto {
    return {
      id: sizeTable.id,
      tableName: sizeTable.tableName,
      data: sizeTable.data,
    };
  }

  async createSizeTable(
    createDto: CreateSizeTableDto,
  ): Promise<SizeTableResponseDto | null> {
    try {
      const sizeTable = new SizeTable();
      sizeTable.tableName = createDto.tableName;
      sizeTable.data = {
        tableName: createDto.tableName,
        dimensions: createDto.dimensions,
      };

      const savedSizeTable = await this.sizeTableRepo.save(sizeTable);
      return this.sanitizeSizeTable(savedSizeTable);
    } catch (error) {
      console.error('Error creating size table:', error);
      return null;
    }
  }

  async getAllSizeTables(): Promise<SizeTableResponseDto[]> {
    try {
      const sizeTables = await this.sizeTableRepo.find({
        order: { tableName: 'ASC' },
      });
      return sizeTables.map((sizeTable) => this.sanitizeSizeTable(sizeTable));
    } catch (error) {
      console.error('Error getting all size tables:', error);
      return [];
    }
  }

  async getSizeTableById(id: string): Promise<SizeTableResponseDto> {
    try {
      const sizeTable = await this.sizeTableRepo.findOne({
        where: { id },
      });

      if (!sizeTable) {
        throw new NotFoundException(`Size table with ID ${id} not found`);
      }

      return this.sanitizeSizeTable(sizeTable);
    } catch (error) {
      console.error('Error getting size table by ID:', error);
      throw error;
    }
  }

  async updateSizeTable(
    id: string,
    updateDto: UpdateSizeTableDto,
  ): Promise<SizeTableResponseDto> {
    try {
      const sizeTable = await this.sizeTableRepo.findOne({
        where: { id },
      });

      if (!sizeTable) {
        throw new NotFoundException(`Size table with ID ${id} not found`);
      }

      // Update table name if provided
      if (updateDto.tableName !== undefined) {
        sizeTable.tableName = updateDto.tableName;
        sizeTable.data.tableName = updateDto.tableName;
      }

      // Update dimensions if provided
      if (updateDto.dimensions !== undefined) {
        sizeTable.data.dimensions = updateDto.dimensions;
      }

      const updatedSizeTable = await this.sizeTableRepo.save(sizeTable);
      return this.sanitizeSizeTable(updatedSizeTable);
    } catch (error) {
      console.error('Error updating size table:', error);
      throw error;
    }
  }

  async deleteSizeTable(id: string): Promise<void> {
    try {
      const sizeTable = await this.sizeTableRepo.findOne({
        where: { id },
      });

      if (!sizeTable) {
        throw new NotFoundException(`Size table with ID ${id} not found`);
      }

      await this.sizeTableRepo.remove(sizeTable);
    } catch (error) {
      console.error('Error deleting size table:', error);
      throw error;
    }
  }
}
