"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddPriorityToProductCollection1748630659236", {
    enumerable: true,
    get: function() {
        return AddPriorityToProductCollection1748630659236;
    }
});
const _typeorm = require("typeorm");
let AddPriorityToProductCollection1748630659236 = class AddPriorityToProductCollection1748630659236 {
    async up(queryRunner) {
        await queryRunner.addColumns('product_collection', [
            new _typeorm.TableColumn({
                name: 'displayPriority',
                type: 'int',
                default: 0,
                comment: 'Display priority (higher number = higher priority)'
            }),
            new _typeorm.TableColumn({
                name: 'isPriority',
                type: 'boolean',
                default: false,
                comment: 'Mark as priority collection for special display'
            })
        ]);
        // Add index for better performance on priority queries
        await queryRunner.query('CREATE INDEX IDX_PRODUCT_COLLECTION_PRIORITY ON product_collection (displayPriority DESC, isPriority DESC)');
    }
    async down(queryRunner) {
        await queryRunner.dropIndex('product_collection', 'IDX_PRODUCT_COLLECTION_PRIORITY');
        await queryRunner.dropColumns('product_collection', [
            'displayPriority',
            'isPriority'
        ]);
    }
    constructor(){
        this.name = 'AddPriorityToProductCollection1748630659236';
    }
};

//# sourceMappingURL=1748630659236-AddPriorityToProductCollection.js.map