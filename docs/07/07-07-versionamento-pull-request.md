# Artefato 07-07 — Versionamento, Commits e Pull Request

## 1. Identificação Geral da Submissão

* **Sub-Issue Vinculada:** [#10 — [SUB-05] feat(api): expor endpoint POST /parts no PartsController](https://github.com/peaga21/AutoFlow/issues/10)
* **Sub-Issues Coordenadas:**
  * [#7 — [SUB-02] feat(contracts): definir DTOs de entrada/saída e porta IPartsRepository](https://github.com/peaga21/AutoFlow/issues/7)
  * [#9 — [SUB-04] feat(application): implementar serviço de aplicação PartsService](https://github.com/peaga21/AutoFlow/issues/9)
  * [#11 — [SUB-06] test(e2e): implementar testes automatizados da fronteira HTTP com Vitest](https://github.com/peaga21/AutoFlow/issues/11)
* **Branch de Origem (*Head Branch*):** `feat/sub-05-http-endpoint`
* **Branch-Base de Destino (*Base Branch*):** `feat/sub-01-domain-part`
* **Padrão Semântico de Commits:** *Conventional Commits*

---

## 2. Relação de Branches Dependentes

A branch `feat/sub-05-http-endpoint` foi derivada a partir de `feat/sub-01-domain-part` para ter acesso à entidade de domínio `Part` sem violar o princípio de estabilidade da branch `main`.

```text
main
  └── feat/sub-01-domain-part (PR A - Domínio e testes unitários)
        └── feat/sub-05-http-endpoint (PR B - Fronteira HTTP, DTOs e Módulos)
```

* **Commits Herdados da Branch-Base:** `32d2a9c`, `9a7984e`, `74fe127`
* **Commits Exclusivos Desta Etapa:** Commit da implementação HTTP, DTOs, módulos e documentação 07.

---

## 3. Minuta do Pull Request

* **Título do Pull Request:** `feat(parts): add HTTP endpoint POST /parts with validation and tests (#10)`
* **Estado:** **Draft (Rascunho)** / Aberto para Revisão Técnica

### Descrição do PR:
```markdown
## 🚀 Pull Request — [SUB-05] feat(api): expor endpoint POST /parts no PartsController

### 📌 Issues Vinculadas
- Fixes #10 (Sub-Issue SUB-05: Endpoint HTTP)
- Relacionada a #7 (SUB-02: DTOs e Contrato IPartsRepository)
- Relacionada a #9 (SUB-04: PartsService)
- Relacionada a #11 (SUB-06: Testes HTTP)
- Épico: #5 ([UC12] Cadastrar Peça)

### 🎯 Objetivo
Disponibilizar a rota HTTP `POST /parts` via NestJS, implementando a validação de entrada na fronteira via `CreatePartDto` e `ValidationPipe`, orquestrando a criação no `PartsService` e garantindo isolamento da persistência através de `InMemoryPartsRepository`.

### 🛠️ Alterações Incluídas
- **Controller HTTP:** `src/modules/parts/controllers/parts.controller.ts` (`@Post() /parts`)
- **DTOs de Entrada e Saída:** `CreatePartDto` e `CreatePartResponseDto`
- **Validação:** `@IsString()`, `@IsNotEmpty()`, `@IsPositive()`, `@Min(0)`, `@IsUUID()`
- **Serviço de Aplicação:** `PartsService` com injeção do token `PARTS_REPOSITORY`
- **Repositório em Memória:** `InMemoryPartsRepository` para dev e testes locais
- **Módulo Feature:** `PartsModule` registrado em `AppModule`
- **Testes da Fronteira HTTP:** `parts.controller.spec.ts` com Supertest (201 e 400)
- **Testes de Aplicação:** `parts.service.spec.ts` (sucesso e conflito de SKU)

### 🧪 Evidências de Testes (100% Verde)
\`\`\`text
 ✓ src/modules/parts/controllers/parts.controller.spec.ts (2 tests) 357ms
 ✓ src/modules/parts/services/parts.service.spec.ts (2 tests) 8ms
 ✓ src/modules/parts/domain/part.entity.spec.ts (1 test) 4ms
 ✓ src/modules/orders/services/orders.service.spec.ts (6 tests) 27ms
 Total: 11 passed (100%)
\`\`\`

### 🌐 Evidência de Requisição HTTP Real
- `POST /parts` (Payload Válido) ➔ `201 Created`
- `POST /parts` (Payload Inválido) ➔ `400 Bad Request` com array de mensagens de validação

### ⏳ Próximos Passos
- [ ] Revisão técnica por pares
- [ ] Implementação de persistência real PostgreSQL / TypeORM (SUB-03)
- [ ] Testes E2E com container de banco de dados
```

---

## 4. Status no GitHub Project

* **Sub-Issue `#10` (`[SUB-05]`):** Movida para **`In Review`** no Project `#2` (*Planejamento - UC12 Cadastrar Peça*).
* **Epic `#5` (`[UC12]`):** Permanece em **`In Progress`**, pois as Sub-Issues `#8` (Persistência TypeORM/Migration PostgreSQL), `#11` (Testes E2E reais) e `#12` (OpenAPI/Docs) ainda estão pendentes.
* **Política de Integração:** Nenhum merge direto na `main` foi executado; a integração ocorrerá de forma controlada após a aprovação de toda a cadeia.
