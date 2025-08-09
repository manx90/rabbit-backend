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
    CollectionMetadataDto: function() {
        return CollectionMetadataDto;
    },
    CollectionSettingsDto: function() {
        return CollectionSettingsDto;
    },
    CreateProductCollectionDto: function() {
        return CreateProductCollectionDto;
    },
    ProductCollectionResponseDto: function() {
        return ProductCollectionResponseDto;
    },
    UpdateProductCollectionDto: function() {
        return UpdateProductCollectionDto;
    }
});
const _swagger = require("@nestjs/swagger");
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
const _productcollectionentity = require("../entities/product-collection.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CollectionSettingsDto = class CollectionSettingsDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 50
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CollectionSettingsDto.prototype, "maxProducts", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: true
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CollectionSettingsDto.prototype, "showOutOfStock", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'createdAt'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CollectionSettingsDto.prototype, "sortBy", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: [
            'ASC',
            'DESC'
        ],
        example: 'DESC'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CollectionSettingsDto.prototype, "sortOrder", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: true
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CollectionSettingsDto.prototype, "includeSubcategories", void 0);
let CollectionMetadataDto = class CollectionMetadataDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: [
            'summer',
            'discount'
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], CollectionMetadataDto.prototype, "tags", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'summer'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CollectionMetadataDto.prototype, "season", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 20
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CollectionMetadataDto.prototype, "discount", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: '2024-06-01'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CollectionMetadataDto.prototype, "validFrom", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: '2024-08-31'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CollectionMetadataDto.prototype, "validTo", void 0);
let CreateProductCollectionDto = class CreateProductCollectionDto {
    constructor(){
        this.type = _productcollectionentity.CollectionType.MIXED;
        this.status = _productcollectionentity.CollectionStatus.ACTIVE;
        this.isFeatured = false;
        this.sortOrder = 0;
        this.displayPriority = 0;
        this.isPriority = false;
    }
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'Summer Collection with Discount'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateProductCollectionDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'Best summer products with special discounts'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateProductCollectionDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: _productcollectionentity.CollectionType,
        example: _productcollectionentity.CollectionType.MIXED,
        default: _productcollectionentity.CollectionType.MIXED
    }),
    (0, _classvalidator.IsEnum)(_productcollectionentity.CollectionType),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof _productcollectionentity.CollectionType === "undefined" ? Object : _productcollectionentity.CollectionType)
], CreateProductCollectionDto.prototype, "type", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: _productcollectionentity.CollectionStatus,
        default: _productcollectionentity.CollectionStatus.ACTIVE
    }),
    (0, _classvalidator.IsEnum)(_productcollectionentity.CollectionStatus),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof _productcollectionentity.CollectionStatus === "undefined" ? Object : _productcollectionentity.CollectionStatus)
], CreateProductCollectionDto.prototype, "status", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: false
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CreateProductCollectionDto.prototype, "isFeatured", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 0
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateProductCollectionDto.prototype, "sortOrder", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 1,
        description: 'Display priority (higher number = higher priority)'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateProductCollectionDto.prototype, "displayPriority", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: false,
        description: 'Mark as priority collection for special display'
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CreateProductCollectionDto.prototype, "isPriority", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: [
            1,
            2,
            3
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ArrayMaxSize)(10, {
        message: 'Maximum 10 categories allowed'
    }),
    _ts_metadata("design:type", Array)
], CreateProductCollectionDto.prototype, "categoryIds", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: [
            1,
            2,
            3
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ArrayMaxSize)(20, {
        message: 'Maximum 20 subcategories allowed'
    }),
    _ts_metadata("design:type", Array)
], CreateProductCollectionDto.prototype, "subCategoryIds", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: [
            1,
            2,
            3
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ArrayMaxSize)(10, {
        message: 'Maximum 10 products allowed'
    }),
    _ts_metadata("design:type", Array)
], CreateProductCollectionDto.prototype, "productIds", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)(),
    (0, _classvalidator.IsObject)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>CollectionSettingsDto),
    _ts_metadata("design:type", typeof CollectionSettingsDto === "undefined" ? Object : CollectionSettingsDto)
], CreateProductCollectionDto.prototype, "settings", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)(),
    (0, _classvalidator.IsObject)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>CollectionMetadataDto),
    _ts_metadata("design:type", typeof CollectionMetadataDto === "undefined" ? Object : CollectionMetadataDto)
], CreateProductCollectionDto.prototype, "metadata", void 0);
let UpdateProductCollectionDto = class UpdateProductCollectionDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'Summer Collection with Discount'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateProductCollectionDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'Best summer products with special discounts'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateProductCollectionDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: _productcollectionentity.CollectionType
    }),
    (0, _classvalidator.IsEnum)(_productcollectionentity.CollectionType),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof _productcollectionentity.CollectionType === "undefined" ? Object : _productcollectionentity.CollectionType)
], UpdateProductCollectionDto.prototype, "type", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: _productcollectionentity.CollectionStatus
    }),
    (0, _classvalidator.IsEnum)(_productcollectionentity.CollectionStatus),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof _productcollectionentity.CollectionStatus === "undefined" ? Object : _productcollectionentity.CollectionStatus)
], UpdateProductCollectionDto.prototype, "status", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: false
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], UpdateProductCollectionDto.prototype, "isFeatured", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 0
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UpdateProductCollectionDto.prototype, "sortOrder", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 1,
        description: 'Display priority (higher number = higher priority)'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UpdateProductCollectionDto.prototype, "displayPriority", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: false,
        description: 'Mark as priority collection for special display'
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], UpdateProductCollectionDto.prototype, "isPriority", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: [
            1,
            2,
            3
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ArrayMaxSize)(10, {
        message: 'Maximum 10 categories allowed'
    }),
    _ts_metadata("design:type", Array)
], UpdateProductCollectionDto.prototype, "categoryIds", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: [
            1,
            2,
            3
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ArrayMaxSize)(20, {
        message: 'Maximum 20 subcategories allowed'
    }),
    _ts_metadata("design:type", Array)
], UpdateProductCollectionDto.prototype, "subCategoryIds", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: [
            1,
            2,
            3
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ArrayMaxSize)(10, {
        message: 'Maximum 10 products allowed'
    }),
    _ts_metadata("design:type", Array)
], UpdateProductCollectionDto.prototype, "productIds", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)(),
    (0, _classvalidator.IsObject)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>CollectionSettingsDto),
    _ts_metadata("design:type", typeof CollectionSettingsDto === "undefined" ? Object : CollectionSettingsDto)
], UpdateProductCollectionDto.prototype, "settings", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)(),
    (0, _classvalidator.IsObject)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>CollectionMetadataDto),
    _ts_metadata("design:type", typeof CollectionMetadataDto === "undefined" ? Object : CollectionMetadataDto)
], UpdateProductCollectionDto.prototype, "metadata", void 0);
let ProductCollectionResponseDto = class ProductCollectionResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", Number)
], ProductCollectionResponseDto.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], ProductCollectionResponseDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], ProductCollectionResponseDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _productcollectionentity.CollectionType
    }),
    _ts_metadata("design:type", typeof _productcollectionentity.CollectionType === "undefined" ? Object : _productcollectionentity.CollectionType)
], ProductCollectionResponseDto.prototype, "type", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _productcollectionentity.CollectionStatus
    }),
    _ts_metadata("design:type", typeof _productcollectionentity.CollectionStatus === "undefined" ? Object : _productcollectionentity.CollectionStatus)
], ProductCollectionResponseDto.prototype, "status", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", Boolean)
], ProductCollectionResponseDto.prototype, "isFeatured", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", Number)
], ProductCollectionResponseDto.prototype, "sortOrder", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", Number)
], ProductCollectionResponseDto.prototype, "displayPriority", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", Boolean)
], ProductCollectionResponseDto.prototype, "isPriority", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", typeof CollectionSettingsDto === "undefined" ? Object : CollectionSettingsDto)
], ProductCollectionResponseDto.prototype, "settings", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", typeof CollectionMetadataDto === "undefined" ? Object : CollectionMetadataDto)
], ProductCollectionResponseDto.prototype, "metadata", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ProductCollectionResponseDto.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ProductCollectionResponseDto.prototype, "updatedAt", void 0);

//# sourceMappingURL=product-collection.dto.js.map