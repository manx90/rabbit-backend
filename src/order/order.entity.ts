import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Exclude, Type } from 'class-transformer';
import { Auth } from 'src/auth/auth.entity';
import { Product } from '../product/entities/product.entity';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const business_address = process.env.BUSINESS_ADDRESS;
const buisness = process.env.BUISINESS;

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => Auth, (user) => user.orders, { eager: true })
  @Type(() => Auth)
  readyBy: Auth;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  @Type(() => OrderItem)
  items: OrderItem[];

  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // optemus

  @Column('decimal', { precision: 10, scale: 2 })
  Cod_amount: number;

  @BeforeInsert()
  setCod_amount() {
    // Use the provided Cod_amount instead of calculating from items
    if (!this.Cod_amount) {
      this.Cod_amount = 0;
    }
  }

  @Column({ default: buisness })
  business: number;

  @Column({ default: business_address })
  business_address: number;

  @Column({ nullable: false })
  consignee_name: string;

  @Column({ nullable: false })
  consignee_phone: number;

  @Column({ nullable: false })
  consignee_city: number;

  @Column({ nullable: false })
  consignee_area: number;

  @Column({ default: null })
  consignee_address: string;

  @Column({ nullable: false })
  shipment_types: number;

  @Column({ type: 'text', default: null })
  items_description: string;

  @Column({ default: '1' })
  is_cod: '1' | '0';

  @Column({ nullable: false })
  quantity: number;

  @BeforeInsert()
  setQuantity() {
    this.quantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  @Column({ default: '0' })
  has_return: '1' | '0';

  @Column({ default: null })
  return_notes: string;

  @Column({ default: null })
  notes: string;
}
@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text' })
  size: string;

  @Column({ type: 'text' })
  color: string;

  @ManyToOne(() => Order, (order) => order.items)
  @Exclude({ toPlainOnly: true })
  order: Order;
}
