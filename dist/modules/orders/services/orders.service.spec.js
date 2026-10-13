"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const testing_1 = require("@nestjs/testing");
const orders_service_js_1 = require("./orders.service.js");
const orders_repository_interface_js_1 = require("../repositories/orders.repository.interface.js");
const payments_repository_interface_js_1 = require("../../../modules/payments/repositories/payments.repository.interface.js");
const order_entity_js_1 = require("../entities/order.entity.js");
const order_status_enum_js_1 = require("../../../common/enums/order-status.enum.js");
const payment_entity_js_1 = require("../../../modules/payments/entities/payment.entity.js");
const payment_status_enum_js_1 = require("../../../common/enums/payment-status.enum.js");
const order_not_found_exception_js_1 = require("../../../common/exceptions/order-not-found.exception.js");
const payment_not_found_exception_js_1 = require("../../../common/exceptions/payment-not-found.exception.js");
const payment_not_approved_exception_js_1 = require("../../../common/exceptions/payment-not-approved.exception.js");
const order_already_confirmed_exception_js_1 = require("../../../common/exceptions/order-already-confirmed.exception.js");
const ORDER_ID = 'order-id';
function makeOrder(status = order_status_enum_js_1.OrderStatus.PENDING) {
    return new order_entity_js_1.Order(ORDER_ID, 'customer-id', status, new Date(), new Date());
}
function makePayment(status = payment_status_enum_js_1.PaymentStatus.APPROVED) {
    return new payment_entity_js_1.Payment('payment-id', ORDER_ID, status, 100, null, new Date(), new Date());
}
(0, vitest_1.describe)('OrdersService', () => {
    let service;
    let ordersRepository;
    let paymentsRepository;
    (0, vitest_1.beforeEach)(async () => {
        const ordersRepositoryMock = {
            findById: vitest_1.vi.fn(),
            save: vitest_1.vi.fn(),
        };
        const paymentsRepositoryMock = {
            findByOrderId: vitest_1.vi.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                orders_service_js_1.OrdersService,
                { provide: orders_repository_interface_js_1.ORDERS_REPOSITORY, useValue: ordersRepositoryMock },
                { provide: payments_repository_interface_js_1.PAYMENTS_REPOSITORY, useValue: paymentsRepositoryMock },
            ],
        }).compile();
        service = module.get(orders_service_js_1.OrdersService);
        ordersRepository = module.get(orders_repository_interface_js_1.ORDERS_REPOSITORY);
        paymentsRepository = module.get(payments_repository_interface_js_1.PAYMENTS_REPOSITORY);
    });
    (0, vitest_1.it)('should throw OrderNotFoundException when order does not exist', async () => {
        ordersRepository.findById.mockResolvedValue(null);
        await (0, vitest_1.expect)(service.confirmOrder(ORDER_ID)).rejects.toThrow(order_not_found_exception_js_1.OrderNotFoundException);
        (0, vitest_1.expect)(paymentsRepository.findByOrderId).not.toHaveBeenCalled();
        (0, vitest_1.expect)(ordersRepository.save).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should throw PaymentNotFoundException when payment does not exist', async () => {
        ordersRepository.findById.mockResolvedValue(makeOrder());
        paymentsRepository.findByOrderId.mockResolvedValue(null);
        await (0, vitest_1.expect)(service.confirmOrder(ORDER_ID)).rejects.toThrow(payment_not_found_exception_js_1.PaymentNotFoundException);
        (0, vitest_1.expect)(ordersRepository.save).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should fail when payment is pending', async () => {
        ordersRepository.findById.mockResolvedValue(makeOrder());
        paymentsRepository.findByOrderId.mockResolvedValue(makePayment(payment_status_enum_js_1.PaymentStatus.PENDING));
        await (0, vitest_1.expect)(service.confirmOrder(ORDER_ID)).rejects.toThrow(payment_not_approved_exception_js_1.PaymentNotApprovedException);
        (0, vitest_1.expect)(ordersRepository.save).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should fail when payment is rejected', async () => {
        ordersRepository.findById.mockResolvedValue(makeOrder());
        paymentsRepository.findByOrderId.mockResolvedValue(makePayment(payment_status_enum_js_1.PaymentStatus.REJECTED));
        await (0, vitest_1.expect)(service.confirmOrder(ORDER_ID)).rejects.toThrow(payment_not_approved_exception_js_1.PaymentNotApprovedException);
        (0, vitest_1.expect)(ordersRepository.save).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should fail when order is already confirmed', async () => {
        ordersRepository.findById.mockResolvedValue(makeOrder(order_status_enum_js_1.OrderStatus.CONFIRMED));
        paymentsRepository.findByOrderId.mockResolvedValue(makePayment(payment_status_enum_js_1.PaymentStatus.APPROVED));
        await (0, vitest_1.expect)(service.confirmOrder(ORDER_ID)).rejects.toThrow(order_already_confirmed_exception_js_1.OrderAlreadyConfirmedException);
        (0, vitest_1.expect)(ordersRepository.save).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should confirm order when payment is approved', async () => {
        const order = makeOrder(order_status_enum_js_1.OrderStatus.PENDING);
        ordersRepository.findById.mockResolvedValue(order);
        paymentsRepository.findByOrderId.mockResolvedValue(makePayment(payment_status_enum_js_1.PaymentStatus.APPROVED));
        ordersRepository.save.mockImplementation(async (input) => input);
        const result = await service.confirmOrder(ORDER_ID);
        (0, vitest_1.expect)(ordersRepository.save).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(ordersRepository.save).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
            id: ORDER_ID,
            status: order_status_enum_js_1.OrderStatus.CONFIRMED,
        }));
        (0, vitest_1.expect)(result).toEqual({
            orderId: ORDER_ID,
            status: order_status_enum_js_1.OrderStatus.CONFIRMED,
            updatedAt: vitest_1.expect.any(Date),
            message: 'Order confirmed successfully.',
        });
    });
});
//# sourceMappingURL=orders.service.spec.js.map