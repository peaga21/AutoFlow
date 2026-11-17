import { Body, Controller, HttpCode, HttpStatus, Inject, Post, ValidationPipe } from '@nestjs/common';
import { PartsService } from '../services/parts.service.js';
import { CreatePartDto } from '../dtos/create-part.dto.js';
import { CreatePartResponseDto } from '../dtos/create-part-response.dto.js';

@Controller('parts')
export class PartsController {
  constructor(
    @Inject(PartsService)
    private readonly partsService: PartsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPart(
    @Body(new ValidationPipe({ whitelist: true, transform: true, expectedType: CreatePartDto }))
    dto: CreatePartDto,
  ): Promise<CreatePartResponseDto> {
    return this.partsService.createPart(dto);
  }
}
