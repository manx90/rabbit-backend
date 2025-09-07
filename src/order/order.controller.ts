import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Put,
  Get,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { order } from './order.entity';
import { OrderStatus } from './order.types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.constant';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Request } from 'express';
import { auth } from 'src/auth/entities/auth.entity';

@Controller('order')
@UseInterceptors(ClassSerializerInterceptor)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  createOrder(@Body() createOrderDto: CreateOrderDto): Promise<order> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get('numberOfOrders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  numberOfOrders(): Promise<number> {
    return this.orderService.numberOfOrders();
  }

  @Get('count/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  countPendingOrders(): Promise<number> {
    return this.orderService.countPendingOrders();
  }

  @Get('count/cancelled')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  countCancelledOrders(): Promise<number> {
    return this.orderService.countCancelledOrders();
  }

  @Get('count/shipped')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  countShippedOrders(): Promise<number> {
    return this.orderService.countShippedOrders();
  }

  @Get('count/readied')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  countReadiedOrders(): Promise<number> {
    return this.orderService.countReadiedOrders();
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<order> {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  getAllOrders(): Promise<order[]> {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  getOrderById(@Param('id') id: string): Promise<order> {
    return this.orderService.getOrderById(id);
  }

  @Get('status/:status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  getOrdersByStatus(@Param('status') status: OrderStatus): Promise<order[]> {
    return this.orderService.getOrdersByStatus(status);
  }

  @Put('readyBy/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  addReadyBy(@Param('id') id: string, @Req() req: Request): Promise<order> {
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }
    const userId = (req.user as auth).id;
    return this.orderService.addReadyBy(id, userId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  deleteAllOrders(): Promise<void> {
    return this.orderService.deleteAllOrders();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  deleteOrder(@Param('id') id: string): Promise<void> {
    return this.orderService.deleteOrder(id);
  }

  @Put('readied/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  updateOrderStatusToReadied(@Param('id') id: string): Promise<void> {
    return this.orderService.updateOrderStatusToReadied(id);
  }

  @Put('shipped/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  updateOrderStatusToShipped(@Param('id') id: string): Promise<void> {
    return this.orderService.updateOrderStatusToShipped(id);
  }

  @Put('cancelled/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  updateOrderStatusToCancelled(@Param('id') id: string): Promise<void> {
    return this.orderService.updateOrderStatusToCancelled(id);
  }
}
