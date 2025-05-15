import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './interfaces/order-item.interface';
export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  consignee_name: string;

  @IsNotEmpty()
  @IsNumber()
  consignee_phone: number;

  @IsNotEmpty()
  @IsNumber()
  consignee_city: number;

  @IsNotEmpty()
  @IsNumber()
  consignee_area: number;

  @IsNotEmpty()
  @IsString()
  consignee_address: string;

  @IsNotEmpty()
  @IsNumber()
  shipment_types: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  items_description: string;

  @IsNotEmpty()
  @IsString()
  is_cod: '1' | '0';

  @IsNotEmpty()
  @IsNumber()
  cod_amount: number;

  @IsNotEmpty()
  @IsString()
  has_return: '1' | '0';

  @IsNotEmpty()
  @IsString()
  return_notes: string;

  @IsNotEmpty()
  @IsString()
  notes: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto as any)
  items: OrderItemDto[];
}
