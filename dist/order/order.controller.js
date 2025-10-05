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
const _swagger = require("@nestjs/swagger");
const _orderservice = require("./order.service");
const _orderdto = require("./order.dto");
const _orderentity = require("./order.entity");
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
    countPendingOrders() {
        return this.orderService.countPendingOrders();
    }
    countCancelledOrders() {
        return this.orderService.countCancelledOrders();
    }
    countShippedOrders() {
        return this.orderService.countShippedOrders();
    }
    countReadiedOrders() {
        return this.orderService.countReadiedOrders();
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
    getRevenue(startDate, endDate) {
        const options = {};
        if (startDate && endDate) {
            options.startDate = new Date(startDate);
            options.endDate = new Date(endDate);
        }
        return this.orderService.getRevenue(options);
    }
    getGrowth(days) {
        const d = days ? parseInt(days) : 30;
        return this.orderService.getGrowth(d);
    }
    constructor(orderService){
        this.orderService = orderService;
    }
};
_ts_decorate([
    (0, _common.Post)('create'),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new order'
    }),
    (0, _swagger.ApiBody)({
        type: _orderdto.CreateOrderDto
    }),
    (0, _swagger.ApiCreatedResponse)({
        description: 'Order created successfully',
        type: _orderentity.order
    }),
    (0, _swagger.ApiBadRequestResponse)({
        description: 'Bad request - validation failed'
    }),
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
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get total number of orders (Admin/SuperAdmin only)'
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'Total orders count retrieved successfully'
    }),
    (0, _swagger.ApiUnauthorizedResponse)({
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiForbiddenResponse)({
        description: 'Forbidden - Admin/SuperAdmin role required'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "numberOfOrders", null);
_ts_decorate([
    (0, _common.Get)('count/pending'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "countPendingOrders", null);
_ts_decorate([
    (0, _common.Get)('count/cancelled'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "countCancelledOrders", null);
_ts_decorate([
    (0, _common.Get)('count/shipped'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "countShippedOrders", null);
_ts_decorate([
    (0, _common.Get)('count/readied'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "countReadiedOrders", null);
_ts_decorate([
    (0, _common.Put)('update/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Update order by ID (Admin/SuperAdmin only)'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Order ID'
    }),
    (0, _swagger.ApiBody)({
        type: _orderdto.UpdateOrderDto
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'Order updated successfully',
        type: _orderentity.order
    }),
    (0, _swagger.ApiNotFoundResponse)({
        description: 'Order not found'
    }),
    (0, _swagger.ApiBadRequestResponse)({
        description: 'Bad request - validation failed'
    }),
    (0, _swagger.ApiUnauthorizedResponse)({
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiForbiddenResponse)({
        description: 'Forbidden - Admin/SuperAdmin role required'
    }),
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
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all orders (Admin/SuperAdmin only)'
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'Orders retrieved successfully',
        type: [
            _orderentity.order
        ]
    }),
    (0, _swagger.ApiUnauthorizedResponse)({
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiForbiddenResponse)({
        description: 'Forbidden - Admin/SuperAdmin role required'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "getAllOrders", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get order by ID (Admin/SuperAdmin only)'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Order ID'
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'Order retrieved successfully',
        type: _orderentity.order
    }),
    (0, _swagger.ApiNotFoundResponse)({
        description: 'Order not found'
    }),
    (0, _swagger.ApiUnauthorizedResponse)({
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiForbiddenResponse)({
        description: 'Forbidden - Admin/SuperAdmin role required'
    }),
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
_ts_decorate([
    (0, _common.Get)('stats/revenue'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Query)('startDate')),
    _ts_param(1, (0, _common.Query)('endDate')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "getRevenue", null);
_ts_decorate([
    (0, _common.Get)('stats/growth'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.Admin, _rolesconstant.Role.SuperAdmin),
    _ts_param(0, (0, _common.Query)('days')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OrderController.prototype, "getGrowth", null);
OrderController = _ts_decorate([
    (0, _swagger.ApiTags)('Orders'),
    (0, _common.Controller)('order'),
    (0, _common.UseInterceptors)(_common.ClassSerializerInterceptor),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _orderservice.OrderService === "undefined" ? Object : _orderservice.OrderService
    ])
], OrderController);

//# sourceMappingURL=order.controller.js.map