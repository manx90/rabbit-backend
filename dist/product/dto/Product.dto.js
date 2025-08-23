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
    ColorDetailDto: function() {
        return ColorDetailDto;
    },
    ColorQuantityDto: function() {
        return ColorQuantityDto;
    },
    CreateProductDto: function() {
        return CreateProductDto;
    },
    SizeDetailDto: function() {
        return SizeDetailDto;
    },
    UpdateProductDto: function() {
        return UpdateProductDto;
    }
});
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
const _swagger = require("@nestjs/swagger");
const _entityinterface = require("../../common/interfaces/entity.interface");
const _productentity = require("../entities/product.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ColorQuantityDto = class ColorQuantityDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'أحمر'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ColorQuantityDto.prototype, "colorName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 12,
        minimum: 0
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], ColorQuantityDto.prototype, "quantity", void 0);
let SizeDetailDto = class SizeDetailDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'XL'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], SizeDetailDto.prototype, "sizeName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 35000
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsPositive)(),
    _ts_metadata("design:type", Number)
], SizeDetailDto.prototype, "price", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Colors and their stock for this size',
        type: [
            ColorQuantityDto
        ],
        minItems: 1
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ArrayMinSize)(1),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>ColorQuantityDto),
    _ts_metadata("design:type", Array)
], SizeDetailDto.prototype, "quantities", void 0);
let ColorDetailDto = class ColorDetailDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'أحمر'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ColorDetailDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'red-color.jpg'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ColorDetailDto.prototype, "imgColor", void 0);
let CreateProductDto = class CreateProductDto {
    constructor(){
        this.publishState = _entityinterface.PublishState.DRAFT;
        /* UX flags */ this.isActive = false;
        this.isFeatured = false;
        this.isTrending = false;
        this.isNew = true;
        this.isBestSeller = false;
    }
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'تيشيرت رجالي'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'تيشيرت قطن عالي الجودة ومريح'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 1
    }),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], CreateProductDto.prototype, "categoryId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 2
    }),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], CreateProductDto.prototype, "subCategoryId", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: _entityinterface.PublishState,
        default: _entityinterface.PublishState.DRAFT
    }),
    (0, _classvalidator.IsEnum)(_entityinterface.PublishState),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof _entityinterface.PublishState === "undefined" ? Object : _entityinterface.PublishState)
], CreateProductDto.prototype, "publishState", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'List of sizes with their prices and color quantities',
        type: [
            SizeDetailDto
        ],
        minItems: 1
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ArrayMinSize)(1),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>SizeDetailDto),
    _ts_metadata("design:type", Array)
], CreateProductDto.prototype, "sizes", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: '2025-01-01'
    }),
    (0, _classvalidator.IsDate)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CreateProductDto.prototype, "datePublished", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Flat list of colors (redundant, but handy for front-end)',
        type: [
            ColorDetailDto
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>ColorDetailDto),
    _ts_metadata("design:type", Array)
], CreateProductDto.prototype, "colors", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        default: false
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CreateProductDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        default: false
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CreateProductDto.prototype, "isFeatured", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        default: false
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CreateProductDto.prototype, "isTrending", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        default: true
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CreateProductDto.prototype, "isNew", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        default: false
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CreateProductDto.prototype, "isBestSeller", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'cover.jpg'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateProductDto.prototype, "imgCover", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'size-chart.jpg'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateProductDto.prototype, "imgSizeChart", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'measure.jpg'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateProductDto.prototype, "imgMeasure", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'images.jpg'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateProductDto.prototype, "images", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'colors.jpg'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateProductDto.prototype, "imgColors", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: _productentity.Season,
        default: _productentity.Season.all
    }),
    (0, _classvalidator.IsEnum)(_productentity.Season),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof _productentity.Season === "undefined" ? Object : _productentity.Season)
], CreateProductDto.prototype, "season", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: [
            'fashion',
            'clothing',
            'trendy',
            'stylish'
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], CreateProductDto.prototype, "wordKeys", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateProductDto.prototype, "videoLink", void 0);
let UpdateProductDto = class UpdateProductDto {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateProductDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)(_entityinterface.PublishState),
    _ts_metadata("design:type", typeof _entityinterface.PublishState === "undefined" ? Object : _entityinterface.PublishState)
], UpdateProductDto.prototype, "publishState", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], UpdateProductDto.prototype, "categoryId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], UpdateProductDto.prototype, "subCategoryId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>SizeDetailDto),
    _ts_metadata("design:type", Array)
], UpdateProductDto.prototype, "sizes", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>ColorDetailDto),
    _ts_metadata("design:type", Array)
], UpdateProductDto.prototype, "colors", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], UpdateProductDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], UpdateProductDto.prototype, "isFeatured", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], UpdateProductDto.prototype, "isTrending", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], UpdateProductDto.prototype, "isNew", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], UpdateProductDto.prototype, "isBestSeller", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsDate)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UpdateProductDto.prototype, "datePublished", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)(_productentity.Season),
    _ts_metadata("design:type", typeof _productentity.Season === "undefined" ? Object : _productentity.Season)
], UpdateProductDto.prototype, "season", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    _ts_metadata("design:type", Array)
], UpdateProductDto.prototype, "wordKeys", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateProductDto.prototype, "videoLink", void 0);

//# sourceMappingURL=Product.dto.js.map