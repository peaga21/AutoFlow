import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConflictException } from '@nestjs/common';
import { PartsService } from './parts.service.js';
import { type PartsRepository } from '../repositories/parts.repository.interface.js';
import { Part } from '../domain/part.entity.js';

describe('PartsService', () => {
  let service: PartsService;
  let mockRepository: PartsRepository;

  beforeEach(() => {
    mockRepository = {
      findByCode: vi.fn(),
      save: vi.fn(),
    };
    service = new PartsService(mockRepository);
  });

  it('should create and save a new part when data is valid and code is unique', async () => {
    const dto = {
      code: 'PART-2026-X',
      name: 'Vela de Ignição Bosch Super Plus',
      price: 29.9,
      stockQuantity: 50,
      categoryId: '2c62c3e2-8924-4f81-a67b-1188371192e2',
    };

    (mockRepository.findByCode as any).mockResolvedValue(null);
    (mockRepository.save as any).mockImplementation((part: Part) => Promise.resolve(part));

    const result = await service.createPart(dto);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.code).toBe(dto.code);
    expect(result.name).toBe(dto.name);
    expect(result.price).toBe(dto.price);
    expect(result.stockQuantity).toBe(dto.stockQuantity);
    expect(result.categoryId).toBe(dto.categoryId);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(mockRepository.findByCode).toHaveBeenCalledWith('PART-2026-X');
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw ConflictException when part code already exists in repository', async () => {
    const dto = {
      code: 'PART-2026-X',
      name: 'Vela de Ignição Bosch Super Plus',
      price: 29.9,
      stockQuantity: 50,
      categoryId: '2c62c3e2-8924-4f81-a67b-1188371192e2',
    };

    const existingPart = Part.create(dto);
    (mockRepository.findByCode as any).mockResolvedValue(existingPart);

    await expect(service.createPart(dto)).rejects.toThrow(ConflictException);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
