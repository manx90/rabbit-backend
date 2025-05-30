// order/order.dto.ts
import {
  IsArray,
  IsIn,
  // IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  // IsIn,
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
  @IsNumber()
  consignee_city: number;

  // @IsNotEmpty()
  @IsNumber()
  consignee_area: number;

  // @IsNotEmpty()
  @IsString()
  consignee_address: string;

  // Shipment
  // @IsNotEmpty()
  @IsNumber()
  shipment_types: number;

  // @IsNotEmpty()
  @IsNumber()
  quantity: number;

  // @IsNotEmpty()
  @IsString()
  items_description: string;

  // @IsNotEmpty()
  @IsIn(['1', '0'])
  is_cod: '1' | '0';

  // @IsNotEmpty()
  @IsNumber()
  cod_amount: number;

  // @IsNotEmpty()
  @IsIn(['1', '0'])
  has_return: '1' | '0';

  @IsString()
  return_notes: string;

  @IsString()
  notes: string;

  // Items
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
