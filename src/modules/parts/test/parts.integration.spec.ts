import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PartsModule } from '../parts.module.js';
import { PARTS_REPOSITORY } from '../repositories/parts.repository.interface.js';
import { InMemoryPartsRepository } from '../repositories/in-memory-parts.repository.js';
import { PartsController } from '../controllers/parts.controller.js';
import { PartsService } from '../services/parts.service.js';

describe('Parts Backend Integration (Full Chain)', () => {
  let app: INestApplication;
  let repository: InMemoryPartsRepository;

  beforeAll(async () => {
    // Inicialização do módulo real da feature sem dublês (mocks) para o Service ou Repositório
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PartsModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();

    // Recuperação da instância real do repositório em memória resolvido pelo container de IoC
    repository = moduleRef.get<InMemoryPartsRepository>(PARTS_REPOSITORY);
  });

  afterAll(async () => {
    await app?.close();
  });

  beforeEach(() => {
    repository.clear();
  });

  it('deve executar o fluxo integrado completo (Controller -> Service -> InMemoryRepository) e retornar 201 Created', async () => {
    const validPayload = {
      code: 'PART-INTEGRATED-01',
      name: 'Pastilha de Freio Cerâmica Fras-le',
      price: 189.9,
      stockQuantity: 25,
      categoryId: '2c62c3e2-8924-4f81-a67b-1188371192e2',
    };

    // Act: Requisição HTTP real atravessando toda a pilha
    const response = await request(app.getHttpServer())
      .post('/parts')
      .send(validPayload)
      .expect(201);

    // Assert: Resposta HTTP
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      code: validPayload.code,
      name: validPayload.name,
      price: validPayload.price,
      stockQuantity: validPayload.stockQuantity,
      categoryId: validPayload.categoryId,
    });
    expect(response.body.id).toEqual(expect.any(String));
    expect(response.body.createdAt).toBeDefined();

    // Assert de Armazenamento: Inspeção direta no estado interno do repositório real
    const storedPart = await repository.findByCode(validPayload.code);
    expect(storedPart).toBeDefined();
    expect(storedPart?.id).toBe(response.body.id);
    expect(storedPart?.code).toBe(validPayload.code);
    expect(storedPart?.name).toBe(validPayload.name);
  });

  it('deve rejeitar payload inválido na fronteira HTTP com 400 Bad Request sem persistir no repositório', async () => {
    const invalidPayload = {
      code: '',
      name: '',
      price: -50,
      stockQuantity: -10,
      categoryId: 'uuid-invalido',
    };

    const response = await request(app.getHttpServer())
      .post('/parts')
      .send(invalidPayload)
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(Array.isArray(response.body.message)).toBe(true);

    // Garantia de que nada foi persistido no repositório em memória
    const storedPart = await repository.findByCode(invalidPayload.code);
    expect(storedPart).toBeNull();
  });

  it('deve retornar 409 Conflict ao tentar cadastrar peça com código SKU duplicado usando o Service e Repositório reais', async () => {
    const initialPayload = {
      code: 'PART-SKU-DUP',
      name: 'Filtro de Óleo Mann Filter',
      price: 45.0,
      stockQuantity: 40,
      categoryId: '2c62c3e2-8924-4f81-a67b-1188371192e2',
    };

    // 1ª Requisição: Cadastro com sucesso
    await request(app.getHttpServer())
      .post('/parts')
      .send(initialPayload)
      .expect(201);

    // 2ª Requisição com o mesmo código SKU: O Service real consulta o InMemoryRepository real e dispara ConflictException
    const duplicateResponse = await request(app.getHttpServer())
      .post('/parts')
      .send({
        ...initialPayload,
        name: 'Filtro de Óleo Mann Filter (Tentativa Duplicada)',
      })
      .expect(409);

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body.message).toContain('already exists');
    expect(duplicateResponse.body.error).toBe('Conflict');
  });

  it('diagnóstico de falha: deve lançar UnknownDependenciesException ao tentar compilar módulo sem o provider do token de repositório', async () => {
    // Experimento isolado de injeção de dependência: PartsController + PartsService sem o PARTS_REPOSITORY
    await expect(
      Test.createTestingModule({
        controllers: [PartsController],
        providers: [PartsService],
      }).compile(),
    ).rejects.toThrow();
  });
});
