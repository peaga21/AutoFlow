"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderAlreadyConfirmedException = void 0;
const common_1 = require("@nestjs/common");
class OrderAlreadyConfirmedException extends common_1.ConflictException {
    constructor(orderId) {
        super(`Order with ID ${orderId} is already confirmed.`);
    }
}
exports.OrderAlreadyConfirmedException = OrderAlreadyConfirmedException;
//# sourceMappingURL=order-already-confirmed.exception.js.map