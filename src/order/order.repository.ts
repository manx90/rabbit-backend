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
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Create a new order with items
   * @param createOrderData Order data from request
   * @returns The created order
   */
  async createOrder(createOrderData: CreateOrderDto): Promise<Order> {
    // Create new order instance
    const order = new Order();

    // Set business information
    order.business = 1;
    order.business_address = 1;

    // Set consignee information
    order.consignee_name = createOrderData.consignee_name;
    order.consignee_phone = createOrderData.consignee_phone;
    order.consignee_city = createOrderData.consignee_city;
    order.consignee_area = createOrderData.consignee_area;
    order.consignee_address = createOrderData.consignee_address;

    // Set shipment information
    order.shipment_types = createOrderData.shipment_types;
    order.quantity = createOrderData.quantity;
    order.Cod_amount = createOrderData.cod_amount;
    order.items_description = createOrderData.items_description;
    order.is_cod = createOrderData.is_cod;
    order.has_return = createOrderData.has_return;
    order.return_notes = createOrderData.return_notes;
    order.notes = createOrderData.notes;

    // Initialize items array
    order.items = [];

    // Process each ordered item
    for (const item of createOrderData.items) {
      await this.addItemToOrder(order, item);
    }

    // Save and return the order
    return this.orderRepository.save(order);
  }

  /**
   * Add an item to an order
   * @param order The order to add the item to
   * @param item The item data
   */
  private async addItemToOrder(order: Order, item: any): Promise<void> {
    // Find the product
    const product = await this.findProductById(item.product_id);

    // Verify product availability
    this.verifyProductAvailability(product, item);

    // Create and configure the order item
    const orderItem = this.createOrderItem(product, item, order);

    // Add to order
    order.items.push(orderItem);
  }

  /**
   * Find a product by ID
   * @param productId The product ID
   * @returns The product
   */
  private async findProductById(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return product;
  }

  /**
   * Verify that the product is available in the requested color, size, and quantity
   * @param product The product
   * @param item The order item
   */
  private verifyProductAvailability(product: Product, item: any): void {
    // Find the color
    const color = product.colorsWithSizes.find((c) => c.name === item.color);

    if (!color) {
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Color ${item.color} not available for this product`,
      );
    }

    // Find the size
    const size = color.sizes.find((s) => s.size === item.size);

    if (!size) {
      throw new BadRequestException(
        `Size ${item.size} not available for this color`,
      );
    }

    // Check quantity
    if (size.quantity < item.quantity) {
      throw new BadRequestException(
        `Not enough quantity available. Requested: ${item.quantity}, Available: ${size.quantity}`,
      );
    }
  }

  /**
   * Create a new order item
   * @param product The product
   * @param item The item data
   * @param order The parent order
   * @returns The created order item
   */
  private createOrderItem(
    product: Product,
    item: any,
    order: Order,
  ): OrderItem {
    const orderItem = new OrderItem();
    orderItem.product = product;
    orderItem.size = item.size;
    orderItem.color = item.color;
    orderItem.quantity = item.quantity;
    orderItem.order = order;

    return orderItem;
  }

  /**
   * Find an order by ID
   * @param id The order ID
   * @returns The order
   */
  async findOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  /**
   * Find all orders with optional filtering
   * @param filters Optional filters
   * @returns List of orders
   */
  async findAllOrders(filters?: Partial<Order>): Promise<Order[]> {
    const whereClause: FindOptionsWhere<Order> = {};

    // Apply filters if provided
    if (filters) {
      if (filters.status) whereClause.status = filters.status;
      if (filters.consignee_name)
        whereClause.consignee_name = filters.consignee_name;
      // Add more filters as needed
    }

    return this.orderRepository.find({
      where: Object.keys(whereClause).length ? whereClause : undefined,
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Update order status
   * @param id The order ID
   * @param status The new status
   * @returns The updated order
   */
  async updateOrderStatus(
    id: string,
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  ): Promise<Order> {
    const order = await this.findOrderById(id);
    order.status = status;
    return this.orderRepository.save(order);
  }
}
