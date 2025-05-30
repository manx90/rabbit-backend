import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReadyByToOrder1748630659234 implements MigrationInterface {
  name = 'AddReadyByToOrder1748630659234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_904370c093ceea4369659a3c810\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Product\` ADD CONSTRAINT \`FK_896e2e0f6dfa6f80117a79e1d7e\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Product\` ADD CONSTRAINT \`FK_2646f6bdf95330a9d7601b90f1e\` FOREIGN KEY (\`subCategoryId\`) REFERENCES \`subcategories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Product\` ADD CONSTRAINT \`FK_57cfafda94d308c3a0d2f9df396\` FOREIGN KEY (\`posterId\`) REFERENCES \`auths\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_904370c093ceea4369659a3c810\` FOREIGN KEY (\`productId\`) REFERENCES \`Product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_904370c093ceea4369659a3c810\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Product\` DROP FOREIGN KEY \`FK_57cfafda94d308c3a0d2f9df396\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Product\` DROP FOREIGN KEY \`FK_2646f6bdf95330a9d7601b90f1e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Product\` DROP FOREIGN KEY \`FK_896e2e0f6dfa6f80117a79e1d7e\``,
    );
    await queryRunner.query(`DROP TABLE \`Product\``);
    await queryRunner.query(
      `ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_904370c093ceea4369659a3c810\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
