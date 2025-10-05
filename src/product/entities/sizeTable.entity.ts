import { Column, Entity, PrimaryColumn, Generated, OneToMany } from 'typeorm';
import { product } from './product.entity';
import { SizeTableData } from '../interfaces/size-table.interface';

@Entity()
export class SizeTable {
  @PrimaryColumn('char', { length: 36 })
  @Generated('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  tableName: string;

  @Column({ type: 'json' })
  data: SizeTableData;

  @OneToMany(() => product, (product) => product.sizeTable)
  products: product[];
}
