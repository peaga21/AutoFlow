import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { Part } from '../domain/part.entity.js';
import { CreatePartDto } from '../dtos/create-part.dto.js';
import { CreatePartResponseDto } from '../dtos/create-part-response.dto.js';
import { PARTS_REPOSITORY, type PartsRepository } from '../repositories/parts.repository.interface.js';

@Injectable()
export class PartsService {
  constructor(
    @Inject(PARTS_REPOSITORY)
    private readonly partsRepository: PartsRepository,
  ) {}

  async createPart(dto: CreatePartDto): Promise<CreatePartResponseDto> {
    const existingPart = await this.partsRepository.findByCode(dto.code);
    if (existingPart) {
      throw new ConflictException(`Part with code ${dto.code} already exists`);
    }

    const part = Part.create({
      code: dto.code,
      name: dto.name,
      price: dto.price,
      stockQuantity: dto.stockQuantity,
      categoryId: dto.categoryId,
    });

    const savedPart = await this.partsRepository.save(part);

    return {
      id: savedPart.id,
      code: savedPart.code,
      name: savedPart.name,
      price: savedPart.price,
      stockQuantity: savedPart.stockQuantity,
      categoryId: savedPart.categoryId,
      createdAt: savedPart.createdAt,
    };
  }
}
