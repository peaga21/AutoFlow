import { NotFoundException } from '@nestjs/common';

export class PaymentNotFoundException extends NotFoundException {
  constructor(orderId: string) {
    super(`Payment for order with ID ${orderId} not found.`);
  }
}