import { ConflictException } from '@nestjs/common';

export class OrderAlreadyConfirmedException extends ConflictException {
  constructor(orderId: string) {
    super(`Order with ID ${orderId} is already confirmed.`);
  }
}