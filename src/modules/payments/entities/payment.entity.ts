import { PaymentStatus } from '../../../common/enums/payment-status.enum.js';

export class Payment {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public status: PaymentStatus,
    public readonly amount: number,
    public readonly method: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}