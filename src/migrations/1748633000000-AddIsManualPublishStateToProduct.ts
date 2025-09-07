import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsManualPublishStateToProduct1748633000000
  implements MigrationInterface
{
  name = 'AddIsManualPublishStateToProduct1748633000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the missing isManualPublishState column to the product table
    await queryRunner.query(`
      ALTER TABLE \`product\` 
      ADD COLUMN \`isManualPublishState\` tinyint(1) NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the isManualPublishState column
    await queryRunner.query(`
      ALTER TABLE \`product\` 
      DROP COLUMN \`isManualPublishState\`
    `);
  }
}
