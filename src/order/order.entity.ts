import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import { OrderStatus } from './order.types';
import { auth } from 'src/auth/entities/auth.entity';
import { product } from 'src/product/entities/product.entity';
import { Exclude } from 'class-transformer';
import { OptosShipmentService } from 'src/optos/optos.shipment.service';

@Entity()
export class order {
  @PrimaryGeneratedColumn()
  id: string;

  /** merchant/company id */
  @Column({ type: 'varchar', default: '1800' })
  business: string;

  /** merchant address id */
  @Column({ type: 'varchar', default: '1802' })
  business_address: string;

  /** user who prepared / owns order */
  @ManyToOne(() => auth, (user) => user.orders, { nullable: true })
  readyBy: auth;
  // Consignee
  @Column({ nullable: true })
  consignee_name: string;

  @Column({ nullable: true })
  consignee_phone: string;

  @Column({ type: 'varchar', nullable: true })
  consignee_city: string;

  @Column({ type: 'varchar', nullable: true })
  consignee_area: string;

  @Column({ nullable: true })
  consignee_address: string;

  // Shipment info
  @Column({ type: 'varchar', nullable: true })
  shipment_types: string;

  @Column({ type: 'varchar', nullable: true })
  quantity: string;

  @Column({ name: 'cod_amount', type: 'varchar', nullable: true })
  cod_amount: string;

  @Column({ type: 'varchar', nullable: true })
  items_description: string;

  @Column({ type: 'varchar', default: '0' })
  is_cod: string;

  @Column({ type: 'varchar', default: '0' })
  has_return: string;

  @Column({ type: 'varchar', nullable: true })
  return_notes: string;

  @Column({ type: 'varchar', nullable: true })
  notes: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @OneToMany(() => orderitem, (item) => item.order, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  items: orderitem[];

  @ManyToOne(() => auth, {
    nullable: true,
  })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'numeric', nullable: true })
  amount: number;

  @BeforeUpdate()
  calculateAmount() {
    if (this.items && this.items.length > 0) {
      this.amount = this.items.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0,
      );
    } else {
      this.amount = 0;
    }
  }

  @Column({ type: 'numeric', nullable: true })
  optos_id: number;

  @Column({ type: 'varchar', nullable: true })
  optos_status: string;
}

@Entity()
export class orderitem {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  order: order;

  @ManyToOne(() => product, (product) => product.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Exclude()
  product: product;

  @Column({ type: 'int', name: 'productId' })
  productId: number;

  @Column({ type: 'varchar', nullable: true })
  sizeName: string;

  @Column({ type: 'varchar', nullable: true })
  colorName: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'numeric', default: '0' })
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
