import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
  IsObject,
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
