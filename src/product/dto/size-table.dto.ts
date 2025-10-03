import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/* ---------- DTOs for Size Table ---------- */

export class SizeFieldResponseDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Chest' })
  @IsString()
  @IsNotEmpty()
  fieldName: string;

  @ApiProperty({ example: '38 inches' })
  @IsString()
  @IsNotEmpty()
  fieldValue: string;
}

export class SizeDimensionResponseDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Medium' })
  @IsString()
  @IsNotEmpty()
  sizeName: string;

  @ApiPropertyOptional({
    description: 'Optional fields for this size',
    type: [SizeFieldResponseDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeFieldResponseDto)
  fields?: SizeFieldResponseDto[];
}

export class SizeTableResponseDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'T-Shirt Size Chart' })
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @ApiPropertyOptional({
    description: 'Optional size dimensions to create with the table',
    type: [SizeDimensionResponseDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeDimensionResponseDto)
  sizeDimensions?: SizeDimensionResponseDto[];
}

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

  @ApiPropertyOptional({
    description: 'Optional fields for this size',
    type: [SizeFieldDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeFieldDto)
  fields?: SizeFieldDto[];
}

export class CreateSizeTableDto {
  @ApiProperty({ example: 'T-Shirt Size Chart' })
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @ApiPropertyOptional({
    description: 'Optional size dimensions to create with the table',
    type: [SizeDimensionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeDimensionDto)
  sizeDimensions?: SizeDimensionDto[];
}

export class UpdateSizeTableDto {
  @ApiPropertyOptional({ example: 'Updated T-Shirt Size Chart' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tableName?: string;
}

export class AddSizeDimensionDto {
  @ApiProperty({ example: 'Large' })
  @IsString()
  @IsNotEmpty()
  sizeName: string;

  @ApiPropertyOptional({
    description: 'Optional fields for this size',
    type: [SizeFieldDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeFieldDto)
  fields?: SizeFieldDto[];
}
