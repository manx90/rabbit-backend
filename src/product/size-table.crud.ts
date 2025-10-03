/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SizeTable, SizeDimension, SizeField } from './entities/sizeTable';

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

  async createSizeTable(tableData: {
    tableName: string;
    sizeDimensions?: Array<{
      sizeName: string;
      fields?: Array<{
        fieldName: string;
        fieldValue: string;
      }>;
    }>;
  }): Promise<SizeTable | null> {
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

    return await this.sizeTableRepo.findOne({
      where: { id: savedTable.id },
      relations: ['sizeDimensions', 'sizeDimensions.fields'],
    });
  }

  async getAllSizeTables(): Promise<SizeTable[]> {
    return await this.sizeTableRepo.find({
      relations: ['sizeDimensions', 'sizeDimensions.fields'],
      order: { id: 'ASC' },
    });
  }

  async getSizeTableById(id: number): Promise<SizeTable> {
    const sizeTable = await this.sizeTableRepo.findOne({
      where: { id },
      relations: ['sizeDimensions', 'sizeDimensions.fields'],
    });

    if (!sizeTable) {
      throw new NotFoundException(`Size table with ID ${id} not found`);
    }

    return sizeTable;
  }

  async updateSizeTable(
    id: number,
    updateData: {
      tableName?: string;
    },
  ): Promise<SizeTable> {
    const sizeTable = await this.sizeTableRepo.findOne({
      where: { id },
    });

    if (!sizeTable) {
      throw new NotFoundException(`Size table with ID ${id} not found`);
    }

    Object.assign(sizeTable, updateData);
    return await this.sizeTableRepo.save(sizeTable);
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
  ): Promise<SizeDimension | null> {
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

    return await this.sizeDimensionRepo.findOne({
      where: { id: savedDimension.id },
      relations: ['fields'],
    });
  }
}
