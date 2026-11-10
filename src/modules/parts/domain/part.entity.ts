import { randomUUID } from 'node:crypto';

export interface CreatePartProps {
  id?: string;
  code: string;
  name: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  createdAt?: Date;
}

export class Part {
  id!: string;
  code!: string;
  name!: string;
  price!: number;
  stockQuantity!: number;
  categoryId!: string;
  createdAt!: Date;

  static create(props: CreatePartProps): Part {
    const part = new Part();
    part.id = props.id || randomUUID();
    part.code = props.code;
    part.name = props.name;
    part.price = props.price;
    part.stockQuantity = props.stockQuantity;
    part.categoryId = props.categoryId;
    part.createdAt = props.createdAt || new Date();
    return part;
  }
}
