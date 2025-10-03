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
    AddSizeDimensionDto: function() {
        return AddSizeDimensionDto;
    },
    CreateSizeTableDto: function() {
        return CreateSizeTableDto;
    },
    SizeDimensionDto: function() {
        return SizeDimensionDto;
    },
    SizeFieldDto: function() {
        return SizeFieldDto;
    },
    UpdateSizeTableDto: function() {
        return UpdateSizeTableDto;
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
let SizeFieldDto = class SizeFieldDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Chest'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], SizeFieldDto.prototype, "fieldName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '38 inches'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], SizeFieldDto.prototype, "fieldValue", void 0);
let SizeDimensionDto = class SizeDimensionDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Medium'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], SizeDimensionDto.prototype, "sizeName", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Optional fields for this size',
        type: [
            SizeFieldDto
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>SizeFieldDto),
    _ts_metadata("design:type", Array)
], SizeDimensionDto.prototype, "fields", void 0);
let CreateSizeTableDto = class CreateSizeTableDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'T-Shirt Size Chart'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSizeTableDto.prototype, "tableName", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Optional size dimensions to create with the table',
        type: [
            SizeDimensionDto
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>SizeDimensionDto),
    _ts_metadata("design:type", Array)
], CreateSizeTableDto.prototype, "sizeDimensions", void 0);
let UpdateSizeTableDto = class UpdateSizeTableDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'Updated T-Shirt Size Chart'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], UpdateSizeTableDto.prototype, "tableName", void 0);
let AddSizeDimensionDto = class AddSizeDimensionDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Large'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AddSizeDimensionDto.prototype, "sizeName", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Optional fields for this size',
        type: [
            SizeFieldDto
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>SizeFieldDto),
    _ts_metadata("design:type", Array)
], AddSizeDimensionDto.prototype, "fields", void 0);

//# sourceMappingURL=size-table.dto.js.map