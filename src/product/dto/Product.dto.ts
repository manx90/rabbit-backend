import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SizeQuantityDto {
  @IsString()
  @IsNotEmpty()
  size: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class ColorWithSizesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  imgColor?: string;

  @IsArray()
  @Type(() => SizeQuantityDto)
  sizes: SizeQuantityDto[];
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  priceCover?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  subCategoryId?: number;

  // For dynamic form data
  [key: string]: any;

  // utils
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isTrending?: boolean;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  @IsBoolean()
  @IsOptional()
  isBestSeller?: boolean;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  priceCover?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  subCategoryId?: number;

  // utils
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isTrending?: boolean;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;
}
