import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateShipmentDto {
  @IsOptional()
  @IsString()
  business?: string;

  @IsOptional()
  @IsString()
  business_address?: string;

  @IsNotEmpty()
  @IsString()
  consignee_name: string;

  @IsNotEmpty()
  @IsString()
  consignee_phone: string;

  @IsNotEmpty()
  @IsString()
  consignee_city: string;

  @IsNotEmpty()
  @IsString()
  consignee_area: string;

  @IsNotEmpty()
  @IsString()
  consignee_address: string;

  @IsNotEmpty()
  @IsString()
  shipment_types: string;

  @IsNotEmpty()
  @IsString()
  quantity: string;

  @IsNotEmpty()
  @IsString()
  items_description: string;

  @IsOptional()
  @IsString()
  is_cod?: '1' | '0';

  @IsNotEmpty()
  @IsString()
  cod_amount: string;

  @IsOptional()
  @IsString()
  has_return?: '1' | '0';

  @IsOptional()
  @IsString()
  return_notes?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
