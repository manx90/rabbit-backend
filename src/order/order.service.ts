import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './order.dto';
import { OrderRepository } from './order.repository';
import { Order } from './order.entity';
import { Auth } from 'src/auth/auth.entity';
@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  /**
   * Create a new order
   * @param createOrderDto Order data from request
   * @returns The created order
   */
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderRepository.createOrder(createOrderDto);
  }

  /**
   * Get an order by its ID
   * @param id Order ID
   * @returns The order with its items
   */
  async getOrderById(id: string): Promise<Order> {
    return this.orderRepository.findOrderById(id);
  }

  /**
   * Get all orders for a specific user
   * @param userId User ID
   * @returns List of orders for the user
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    // Find orders where readyBy.id matches userId
    const orders = await this.orderRepository.findAllOrders();
    return orders.filter(
      (order) => order.readyBy && order.readyBy.id === userId,
    );
  }

  /**
   * Update the status of an order
   * @param id Order ID
   * @param status New status
   * @param user User making the change (for authorization)
   * @returns The updated order
   */
  async updateOrderStatus(
    id: string, 
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
    user?: Auth
  ): Promise<Order> {
    // Optional: Add authorization check here if needed
    // if (user && !this.canUserUpdateOrder(user, id)) {
    //   throw new ForbiddenException('You are not authorized to update this order');
    // }
    
    return this.orderRepository.updateOrderStatus(id, status);
  }

  /**
   * Cancel an order
   * @param id Order ID
   * @param user User making the cancellation (for authorization)
   * @returns The cancelled order
   */
  async cancelOrder(id: string, user?: Auth): Promise<Order> {
    const order = await this.getOrderById(id);
    
    // Check if order can be cancelled (only pending or processing orders)
    if (order.status !== 'pending' && order.status !== 'processing') {
      throw new BadRequestException(
        `Cannot cancel order with status '${order.status}'. Only pending or processing orders can be cancelled.`
      );
    }
    
    // Optional: Add authorization check here if needed
    // if (user && !this.canUserCancelOrder(user, order)) {
    //   throw new ForbiddenException('You are not authorized to cancel this order');
    // }
    
    return this.updateOrderStatus(id, 'cancelled', user);
  }
  /**
   * Get all orders with optional filtering
   * @param filters Optional filters for orders
   * @returns List of filtered orders
   */
  async getAllOrders(filters?: Partial<Order>): Promise<Order[]> {
    return this.orderRepository.findAllOrders(filters);
  }
  /**
   * Search for orders by various criteria
   * @param searchTerm Search term
   * @returns List of matching orders
   */
  async searchOrders(searchTerm: string): Promise<Order[]> {
    const allOrders = await this.orderRepository.findAllOrders();
    
    // Search in consignee name, phone, or order ID
    return allOrders.filter(order => {
      return (
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.consignee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.consignee_phone.toString().includes(searchTerm)
      );
    });
  }
}
