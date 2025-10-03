import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
@Entity()
export class SizeTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  tableName: string;

  @OneToMany(() => SizeDimension, (size) => size.sizeTable, {
    cascade: true,
  })
  sizeDimensions: SizeDimension[];
}

@Entity()
export class SizeDimension {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  sizeName: string;

  @OneToMany(() => SizeField, (field) => field.sizeDimension, {
    cascade: true,
    eager: true,
  })
  fields: SizeField[];

  @ManyToOne(() => SizeTable, (table) => table.sizeDimensions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tableId' })
  sizeTable: SizeTable;
}

@Entity()
export class SizeField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  fieldName: string;

  @Column({ type: 'varchar', length: 255 })
  fieldValue: string;

  @ManyToOne(() => SizeDimension, (size) => size.fields, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sizeId' })
  sizeDimension: SizeDimension;
}
