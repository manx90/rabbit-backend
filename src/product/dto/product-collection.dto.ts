import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsArray,
  ArrayMaxSize,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CollectionType,
  CollectionStatus,
} from '../entities/product-collection.entity';

export class CollectionSettingsDto {
  @ApiPropertyOptional({ example: 50 })
  @IsNumber()
  @IsOptional()
  maxProducts?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  showOutOfStock?: boolean;

  @ApiPropertyOptional({ example: 'createdAt' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], example: 'DESC' })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  includeSubcategories?: boolean;
}

export class CollectionMetadataDto {
  @ApiPropertyOptional({ example: ['summer', 'discount'] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: 'summer' })
  @IsString()
  @IsOptional()
  season?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsNumber()
  @IsOptional()
  discount?: number;

  @ApiPropertyOptional({ example: '2024-06-01' })
  @IsString()
  @IsOptional()
  validFrom?: Date;

  @ApiPropertyOptional({ example: '2024-08-31' })
  @IsString()
  @IsOptional()
  validTo?: Date;
}

export class CreateProductCollectionDto {
  @ApiPropertyOptional({ example: 'Summer Collection with Discount' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Best summer products with special discounts',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: CollectionType,
    example: CollectionType.MIXED,
    default: CollectionType.MIXED,
  })
  @IsEnum(CollectionType)
  @IsOptional()
  type?: CollectionType = CollectionType.MIXED;

  @ApiPropertyOptional({
    enum: CollectionStatus,
    default: CollectionStatus.ACTIVE,
  })
  @IsEnum(CollectionStatus)
  @IsOptional()
  status?: CollectionStatus = CollectionStatus.ACTIVE;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean = false;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number = 0;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display priority (higher number = higher priority)',
  })
  @IsNumber()
  @IsOptional()
  displayPriority?: number = 0;

  @ApiPropertyOptional({
    example: false,
    description: 'Mark as priority collection for special display',
  })
  @IsBoolean()
  @IsOptional()
  isPriority?: boolean = false;

  // Category and subcategory IDs
  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsArray()
  @IsOptional()
  @ArrayMaxSize(10, { message: 'Maximum 10 categories allowed' })
  categoryIds?: number[];

  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsArray()
  @IsOptional()
  @ArrayMaxSize(20, { message: 'Maximum 20 subcategories allowed' })
  subCategoryIds?: number[];

  // Product IDs
  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsArray()
  @IsOptional()
  @ArrayMaxSize(10, { message: 'Maximum 10 products allowed' })
  productIds?: number[];

  // Settings
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CollectionSettingsDto)
  settings?: CollectionSettingsDto;

  // Metadata
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CollectionMetadataDto)
  metadata?: CollectionMetadataDto;
}

export class UpdateProductCollectionDto {
  @ApiPropertyOptional({ example: 'Summer Collection with Discount' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Best summer products with special discounts',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: CollectionType })
  @IsEnum(CollectionType)
  @IsOptional()
  type?: CollectionType;

  @ApiPropertyOptional({ enum: CollectionStatus })
  @IsEnum(CollectionStatus)
  @IsOptional()
  status?: CollectionStatus;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display priority (higher number = higher priority)',
  })
  @IsNumber()
  @IsOptional()
  displayPriority?: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Mark as priority collection for special display',
  })
  @IsBoolean()
  @IsOptional()
  isPriority?: boolean;

  // Category and subcategory IDs
  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsArray()
  @IsOptional()
  @ArrayMaxSize(10, { message: 'Maximum 10 categories allowed' })
  categoryIds?: number[];

  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsArray()
  @IsOptional()
  @ArrayMaxSize(20, { message: 'Maximum 20 subcategories allowed' })
  subCategoryIds?: number[];

  // Product IDs
  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsArray()
  @IsOptional()
  @ArrayMaxSize(10, { message: 'Maximum 10 products allowed' })
  productIds?: number[];

  // Settings
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CollectionSettingsDto)
  settings?: CollectionSettingsDto;

  // Metadata
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CollectionMetadataDto)
  metadata?: CollectionMetadataDto;
}

export class ProductCollectionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: CollectionType })
  type: CollectionType;

  @ApiProperty({ enum: CollectionStatus })
  status: CollectionStatus;

  @ApiProperty()
  isFeatured: boolean;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  displayPriority: number;

  @ApiProperty()
  isPriority: boolean;

  @ApiProperty()
  settings: CollectionSettingsDto;

  @ApiProperty()
  metadata: CollectionMetadataDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
