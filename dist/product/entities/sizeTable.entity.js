"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SizeTable", {
    enumerable: true,
    get: function() {
        return SizeTable;
    }
});
const _typeorm = require("typeorm");
const _productentity = require("./product.entity");
const _sizetableinterface = require("../interfaces/size-table.interface");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SizeTable = class SizeTable {
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)('char', {
        length: 36
    }),
    (0, _typeorm.Generated)('uuid'),
    _ts_metadata("design:type", String)
], SizeTable.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 255
    }),
    _ts_metadata("design:type", String)
], SizeTable.prototype, "tableName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'json'
    }),
    _ts_metadata("design:type", typeof _sizetableinterface.SizeTableData === "undefined" ? Object : _sizetableinterface.SizeTableData)
], SizeTable.prototype, "data", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_productentity.product, (product)=>product.sizeTable),
    _ts_metadata("design:type", Array)
], SizeTable.prototype, "products", void 0);
SizeTable = _ts_decorate([
    (0, _typeorm.Entity)()
], SizeTable);

//# sourceMappingURL=sizeTable.entity.js.map