import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';
import { Order } from './order.entity';

@Controller('order')
@UseInterceptors(ClassSerializerInterceptor)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.orderService.createOrder(createOrderDto);
  }
}
