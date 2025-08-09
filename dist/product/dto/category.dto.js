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
    CategoryResponseDto: function() {
        return CategoryResponseDto;
    },
    CreateCategoryDto: function() {
        return CreateCategoryDto;
    },
    CreateSubCategoryDto: function() {
        return CreateSubCategoryDto;
    },
    SubCategoryResponseDto: function() {
        return SubCategoryResponseDto;
    },
    UpdateCategoryDto: function() {
        return UpdateCategoryDto;
    },
    UpdateSubCategoryDto: function() {
        return UpdateSubCategoryDto;
    },
    UploadIcon: function() {
        return UploadIcon;
    }
});
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UploadIcon = class UploadIcon {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        type: 'string',
        format: 'binary'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File)
], UploadIcon.prototype, "iconCat", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        type: 'string',
        format: 'binary'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File)
], UploadIcon.prototype, "iconSubCat", void 0);
let SubCategoryResponseDto = class SubCategoryResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 5
    }),
    _ts_metadata("design:type", Number)
], SubCategoryResponseDto.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'T-Shirts'
    }),
    _ts_metadata("design:type", String)
], SubCategoryResponseDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: true
    }),
    _ts_metadata("design:type", Boolean)
], SubCategoryResponseDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '2025-05-26T07:00:00.000Z'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], SubCategoryResponseDto.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '2025-05-26T07:00:00.000Z'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], SubCategoryResponseDto.prototype, "updatedAt", void 0);
let CategoryResponseDto = class CategoryResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 1
    }),
    _ts_metadata("design:type", Number)
], CategoryResponseDto.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Clothing'
    }),
    _ts_metadata("design:type", String)
], CategoryResponseDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: [
            SubCategoryResponseDto
        ]
    }),
    _ts_metadata("design:type", Array)
], CategoryResponseDto.prototype, "subCategories", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: true
    }),
    _ts_metadata("design:type", Boolean)
], CategoryResponseDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '2025-05-26T07:00:00.000Z'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CategoryResponseDto.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '2025-05-26T07:00:00.000Z'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CategoryResponseDto.prototype, "updatedAt", void 0);
let CreateSubCategoryDto = class CreateSubCategoryDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'T-Shirts'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSubCategoryDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 1,
        description: 'Parent category ID'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], CreateSubCategoryDto.prototype, "categoryId", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        type: 'string',
        format: 'binary'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], CreateSubCategoryDto.prototype, "iconSubCat", void 0);
let UpdateSubCategoryDto = class UpdateSubCategoryDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: "Men's T-Shirts"
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], UpdateSubCategoryDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], UpdateSubCategoryDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        type: 'string',
        format: 'binary'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], UpdateSubCategoryDto.prototype, "iconSubCat", void 0);
let CreateCategoryDto = class CreateCategoryDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Clothing'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Initial subcategories (IDs or objects)',
        type: [
            CreateSubCategoryDto
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>CreateSubCategoryDto),
    _ts_metadata("design:type", Array)
], CreateCategoryDto.prototype, "subCategories", void 0);
let UpdateCategoryDto = class UpdateCategoryDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'Apparel'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], UpdateCategoryDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: false
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], UpdateCategoryDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        type: 'string',
        format: 'binary'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], UpdateCategoryDto.prototype, "iconCat", void 0);

//# sourceMappingURL=category.dto.js.map