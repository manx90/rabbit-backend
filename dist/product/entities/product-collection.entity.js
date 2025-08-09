"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    CollectionStatus: function() {
        return CollectionStatus;
    },
    CollectionType: function() {
        return CollectionType;
    },
    ProductCollection: function() {
        return ProductCollection;
    }
});
const _typeorm = require("typeorm");
const _productentity = require("./product.entity");
const _Categoryentity = require("./Category.entity");
const _authentity = require("../../auth/entities/auth.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var CollectionType = /*#__PURE__*/ function(CollectionType) {
    CollectionType["CATEGORY_BASED"] = "category_based";
    CollectionType["PRODUCT_BASED"] = "product_based";
    CollectionType["MIXED"] = "mixed";
    return CollectionType;
}({});
var CollectionStatus = /*#__PURE__*/ function(CollectionStatus) {
    CollectionStatus["ACTIVE"] = "active";
    CollectionStatus["INACTIVE"] = "inactive";
    CollectionStatus["DRAFT"] = "draft";
    return CollectionStatus;
}({});
let ProductCollection = class ProductCollection {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], ProductCollection.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 255
    }),
    _ts_metadata("design:type", String)
], ProductCollection.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ProductCollection.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: CollectionType,
        default: "mixed"
    }),
    _ts_metadata("design:type", String)
], ProductCollection.prototype, "type", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: CollectionStatus,
        default: "draft"
    }),
    _ts_metadata("design:type", String)
], ProductCollection.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], ProductCollection.prototype, "isFeatured", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'int',
        default: 0
    }),
    _ts_metadata("design:type", Number)
], ProductCollection.prototype, "sortOrder", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'int',
        default: 0
    }),
    _ts_metadata("design:type", Number)
], ProductCollection.prototype, "displayPriority", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], ProductCollection.prototype, "isPriority", void 0);
_ts_decorate([
    (0, _typeorm.ManyToMany)(()=>_Categoryentity.category),
    (0, _typeorm.JoinTable)({
        name: 'collection_categories',
        joinColumn: {
            name: 'collectionId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'categoryId',
            referencedColumnName: 'id'
        }
    }),
    _ts_metadata("design:type", Array)
], ProductCollection.prototype, "categories", void 0);
_ts_decorate([
    (0, _typeorm.ManyToMany)(()=>_Categoryentity.subCategory),
    (0, _typeorm.JoinTable)({
        name: 'collection_subcategories',
        joinColumn: {
            name: 'collectionId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'subCategoryId',
            referencedColumnName: 'id'
        }
    }),
    _ts_metadata("design:type", Array)
], ProductCollection.prototype, "subCategories", void 0);
_ts_decorate([
    (0, _typeorm.ManyToMany)(()=>_productentity.product),
    (0, _typeorm.JoinTable)({
        name: 'collection_products',
        joinColumn: {
            name: 'collectionId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'productId',
            referencedColumnName: 'id'
        }
    }),
    _ts_metadata("design:type", Array)
], ProductCollection.prototype, "products", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'json',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ProductCollection.prototype, "settings", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'json',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ProductCollection.prototype, "metadata", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_authentity.auth, {
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'createdById'
    }),
    _ts_metadata("design:type", typeof _authentity.auth === "undefined" ? Object : _authentity.auth)
], ProductCollection.prototype, "createdBy", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ProductCollection.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ProductCollection.prototype, "updatedAt", void 0);
ProductCollection = _ts_decorate([
    (0, _typeorm.Entity)()
], ProductCollection);

//# sourceMappingURL=product-collection.entity.js.map