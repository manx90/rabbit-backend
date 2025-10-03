import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  @MaxLength(100)
  cityName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  optusId?: string;

  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateDeliveryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  cityName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  optusId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
