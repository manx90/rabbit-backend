import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductColor } from '../product/entities/product-color.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productService: ProductService,
  ) {}

  async create(orderData: {
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
    const order = this.orderRepository.create({
      customerName: orderData.customerName,
      phoneNumber: orderData.phoneNumber,
      city: orderData.city,
      address: orderData.address,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items and update stock
    for (const itemData of orderData.items) {
      const product = await this.productService.findOne(itemData.productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const size = product.sizes.find(s => s.id === itemData.sizeId);
      if (!size) {
        throw new Error('Size not found');
      }

      const color = size.colors.find(c => c.id === itemData.colorId);
      if (!color || color.quantity < itemData.quantity) {
        throw new Error('Insufficient stock');
      }

      const orderItem = this.orderItemRepository.create({
        order: savedOrder,
        product: { id: itemData.productId },
        size: { id: itemData.sizeId },
        color: { id: itemData.colorId },
        quantity: itemData.quantity,
        price: size.price,
      });

      await this.orderItemRepository.save(orderItem);

      // Update stock
      await this.productService.updateStock(itemData.colorId, color.quantity - itemData.quantity);
    }

    return this.findOne(savedOrder.id);
  }

  async findAll() {
    return this.orderRepository.find({
      relations: ['items', 'items.product', 'items.size', 'items.color'],
    });
  }

  async findOne(id: number) {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'items.size', 'items.color'],
    });
  }

  async updateStatus(id: number, status: string) {
    await this.orderRepository.update(id, { status });
    return this.findOne(id);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    if (order) {
      await this.orderRepository.remove(order);
    }
    return order;
  }
}
