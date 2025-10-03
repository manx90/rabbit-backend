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
    SizeDimension: function() {
        return SizeDimension;
    },
    SizeField: function() {
        return SizeField;
    },
    SizeTable: function() {
        return SizeTable;
    }
});
const _typeorm = require("typeorm");
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
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], SizeTable.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 255
    }),
    _ts_metadata("design:type", String)
], SizeTable.prototype, "tableName", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>SizeDimension, (size)=>size.sizeTable, {
        cascade: true
    }),
    _ts_metadata("design:type", Array)
], SizeTable.prototype, "sizeDimensions", void 0);
SizeTable = _ts_decorate([
    (0, _typeorm.Entity)()
], SizeTable);
let SizeDimension = class SizeDimension {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], SizeDimension.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 255
    }),
    _ts_metadata("design:type", String)
], SizeDimension.prototype, "sizeName", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>SizeField, (field)=>field.sizeDimension, {
        cascade: true,
        eager: true
    }),
    _ts_metadata("design:type", Array)
], SizeDimension.prototype, "fields", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>SizeTable, (table)=>table.sizeDimensions, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'tableId'
    }),
    _ts_metadata("design:type", typeof SizeTable === "undefined" ? Object : SizeTable)
], SizeDimension.prototype, "sizeTable", void 0);
SizeDimension = _ts_decorate([
    (0, _typeorm.Entity)()
], SizeDimension);
let SizeField = class SizeField {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], SizeField.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 255
    }),
    _ts_metadata("design:type", String)
], SizeField.prototype, "fieldName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 255
    }),
    _ts_metadata("design:type", String)
], SizeField.prototype, "fieldValue", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>SizeDimension, (size)=>size.fields, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'sizeId'
    }),
    _ts_metadata("design:type", typeof SizeDimension === "undefined" ? Object : SizeDimension)
], SizeField.prototype, "sizeDimension", void 0);
SizeField = _ts_decorate([
    (0, _typeorm.Entity)()
], SizeField);

//# sourceMappingURL=sizeTable.js.map