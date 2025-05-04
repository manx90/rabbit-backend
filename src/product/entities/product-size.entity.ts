import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { ProductColor } from './product-color.entity';

@Entity()
export class ProductSize {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  size: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Product, product => product.sizes)
  product: Product;

  @OneToMany(() => ProductColor, color => color.size)
  colors: ProductColor[];
} 