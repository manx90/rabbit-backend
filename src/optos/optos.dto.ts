import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShipmentDto {
  @IsNotEmpty()
  @IsString()
  business: string;

  @IsNotEmpty()
  @IsString()
  business_address: string;

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

  @IsNotEmpty()
  @IsString()
  is_cod: '1' | '0';

  @IsNotEmpty()
  @IsString()
  cod_amount: string;

  @IsNotEmpty()
  @IsString()
  has_return: '1' | '0';

  @IsNotEmpty()
  @IsString()
  return_notes: string;

  @IsNotEmpty()
  @IsString()
  notes: string;
}
