import { describe, it, beforeEach, vi, expect, type Mocked } from 'vitest';
import { describe, it, beforeEach, vi, type Mocked } from 'vitest';
import { Test, type TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service.js';
import { ORDERS_REPOSITORY, type OrdersRepository } from '../repositories/orders.repository.interface.js';
import { PAYMENTS_REPOSITORY, type PaymentsRepository } from '../../../modules/payments/repositories/payments.repository.interface.js';
import { Order } from '../entities/order.entity.js';
import { OrderStatus } from '../../../common/enums/order-status.enum.js';
import { Payment } from '../../../modules/payments/entities/payment.entity.js';
import { PaymentStatus } from '../../../common/enums/payment-status.enum.js';
import { OrderNotFoundException } from '../../../common/exceptions/order-not-found.exception.js';
import { PaymentNotFoundException } from '../../../common/exceptions/payment-not-found.exception.js';
import { PaymentNotApprovedException } from '../../../common/exceptions/payment-not-approved.exception.js';
import { OrderAlreadyConfirmedException } from '../../../common/exceptions/order-already-confirmed.exception.js';

const ORDER_ID = 'order-id';

function makeOrder(status: OrderStatus = OrderStatus.PENDING): Order {
  return new Order(ORDER_ID, 'customer-id', status, new Date(), new Date());
}

function makePayment(status: PaymentStatus = PaymentStatus.APPROVED): Payment {
  return new Payment('payment-id', ORDER_ID, status, 100, null, new Date(), new Date());
}

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: Mocked<OrdersRepository>;
  let paymentsRepository: Mocked<PaymentsRepository>;

  beforeEach(async () => {
    const ordersRepositoryMock: Mocked<OrdersRepository> = {
      findById: vi.fn(),
      save: vi.fn(),
    };

    const paymentsRepositoryMock: Mocked<PaymentsRepository> = {
      findByOrderId: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: ORDERS_REPOSITORY, useValue: ordersRepositoryMock },
        { provide: PAYMENTS_REPOSITORY, useValue: paymentsRepositoryMock },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get(ORDERS_REPOSITORY);
    paymentsRepository = module.get(PAYMENTS_REPOSITORY);
  });

  it('should throw OrderNotFoundException when order does not exist', async () => {
    ordersRepository.findById.mockResolvedValue(null);
    await expect(service.confirmOrder(ORDER_ID)).rejects.toThrow(OrderNotFoundException);
    expect(paymentsRepository.findByOrderId).not.toHaveBeenCalled();
    expect(ordersRepository.save).not.toHaveBeenCalled();
  });

  it('should throw PaymentNotFoundException when payment does not exist', async () => {
    ordersRepository.findById.mockResolvedValue(makeOrder());
    paymentsRepository.findByOrderId.mockResolvedValue(null);
    await expect(service.confirmOrder(ORDER_ID)).rejects.toThrow(PaymentNotFoundException);
    expect(ordersRepository.save).not.toHaveBeenCalled();
  });

  it('should fail when payment is pending', async () => {
    ordersRepository.findById.mockResolvedValue(makeOrder());
    paymentsRepository.findByOrderId.mockResolvedValue(makePayment(PaymentStatus.PENDING));
    await expect(service.confirmOrder(ORDER_ID)).rejects.toThrow(PaymentNotApprovedException);
    expect(ordersRepository.save).not.toHaveBeenCalled();
  });

  it('should fail when payment is rejected', async () => {
    ordersRepository.findById.mockResolvedValue(makeOrder());
    paymentsRepository.findByOrderId.mockResolvedValue(makePayment(PaymentStatus.REJECTED));
    await expect(service.confirmOrder(ORDER_ID)).rejects.toThrow(PaymentNotApprovedException);
    expect(ordersRepository.save).not.toHaveBeenCalled();
  });

  it('should fail when order is already confirmed', async () => {
    ordersRepository.findById.mockResolvedValue(makeOrder(OrderStatus.CONFIRMED));
    paymentsRepository.findByOrderId.mockResolvedValue(makePayment(PaymentStatus.APPROVED));
    await expect(service.confirmOrder(ORDER_ID)).rejects.toThrow(OrderAlreadyConfirmedException);
    expect(ordersRepository.save).not.toHaveBeenCalled();
  });

  it('should confirm order when payment is approved', async () => {
    const order = makeOrder(OrderStatus.PENDING);
    ordersRepository.findById.mockResolvedValue(order);
    paymentsRepository.findByOrderId.mockResolvedValue(makePayment(PaymentStatus.APPROVED));
    ordersRepository.save.mockImplementation(async (input) => input);

    const result = await service.confirmOrder(ORDER_ID);

    expect(ordersRepository.save).toHaveBeenCalledTimes(1);
    expect(ordersRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: ORDER_ID,
        status: OrderStatus.CONFIRMED,
      }),
    );
    expect(result).toEqual({
      orderId: ORDER_ID,
      status: OrderStatus.CONFIRMED,
      updatedAt: expect.any(Date),
      message: 'Order confirmed successfully.',
    });
  });
});