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
  @IsArray()
  @IsOptional()
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
  imgCover: string;
  imgSizeChart: string;
  imgMeasure: string;
  images: string[];
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PublishState)
  publishState?: PublishState;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  subCategoryId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeDetailDto)
  sizes?: SizeDetailDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColorDetailDto)
  colors?: ColorDetailDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isTrending?: boolean;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;
}
