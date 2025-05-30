import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { OrderStatus } from './order.types';
import { Auth } from 'src/auth/entities/auth.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** merchant/company id */
  @Column('int')
  business: number;

  /** merchant address id */
  @Column('int')
  business_address: number;

  /** user who prepared / owns order */
  @ManyToOne(() => Auth, (user) => user.orders, { nullable: true, eager: true })
  readyBy?: Auth;

  // Consignee
  @Column()
  consignee_name: string;

  @Column()
  consignee_phone: string;

  @Column('int')
  consignee_city: number;

  @Column('int')
  consignee_area: number;

  @Column()
  consignee_address: string;

  // Shipment info
  @Column('int')
  shipment_types: number;

  @Column('int')
  quantity: number;

  @Column({ name: 'Cod_amount', type: 'numeric', default: 0 })
  Cod_amount: number;

  @Column()
  items_description: string;

  @Column({ type: 'boolean', default: false })
  is_cod: boolean;

  @Column({ type: 'boolean', default: false })
  has_return: boolean;

  @Column({ nullable: true })
  return_notes: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column()
  sizeName: string;

  @Column()
  colorName: string;

  @Column('int')
  quantity: number;
}
