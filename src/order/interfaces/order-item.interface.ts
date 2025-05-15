import { IsNumber, IsString } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  product_id: number;

  @IsNumber()
  quantity: number;

  @IsString()
  size: string;

  @IsString()
  color: string;
}
