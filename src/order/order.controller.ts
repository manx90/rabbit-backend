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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
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

@ApiTags('Orders')
@Controller('order')
@UseInterceptors(ClassSerializerInterceptor)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiCreatedResponse({
    description: 'Order created successfully',
    type: order,
  })
  @ApiBadRequestResponse({ description: 'Bad request - validation failed' })
  createOrder(@Body() createOrderDto: CreateOrderDto): Promise<order> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get('numberOfOrders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get total number of orders (Admin/SuperAdmin only)',
  })
  @ApiOkResponse({ description: 'Total orders count retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin/SuperAdmin role required',
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order by ID (Admin/SuperAdmin only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiOkResponse({ description: 'Order updated successfully', type: order })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiBadRequestResponse({ description: 'Bad request - validation failed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin/SuperAdmin role required',
  })
  updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<order> {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders (Admin/SuperAdmin only)' })
  @ApiOkResponse({
    description: 'Orders retrieved successfully',
    type: [order],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin/SuperAdmin role required',
  })
  getAllOrders(): Promise<order[]> {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID (Admin/SuperAdmin only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiOkResponse({ description: 'Order retrieved successfully', type: order })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin/SuperAdmin role required',
  })
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

  @Get('stats/revenue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  getRevenue(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ totalRevenue: number; totalOrders: number }> {
    const options: { startDate?: Date; endDate?: Date } = {};
    if (startDate && endDate) {
      options.startDate = new Date(startDate);
      options.endDate = new Date(endDate);
    }
    return this.orderService.getRevenue(options);
  }

  @Get('stats/growth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  getGrowth(@Query('days') days?: string): Promise<{
    orders: { current: number; previous: number; percentChange: number };
    revenue: { current: number; previous: number; percentChange: number };
  }> {
    const d = days ? parseInt(days) : 30;
    return this.orderService.getGrowth(d);
  }
}
