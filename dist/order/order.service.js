"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrderService", {
    enumerable: true,
    get: function() {
        return OrderService;
    }
});
const _common = require("@nestjs/common");
const _orderrepository = require("./order.repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OrderService = class OrderService {
    createOrder(dto) {
        return this.orderRepository.createOrder(dto);
    }
    updateOrder(id, dto) {
        return this.orderRepository.updateOrder(id, dto);
    }
    getAllOrders() {
        return this.orderRepository.getAllOrders();
    }
    getOrderById(id) {
        return this.orderRepository.getOrderById(id);
    }
    deleteOrder(id) {
        return this.orderRepository.deleteOrder(id);
    }
    updateOrderStatusToReadied(id) {
        return this.orderRepository.updateOrderStatusToReadied(id);
    }
    updateOrderStatusToShipped(id) {
        return this.orderRepository.updateOrderStatusToShipped(id);
    }
    updateOrderStatusToCancelled(id) {
        return this.orderRepository.updateOrderStatusToCancelled(id);
    }
    getOrdersByStatus(status) {
        return this.orderRepository.getOrdersByStatus(status);
    }
    addReadyBy(id, readyById) {
        return this.orderRepository.addReadyBy(id, readyById);
    }
    deleteAllOrders() {
        return this.orderRepository.deleteAllOrders();
    }
    numberOfOrders() {
        return this.orderRepository.length();
    }
    countPendingOrders() {
        return this.orderRepository.countPendingOrders();
    }
    countCancelledOrders() {
        return this.orderRepository.countCancelledOrders();
    }
    countShippedOrders() {
        return this.orderRepository.countShippedOrders();
    }
    countReadiedOrders() {
        return this.orderRepository.countReadiedOrders();
    }
    getRevenue(options) {
        return this.orderRepository.getRevenue(options);
    }
    getGrowth(days = 30) {
        return this.orderRepository.getGrowth(days);
    }
    constructor(orderRepository){
        this.orderRepository = orderRepository;
    }
};
OrderService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _orderrepository.OrderRepository === "undefined" ? Object : _orderrepository.OrderRepository
    ])
], OrderService);

//# sourceMappingURL=order.service.js.map