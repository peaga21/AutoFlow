import { describe, it, expect } from 'vitest';
import { Part, CreatePartProps } from './part.entity';

describe('Part Domain Entity (TDD RED)', () => {
  it('should instantiate a valid Part entity with generated ID and timestamp when valid data is provided (CA-01)', () => {
    // Arrange (Preparação de dados válidos)
    const validProps: CreatePartProps = {
      code: 'PART-2026-X',
      name: 'Vela de Ignição Bosch Super Plus',
      price: 29.90,
      stockQuantity: 50,
      categoryId: '2c62c3e2-8924-4f81-a67b-1188371192e2',
    };

    // Act (Ação: Invocação do método de fábrica de domínio)
    const part = Part.create(validProps);

    // Assert (Verificação: Garantia do estado da entidade)
    expect(part).toBeDefined();
    expect(part.id).toBeDefined();
    expect(typeof part.id).toBe('string');
    expect(part.id.length).toBeGreaterThan(0);
    expect(part.code).toBe(validProps.code);
    expect(part.name).toBe(validProps.name);
    expect(part.price).toBe(validProps.price);
    expect(part.stockQuantity).toBe(validProps.stockQuantity);
    expect(part.categoryId).toBe(validProps.categoryId);
    expect(part.createdAt).toBeInstanceOf(Date);
  });
});
