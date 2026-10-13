import { OrderStatus } from '../../../common/enums/order-status.enum.js';
import { OrderAlreadyConfirmedException } from '../../../common/exceptions/order-already-confirmed.exception.js';
import { PaymentStatus } from '../../../common/enums/payment-status.enum.js';

export class Order {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public status: OrderStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  confirm(paymentStatus: PaymentStatus): void {
    if (this.status === OrderStatus.CONFIRMED) {
      throw new OrderAlreadyConfirmedException(this.id);
    }
    this.status = OrderStatus.CONFIRMED;
    this.updatedAt = new Date();
  }
}