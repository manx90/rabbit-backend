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

  updateOrderStatusToProcessing(id: string): Promise<any> {
    return this.orderRepository.updateOrderStatusToProcessing(id);
  }

  updateOrderStatusToDelivered(id: string): Promise<void> {
    return this.orderRepository.updateOrderStatusToDelivered(id);
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
}
