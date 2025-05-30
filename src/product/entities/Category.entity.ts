import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { product } from './product.entity';

@Entity()
export class category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string; // Category title

  @OneToMany(() => subCategory, (sub) => sub.category, {
    cascade: true,
  })
  @Exclude()
  subCategories: subCategory[];

  @Column('simple-array', { nullable: true })
  subCategoryIds: number[];

  @BeforeInsert()
  @BeforeUpdate()
  updateSubCategoryIds() {
    this.subCategoryIds = this.subCategories.map((sub) => sub.id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => product, (prod) => prod.category)
  @Exclude()
  products: product[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class subCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string; // SubCategory title

  @ManyToOne(() => category, (category) => category.subCategories, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  category: category;

  @Column({ name: 'categoryId' })
  categoryId: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => product, (prod) => prod.subCategory)
  @Exclude()
  products: product[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
