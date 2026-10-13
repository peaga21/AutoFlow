import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller.js';
import { OrdersService } from './services/orders.service.js';
import { ORDERS_REPOSITORY } from './repositories/orders.repository.interface.js';
import { PAYMENTS_REPOSITORY } from '../payments/repositories/payments.repository.interface.js';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: ORDERS_REPOSITORY,
      useValue: {
        findById: async (id: string) => {
          if (id === '123') {
            return {
              id: '123',
              status: 'PENDING',
              totalAmount: 100,
              confirmedAt: null,
              confirm() {
                this.status = 'CONFIRMED';
                this.confirmedAt = new Date();
              },
            };
          }
          return null;
        },
        save: async (order: any) => order,
      },
    },
    {
      provide: PAYMENTS_REPOSITORY,
      useValue: {
        findByOrderId: async (orderId: string) => {
          if (orderId === '123') {
            return {
              id: 'p1',
              orderId: '123',
              status: 'APPROVED',
              isApproved() {
                return true;
              },
            };
          }
          return null;
        },
      },
    },
  ],
})
export class OrdersModule {}