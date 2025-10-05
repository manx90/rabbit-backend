import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddPriorityToProductCollection1748630659236
  implements MigrationInterface
{
  name = 'AddPriorityToProductCollection1748630659236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product_collection');

    if (table) {
      // Add displayPriority if not exists
      if (!table.findColumnByName('displayPriority')) {
        await queryRunner.addColumn(
          'product_collection',
          new TableColumn({
            name: 'displayPriority',
            type: 'int',
            default: 0,
            comment: 'Display priority (higher number = higher priority)',
          }),
        );
      }

      // Add isPriority if not exists
      if (!table.findColumnByName('isPriority')) {
        await queryRunner.addColumn(
          'product_collection',
          new TableColumn({
            name: 'isPriority',
            type: 'boolean',
            default: false,
            comment: 'Mark as priority collection for special display',
          }),
        );
      }

      // Add index if not exists
      const hasIndex = table.indices.some(
        (idx) => idx.name === 'IDX_PRODUCT_COLLECTION_PRIORITY',
      );

      if (!hasIndex) {
        await queryRunner.createIndex(
          'product_collection',
          new TableIndex({
            name: 'IDX_PRODUCT_COLLECTION_PRIORITY',
            columnNames: ['displayPriority', 'isPriority'],
          }),
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'product_collection',
      'IDX_PRODUCT_COLLECTION_PRIORITY',
    );

    const table = await queryRunner.getTable('product_collection');
    if (table) {
      if (table.findColumnByName('displayPriority')) {
        await queryRunner.dropColumn('product_collection', 'displayPriority');
      }
      if (table.findColumnByName('isPriority')) {
        await queryRunner.dropColumn('product_collection', 'isPriority');
      }
    }
  }
}
