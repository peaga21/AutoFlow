# Artefato 08-05 — Implementação e Execução dos Testes Integrados do Backend

## 1. Identificação da Suíte de Testes Integrados

* **Arquivo de Teste Criado:** [`src/modules/parts/test/parts.integration.spec.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/test/parts.integration.spec.ts)
* **Framework de Testes:** Vitest (`v3.2.7`) + Supertest (`v7.3.2`) + `@nestjs/testing`
* **Sub-Issue Vinculada:** [#11 — [SUB-06] test(e2e): implementar testes automatizados unitários e de integração com Vitest](https://github.com/peaga21/AutoFlow/issues/11)
* **Componentes Testados Integrados:** `PartsModule`, `PartsController`, `PartsService`, `InMemoryPartsRepository` (via `PARTS_REPOSITORY`).
* **Regra Rigorosa Cumprida:** Nenhum mock para o `PartsService` ou para o `InMemoryPartsRepository`.

---

## 2. Código-Fonte Completo e Consolidado em Arquivo Único

```typescript
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
```

---

## 3. Registro Autêntico da Saída do Terminal

Comando executado:
```bash
pnpm vitest run src/modules/parts/test/parts.integration.spec.ts
```

Saída real do terminal:
```text
 RUN  v3.2.7 C:/Users/pedro/.vscode/AutoFlow

 ✓ src/modules/parts/test/parts.integration.spec.ts (4 tests) 498ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  14:49:56
   Duration  2.72s (transform 129ms, setup 0ms, collect 1.49s, tests 498ms, environment 0ms, prepare 275ms)
```

---

## 4. Análise da Evidência de Armazenamento (Fase 8)

No Teste 1, para além da validação do status `201 Created` e do JSON retornado, foi realizada a **inspeção direta na coleção do repositório**:
```typescript
const storedPart = await repository.findByCode(validPayload.code);
expect(storedPart).toBeDefined();
expect(storedPart?.id).toBe(response.body.id);
expect(storedPart?.code).toBe(validPayload.code);
```
Essa checagem comprova conclusivamente que a entidade passou por todas as etapas e foi efetivamente armazenada no estado interno do `InMemoryPartsRepository`.

---

## 5. Comparação com a Linha de Base (Ausência de Regressões)

Comando da suíte completa:
```bash
pnpm vitest run src/modules/
```

Saída real:
```text
 Test Files  5 passed (5)
      Tests  16 passed (16)
   Start at  14:50:11
   Duration  4.69s (tests 945ms)
```

| Arquivo de Teste | Qtd Anterior (08-01) | Qtd Atual (08-05) | Status |
| :--- | :---: | :---: | :---: |
| `part.entity.spec.ts` | 1 | 1 | ✅ Preservado |
| `parts.service.spec.ts` | 2 | 2 | ✅ Preservado |
| `parts.controller.spec.ts` | 3 | 3 | ✅ Preservado |
| `orders.service.spec.ts` | 6 | 6 | ✅ Preservado |
| `parts.integration.spec.ts` | — | **4 (Novo)** | ✅ **Aprovado** |
| **Total** | **12** | **16 (+4)** | **Zero regressões** |
