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
    order: function() {
        return order;
    },
    orderitem: function() {
        return orderitem;
    }
});
const _typeorm = require("typeorm");
const _ordertypes = require("./order.types");
const _authentity = require("../auth/entities/auth.entity");
const _productentity = require("../product/entities/product.entity");
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
let order = class order {
    calculateAmount() {
        if (this.items && this.items.length > 0) {
            this.amount = this.items.reduce((total, item)=>total + Number(item.price) * Number(item.quantity), 0);
        } else {
            this.amount = 0;
        }
    }
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", String)
], order.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        default: '1800'
    }),
    _ts_metadata("design:type", String)
], order.prototype, "business", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        default: '1802'
    }),
    _ts_metadata("design:type", String)
], order.prototype, "business_address", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_authentity.auth, (user)=>user.orders, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _authentity.auth === "undefined" ? Object : _authentity.auth)
], order.prototype, "readyBy", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], order.prototype, "consignee_name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], order.prototype, "consignee_phone", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], order.prototype, "consignee_city", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], order.prototype, "consignee_area", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], order.prototype, "consignee_address", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], order.prototype, "shipment_types", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], order.prototype, "quantity", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'cod_amount',
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], order.prototype, "cod_amount", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], order.prototype, "items_description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        default: '0'
    }),
    _ts_metadata("design:type", String)
], order.prototype, "is_cod", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        default: '0'
    }),
    _ts_metadata("design:type", String)
], order.prototype, "has_return", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], order.prototype, "return_notes", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], order.prototype, "notes", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _ordertypes.OrderStatus,
        default: _ordertypes.OrderStatus.PENDING
    }),
    _ts_metadata("design:type", typeof _ordertypes.OrderStatus === "undefined" ? Object : _ordertypes.OrderStatus)
], order.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>orderitem, (item)=>item.order, {
        cascade: true,
        eager: true
    }),
    _ts_metadata("design:type", Array)
], order.prototype, "items", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_authentity.auth, {
        nullable: true
    }),
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], order.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'numeric',
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], order.prototype, "amount", void 0);
_ts_decorate([
    (0, _typeorm.BeforeUpdate)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], order.prototype, "calculateAmount", null);
order = _ts_decorate([
    (0, _typeorm.Entity)()
], order);
let orderitem = class orderitem {
    getPrice() {
        const price = this.product.sizeDetails.map((size)=>{
            if (size.sizeName === this.sizeName) {
                return size.price;
            }
        });
        this.price = price.find((p)=>p !== undefined) || 0;
    }
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", String)
], orderitem.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>order, (order)=>order.items),
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", typeof order === "undefined" ? Object : order)
], orderitem.prototype, "order", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_productentity.product, (product)=>product.id, {
        cascade: true,
        onDelete: 'CASCADE'
    }),
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", typeof _productentity.product === "undefined" ? Object : _productentity.product)
], orderitem.prototype, "product", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'int',
        name: 'productId'
    }),
    _ts_metadata("design:type", Number)
], orderitem.prototype, "productId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], orderitem.prototype, "sizeName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], orderitem.prototype, "colorName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'int'
    }),
    _ts_metadata("design:type", Number)
], orderitem.prototype, "quantity", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'numeric',
        default: '0'
    }),
    _ts_metadata("design:type", Number)
], orderitem.prototype, "price", void 0);
_ts_decorate([
    (0, _typeorm.BeforeInsert)(),
    (0, _typeorm.BeforeUpdate)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], orderitem.prototype, "getPrice", null);
orderitem = _ts_decorate([
    (0, _typeorm.Entity)()
], orderitem);

//# sourceMappingURL=order.entity.js.map