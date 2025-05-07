import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

interface ColorImage {
  colorName: string;
  imgColor: Buffer;
}

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

  @ManyToOne(() => Category, (category) => category.subCategories)
  category: Category;

  @OneToMany(() => Product, (product) => product.subCategory)
  products: Product[];

  @Column({ type: 'boolean' })
  isActive: boolean;
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

  @Column({ type: 'bytea', array: true, default: null })
  images: Buffer[];

  @Column({ type: 'bytea', default: null })
  imgCover: Buffer;

  @Column({ type: 'bytea', default: null })
  imgSize: Buffer;

  @Column({ type: 'bytea', default: null })
  imgMeasure: Buffer;

  @Column({ type: 'jsonb', default: null })
  imgColors: ColorImage[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products)
  subCategory: SubCategory;

  @Column({ type: 'numeric', default: null })
  quantity: number;

  @Column({ type: 'date', default: new Date() })
  createdAt: Date;

  @Column({ type: 'date', default: null })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'boolean', default: false })
  isTrending: boolean;

  @Column({ type: 'boolean', default: true })
  isNew: boolean;

  @OneToMany(() => ProductSize, (size) => size.product)
  sizes: ProductSize[];
}

@Entity()
export class ProductSize {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  sizeName: string;

  @Column({ type: 'numeric' })
  Price: number;

  @Column({ type: 'jsonb' })
  Colors: { colorName: string; quantity: number }[];

  @ManyToOne(() => Product, (product) => product.sizes)
  product: Product;

  @Column({ type: 'boolean' })
  isActive: boolean;
}
