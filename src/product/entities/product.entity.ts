/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Transform } from 'class-transformer';
import { auth } from 'src/auth/entities/auth.entity';
import { SizeTable } from './sizeTable.entity';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  ColorDetail,
  PublishState,
  SizeDetail,
} from '../../common/interfaces/entity.interface';
import { category, subCategory } from './Category.entity';

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

export enum Season {
  winter = 'winter',
  summer = 'summer',
  spring_autumn = 'spring_autumn',
  all = 'all',
}

@Entity()
export class product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: Season,
    default: Season.all,
    nullable: true,
  })
  season: Season;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  @Transform(({ value }) => {
    const newVal = value?.map((item) => item.trim());
    return newVal;
  })
  wordKeys: string[];

  @Column({ type: 'longtext', nullable: true })
  videoLink: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'simple-array', nullable: true })
  productIdsCollection: number[];

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
    default: PublishState.PUBLISHED,
  })
  publishState: PublishState;

  @Column({ type: 'boolean', default: false, nullable: true })
  isManualPublishState: boolean;

  @Column({ type: 'json', nullable: true })
  colors: ColorDetail[];

  @ManyToOne(() => category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: { id: number; name: string };

  @ManyToOne(() => subCategory, (subCategory) => subCategory.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: subCategory;

  @ManyToOne(() => auth, { nullable: true })
  @JoinColumn({ name: 'posterId' })
  poster: { id: string; username: string };

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

  @Column({
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  datePublished: Date;

  @ManyToOne(() => SizeTable, { nullable: true })
  @JoinColumn({ name: 'sizeTableId' })
  sizeTable: SizeTable | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  PosterAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  updatedAt: Date;
  Product: { id: string; username: string };

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

  // schedule publish
  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  updatePublishState() {
    // Skip automatic state update if manually set (only if column exists)
    if (this.isManualPublishState === true) {
      return;
    }

    if (this.datePublished && this.datePublished > new Date()) {
      this.publishState = PublishState.DRAFT;
    } else {
      this.publishState = PublishState.PUBLISHED;
    }
  }

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
