import { Module } from '@nestjs/common';
import { PartsController } from './controllers/parts.controller.js';
import { PartsService } from './services/parts.service.js';
import { PARTS_REPOSITORY } from './repositories/parts.repository.interface.js';
import { InMemoryPartsRepository } from './repositories/in-memory-parts.repository.js';

@Module({
  controllers: [PartsController],
  providers: [
    PartsService,
    {
      provide: PARTS_REPOSITORY,
      useClass: InMemoryPartsRepository,
    },
  ],
  exports: [PartsService, PARTS_REPOSITORY],
})
export class PartsModule {}
