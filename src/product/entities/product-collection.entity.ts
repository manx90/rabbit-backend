import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { product } from './product.entity';
import { category, subCategory } from './Category.entity';
import { auth } from 'src/auth/entities/auth.entity';

export enum CollectionType {
  CATEGORY_BASED = 'category_based',
  PRODUCT_BASED = 'product_based',
  MIXED = 'mixed',
}

export enum CollectionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
}

@Entity()
export class ProductCollection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CollectionType,
    default: CollectionType.MIXED,
  })
  type: CollectionType;

  @Column({
    type: 'enum',
    enum: CollectionStatus,
    default: CollectionStatus.DRAFT,
  })
  status: CollectionStatus;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'int', default: 0 })
  displayPriority: number;

  @Column({ type: 'boolean', default: false })
  isPriority: boolean;

  // For category-based collections
  @ManyToMany(() => category)
  @JoinTable({
    name: 'collection_categories',
    joinColumn: { name: 'collectionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: category[];

  // For subcategory-based collections
  @ManyToMany(() => subCategory)
  @JoinTable({
    name: 'collection_subcategories',
    joinColumn: { name: 'collectionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'subCategoryId', referencedColumnName: 'id' },
  })
  subCategories: subCategory[];

  // For product-based collections
  @ManyToMany(() => product)
  @JoinTable({
    name: 'collection_products',
    joinColumn: { name: 'collectionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'productId', referencedColumnName: 'id' },
  })
  products: product[];

  // Collection settings
  @Column({ type: 'json', nullable: true })
  settings: {
    maxProducts?: number;
    showOutOfStock?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    includeSubcategories?: boolean;
  };

  // Metadata
  @Column({ type: 'json', nullable: true })
  metadata: {
    tags?: string[];
    season?: string;
    discount?: number;
    validFrom?: Date;
    validTo?: Date;
  };

  @ManyToOne(() => auth, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: auth;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
