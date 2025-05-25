import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './order.dto';
import { OrderRepository } from './order.repository';
import { Order } from './order.entity';
import { OrderStatus } from './order.types';
// import { Auth } from '../auth/auth.entity';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  createOrder(dto: CreateOrderDto): Promise<Order> {
    return this.orderRepository.createOrder(dto);
  }

  getOrderById(id: string): Promise<Order> {
    return this.orderRepository.findOrderById(id);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const orders = await this.orderRepository.findAllOrders();
    return orders.filter((o) => o.readyBy?.id === userId);
  }

  updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    return this.orderRepository.updateOrderStatus(id, status);
  }

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.getOrderById(id);
    if (![OrderStatus.PENDING, OrderStatus.PROCESSING].includes(order.status)) {
      throw new BadRequestException(
        `Cannot cancel order in status ${order.status}`,
      );
    }
    return this.updateOrderStatus(id, OrderStatus.CANCELLED);
  }

  getAllOrders(filters?: Partial<Order>): Promise<Order[]> {
    return this.orderRepository.findAllOrders(filters);
  }

  async searchOrders(term: string): Promise<Order[]> {
    const orders = await this.orderRepository.findAllOrders();
    const lc = term.toLowerCase();
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(lc) ||
        o.consignee_name.toLowerCase().includes(lc) ||
        o.consignee_phone.includes(term),
    );
  }
}
