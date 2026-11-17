import { Part } from '../domain/part.entity.js';

export const PARTS_REPOSITORY = Symbol('PARTS_REPOSITORY');

export interface PartsRepository {
  findByCode(code: string): Promise<Part | null>;
  save(part: Part): Promise<Part>;
}
