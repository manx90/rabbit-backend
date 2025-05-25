import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  Min,
  IsPositive,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublishState } from '../../common/interfaces/entity.interface';

/* ---------- nested DTOs ---------- */

export class ColorQuantityDto {
  @ApiProperty({ example: 'أحمر' })
  @IsString()
  @IsNotEmpty()
  colorName: string;

  @ApiProperty({ example: 12, minimum: 0 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({ example: 'red-color.jpg' })
  @IsOptional()
  @IsString()
  imgColor?: string;
}

export class SizeDetailDto {
  @ApiProperty({ example: 'XL' })
  @IsString()
  @IsNotEmpty()
  sizeName: string;

  @ApiProperty({ example: 35000 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Colors and their stock for this size',
    type: [ColorQuantityDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ColorQuantityDto)
  quantities: ColorQuantityDto[];
}

export class ColorDetailDto {
  @ApiProperty({ example: 'أحمر' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'red-color.jpg' })
  @IsOptional()
  @IsString()
  imgColor?: string;
}

/* ---------- main DTO ---------- */

export class CreateProductDto {
  @ApiProperty({ example: 'تيشيرت رجالي' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'تيشيرت قطن عالي الجودة ومريح' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  subCategoryId: number;

  @ApiPropertyOptional({ enum: PublishState, default: PublishState.DRAFT })
  @IsEnum(PublishState)
  @IsOptional()
  publishState?: PublishState = PublishState.DRAFT;

  @ApiProperty({
    description: 'Gallery images (file names or URLs)',
    example: ['gallery1.jpg', 'gallery2.jpg'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  images: string[];

  @ApiProperty({ example: 'cover.jpg' })
  @IsString()
  imgCover: string;

  @ApiPropertyOptional({ example: 'size-chart.png' })
  @IsOptional()
  @IsString()
  imgSizeChart?: string;

  @ApiPropertyOptional({ example: 'measure.png' })
  @IsOptional()
  @IsString()
  imgMeasure?: string;

  /* sizes & colors */
  @ApiProperty({
    description: 'List of sizes with their prices and color quantities',
    type: [SizeDetailDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SizeDetailDto)
  sizes: SizeDetailDto[];

  /** optional convenience list if you want to expose colors separately */
  @ApiPropertyOptional({
    description: 'Flat list of colors (redundant, but handy for front-end)',
    type: [ColorDetailDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColorDetailDto)
  colors?: ColorDetailDto[];

  /* UX flags */
  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = false;
  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean = false;
  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isTrending?: boolean = false;
  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isNew?: boolean = true;
  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isBestSeller?: boolean = false;
}

export class UpdateProductDto {
  /* ——— Basics ——— */
  @ApiPropertyOptional({ description: 'New product name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'New product description' })
  @IsString()
  @IsOptional()
  description?: string;

  /* ——— Category refs ——— */
  @ApiPropertyOptional({ description: 'New category ID', example: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({ description: 'New sub-category ID', example: 2 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  subCategoryId?: number;

  /* ——— Publish state ——— */
  @ApiPropertyOptional({ enum: PublishState })
  @IsEnum(PublishState)
  @IsOptional()
  publishState?: PublishState;

  /* ——— Images ——— */
  @ApiPropertyOptional({
    type: [String],
    description: 'Replace gallery images',
  })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ description: 'New cover image' })
  @IsOptional()
  @IsString()
  imgCover?: string;

  @ApiPropertyOptional({ description: 'New size-chart image' })
  @IsOptional()
  @IsString()
  imgSizeChart?: string;

  @ApiPropertyOptional({ description: 'New measurement guide image' })
  @IsOptional()
  @IsString()
  imgMeasure?: string;

  /* ——— Size / Color matrix ——— */
  @ApiPropertyOptional({
    type: [SizeDetailDto],
    description: 'Replace the size list completely',
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SizeDetailDto)
  sizes?: SizeDetailDto[];

  /* ——— UX flags ——— */
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isTrending?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isBestSeller?: boolean;
}
