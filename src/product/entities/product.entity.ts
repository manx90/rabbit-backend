import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  BeforeInsert,
  JoinColumn,
  BeforeUpdate,
  // OneToOne,
} from 'typeorm';
import { subCategory, category } from './Category.entity';
import {
  SizeDetail,
  PublishState,
  ColorDetail,
} from '../../common/interfaces/entity.interface';
import { auth } from 'src/auth/entities/auth.entity';

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  isActive: boolean;
  PosterAt: Date | null;
}

@Entity()
export class product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'longtext', nullable: true })
  imgCover: string;

  @Column({ type: 'longtext', nullable: true })
  imgSizeChart: string;

  @Column({ type: 'longtext', nullable: true })
  imgMeasure: string;

  @Column({ type: 'json' })
  sizeDetails: SizeDetail[];

  @Column({
    type: 'enum',
    enum: PublishState,
    default: PublishState.DRAFT,
  })
  publishState: PublishState;

  @Column({ type: 'json', nullable: true })
  colors: ColorDetail[];

  @ManyToOne(() => category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: category;

  @ManyToOne(() => subCategory, (subCategory) => subCategory.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: subCategory;

  @ManyToOne(() => auth, { nullable: true })
  @JoinColumn({ name: 'posterId' })
  poster: auth;

  @Column({ type: 'decimal', default: null })
  quantity: number;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'boolean', default: false })
  isTrending: boolean;

  @Column({ type: 'boolean', default: true })
  isNew: boolean;

  @Column({ type: 'boolean', default: false })
  isBestSeller: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'int', default: 0 })
  sales: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  PosterAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  updatedAt: Date;

  /**
   * Calculate total quantity from all sizes and colors
   */
  getTotalQuantity(): number {
    if (!this.sizeDetails) return 0;

    return this.sizeDetails.reduce((total, size) => {
      const sizeTotal = size.quantities.reduce((sizeSum, colorQty) => {
        return sizeSum + colorQty.quantity;
      }, 0);
      return total + sizeTotal;
    }, 0);
  }

  /**
   * Get all available colors from all sizes
   */
  getAvailableColors(): Array<{ name: string; imgColor?: string }> {
    if (!this.sizeDetails) return [];

    const colorsMap = new Map<string, string>();

    this.sizeDetails.forEach((size) => {
      size.quantities.forEach((colorQty) => {
        if (colorQty.quantity > 0) {
          colorsMap.set(colorQty.colorName, '');
        }
      });
    });

    return Array.from(colorsMap.entries()).map(([name, imgColor]) => ({
      name,
      imgColor,
    }));
  }

  /**
   * Get all available sizes
   */
  getAvailableSizes(): string[] {
    if (!this.sizeDetails) return [];

    return this.sizeDetails
      .filter((size) => size.quantities.some((q) => q.quantity > 0))
      .map((size) => size.sizeName);
  }

  /**
   * Before insert hook - set isActive based on publishState
  //  */
  // @BeforeInsert()
  // @BeforeUpdate()
  // setActiveStatus() {
  //   this.isActive = this.publishState === PublishState.PUBLISHED;
  // }

  /**
   * Before insert hook - validate size details
   */
  @BeforeInsert()
  @BeforeUpdate()
  validateSizeDetails() {
    if (!this.sizeDetails || this.sizeDetails.length === 0) {
      throw new Error('Product must have at least one size detail');
    }

    this.sizeDetails.forEach((size) => {
      if (!size.sizeName || size.price <= 0) {
        throw new Error('Each size must have a valid name and price');
      }

      if (!size.quantities || size.quantities.length === 0) {
        throw new Error('Each size must have at least one color quantity');
      }

      size.quantities.forEach((colorQty) => {
        if (!colorQty.colorName || colorQty.quantity < 0) {
          throw new Error(
            'Each color quantity must have a valid color name and non-negative quantity',
          );
        }
      });
    });
  }

  /**
   * Before insert hook - validate size details
   */
  @BeforeInsert()
  @BeforeUpdate()
  validateTotalQuantity() {
    if (!this.sizeDetails) return;

    const totalQuantity = this.sizeDetails.reduce(
      (total, size) =>
        total +
        size.quantities.reduce((sum, colorQty) => sum + colorQty.quantity, 0),
      0,
    );

    this.quantity = totalQuantity;
  }
}
