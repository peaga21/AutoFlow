# Artefato 08-01 — Diagnóstico da Arquitetura e Recuperação da Linha de Base

## 1. Identificação Geral do Projeto e Contexto

* **Projeto:** AutoFlow — Plataforma Corporativa de Gestão Operacional para Oficinas Mecânicas
* **Módulo:** Estoque e Almoxarifado (*Inventory / Parts*)
* **Caso de Uso Principal:** `[UC12]` Cadastrar Peça (Epic Issue [#5](https://github.com/peaga21/AutoFlow/issues/5))
* **Sub-Issues Relacionadas:**
  * [#6 — [SUB-01] feat(domain): modelar entidade Part e regras de negócio](https://github.com/peaga21/AutoFlow/issues/6)
  * [#7 — [SUB-02] feat(contracts): definir DTOs de entrada/saída e porta IPartsRepository](https://github.com/peaga21/AutoFlow/issues/7)
  * [#8 — [SUB-03] feat(infra): implementar persistência TypeORM e migration PostgreSQL](https://github.com/peaga21/AutoFlow/issues/8)
  * [#9 — [SUB-04] feat(application): implementar serviço de aplicação PartsService](https://github.com/peaga21/AutoFlow/issues/9)
  * [#10 — [SUB-05] feat(api): expor endpoint POST /parts no PartsController](https://github.com/peaga21/AutoFlow/issues/10)
  * [#11 — [SUB-06] test(e2e): implementar testes automatizados unitários e integrados com Vitest](https://github.com/peaga21/AutoFlow/issues/11)
* **Desenvolvedor:** Pedro Henrique Dias (`@peaga21`) — Modo Solo
* **Branch Ativa:** `feat/sub-05-http-endpoint`

---

## 2. Componentes Reais Identificados e Arquitetura em Camadas

A aplicação backend do AutoFlow estrutura o caso de uso `[UC12]` em camadas concêntricas (Clean Architecture), preservando a regra de dependência:

```text
               +-------------------------------------------------------+
               | Camada de Borda / HTTP                                |
               | PartsController (POST /parts) + ValidationPipe        |
               +---------------------------+---------------------------+
                                           | (usa DTO)
                                           v
               +-------------------------------------------------------+
               | Camada de Aplicação                                   |
               | PartsService (createPart)                             |
               +-------------+---------------------------+-------------+
                             |                           |
                             v                           v
              +--------------------------+  +--------------------------+
              | Camada de Domínio Puro   |  | Porta de Persistência    |
              | Part Entity (create)     |  | PartsRepository (Token)  |
              +--------------------------+  +-------------+------------+
                                                          |
                                                          v (implementa)
                                            +--------------------------+
                                            | Infraestrutura (Memória) |
                                            | InMemoryPartsRepository  |
                                            +--------------------------+
```

---

## 3. Contratos Preservados

| Elemento | Arquivo / Contrato | Papel no Sistema |
| :--- | :--- | :--- |
| **Entidade** | [`part.entity.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/domain/part.entity.ts) | Núcleo de domínio, invariantes, fábrica `Part.create` |
| **DTO de Entrada** | [`create-part.dto.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/dtos/create-part.dto.ts) | Validação sintática de borda via `class-validator` |
| **DTO de Saída** | [`create-part-response.dto.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/dtos/create-part-response.dto.ts) | Desacoplamento da representação serializada |
| **Porta** | [`parts.repository.interface.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/repositories/parts.repository.interface.ts) | Interface `PartsRepository` e token `PARTS_REPOSITORY` |
| **Serviço** | [`parts.service.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/services/parts.service.ts) | Orquestração do caso de uso e validação de SKU |
| **Controller** | [`parts.controller.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/controllers/parts.controller.ts) | Rota REST `POST /parts` com status `201 Created` |
| **Repositório** | [`in-memory-parts.repository.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/repositories/in-memory-parts.repository.ts) | Implementação real em memória para execução standalone |

---

## 4. Recuperação Real da Linha de Base dos Testes (Fase 3)

Comando executado no terminal na branch `feat/sub-05-http-endpoint`:
```bash
pnpm vitest run src/modules/
```

Saída real do terminal:
```text
 RUN  v3.2.7 C:/Users/pedro/.vscode/AutoFlow

 ✓ src/modules/parts/domain/part.entity.spec.ts (1 test) 4ms
 ✓ src/modules/parts/services/parts.service.spec.ts (2 tests) 10ms
 ✓ src/modules/orders/services/orders.service.spec.ts (6 tests) 32ms
 ✓ src/modules/parts/controllers/parts.controller.spec.ts (3 tests) 504ms
   ✓ PartsController (HTTP Boundary) > POST /parts should return 201 Created and delegate to service when valid payload is provided  471ms

 Test Files  4 passed (4)
      Tests  12 passed (12)
   Start at  14:47:39
   Duration  3.57s (transform 530ms, setup 0ms, collect 4.99s, tests 551ms, environment 1ms, prepare 1.35s)
```

### Síntese da Linha de Base:
* **Arquivos de Teste:** 4 executados, 4 aprovados (100%).
* **Quantidade Total de Testes:** 12 executados, 12 aprovados (0 falhas).
* **Ausência de Regressões:** Confirmada integridade total da suíte pré-existente antes da introdução dos testes integrados do backend.
