import { Injectable } from '@nestjs/common';
import { Part } from '../domain/part.entity.js';
import { PartsRepository } from './parts.repository.interface.js';

@Injectable()
export class InMemoryPartsRepository implements PartsRepository {
  private readonly parts: Map<string, Part> = new Map();

  async findByCode(code: string): Promise<Part | null> {
    for (const part of this.parts.values()) {
      if (part.code === code) {
        return part;
      }
    }
    return null;
  }

  async save(part: Part): Promise<Part> {
    this.parts.set(part.id, part);
    return part;
  }

  clear(): void {
    this.parts.clear();
  }
}
