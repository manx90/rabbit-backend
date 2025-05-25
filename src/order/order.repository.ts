import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Order, OrderItem } from './order.entity';
import { CreateOrderDto } from './order.dto';
import { Product } from 'src/product/entities/product.entity';
import { OrderStatus } from './order.types';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  /** Create and persist a new order */
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepo.create(); // empty instance avoids overload confusion

    // static fields
    order.business = 1;
    order.business_address = 1;
    order.status = OrderStatus.PENDING;

    // consignee & shipment
    order.consignee_name = dto.consignee_name;
    order.consignee_phone = dto.consignee_phone;
    order.consignee_city = dto.consignee_city;
    order.consignee_area = dto.consignee_area;
    order.consignee_address = dto.consignee_address;

    order.shipment_types = dto.shipment_types;
    order.items_description = dto.items_description;

    order.is_cod = dto.is_cod === '1';
    order.has_return = dto.has_return === '1';
    order.Cod_amount = dto.cod_amount;

    order.return_notes = dto.return_notes;
    order.notes = dto.notes;

    order.items = [];

    // iterate items
    for (const item of dto.items) {
      await this.addItem(order, item);
    }

    // calculate total quantity
    order.quantity = order.items.reduce((sum, i) => sum + i.quantity, 0);

    return this.orderRepo.save(order);
  }

  /** attach validated item */
  private async addItem(order: Order, item: CreateOrderDto['items'][number]) {
    const product = await this.productRepo.findOne({
      where: { id: item.productId },
    });
    if (!product)
      throw new NotFoundException(`Product ${item.productId} not found`);

    // validate size/color
    const size = product.sizeDetails.find((s) => s.sizeName === item.sizeName);
    if (!size)
      throw new BadRequestException(`Size ${item.sizeName} not available`);
    const color = size.quantities.find((q) => q.colorName === item.colorName);
    if (!color)
      throw new BadRequestException(
        `Color ${item.colorName} not available for size ${item.sizeName}`,
      );
    if (color.quantity < item.quantity)
      throw new BadRequestException('Insufficient stock');

    const orderItem = this.orderRepo.manager.create(OrderItem, {
      order,
      product,
      sizeName: item.sizeName,
      colorName: item.colorName,
      quantity: item.quantity,
    });

    order.items.push(orderItem);
  }

  /** find by id */
  async findOrderById(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'readyBy'],
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  /** list orders */
  async findAllOrders(filters?: Partial<Order>): Promise<Order[]> {
    const where: FindOptionsWhere<Order> = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.consignee_name) where.consignee_name = filters.consignee_name;

    return this.orderRepo.find({
      where: Object.keys(where).length ? where : undefined,
      relations: ['items', 'items.product', 'readyBy'],
      order: { createdAt: 'DESC' },
    });
  }

  /** update status */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOrderById(id);
    order.status = status;
    return this.orderRepo.save(order);
  }
}
