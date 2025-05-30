import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './order.dto';
import { OrderRepository } from './order.repository';
import { order } from './order.entity';
// import { OrderStatus } from './order.types';
// import { Auth } from '../auth/auth.entity';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  createOrder(dto: CreateOrderDto): Promise<order> {
    return this.orderRepository.createOrder(dto);
  }
}
