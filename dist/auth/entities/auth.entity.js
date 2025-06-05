"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "auth", {
    enumerable: true,
    get: function() {
        return auth;
    }
});
const _typeorm = require("typeorm");
const _classtransformer = require("class-transformer");
const _rolesconstant = require("../../common/constants/roles.constant");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let auth = class auth {
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)('char', {
        length: 36
    }),
    (0, _typeorm.Generated)('uuid'),
    _ts_metadata("design:type", String)
], auth.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        unique: true
    }),
    _ts_metadata("design:type", String)
], auth.prototype, "username", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false
    }),
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", String)
], auth.prototype, "password", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>{
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const OrderEntity = require('../../order/order.entity').order;
        return OrderEntity;
    }, (orderEntity)=>orderEntity.readyBy),
    _ts_metadata("design:type", Array)
], auth.prototype, "orders", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _rolesconstant.Role,
        default: _rolesconstant.Role.Salesman
    }),
    _ts_metadata("design:type", typeof _rolesconstant.Role === "undefined" ? Object : _rolesconstant.Role)
], auth.prototype, "role", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamp',
        default: ()=>'CURRENT_TIMESTAMP'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], auth.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamp',
        default: ()=>'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], auth.prototype, "updatedAt", void 0);
auth = _ts_decorate([
    (0, _typeorm.Entity)()
], auth);

//# sourceMappingURL=auth.entity.js.map