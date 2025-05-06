import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  // @IsNotEmpty()
  name: string;

  @IsString()
  // @IsNotEmpty()
  description: string;

  @IsString()
  // @IsNotEmpty()
  priceCover: number;

  @IsArray()
  // @IsNotEmpty()
  images: File[];

  @IsString()
  // @IsNotEmpty()
  category: string;

  @IsString()
  // @IsNotEmpty()
  subCategory: string;

  @IsArray()
  // @IsNotEmpty()
  sizes: [
    {
      size: string;
      price: number;
      quantity: number;
      imgColorIndex: number;
    },
  ];

  @IsArray()
  // @IsNotEmpty()
  imgColors: File[];

  @IsString()
  // @IsNotEmpty()
  imgSize: File;

  @IsString()
  // @IsNotEmpty()
  imgMeasure: File;

  @IsString()
  // @IsNotEmpty()
  imgCover: File;

  @IsString()
  // @IsNotEmpty()
  isActive: boolean;

  @IsString()
  // @IsNotEmpty()
  isFeatured: boolean;

  @IsString()
  // @IsNotEmpty()
  isTrending: boolean;

  @IsString()
  // @IsNotEmpty()
  isNew: boolean;
}
