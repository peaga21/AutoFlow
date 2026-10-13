import { BadRequestException } from '@nestjs/common';
import { PaymentStatus } from '../enums/payment-status.enum.js';

export class PaymentNotApprovedException extends BadRequestException {
  constructor(status: PaymentStatus) {
    super(`Payment is not approved. Current status: ${status}`);
  }
}