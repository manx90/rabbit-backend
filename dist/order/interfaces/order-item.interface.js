"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrderItemDto", {
    enumerable: true,
    get: function() {
        return OrderItemDto;
    }
});
const _classvalidator = require("class-validator");
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
], OrderItemDto.prototype, "product_id", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], OrderItemDto.prototype, "quantity", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], OrderItemDto.prototype, "size", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], OrderItemDto.prototype, "color", void 0);

//# sourceMappingURL=order-item.interface.js.map