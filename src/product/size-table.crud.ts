/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SizeTable, SizeDimension, SizeField } from './entities/sizeTable';
import {
  SizeDimensionResponseDto,
  SizeFieldResponseDto,
  SizeTableResponseDto,
} from './dto/size-table.dto';

@Injectable()
export class SizeTableCrud {
  constructor(
    @InjectRepository(SizeTable)
    private readonly sizeTableRepo: Repository<SizeTable>,
    @InjectRepository(SizeDimension)
    private readonly sizeDimensionRepo: Repository<SizeDimension>,
    @InjectRepository(SizeField)
    private readonly sizeFieldRepo: Repository<SizeField>,
  ) {}

  private sanitizeSizeField(field: SizeField): SizeFieldResponseDto {
    const { id, fieldName, fieldValue } = field;

    return {
      id,
      fieldName,
      fieldValue,
    };
  }

  private sanitizeSizeDimension(
    dimension: SizeDimension,
  ): SizeDimensionResponseDto {
    const { id, sizeName } = dimension;
    const fields = Array.isArray(dimension.fields)
      ? dimension.fields.map((field) => this.sanitizeSizeField(field))
      : [];

    return {
      id,
      sizeName,
      fields,
    };
  }

  private sanitizeSizeTable(sizeTable: SizeTable): SizeTableResponseDto {
    const { id, tableName } = sizeTable;
    const sizeDimensions = Array.isArray(sizeTable.sizeDimensions)
      ? sizeTable.sizeDimensions.map((dimension) =>
          this.sanitizeSizeDimension(dimension),
        )
      : [];

    return {
      id,
      tableName,
      sizeDimensions,
    };
  }

  async createSizeTable(tableData: {
    tableName: string;
    sizeDimensions?: Array<{
      sizeName: string;
      fields?: Array<{
        fieldName: string;
        fieldValue: string;
      }>;
    }>;
  }): Promise<SizeTableResponseDto | null> {
    const sizeTable = this.sizeTableRepo.create({
      tableName: tableData.tableName,
    });

    const savedTable = await this.sizeTableRepo.save(sizeTable);

    // Create size dimensions if provided
    if (tableData.sizeDimensions && tableData.sizeDimensions.length > 0) {
      for (const sizeDim of tableData.sizeDimensions) {
        const sizeDimension = this.sizeDimensionRepo.create({
          sizeName: sizeDim.sizeName,
          sizeTable: savedTable,
        });

        const savedDimension = await this.sizeDimensionRepo.save(sizeDimension);

        // Create fields if provided
        if (sizeDim.fields && sizeDim.fields.length > 0) {
          for (const field of sizeDim.fields) {
            await this.sizeFieldRepo.save({
              fieldName: field.fieldName,
              fieldValue: field.fieldValue,
              sizeDimension: savedDimension,
            });
          }
        }
      }
    }

    const createdTable = await this.sizeTableRepo.findOne({
      where: { id: savedTable.id },
      relations: ['sizeDimensions', 'sizeDimensions.fields'],
    });

    return createdTable ? this.sanitizeSizeTable(createdTable) : null;
  }

  async getAllSizeTables(): Promise<SizeTableResponseDto[]> {
    const sizeTables = await this.sizeTableRepo.find({
      relations: ['sizeDimensions', 'sizeDimensions.fields'],
      order: { id: 'ASC' },
    });

    return sizeTables.map((table) => this.sanitizeSizeTable(table));
  }

  async getSizeTableById(id: number): Promise<SizeTableResponseDto> {
    const sizeTable = await this.sizeTableRepo.findOne({
      where: { id },
      relations: ['sizeDimensions', 'sizeDimensions.fields'],
    });

    if (!sizeTable) {
      throw new NotFoundException(`Size table with ID ${id} not found`);
    }

    return this.sanitizeSizeTable(sizeTable);
  }

  async updateSizeTable(
    id: number,
    updateData: {
      tableName?: string;
    },
  ): Promise<SizeTableResponseDto> {
    const sizeTable = await this.sizeTableRepo.findOne({
      where: { id },
    });

    if (!sizeTable) {
      throw new NotFoundException(`Size table with ID ${id} not found`);
    }

    Object.assign(sizeTable, updateData);
    const updatedTable = await this.sizeTableRepo.save(sizeTable);
    const reloadedTable = await this.sizeTableRepo.findOne({
      where: { id: updatedTable.id },
      relations: ['sizeDimensions', 'sizeDimensions.fields'],
    });

    return reloadedTable
      ? this.sanitizeSizeTable(reloadedTable)
      : this.sanitizeSizeTable({
          ...updatedTable,
          sizeDimensions: [],
        });
  }

  async deleteSizeTable(id: number): Promise<void> {
    const sizeTable = await this.sizeTableRepo.findOne({
      where: { id },
    });

    if (!sizeTable) {
      throw new NotFoundException(`Size table with ID ${id} not found`);
    }

    await this.sizeTableRepo.remove(sizeTable);
  }

  async addSizeDimension(
    tableId: number,
    sizeData: {
      sizeName: string;
      fields?: Array<{
        fieldName: string;
        fieldValue: string;
      }>;
    },
  ): Promise<SizeDimensionResponseDto | null> {
    const sizeTable = await this.sizeTableRepo.findOne({
      where: { id: tableId },
    });

    if (!sizeTable) {
      throw new NotFoundException(`Size table with ID ${tableId} not found`);
    }

    const sizeDimension = this.sizeDimensionRepo.create({
      sizeName: sizeData.sizeName,
      sizeTable,
    });

    const savedDimension = await this.sizeDimensionRepo.save(sizeDimension);

    // Create fields if provided
    if (sizeData.fields && sizeData.fields.length > 0) {
      for (const field of sizeData.fields) {
        await this.sizeFieldRepo.save({
          fieldName: field.fieldName,
          fieldValue: field.fieldValue,
          sizeDimension: savedDimension,
        });
      }
    }

    const dimension = await this.sizeDimensionRepo.findOne({
      where: { id: savedDimension.id },
      relations: ['fields'],
    });

    return dimension ? this.sanitizeSizeDimension(dimension) : null;
  }
}
