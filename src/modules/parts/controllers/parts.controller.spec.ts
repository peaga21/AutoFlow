import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, INestApplication, ValidationPipe } from '@nestjs/common';
import { PartsController } from './parts.controller.js';
import { PartsService } from '../services/parts.service.js';

describe('PartsController (HTTP Boundary)', () => {
  let app: INestApplication;

  const mockPartsService = {
    createPart: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PartsController],
      providers: [
        {
          provide: PartsService,
          useValue: mockPartsService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /parts should return 201 Created and delegate to service when valid payload is provided', async () => {
    const validPayload = {
      code: 'PART-2026-X',
      name: 'Vela de Ignição Bosch Super Plus',
      price: 29.9,
      stockQuantity: 50,
      categoryId: '2c62c3e2-8924-4f81-a67b-1188371192e2',
    };

    const mockResponse = {
      id: 'e86b0ddc-76e4-4c4f-9e6f-5b1234567890',
      ...validPayload,
      createdAt: new Date().toISOString(),
    };

    mockPartsService.createPart.mockResolvedValueOnce(mockResponse);

    const response = await request(app.getHttpServer())
      .post('/parts')
      .send(validPayload)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(mockResponse.id);
    expect(response.body.code).toBe(validPayload.code);
    expect(response.body.name).toBe(validPayload.name);
    expect(response.body.price).toBe(validPayload.price);
    expect(response.body.stockQuantity).toBe(validPayload.stockQuantity);
    expect(response.body.categoryId).toBe(validPayload.categoryId);
    expect(mockPartsService.createPart).toHaveBeenCalledTimes(1);
    expect(mockPartsService.createPart).toHaveBeenCalledWith(validPayload);
  });

  it('POST /parts should return 400 Bad Request and NOT call service when payload is invalid (empty code/name and negative price)', async () => {
    const invalidPayload = {
      code: '',
      name: '',
      price: -10,
      stockQuantity: -5,
      categoryId: 'invalid-uuid',
    };

    const response = await request(app.getHttpServer())
      .post('/parts')
      .send(invalidPayload)
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.error).toBe('Bad Request');
    expect(mockPartsService.createPart).not.toHaveBeenCalled();
  });

  it('POST /parts should return 409 Conflict when service throws ConflictException (duplicate SKU code)', async () => {
    const validPayload = {
      code: 'PART-DUPLICATE',
      name: 'Vela de Ignição Bosch Super Plus',
      price: 29.9,
      stockQuantity: 50,
      categoryId: '2c62c3e2-8924-4f81-a67b-1188371192e2',
    };

    mockPartsService.createPart.mockRejectedValueOnce(
      new ConflictException('Part with code PART-DUPLICATE already exists'),
    );

    const response = await request(app.getHttpServer())
      .post('/parts')
      .send(validPayload)
      .expect(409);

    expect(response.status).toBe(409);
    expect(response.body.message).toContain('already exists');
    expect(response.body.error).toBe('Conflict');
    expect(mockPartsService.createPart).toHaveBeenCalledWith(validPayload);
  });
});
