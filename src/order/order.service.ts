import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './order.dto';
import { OrderRepository } from './order.repository';
import { order } from './order.entity';
import { UpdateOrderDto } from './order.dto';
import { OrderStatus } from './order.types';
// import { Auth } from '../auth/auth.entity';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  createOrder(dto: CreateOrderDto): Promise<order> {
    return this.orderRepository.createOrder(dto);
  }
  updateOrder(id: string, dto: UpdateOrderDto): Promise<order> {
    return this.orderRepository.updateOrder(id, dto);
  }
  getAllOrders(): Promise<order[]> {
    return this.orderRepository.getAllOrders();
  }

  getOrderById(id: string): Promise<order> {
    return this.orderRepository.getOrderById(id);
  }

  deleteOrder(id: string): Promise<void> {
    return this.orderRepository.deleteOrder(id);
  }

  updateOrderStatusToReadied(id: string): Promise<any> {
    return this.orderRepository.updateOrderStatusToReadied(id);
  }

  updateOrderStatusToShipped(id: string): Promise<void> {
    return this.orderRepository.updateOrderStatusToShipped(id);
  }

  updateOrderStatusToCancelled(id: string): Promise<void> {
    return this.orderRepository.updateOrderStatusToCancelled(id);
  }

  getOrdersByStatus(status: OrderStatus): Promise<order[]> {
    return this.orderRepository.getOrdersByStatus(status);
  }

  addReadyBy(id: string, readyById: string): Promise<order> {
    return this.orderRepository.addReadyBy(id, readyById);
  }

  deleteAllOrders(): Promise<any> {
    return this.orderRepository.deleteAllOrders();
  }

  numberOfOrders(): Promise<number> {
    return this.orderRepository.length();
  }

  countPendingOrders(): Promise<number> {
    return this.orderRepository.countPendingOrders();
  }

  countCancelledOrders(): Promise<number> {
    return this.orderRepository.countCancelledOrders();
  }

  countShippedOrders(): Promise<number> {
    return this.orderRepository.countShippedOrders();
  }

  countReadiedOrders(): Promise<number> {
    return this.orderRepository.countReadiedOrders();
  }

  getRevenue(options?: { startDate?: Date; endDate?: Date }): Promise<{
    totalRevenue: number;
    totalOrders: number;
  }> {
    return this.orderRepository.getRevenue(options);
  }

  getGrowth(days: number = 30): Promise<{
    orders: { current: number; previous: number; percentChange: number };
    revenue: { current: number; previous: number; percentChange: number };
  }> {
    return this.orderRepository.getGrowth(days);
  }
}
