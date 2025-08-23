"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrderController", {
    enumerable: true,
    get: function() {
        return OrderController;
    }
});
const _common = require("@nestjs/common");
const _orderservice = require("./order.service");
const _orderdto = require("./order.dto");
const _ordertypes = require("./order.types");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _rolesconstant = require("../common/constants/roles.constant");
const _rolesguard = require("../common/guards/roles.guard");
const _jwtauthguard = require("../common/guards/jwt-auth.guard");
const _express = require("express");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let OrderController = class OrderController {
    createOrder(createOrderDto) {
        return this.orderService.createOrder(createOrderDto);
    }
    numberOfOrders() {
        return this.orderService.numberOfOrders();
    }
    updateOrder(id, updateOrderDto) {
        return this.orderService.updateOrder(id, updateOrderDto);
    }
    getAllOrders() {
        return this.orderService.getAllOrders();
    }
    getOrderById(id) {
        return this.orderService.getOrderById(id);
    }
    getOrdersByStatus(status) {
        return this.orderService.getOrdersByStatus(status);
    }
    addReadyBy(id, req) {
        if (!req.user) {
            throw new _common.UnauthorizedException('User not found');
        }
        const userId = req.user.id;
        return this.orderService.addReadyBy(id, userId);
    }
    deleteAllOrders() {
        return this.orderService.deleteAllOrders();
    }
    deleteOrder(id) {
        return this.orderService.deleteOrder(id);
    }
    updateOrderStatusToReadied(id) {
        return this.orderService.updateOrderStatusToReadied(id);
    }
    updateOrderStatusToShipped(id) {
        return this.orderService.updateOrderStatusToShipped(id);
    }
    updateOrderStatusToCancelled(id) {
        return this.orderService.updateOrderStatusToCancelled(id);
    }
    constructor(orderService){
        this.orderService = orderService;
    }
};
_ts_decorate([
    (0, _common.Post)('create'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _orderdto.CreateOrderDto === "undefined" ? Object : _orderdto.CreateOrderDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "createOrder", null);
_ts_decorate([
    (0, _common.Get)('numberOfOrders'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "numberOfOrders", null);
_ts_decorate([
    (0, _common.Put)('update/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _orderdto.UpdateOrderDto === "undefined" ? Object : _orderdto.UpdateOrderDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "updateOrder", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "getAllOrders", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "getOrderById", null);
_ts_decorate([
    (0, _common.Get)('status/:status'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('status')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ordertypes.OrderStatus === "undefined" ? Object : _ordertypes.OrderStatus
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "getOrdersByStatus", null);
_ts_decorate([
    (0, _common.Put)('readyBy/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "addReadyBy", null);
_ts_decorate([
    (0, _common.Delete)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "deleteAllOrders", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "deleteOrder", null);
_ts_decorate([
    (0, _common.Put)('readied/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "updateOrderStatusToReadied", null);
_ts_decorate([
    (0, _common.Put)('shipped/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "updateOrderStatusToShipped", null);
_ts_decorate([
    (0, _common.Put)('cancelled/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "updateOrderStatusToCancelled", null);
OrderController = _ts_decorate([
    (0, _common.Controller)('order'),
    (0, _common.UseInterceptors)(_common.ClassSerializerInterceptor),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _orderservice.OrderService === "undefined" ? Object : _orderservice.OrderService
    ])
], OrderController);

//# sourceMappingURL=order.controller.js.map