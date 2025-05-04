import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../product/entities/product.entity';
import { ProductSize } from '../../product/entities/product-size.entity';
import { ProductColor } from '../../product/entities/product-color.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => ProductSize)
  size: ProductSize;

  @ManyToOne(() => ProductColor)
  color: ProductColor;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
} 