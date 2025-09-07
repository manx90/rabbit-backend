"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddIsManualPublishStateToProduct1748633000000", {
    enumerable: true,
    get: function() {
        return AddIsManualPublishStateToProduct1748633000000;
    }
});
let AddIsManualPublishStateToProduct1748633000000 = class AddIsManualPublishStateToProduct1748633000000 {
    async up(queryRunner) {
        // Add the missing isManualPublishState column to the product table
        await queryRunner.query(`
      ALTER TABLE \`product\` 
      ADD COLUMN \`isManualPublishState\` tinyint(1) NOT NULL DEFAULT 0
    `);
    }
    async down(queryRunner) {
        // Remove the isManualPublishState column
        await queryRunner.query(`
      ALTER TABLE \`product\` 
      DROP COLUMN \`isManualPublishState\`
    `);
    }
    constructor(){
        this.name = 'AddIsManualPublishStateToProduct1748633000000';
    }
};

//# sourceMappingURL=1748633000000-AddIsManualPublishStateToProduct.js.map