"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpdateSeasonEnumValues1748632000000", {
    enumerable: true,
    get: function() {
        return UpdateSeasonEnumValues1748632000000;
    }
});
let UpdateSeasonEnumValues1748632000000 = class UpdateSeasonEnumValues1748632000000 {
    async up(queryRunner) {
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
    async down(queryRunner) {
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
    constructor(){
        this.name = 'UpdateSeasonEnumValues1748632000000';
    }
};

//# sourceMappingURL=1748632000000-UpdateSeasonEnumValues.js.map