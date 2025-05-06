import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from "typeorm";


@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'text'})
  name: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategories: SubCategory[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @Column({type: 'boolean'})
  isActive: boolean;
}

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'text'})
  name: string;

  @ManyToOne(() => Category, (category) => category.subCategories)
  category: Category;

  @OneToMany(() => Product, (product) => product.subCategory)
  products: Product[];

  @Column({type: 'boolean'})
  isActive: boolean;
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'text'})
  name: string;

  @Column({type: 'numeric'})
  priceCover: number;

  @Column({type: 'text'})
  description: string;

  @Column({type: 'bytea', array: true})
  images: Buffer[];

  @Column({type: 'bytea'})
  imgCover: Buffer;

  @Column({type: 'bytea'})
  imgSize: Buffer;

  @Column({type: 'bytea'})
  imgMeasure: Buffer;
  
  @Column({type: 'bytea', array: true})
  imgColors: Buffer[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products)
  subCategory: SubCategory;

  @Column({type: 'numeric'})
  quantity: number;

  @Column({type: 'date'})
  createdAt: Date;

  @Column({type: 'date'})
  updatedAt: Date;

  @Column({type: 'boolean', default: true})
  isActive: boolean;

  @Column({type: 'boolean', default: false})
  isDeleted: boolean;

  @Column({type: 'boolean', default: false})
  isFeatured: boolean;

  @Column({type: 'boolean', default: false})
  isTrending: boolean;

  @Column({type: 'boolean', default: true})
  isNew: boolean; 

  @OneToMany(() => ProductSize, (size) => size.product)
  sizes: ProductSize[];

}

@Entity()
export class ProductSize {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'text'})
  size: string;

  @Column({type: 'numeric'})
  quantity: number;
  @Column({type: 'numeric'})
  price: number;

  @Column({type: 'int'})
  imgColorIndex: number;

  @ManyToOne(() => Product, (product) => product.sizes)
  product: Product;

  @Column({type: 'boolean'})
  isActive: boolean;
}