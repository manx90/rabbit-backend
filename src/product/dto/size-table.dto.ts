import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/* ---------- DTOs for Size Table ---------- */

export class SizeFieldDto {
  @ApiProperty({ example: 'Chest' })
  @IsString()
  @IsNotEmpty()
  fieldName: string;

  @ApiProperty({ example: '38 inches' })
  @IsString()
  @IsNotEmpty()
  fieldValue: string;
}

export class SizeDimensionDto {
  @ApiProperty({ example: 'Medium' })
  @IsString()
  @IsNotEmpty()
  sizeName: string;

  @ApiProperty({
    description: 'Fields for this size',
    type: [SizeFieldDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeFieldDto)
  fields: SizeFieldDto[];
}

export class SizeTableDataDto {
  @ApiProperty({ example: 'T-Shirt Size Chart' })
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @ApiProperty({
    description: 'Size dimensions for this table',
    type: [SizeDimensionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeDimensionDto)
  dimensions: SizeDimensionDto[];
}

export class SizeTableResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'T-Shirt Size Chart' })
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @ApiProperty({
    description: 'Size table data',
    type: SizeTableDataDto,
  })
  @ValidateNested()
  @Type(() => SizeTableDataDto)
  data: SizeTableDataDto;
}

export class CreateSizeTableDto {
  @ApiProperty({ example: 'T-Shirt Size Chart' })
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @ApiProperty({
    description: 'Size dimensions for this table',
    type: [SizeDimensionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeDimensionDto)
  dimensions: SizeDimensionDto[];
}

export class UpdateSizeTableDto {
  @ApiPropertyOptional({ example: 'Updated T-Shirt Size Chart' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tableName?: string;

  @ApiPropertyOptional({
    description: 'Updated size dimensions for this table',
    type: [SizeDimensionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeDimensionDto)
  dimensions?: SizeDimensionDto[];
}
