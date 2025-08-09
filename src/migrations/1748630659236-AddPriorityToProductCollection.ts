import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPriorityToProductCollection1748630659236
  implements MigrationInterface
{
  name = 'AddPriorityToProductCollection1748630659236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('product_collection', [
      new TableColumn({
        name: 'displayPriority',
        type: 'int',
        default: 0,
        comment: 'Display priority (higher number = higher priority)',
      }),
      new TableColumn({
        name: 'isPriority',
        type: 'boolean',
        default: false,
        comment: 'Mark as priority collection for special display',
      }),
    ]);

    // Add index for better performance on priority queries
    await queryRunner.query(
      'CREATE INDEX IDX_PRODUCT_COLLECTION_PRIORITY ON product_collection (displayPriority DESC, isPriority DESC)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'product_collection',
      'IDX_PRODUCT_COLLECTION_PRIORITY',
    );
    await queryRunner.dropColumns('product_collection', [
      'displayPriority',
      'isPriority',
    ]);
  }
}
