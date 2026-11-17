# Artefato 07-06 — Testes Automatizados da Fronteira HTTP

## 1. Identificação da Suíte de Testes da Fronteira HTTP

* **Sub-Issue Vinculada:** [#11 — [SUB-06] test(e2e): implementar testes automatizados unitários e de integração com Vitest](https://github.com/peaga21/AutoFlow/issues/11)
* **Arquivo de Teste Criado:** [`src/modules/parts/controllers/parts.controller.spec.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/controllers/parts.controller.spec.ts)
* **Framework e Ferramentas:** Vitest (`v3.2.7`), `@nestjs/testing`, `supertest` (`v7.3.2`)
* **Nível de Teste:** Teste de Integração da Fronteira HTTP (*HTTP Boundary Integration Test*) com simulação isolada da camada de aplicação via mock.

---

## 2. Cenários Automatizados Implementados (Refinamento 3)

### 2.1. Teste 1 — Operação com Dados Válidos (`POST /parts` ➔ `201 Created`)
* **Objetivo:** Garantir que o controller responda na rota `POST /parts` com `201 Created`, converta os dados via DTO, delegue a execução ao método `createPart` do serviço e retorne o corpo JSON serializado.
* **Asserções Realizadas:**
  * Status code `201`;
  * `response.body` definido contendo `id`, `code`, `name`, `price`, `stockQuantity`, `categoryId`;
  * `expect(mockPartsService.createPart).toHaveBeenCalledTimes(1)`;
  * `expect(mockPartsService.createPart).toHaveBeenCalledWith(validPayload)`.

### 2.2. Teste 2 — Rejeição de Entrada Inválida (`POST /parts` ➔ `400 Bad Request`)
* **Objetivo:** Garantir que o `ValidationPipe` intercepte payloads inválidos (campos vazios, números negativos, UUID incorreto), retorne `400 Bad Request` com array de mensagens de erro e comprove que o serviço de aplicação **não foi chamado**.
* **Asserções Realizadas:**
  * Status code `400`;
  * `response.body.error === 'Bad Request'`;
  * `Array.isArray(response.body.message) === true`;
  * `expect(mockPartsService.createPart).not.toHaveBeenCalled()`.

---

## 3. Código-Fonte Completo dos Testes HTTP

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
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
});
```

---

## 4. Registro Real das Saídas do Terminal

### 4.1. Execução dos Testes da Fronteira HTTP
Comando executado:
```bash
pnpm vitest run src/modules/parts/controllers/parts.controller.spec.ts
```

Saída real do terminal:
```text
 RUN  v3.2.7 C:/Users/pedro/.vscode/AutoFlow

 ✓ src/modules/parts/controllers/parts.controller.spec.ts (2 tests) 357ms
   ✓ PartsController (HTTP Boundary) > POST /parts should return 201 Created and delegate to service when valid payload is provided  343ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  14:03:44
   Duration  2.53s (transform 114ms, setup 0ms, collect 1.45s, tests 357ms, environment 0ms, prepare 294ms)
```

### 4.2. Execução dos Testes do Serviço de Aplicação
Comando executado:
```bash
pnpm vitest run src/modules/parts/services/parts.service.spec.ts
```

Saída real do terminal:
```text
 RUN  v3.2.7 C:/Users/pedro/.vscode/AutoFlow

 ✓ src/modules/parts/services/parts.service.spec.ts (2 tests) 8ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  14:03:57
   Duration  1.69s (transform 115ms, setup 0ms, collect 741ms, tests 8ms, environment 0ms, prepare 412ms)
```

### 4.3. Reexecução dos Testes da Entidade de Domínio (Ausência de Regressão)
Comando executado:
```bash
pnpm vitest run src/modules/parts/domain/part.entity.spec.ts
```

Saída real do terminal:
```text
 RUN  v3.2.7 C:/Users/pedro/.vscode/AutoFlow

 ✓ src/modules/parts/domain/part.entity.spec.ts (1 test) 4ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  14:04:07
   Duration  991ms (transform 89ms, setup 0ms, collect 116ms, tests 4ms, environment 0ms, prepare 384ms)
```

### 4.4. Suíte de Regressão do Módulo `Orders`
Comando executado:
```bash
pnpm vitest run src/modules/orders/services/orders.service.spec.ts
```

Saída real do terminal:
```text
 RUN  v3.2.7 C:/Users/pedro/.vscode/AutoFlow

 ✓ src/modules/orders/services/orders.service.spec.ts (6 tests) 27ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  14:04:23
   Duration  2.29s (transform 171ms, setup 0ms, collect 1.39s, tests 27ms, environment 0ms, prepare 390ms)
```

---

## 5. Matriz Consolidada de Verificação de Testes

| Arquivo de Teste | Camada | Qtd Testes | Status | Regressão? |
| :--- | :--- | :---: | :---: | :---: |
| `parts.controller.spec.ts` | Fronteira HTTP | 2 | ✅ **2 passed** | Nenhuma (Novo) |
| `parts.service.spec.ts` | Aplicação | 2 | ✅ **2 passed** | Nenhuma (Novo) |
| `part.entity.spec.ts` | Domínio Puro | 1 | ✅ **1 passed** | Nenhuma (Preservado) |
| `orders.service.spec.ts` | Regressão Geral | 6 | ✅ **6 passed** | Nenhuma (Preservado) |
| **Total Geral** | — | **11** | ✅ **11 passed (100%)** | **Zero regressões** |
