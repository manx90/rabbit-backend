import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNumber({}, { message: 'Price cover must be a valid number' })
  priceCover?: number | null;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  subCategory?: string;

  // For colorsWithSizes structure
  'colorsWithSizes[0].name'?: string;
  'colorsWithSizes[0].imgColor'?: string;
  'colorsWithSizes[0].sizes[0].size'?: string;
  'colorsWithSizes[0].sizes[0].quantity'?: number;
  'colorsWithSizes[0].sizes[1].size'?: string;
  'colorsWithSizes[0].sizes[1].quantity'?: number;

  'colorsWithSizes[1].name'?: string;
  'colorsWithSizes[1].imgColor'?: string;
  'colorsWithSizes[1].sizes[0].size'?: string;
  'colorsWithSizes[1].sizes[0].quantity'?: number;
  'colorsWithSizes[1].sizes[1].size'?: string;
  'colorsWithSizes[1].sizes[1].quantity'?: number;

  // utils
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

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
  isBestSeller: boolean;
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

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  subCategory?: string;

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
