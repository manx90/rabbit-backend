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
    CreateOrderDto: function() {
        return CreateOrderDto;
    },
    OrderItemDto: function() {
        return OrderItemDto;
    },
    UpdateOrderDto: function() {
        return UpdateOrderDto;
    }
});
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OrderItemDto = class OrderItemDto {
};
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], OrderItemDto.prototype, "productId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], OrderItemDto.prototype, "sizeName", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], OrderItemDto.prototype, "colorName", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], OrderItemDto.prototype, "quantity", void 0);
let CreateOrderDto = class CreateOrderDto {
    constructor(){
        // Shipment
        // @IsNotEmpty()
        this.shipment_types = '1';
        // // @IsNotEmpty()
        // @IsOptional()
        // @IsString()
        // quantity: string;
        // @IsNotEmpty()
        this.items_description = '';
        // @IsNotEmpty()
        this.is_cod = '1';
        // // @IsNotEmpty()
        // @IsString()
        // cod_amount: string;
        // @IsNotEmpty()
        this.has_return = '0';
        this.return_notes = '';
        this.notes = '';
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateOrderDto.prototype, "consignee_name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateOrderDto.prototype, "consignee_phone", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateOrderDto.prototype, "consignee_city", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateOrderDto.prototype, "consignee_area", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateOrderDto.prototype, "consignee_address", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateOrderDto.prototype, "shipment_types", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateOrderDto.prototype, "items_description", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateOrderDto.prototype, "is_cod", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateOrderDto.prototype, "has_return", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateOrderDto.prototype, "return_notes", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateOrderDto.prototype, "notes", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>OrderItemDto),
    _ts_metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
let UpdateOrderDto = class UpdateOrderDto extends CreateOrderDto {
};

//# sourceMappingURL=order.dto.js.map