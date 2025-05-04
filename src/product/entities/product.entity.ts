import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { SubCategory } from './sub-category.entity';
import { ProductSize } from './product-size.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  price: number;

  @Column()
  description: string;

  @Column({ default: 0 })
  Quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Category)
  category: Category;

  @ManyToOne(() => SubCategory)
  subCategory: SubCategory;

  @OneToMany(() => ProductSize, size => size.product)
  sizes: ProductSize[];

  @Column('text', { array: true, nullable: true }) // ← نخزن Base64 لكل صورة
  images: string[];
}
