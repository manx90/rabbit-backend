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
    category: function() {
        return category;
    },
    subCategory: function() {
        return subCategory;
    }
});
const _typeorm = require("typeorm");
const _classtransformer = require("class-transformer");
const _productentity = require("./product.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let category = class category {
    updateSubCategoryIds() {
        var _this_subCategories;
        this.subCategoryIds = ((_this_subCategories = this.subCategories) === null || _this_subCategories === void 0 ? void 0 : _this_subCategories.map((sub)=>sub.id)) || [];
    }
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], category.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 100,
        unique: true
    }),
    _ts_metadata("design:type", String)
], category.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'longtext',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], category.prototype, "icon", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>subCategory, (sub)=>sub.category, {
        cascade: true
    }),
    _ts_metadata("design:type", Array)
], category.prototype, "subCategories", void 0);
_ts_decorate([
    (0, _typeorm.Column)('simple-array', {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], category.prototype, "subCategoryIds", void 0);
_ts_decorate([
    (0, _typeorm.BeforeInsert)(),
    (0, _typeorm.BeforeUpdate)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], category.prototype, "updateSubCategoryIds", null);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_productentity.product, (prod)=>prod.category),
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", Array)
], category.prototype, "products", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], category.prototype, "isActive", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], category.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], category.prototype, "updatedAt", void 0);
category = _ts_decorate([
    (0, _typeorm.Entity)()
], category);
let subCategory = class subCategory {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], subCategory.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 100
    }),
    _ts_metadata("design:type", String)
], subCategory.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'longtext',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], subCategory.prototype, "icon", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>category, (category)=>category.subCategories, {
        onDelete: 'CASCADE'
    }),
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", typeof category === "undefined" ? Object : category)
], subCategory.prototype, "category", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'categoryId'
    }),
    _ts_metadata("design:type", Number)
], subCategory.prototype, "categoryId", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_productentity.product, (prod)=>prod.subCategory),
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", Array)
], subCategory.prototype, "products", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], subCategory.prototype, "isActive", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], subCategory.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], subCategory.prototype, "updatedAt", void 0);
subCategory = _ts_decorate([
    (0, _typeorm.Entity)()
], subCategory);

//# sourceMappingURL=Category.entity.js.map