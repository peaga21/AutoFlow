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

  static create(_props: CreatePartProps): Part {
    // Fase RED do TDD: Método propositalmente não implementado para evidenciar a falha funcional
    throw new Error('Method not implemented: Part.create');
  }
}
