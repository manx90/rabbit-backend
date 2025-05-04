import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductSize } from './product-size.entity';

@Entity()
export class ProductColor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  colorName: string;

  @Column()
  colorImage: string; // URL or base64 of the color image

  @Column()
  quantity: number;

  @ManyToOne(() => ProductSize, size => size.colors)
  size: ProductSize;
} 