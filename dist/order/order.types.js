"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrderStatus", {
    enumerable: true,
    get: function() {
        return OrderStatus;
    }
});
var OrderStatus = /*#__PURE__*/ function(OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
    return OrderStatus;
}({});

//# sourceMappingURL=order.types.js.map