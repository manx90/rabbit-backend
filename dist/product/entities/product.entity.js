/* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable @typescript-eslint/no-unsafe-call */ /* eslint-disable @typescript-eslint/no-unsafe-return */ /* eslint-disable @typescript-eslint/no-unsafe-assignment */ "use strict";
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
    Season: function() {
        return Season;
    },
    product: function() {
        return product;
    }
});
const _classtransformer = require("class-transformer");
const _authentity = require("../../auth/entities/auth.entity");
const _sizeTableentity = require("./sizeTable.entity");
const _typeorm = require("typeorm");
const _entityinterface = require("../../common/interfaces/entity.interface");
const _Categoryentity = require("./Category.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var Season = /*#__PURE__*/ function(Season) {
    Season["winter"] = "winter";
    Season["summer"] = "summer";
    Season["spring_autumn"] = "spring_autumn";
    Season["all"] = "all";
    return Season;
}({});
let product = class product {
    /**
   * Calculate total quantity from all sizes and colors
   */ getTotalQuantity() {
        if (!this.sizeDetails) return 0;
        return this.sizeDetails.reduce((total, size)=>{
            const sizeTotal = size.quantities.reduce((sizeSum, colorQty)=>{
                return sizeSum + colorQty.quantity;
            }, 0);
            return total + sizeTotal;
        }, 0);
    }
    /**
   * Get all available colors from all sizes
   */ getAvailableColors() {
        if (!this.sizeDetails) return [];
        const colorsMap = new Map();
        this.sizeDetails.forEach((size)=>{
            size.quantities.forEach((colorQty)=>{
                if (colorQty.quantity > 0) {
                    colorsMap.set(colorQty.colorName, '');
                }
            });
        });
        return Array.from(colorsMap.entries()).map(([name, imgColor])=>({
                name,
                imgColor
            }));
    }
    /**
   * Get all available sizes
   */ getAvailableSizes() {
        if (!this.sizeDetails) return [];
        return this.sizeDetails.filter((size)=>size.quantities.some((q)=>q.quantity > 0)).map((size)=>size.sizeName);
    }
    // schedule publish
    updatePublishState() {
        // Skip automatic state update if manually set (only if column exists)
        if (this.isManualPublishState === true) {
            return;
        }
        if (this.datePublished && this.datePublished > new Date()) {
            this.publishState = _entityinterface.PublishState.DRAFT;
        } else {
            this.publishState = _entityinterface.PublishState.PUBLISHED;
        }
    }
    /**
   * Before insert hook - validate size details
   */ validateSizeDetails() {
        if (!this.sizeDetails || this.sizeDetails.length === 0) {
            throw new Error('Product must have at least one size detail');
        }
        this.sizeDetails.forEach((size)=>{
            if (!size.sizeName || size.price <= 0) {
                throw new Error('Each size must have a valid name and price');
            }
            if (!size.quantities || size.quantities.length === 0) {
                throw new Error('Each size must have at least one color quantity');
            }
            size.quantities.forEach((colorQty)=>{
                if (!colorQty.colorName || colorQty.quantity < 0) {
                    throw new Error('Each color quantity must have a valid color name and non-negative quantity');
                }
            });
        });
    }
    /**
   * Before insert hook - validate size details
   */ validateTotalQuantity() {
        if (!this.sizeDetails) return;
        const totalQuantity = this.sizeDetails.reduce((total, size)=>total + size.quantities.reduce((sum, colorQty)=>sum + colorQty.quantity, 0), 0);
        this.quantity = totalQuantity;
    }
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], product.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 255
    }),
    _ts_metadata("design:type", String)
], product.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: Season,
        default: "all",
        nullable: true
    }),
    _ts_metadata("design:type", String)
], product.prototype, "season", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'simple-array',
        nullable: true
    }),
    (0, _classtransformer.Transform)(({ value })=>{
        const newVal = value === null || value === void 0 ? void 0 : value.map((item)=>item.trim());
        return newVal;
    }),
    _ts_metadata("design:type", Array)
], product.prototype, "wordKeys", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'longtext',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], product.prototype, "videoLink", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], product.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'json',
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], product.prototype, "images", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'simple-array',
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], product.prototype, "productIdsCollection", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'longtext',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], product.prototype, "imgCover", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'longtext',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], product.prototype, "imgSizeChart", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'longtext',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], product.prototype, "imgMeasure", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'json'
    }),
    _ts_metadata("design:type", Array)
], product.prototype, "sizeDetails", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _entityinterface.PublishState,
        default: _entityinterface.PublishState.PUBLISHED
    }),
    _ts_metadata("design:type", typeof _entityinterface.PublishState === "undefined" ? Object : _entityinterface.PublishState)
], product.prototype, "publishState", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: false,
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], product.prototype, "isManualPublishState", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'json',
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], product.prototype, "colors", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_Categoryentity.category, (category)=>category.products),
    (0, _typeorm.JoinColumn)({
        name: 'categoryId'
    }),
    _ts_metadata("design:type", Object)
], product.prototype, "category", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_Categoryentity.subCategory, (subCategory)=>subCategory.products, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'subCategoryId'
    }),
    _ts_metadata("design:type", typeof _Categoryentity.subCategory === "undefined" ? Object : _Categoryentity.subCategory)
], product.prototype, "subCategory", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_authentity.auth, {
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'posterId'
    }),
    _ts_metadata("design:type", Object)
], product.prototype, "poster", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'decimal',
        default: null
    }),
    _ts_metadata("design:type", Number)
], product.prototype, "quantity", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], product.prototype, "isFeatured", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], product.prototype, "isTrending", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], product.prototype, "isNew", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], product.prototype, "isBestSeller", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], product.prototype, "isDeleted", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'int',
        default: 0
    }),
    _ts_metadata("design:type", Number)
], product.prototype, "sales", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamp',
        default: null,
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], product.prototype, "datePublished", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_sizeTableentity.SizeTable, {
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'sizeTableId'
    }),
    _ts_metadata("design:type", Object)
], product.prototype, "sizeTable", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamp',
        default: ()=>'CURRENT_TIMESTAMP'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], product.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamp',
        default: null,
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], product.prototype, "PosterAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamp',
        default: null,
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], product.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.AfterLoad)(),
    (0, _typeorm.AfterInsert)(),
    (0, _typeorm.AfterUpdate)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], product.prototype, "updatePublishState", null);
_ts_decorate([
    (0, _typeorm.BeforeInsert)(),
    (0, _typeorm.BeforeUpdate)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], product.prototype, "validateSizeDetails", null);
_ts_decorate([
    (0, _typeorm.BeforeInsert)(),
    (0, _typeorm.BeforeUpdate)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], product.prototype, "validateTotalQuantity", null);
product = _ts_decorate([
    (0, _typeorm.Entity)()
], product);

//# sourceMappingURL=product.entity.js.map