import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSeasonEnumValues1748632000000 implements MigrationInterface {
  name = 'UpdateSeasonEnumValues1748632000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, modify the column to allow larger values temporarily
    await queryRunner.query(`
      ALTER TABLE product 
      MODIFY season VARCHAR(50) NULL
    `);

    // Update existing Arabic season values to English
    await queryRunner.query(`
      UPDATE product 
      SET season = CASE 
        WHEN season = 'الصيف' THEN 'summer'
        WHEN season = 'الربيع + الخريف' THEN 'spring_autumn'
        WHEN season = 'الشتاء' THEN 'winter'
        WHEN season = 'كل الفصول' THEN 'all'
        ELSE 'all'
      END
    `);

    // Now change the column back to enum with new values
    await queryRunner.query(`
      ALTER TABLE product 
      MODIFY season enum('winter','summer','spring_autumn','all') 
      DEFAULT 'all' NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // First, modify the column to allow larger values temporarily
    await queryRunner.query(`
      ALTER TABLE product 
      MODIFY season VARCHAR(50) NULL
    `);

    // Revert English season values back to Arabic
    await queryRunner.query(`
      UPDATE product 
      SET season = CASE 
        WHEN season = 'summer' THEN 'الصيف'
        WHEN season = 'spring_autumn' THEN 'الربيع + الخريف'
        WHEN season = 'winter' THEN 'الشتاء'
        WHEN season = 'all' THEN 'كل الفصول'
        ELSE 'كل الفصول'
      END
    `);

    // Change the column back to original enum with Arabic values
    await queryRunner.query(`
      ALTER TABLE product 
      MODIFY season enum('الصيف','الربيع + الخريف','الشتاء','كل الفصول') 
      DEFAULT 'كل الفصول' NULL
    `);
  }
}

