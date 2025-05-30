import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { order, orderitem } from './order.entity';
import { CreateOrderDto } from './order.dto';
import { product } from 'src/product/entities/product.entity';
// import { OrderStatus } from './order.types';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(order)
    private readonly orderRepo: Repository<order>,
    @InjectRepository(product)
    private readonly productRepo: Repository<product>,
  ) {}

  /** Create and persist a new order */
  async createOrder(dto: CreateOrderDto): Promise<order> {
    const Order = new order();
    // order.business = 1; // Set explicit business value
    Order.items = [];
    for (const item of dto.items) {
      const product = await this.productRepo.findOne({
        where: { id: item.productId },
        relations: ['category', 'subCategory'],
      });
      if (!product)
        throw new BadRequestException(`Product ${item.productId} not found`);

      const size = product.sizeDetails.find(
        (size) => size.sizeName === item.sizeName,
      );
      if (!size) {
        throw new BadRequestException(
          `Size ${item.sizeName} not found in product ${product.id}`,
        );
      }

      const color = size.quantities.find((q) => q.colorName === item.colorName);
      if (!color) {
        throw new BadRequestException(
          `Color ${item.colorName} not found in product ${product.id} with size ${item.sizeName}`,
        );
      }

      if (item.quantity <= 0) {
        throw new BadRequestException(
          `Quantity of ${item.quantity} is not valid for product ${product.id}`,
        );
      }

      const orderItem = new orderitem();
      orderItem.product = product;
      orderItem.productId = product.id;
      orderItem.sizeName = size.sizeName;
      orderItem.colorName = color.colorName;
      orderItem.quantity = item.quantity;
      orderItem.order = Order;
      Order.items.push(orderItem);
    }
    // First save the order
    const savedOrder = await this.orderRepo.save(Order);

    // Calculate total amount after items are saved
    savedOrder.amount = Order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    Order.consignee_name = dto.consignee_name;
    Order.consignee_phone = dto.consignee_phone;
    Order.consignee_city = dto.consignee_city;
    Order.consignee_area = dto.consignee_area;
    Order.consignee_address = dto.consignee_address;
    Order.shipment_types = dto.shipment_types;
    Order.quantity = dto.quantity;
    Order.items_description = dto.items_description;
    Order.is_cod = dto.is_cod === '1';
    Order.Cod_amount = Order.amount;
    Order.has_return = dto.has_return === '1';
    Order.return_notes = dto.return_notes;
    Order.notes = dto.notes;
    // Update the order with the calculated amount
    return this.orderRepo.save(savedOrder);
  }
}
