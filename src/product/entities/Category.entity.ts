import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  category: string;  

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategories: SubCategory[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @Column({ type: 'boolean' })
  isActive: boolean;
}

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @ManyToOne(() => Category, (category) => category.subCategories, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @OneToMany(() => Product, (product) => product.subCategory)
  products: Product[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
