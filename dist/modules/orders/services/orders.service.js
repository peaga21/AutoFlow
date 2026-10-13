"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const orders_repository_interface_js_1 = require("../repositories/orders.repository.interface.js");
const payments_repository_interface_js_1 = require("../../payments/repositories/payments.repository.interface.js");
const order_not_found_exception_js_1 = require("../../../common/exceptions/order-not-found.exception.js");
const payment_not_found_exception_js_1 = require("../../../common/exceptions/payment-not-found.exception.js");
const payment_not_approved_exception_js_1 = require("../../../common/exceptions/payment-not-approved.exception.js");
const payment_status_enum_js_1 = require("../../../common/enums/payment-status.enum.js");
let OrdersService = class OrdersService {
    ordersRepository;
    paymentsRepository;
    constructor(ordersRepository, paymentsRepository) {
        this.ordersRepository = ordersRepository;
        this.paymentsRepository = paymentsRepository;
    }
    async confirmOrder(orderId) {
        const order = await this.ordersRepository.findById(orderId);
        if (!order) {
            throw new order_not_found_exception_js_1.OrderNotFoundException(orderId);
        }
        const payment = await this.paymentsRepository.findByOrderId(orderId);
        if (!payment) {
            throw new payment_not_found_exception_js_1.PaymentNotFoundException(orderId);
        }
        if (payment.status !== payment_status_enum_js_1.PaymentStatus.APPROVED) {
            throw new payment_not_approved_exception_js_1.PaymentNotApprovedException(payment.status);
        }
        order.confirm(payment.status);
        const savedOrder = await this.ordersRepository.save(order);
        return {
            orderId: savedOrder.id,
            status: savedOrder.status,
            updatedAt: savedOrder.updatedAt,
            message: 'Order confirmed successfully.',
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(orders_repository_interface_js_1.ORDERS_REPOSITORY)),
    __param(1, (0, common_1.Inject)(payments_repository_interface_js_1.PAYMENTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], OrdersService);
//# sourceMappingURL=orders.service.js.map