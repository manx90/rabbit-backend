import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';
import { OrderStatus } from './order.types';
import { auth } from 'src/auth/entities/auth.entity';
import { product } from 'src/product/entities/product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class order {
  @PrimaryGeneratedColumn()
  id: string;

  /** merchant/company id */
  // @Column('int', { default: 1 })
  // business: number;

  // /** merchant address id */
  // @Column('int')
  // business_address: number;

  /** user who prepared / owns order */
  @ManyToOne(() => auth, (user) => user.orders, { nullable: true })
  readyBy: auth;
  // Consignee
  @Column({ nullable: true })
  consignee_name: string;

  @Column({ nullable: true })
  consignee_phone: string;

  @Column('int', { nullable: true })
  consignee_city: number;

  @Column('int', { nullable: true })
  consignee_area: number;

  @Column({ nullable: true })
  consignee_address: string;

  // Shipment info
  @Column('int', { nullable: true })
  shipment_types: number;

  @Column('int', { nullable: true })
  quantity: number;

  @Column({ name: 'Cod_amount', type: 'numeric', default: 0 })
  Cod_amount: number;

  @Column({ nullable: true })
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

  @OneToMany(() => orderitem, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: orderitem[];

  @ManyToOne(() => auth, {
    nullable: true,
  })
  @JoinColumn({ name: 'readyBy', referencedColumnName: 'id' })
  readyBy: auth;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'numeric', nullable: true })
  amount: number;

  @BeforeUpdate()
  calculateAmount() {
    if (this.items && this.items.length > 0) {
      this.amount = this.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
    } else {
      this.amount = 0;
    }
  }

  // @UpdateDateColumn()
  // updatedAt: Date;
  // @ManyToOne('Auth', { onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'readyBy' })
  // readyBy: any; // Type as any to avoid circular dependency issues
}

@Entity()
export class orderitem {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => order, (order) => order.items, { onDelete: 'CASCADE' })
  @Exclude()
  order: order;

  @ManyToOne(() => product, (product) => product.id)
  @Exclude()
  product: product;

  @Column({ name: 'productId' })
  productId: number;

  @Column({ nullable: true })
  sizeName: string;

  @Column({ nullable: true })
  colorName: string;

  @Column('int')
  quantity: number;

  @Column()
  price: number;

  @BeforeInsert()
  @BeforeUpdate()
  getPrice(): void {
    const price = this.product.sizeDetails.map((size) => {
      if (size.sizeName === this.sizeName) {
        return size.price;
      }
    });
    this.price = (price.find((p) => p !== undefined) as number) || 0;
  }
}
