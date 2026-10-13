"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const order_status_enum_js_1 = require("../../../common/enums/order-status.enum.js");
const order_already_confirmed_exception_js_1 = require("../../../common/exceptions/order-already-confirmed.exception.js");
class Order {
    id;
    customerId;
    status;
    createdAt;
    updatedAt;
    constructor(id, customerId, status, createdAt, updatedAt) {
        this.id = id;
        this.customerId = customerId;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    confirm(paymentStatus) {
        if (this.status === order_status_enum_js_1.OrderStatus.CONFIRMED) {
            throw new order_already_confirmed_exception_js_1.OrderAlreadyConfirmedException(this.id);
        }
        this.status = order_status_enum_js_1.OrderStatus.CONFIRMED;
        this.updatedAt = new Date();
    }
}
exports.Order = Order;
//# sourceMappingURL=order.entity.js.map