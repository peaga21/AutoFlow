import { Controller, Param, Post } from '@nestjs/common';
import { OrdersService } from '../services/orders.service.js';
import { ConfirmOrderResponseDto } from '../dtos/confirm-order-response.dto.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(':id/confirm')
  async confirmOrder(@Param('id') id: string): Promise<ConfirmOrderResponseDto> {
    return this.ordersService.confirmOrder(id);
  }
}