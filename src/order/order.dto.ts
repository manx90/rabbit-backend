import {
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  // @IsNotEmpty()
  @IsNumber()
  productId: number;

  // @IsNotEmpty()
  @IsString()
  sizeName: string;

  // @IsNotEmpty()
  @IsString()
  colorName: string;

  // @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  // @IsNotEmpty()
  @IsString()
  consignee_name: string;

  // @IsNotEmpty()
  @IsString()
  consignee_phone: string;

  // @IsNotEmpty()
  @IsString()
  consignee_city: string;

  // @IsNotEmpty()
  @IsString()
  consignee_area: string;

  // @IsNotEmpty()
  @IsString()
  consignee_address: string;

  // Shipment
  // @IsNotEmpty()
  @IsString()
  shipment_types: string = '1';

  // // @IsNotEmpty()
  // @IsOptional()
  // @IsString()
  // quantity: string;

  // @IsNotEmpty()
  @IsString()
  items_description: string = '';

  // @IsNotEmpty()
  @IsOptional()
  @IsString()
  is_cod: string = '1';

  // // @IsNotEmpty()
  // @IsString()
  // cod_amount: string;

  // @IsNotEmpty()
  @IsString()
  has_return: string = '0';

  @IsString()
  return_notes: string = '';

  @IsString()
  notes: string = '';

  // Items
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderDto extends CreateOrderDto {}
