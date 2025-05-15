import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { Category, SubCategory } from './Category.entity';
import { ColorWithSizes } from './../interface/entity.interface';

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  isActive: boolean;
  PosterAt: Date | null;
  setIsActive?: () => void;
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'numeric' })
  priceCover: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', default: null })
  images: string[];

  @Column({ type: 'jsonb', default: null })
  imgCover: string;

  @Column({ type: 'jsonb', default: null })
  imgSize: string;

  @Column({ type: 'jsonb', default: null })
  imgMeasure: string;

  @Column({ type: 'jsonb', default: null })
  colorsWithSizes: ColorWithSizes[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products)
  subCategory: SubCategory;

  @Column({ type: 'numeric', default: null })
  quantity: number;

  @Column({ type: 'date', default: new Date() })
  createdAt: Date;

  @Column({ type: 'date', default: null })
  PosterAt: Date;

  @Column({ type: 'date', default: null })
  updatedAt: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @BeforeInsert()
  setIsActive() {
    this.isActive = this.PosterAt === null;
  }

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'boolean', default: false })
  isTrending: boolean;

  @Column({ type: 'boolean', default: true })
  isNew: boolean;

  @Column({ type: 'boolean', default: false })
  isBestSeller: boolean;
}
