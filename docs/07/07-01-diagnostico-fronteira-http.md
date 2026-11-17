# Artefato 07-01 — Diagnóstico da Fronteira HTTP

## 1. Identificação do Projeto e Contexto

* **Projeto:** AutoFlow — Plataforma Corporativa de Gestão Operacional para Oficinas Mecânicas
* **Módulo:** Estoque e Almoxarifado (*Inventory / Parts*)
* **Caso de Uso Principal:** `[UC12]` Cadastrar Peça (Epic Issue [#5](https://github.com/peaga21/AutoFlow/issues/5))
* **Sub-Issue Responsável pelo Endpoint HTTP:** [#10 — [SUB-05] feat(api): expor endpoint POST /parts no PartsController](https://github.com/peaga21/AutoFlow/issues/10)
* **Sub-Issues Coordenadas/Relacionadas:**
  * [#6 — [SUB-01] feat(domain): modelar entidade Part e regras de negócio](https://github.com/peaga21/AutoFlow/issues/6)
  * [#7 — [SUB-02] feat(contracts): definir DTOs de entrada/saída e porta IPartsRepository](https://github.com/peaga21/AutoFlow/issues/7)
  * [#9 — [SUB-04] feat(application): implementar serviço de aplicação PartsService](https://github.com/peaga21/AutoFlow/issues/9)
* **Desenvolvedor:** Pedro Henrique Dias (`@peaga21`) — Modo Solo
* **Branch Base de Partida:** `feat/sub-01-domain-part` (Material 06)
* **Branch Ativa:** `feat/sub-05-http-endpoint`

---

## 2. Delimitação de Responsabilidades entre Sub-Issues (Refinamento 1)

Para evitar vazamento ou duplicação indevida de escopo, as responsabilidades arquiteturais do caso de uso `[UC12]` são rigorosamente delimitadas:

| Sub-Issue | Papel Arquitetural | Escopo Permitido nesta Etapa | O que NÃO pertence a esta etapa |
| :--- | :--- | :--- | :--- |
| **`[SUB-01]` (Domínio)** | Entidade `Part` e invariantes | Reutilizada integralmente da etapa GREEN | Não alterar a entidade ou regras já aprovadas |
| **`[SUB-02]` (Contratos/DTO)** | `CreatePartDto`, `CreatePartResponseDto`, `PartsRepository` | Definidos formalmente para transporte e tipagem | Não implementar regras de persistência real aqui |
| **`[SUB-04]` (Aplicação)** | `PartsService.createPart` | Orquestração do caso de uso e validação de SKU | Não misturar com parsing HTTP ou banco relacional |
| **`[SUB-05]` (Fronteira HTTP)** | `PartsController` (`POST /parts`) | Roteamento, validação sintática via DTO/Pipe, delegação ao serviço | Não executar lógica de domínio ou queries SQL |
| **`[SUB-06]` (Testes)** | Testes da fronteira HTTP e regressão | Exercitar rota com Supertest (201 e 400) e checar suíte | Não substituir testes de persistência real E2E |

---

## 3. Contratos Existentes Recuperados

### 3.1. Entidade de Domínio (`Part`)
* **Arquivo:** [`src/modules/parts/domain/part.entity.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/domain/part.entity.ts)
* **Propriedades:** `id` (UUID), `code` (string), `name` (string), `price` (number), `stockQuantity` (number), `categoryId` (string), `createdAt` (Date).
* **Fábrica:** `Part.create(props: CreatePartProps): Part` (reutilizada sem alterações).

### 3.2. Contrato de Persistência
* **Porta:** `PartsRepository` (`findByCode(code: string): Promise<Part | null>`, `save(part: Part): Promise<Part>`).
* **Token de Injeção:** `PARTS_REPOSITORY = Symbol('PARTS_REPOSITORY')`.
* **Implementação para esta etapa:** `InMemoryPartsRepository` para viabilizar execução isolada em memória da aplicação sem dependência de PostgreSQL ativo.

---

## 4. Avaliação da Definition of Ready (DoR)

| Critério DoR | Descrição | Avaliação | Justificativa |
| :---: | :--- | :---: | :--- |
| **DoR-01** | Objetivo claramente definido | **Atende** | Expor `POST /parts` no NestJS conectando DTO, pipe e serviço de aplicação. |
| **DoR-02** | Escopo delimitado | **Atende** | Restrito à camada HTTP, DTOs e composição de módulos; sem acoplamento a ORM real. |
| **DoR-03** | Critérios de aceite verificáveis | **Atende** | Sucesso com `201 Created` e rejeição de payload malformado com `400 Bad Request`. |
| **DoR-04** | Dependências identificadas | **Atende** | Depende do domínio `Part` (pronto) e dos pacotes `class-validator`/`class-transformer`. |
| **DoR-05** | Informações disponíveis | **Atende** | Rota `/parts`, verbo `POST`, campos do payload (`code`, `name`, `price`, `stockQuantity`, `categoryId`). |
| **DoR-06** | Responsável definido | **Atende** | Pedro Henrique Dias (`@peaga21`). |
| **DoR-07** | Revisão de planejamento | **Atende** | Planejamento registrado e sincronizado com os artefatos das etapas anteriores. |

---

## 5. Dependências Técnicas e Pacotes (`package.json`)

* **Framework Base:** `@nestjs/core` v11.2.7, `@nestjs/common` v11.2.7, `@nestjs/platform-express` v11.0.1.
* **Validação de Entrada:** `class-validator` v0.15.1, `class-transformer` v0.5.1 (instalados).
* **Testes HTTP:** `supertest` v7.3.2, `@types/supertest` v7.2.1, `vitest` v3.2.7 (configurados).
* **Compilação TypeScript:** `tsconfig.build.json` configurado excluindo arquivos `.spec.ts` para compilação estável via `nest build`.

---

## 6. Situação de Branches e Testes Pré-Execução

* **Branch de Origem:** `feat/sub-01-domain-part` (sincronizada com commit `74fe127`).
* **Nova Branch de Trabalho:** `feat/sub-05-http-endpoint`.
* **Suíte de Testes Pré-Existente:**
  * `part.entity.spec.ts` (1 teste) — ✅ Passed
  * `orders.service.spec.ts` (6 testes) — ✅ Passed
* **Status:** Prontidão aprovada para início da implementação da fronteira HTTP.
