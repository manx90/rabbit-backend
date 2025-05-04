import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() orderData: {
    customerName: string;
    phoneNumber: string;
    city: string;
    address: string;
    items: Array<{
      productId: number;
      sizeId: number;
      colorId: number;
      quantity: number;
    }>;
  }) {
    return this.orderService.create(orderData);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.orderService.updateStatus(+id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
