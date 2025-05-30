import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';
import { order } from './order.entity';

@Controller('order')
@UseInterceptors(ClassSerializerInterceptor)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  createOrder(@Body() createOrderDto: CreateOrderDto): Promise<order> {
    return this.orderService.createOrder(createOrderDto);
  }
}
