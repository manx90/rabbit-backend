import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  colorName: string[];

  @IsNumber()
  @IsNotEmpty()
  priceCover: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  subCategory: string;

  //  size
  @IsArray()
  @IsNotEmpty()
  sizeName: string[];

  @IsArray()
  @IsNotEmpty()
  sizePrice: number[];

  @IsArray()
  @IsNotEmpty()
  sizeColor: string[];

  @IsArray()
  @IsNotEmpty()
  sizeColorQuantity: number[][];
  // utils
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isFeatured: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isTrending: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isNew: boolean;
}
