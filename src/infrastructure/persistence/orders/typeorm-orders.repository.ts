import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.orm-entity';
import { Order } from '../../../modules/orders/entities/order.entity';
const toPersistence = (order: Order): OrderEntity =>
  order as unknown as OrderEntity;

const toDomain = (entity: OrderEntity): Order => entity as unknown as Order;

@Injectable()
export class TypeOrmOrdersRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {}

  async create(order: Order): Promise<void> {
    const entity = toPersistence(order);
    await this.repository.save(entity);
  }

  async findById(orderId: string): Promise<Order | null> {
    const entity = await this.repository.findOne({ where: { orderId } });
    if (!entity) return null;
    return toDomain(entity);
  }

  async findAll(): Promise<Order[]> {
    const entities = await this.repository.find();
    return entities.map(toDomain);
  }

  async update(order: Order): Promise<void> {
    const entity = toPersistence(order);
    await this.repository.save(entity);
  }

  async delete(orderId: string): Promise<void> {
    // O softDelete usa a coluna @DeleteDateColumn que você configurou
    await this.repository.softDelete({ orderId });
  }
}