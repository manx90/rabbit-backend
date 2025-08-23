/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { order, orderitem } from './order.entity';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { product } from 'src/product/entities/product.entity';
import { OrderStatus } from './order.types';
import { auth } from 'src/auth/entities/auth.entity';
import { OptosShipmentService } from 'src/optos/optos.shipment.service';
import { CreateShipmentDto } from 'src/optos/optos.dto';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(order)
    private readonly orderRepo: Repository<order>,
    @InjectRepository(product)
    private readonly productRepo: Repository<product>,
    @InjectRepository(auth)
    private readonly authRepo: Repository<auth>,
    private readonly optosService: OptosShipmentService,
  ) {}

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

      // Check if there's enough quantity for this specific size and color
      if (color.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient quantity. Available: ${color.quantity}, Requested: ${item.quantity} for product ${product.id} with size ${item.sizeName} and color ${item.colorName}`,
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

      // Update the specific color quantity for this size
      color.quantity -= item.quantity;
      await this.productRepo.save(product);
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
    Order.quantity = dto.items
      .reduce((total, item) => total + item.quantity, 0)
      .toString();
    Order.items_description = dto.items_description;
    Order.is_cod = dto.is_cod;
    Order.cod_amount = Order.amount.toString();
    Order.has_return = dto.has_return;
    Order.return_notes = dto.return_notes;
    Order.notes = dto.notes;

    //optos create shipment
    const shipmentDto: CreateShipmentDto = {
      consignee_name: dto.consignee_name,
      consignee_phone: dto.consignee_phone,
      consignee_city: dto.consignee_city,
      consignee_area: dto.consignee_area,
      consignee_address: dto.consignee_address,
      shipment_types: dto.shipment_types,
      quantity: Order.quantity,
      items_description: dto.items_description,
      is_cod: dto.is_cod === '1' ? '1' : '0',
      cod_amount: Order.amount.toString(),
      has_return: dto.has_return === '1' ? '1' : '0',
      return_notes: dto.return_notes,
      notes: dto.notes,
    };
    await this.optosService.createShipment(shipmentDto).then((res) => {
      Order.optos_id = res.id;
      Order.optos_status = res.status;
    });
    // Update the order with the calculated amount
    return this.orderRepo.save(savedOrder);
  }
  async updateOrder(id: string, orderDto: UpdateOrderDto): Promise<order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    // Safely update string fields
    if (orderDto.consignee_name) order.consignee_name = orderDto.consignee_name;
    if (orderDto.consignee_phone)
      order.consignee_phone = orderDto.consignee_phone;
    if (orderDto.consignee_city) order.consignee_city = orderDto.consignee_city;
    if (orderDto.consignee_area) order.consignee_area = orderDto.consignee_area;
    if (orderDto.consignee_address)
      order.consignee_address = orderDto.consignee_address;
    if (orderDto.shipment_types) order.shipment_types = orderDto.shipment_types;
    if (orderDto.items_description)
      order.items_description = orderDto.items_description;
    if (orderDto.return_notes) order.return_notes = orderDto.return_notes;
    if (orderDto.notes) order.notes = orderDto.notes;

    if (orderDto.is_cod) {
      order.is_cod = orderDto.is_cod;
    }

    if (orderDto.has_return) {
      order.has_return = orderDto.has_return;
    }

    if (orderDto.items) {
      const orderItems = await Promise.all(
        orderDto.items.map(async (item) => {
          const orderItem = new orderitem();
          const product = await this.productRepo.findOne({
            where: { id: item.productId },
            relations: ['category', 'subCategory'],
          });
          if (!product) {
            throw new BadRequestException(
              `Product ${item.productId} not found`,
            );
          }
          const size = product.sizeDetails.find(
            (size) => size.sizeName === item.sizeName,
          );
          if (!size) {
            throw new BadRequestException(
              `Size ${item.sizeName} not found in product ${product.id}`,
            );
          }
          const color = size.quantities.find(
            (q) => q.colorName === item.colorName,
          );
          if (!color) {
            throw new BadRequestException(
              `Color ${item.colorName} not found in product ${product.id} with size ${item.sizeName}`,
            );
          }
          orderItem.product = product; // Set the product object
          orderItem.productId = product.id;
          orderItem.sizeName = size.sizeName;
          orderItem.colorName = color.colorName;
          orderItem.quantity = item.quantity;
          orderItem.order = order;
          return orderItem;
        }),
      );
      order.items = orderItems;
      // Update the order with the new items
      return this.orderRepo.save(order);
    }
    return order;
  }

  async updateOrderStatusToReadied(id: string): Promise<order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    order.status = OrderStatus.READIED;
    const updatedOrder = await this.orderRepo.save(order);
    return updatedOrder;
  }

  async updateOrderStatusToShipped(id: string): Promise<void> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    order.status = OrderStatus.SHIPPED;
    await this.orderRepo.save(order);
    return;
  }

  async updateOrderStatusToCancelled(id: string): Promise<void> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    // Return all items to inventory before cancelling the order
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        if (item.product && item.product.sizeDetails) {
          // Find the specific size and color combination
          const sizeDetail = item.product.sizeDetails.find(
            (size) => size.sizeName === item.sizeName,
          );

          if (sizeDetail) {
            const colorQuantity = sizeDetail.quantities.find(
              (colorQty) => colorQty.colorName === item.colorName,
            );

            if (colorQuantity) {
              // Return the quantity back to inventory
              colorQuantity.quantity += item.quantity;
            }
          }

          // Save the updated product
          await this.orderRepo.manager.save(item.product);
        }
      }
    }

    order.status = OrderStatus.CANCELLED;
    await this.orderRepo.save(order);
  }

  async getAllOrders(): Promise<order[]> {
    const orders = await this.orderRepo.find();
    for (const order of orders) {
      if (order.optos_id) {
        await this.updateOrderOptosStatus(order.optos_id);
      }
    }
    const finalOrders = await this.orderRepo.find();
    return finalOrders;
  }

  async getOrderById(id: string): Promise<order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  async getOrdersByStatus(status: OrderStatus): Promise<order[]> {
    return this.orderRepo.find({ where: { status } });
  }

  async deleteOrder(id: string): Promise<void> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    await this.orderRepo.remove(order);
  }

  async addReadyBy(id: string, readyById: string): Promise<order> {
    const order = await this.getOrderById(id);
    const readyBy = await this.authRepo.findOne({ where: { id: readyById } });
    if (!readyBy) {
      throw new NotFoundException(`Ready by user ${readyById} not found`);
    }
    const readyByUser = new auth();
    readyByUser.username = readyBy.username;
    order.readyBy = readyByUser;
    const optos: CreateShipmentDto = {
      consignee_name: order.consignee_name,
      consignee_phone: order.consignee_phone,
      consignee_city: String(order.consignee_city),
      consignee_area: String(order.consignee_area),
      consignee_address: order.consignee_address,
      shipment_types: String(order.shipment_types),
      quantity: String(order.quantity),
      items_description: order.items_description,
      is_cod: order.is_cod ? '1' : '0',
      cod_amount: String(order.cod_amount),
      has_return: order.has_return ? '1' : '0',
      return_notes: order.return_notes,
      notes: order.notes,
    };
    await this.optosService.createShipment(optos);
    return this.orderRepo.save(order);
  }

  async updateOrderOptosStatus(optosId: number): Promise<order> {
    const order = await this.orderRepo.findOne({
      where: { optos_id: optosId },
    });
    if (!order) {
      throw new NotFoundException(`Order with optos_id ${optosId} not found`);
    }
    const res = await this.optosService.getShipment({ id: optosId });

    // Add null checks to prevent the error
    if (res && res[0] && res[0].data && res[0].data[0]) {
      console.log(res[0].data[0].status);
      order.optos_status = res[0].data[0].status;
    } else {
      console.log(`No shipment data found for optos_id: ${optosId}`);
      // You can set a default status or leave it as is
      order.optos_status = order.optos_status || '';
    }

    return await this.orderRepo.save(order);
  }

  async deleteAllOrders(): Promise<void> {
    await this.orderRepo.createQueryBuilder().delete().execute();
  }

  async length(): Promise<number> {
    return this.orderRepo.count();
  }
}
