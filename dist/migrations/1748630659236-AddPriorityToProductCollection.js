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
        const table = await queryRunner.getTable('product_collection');
        if (table) {
            // Add displayPriority if not exists
            if (!table.findColumnByName('displayPriority')) {
                await queryRunner.addColumn('product_collection', new _typeorm.TableColumn({
                    name: 'displayPriority',
                    type: 'int',
                    default: 0,
                    comment: 'Display priority (higher number = higher priority)'
                }));
            }
            // Add isPriority if not exists
            if (!table.findColumnByName('isPriority')) {
                await queryRunner.addColumn('product_collection', new _typeorm.TableColumn({
                    name: 'isPriority',
                    type: 'boolean',
                    default: false,
                    comment: 'Mark as priority collection for special display'
                }));
            }
            // Add index if not exists
            const hasIndex = table.indices.some((idx)=>idx.name === 'IDX_PRODUCT_COLLECTION_PRIORITY');
            if (!hasIndex) {
                await queryRunner.createIndex('product_collection', new _typeorm.TableIndex({
                    name: 'IDX_PRODUCT_COLLECTION_PRIORITY',
                    columnNames: [
                        'displayPriority',
                        'isPriority'
                    ]
                }));
            }
        }
    }
    async down(queryRunner) {
        await queryRunner.dropIndex('product_collection', 'IDX_PRODUCT_COLLECTION_PRIORITY');
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
    constructor(){
        this.name = 'AddPriorityToProductCollection1748630659236';
    }
};

//# sourceMappingURL=1748630659236-AddPriorityToProductCollection.js.map