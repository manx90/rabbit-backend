import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderItem } from './order.entity';
import { Product } from '../product/entities/product.entity';
// import { HttpModule } from '@nestjs/axios';
import { OrderRepository } from './order.repository';
@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product])],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}
