"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentNotApprovedException = void 0;
const common_1 = require("@nestjs/common");
class PaymentNotApprovedException extends common_1.BadRequestException {
    constructor(status) {
        super(`Payment is not approved. Current status: ${status}`);
    }
}
exports.PaymentNotApprovedException = PaymentNotApprovedException;
//# sourceMappingURL=payment-not-approved.exception.js.map