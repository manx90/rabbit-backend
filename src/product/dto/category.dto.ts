import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  ValidateNested,
  //   ArrayMinSize,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubCategoryResponseDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: 'T-Shirts' })
  name: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-05-26T07:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-26T07:00:00.000Z' })
  updatedAt: Date;
}

export class CategoryResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Clothing' })
  name: string;

  @ApiProperty({ type: [SubCategoryResponseDto] })
  subCategories: SubCategoryResponseDto[];

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-05-26T07:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-26T07:00:00.000Z' })
  updatedAt: Date;
}

export class CreateSubCategoryDto {
  @ApiProperty({ example: 'T-Shirts' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: 'Parent category ID' })
  @IsOptional()
  @IsNumber()
  categoryId: number;
}

export class UpdateSubCategoryDto {
  @ApiPropertyOptional({ example: 'Men’s T-Shirts' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  // You could also allow toggling isActive
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'Clothing' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Initial subcategories (IDs or objects)',
    type: [CreateSubCategoryDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubCategoryDto)
  subCategories?: CreateSubCategoryDto[];
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Apparel' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
