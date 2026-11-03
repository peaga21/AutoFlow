import { OrderEntity, OrderStatus as OrderEntityStatus } from './order.orm-entity';
import { Order } from '../../../modules/orders/entities/order.entity'; // Ajuste o caminho para a sua entidade de domínio

export class OrderMapper {
  static toDomain(entity: OrderEntity): Order {
    return new Order(
      entity.orderId,
      entity.customerId,
      entity.status as unknown as Order['status'],
      entity.createdAt,
      entity.updatedAt
    );
  }

  static toPersistence(domain: Order): OrderEntity {
    const entity = new OrderEntity();
    entity.orderId = domain.id; // Supondo que a classe de domínio use 'id'
    entity.customerId = domain.customerId;
    entity.status = domain.status as unknown as OrderEntityStatus;
    return entity;
  }
}