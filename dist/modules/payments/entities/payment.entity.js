"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
class Payment {
    id;
    orderId;
    status;
    amount;
    method;
    createdAt;
    updatedAt;
    constructor(id, orderId, status, amount, method, createdAt, updatedAt) {
        this.id = id;
        this.orderId = orderId;
        this.status = status;
        this.amount = amount;
        this.method = method;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Payment = Payment;
//# sourceMappingURL=payment.entity.js.map