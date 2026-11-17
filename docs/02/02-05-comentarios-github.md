# Artefato 05 — Comentários Técnicos para o GitHub

Este artefato reúne os textos prontos para publicação na aba de comentários de cada uma das Sub-Issues cadastradas no repositório `peaga21/AutoFlow`.

---

## Template Padrão de Conclusão de Revisão Humana
*(Utilize este modelo ao formalizar a aprovação da revisão na Issue do GitHub)*

```markdown
### 📋 Registro de Revisão de Planejamento

**Revisor:** @peaga21 *(ou @revisor_docente)*  
**Issue:** [SUB-XX] - [Título da Sub-Issue]  
**Data da Revisão:** 03/11/2026  
**Resultado:** [x] Aprovada sem ressalvas | [ ] Aprovada com ajustes menores | [ ] Ajustes necessários solicitados  

**Observações Técnicas:**
- Especificação em conformidade com as regras de negócio do caso de uso UC12.
- Critérios de aceite mensuráveis, objetivos e passíveis de verificação automatizada.
- Limites arquiteturais de Clean Architecture respeitados (sem vazamento de detalhes de infraestrutura).

**Ajustes Solicitados:**
- [Nenhum ajuste impeditivo; seguir com a implementação conforme planejado].

**Conclusão e Prontidão:**
- [x] Issue plenamente liberada para o estado **Ready**.
```

---

## Comentários Técnicos Pré-Formatados para Publicação

### Comentário para a Issue #6 (`[SUB-01] feat(domain): modelar entidade Part e regras de negócio`)
```markdown
### 🔍 Auditoria Técnica de Planejamento — Sub-Issue #6 (SUB-01)

**Revisor Responsável:** Auditoria Técnica de Software / @peaga21  
**Fase de Avaliação:** Pré-análise de Definition of Ready (DoR)

#### 1. Elementos Avaliados
- [x] Objetivo e escopo da entidade de domínio puro `Part`.
- [x] Invariantes de negócio: preço $> 0$, estoque $\ge 0$ e presença de código SKU.
- [x] Desacoplamento arquitetural (ausência total de bibliotecas de terceiros no domínio).

#### 2. Recomendações Técnicas
- **Encapsulamento Estrito:** Assegurar que os atributos sejam privados com métodos acessores (`getters`) e construtor privado, expondo unicamente o método de fábrica estático `Part.create(...)`.
- **Exceções de Domínio:** Criar classes de erro especializadas herdando de uma classe base `DomainException` (ex.: `InvalidPartPriceException`) para facilitar a captura na camada de apresentação.

#### 3. Condição para o Estado Ready
- **Status:** **`Ready`** — A atividade cumpre integralmente os requisitos da DoR e está apta para desenvolvimento imediato.
```

---

### Comentário para a Issue #7 (`[SUB-02] feat(contracts): definir DTOs de entrada/saída e porta IPartsRepository`)
```markdown
### 🔍 Auditoria Técnica de Planejamento — Sub-Issue #7 (SUB-02)

**Revisor Responsável:** Auditoria Técnica de Software / @peaga21  
**Fase de Avaliação:** Pré-análise de Definition of Ready (DoR)

#### 1. Elementos Avaliados
- [x] Contrato de transporte `CreatePartDto` com decoradores `class-validator`.
- [x] Contrato de resposta `CreatePartOutput`.
- [x] Interface da porta de persistência `IPartsRepository`.

#### 2. Recomendações Técnicas
- **Tipagem Decimal:** No DTO de entrada, garantir que `price` seja validado com `@IsNumber({ maxDecimalPlaces: 2 })` para evitar erros de precisão monetária.
- **Porta Agnóstica:** Assegurar que `IPartsRepository` utilize estritamente a entidade de domínio `Part` em suas assinaturas, sem expor entidades do TypeORM.

#### 3. Condição para o Estado Ready
- **Status:** **`Ready`** — A atividade cumpre integralmente os requisitos da DoR e pode ser desenvolvida concorrentemente com a SUB-01.
```

---

### Comentário para a Issue #8 (`[SUB-03] feat(infra): implementar persistência TypeORM, PartOrmEntity e migration PostgreSQL`)
```markdown
### 🔍 Auditoria Técnica de Planejamento — Sub-Issue #8 (SUB-03)

**Revisor Responsável:** Auditoria Técnica de Software / @peaga21  
**Fase de Avaliação:** Pré-análise de Definition of Ready (DoR)

#### 1. Elementos Avaliados
- [x] Script de migration TypeORM para criação da tabela física `parts`.
- [x] Implementação da classe `PartOrmEntity` e adaptador `TypeOrmPartsRepository`.
- [x] Padrão Data Mapper via `PartMapper`.

#### 2. Recomendações Técnicas
- **Índice Único no Banco:** Configurar explicitamente a constraint `UNIQUE (code)` na migration SQL para servir como segunda linha de defesa na integridade relacional.
- **Precisão de Coluna:** Utilizar tipo `numeric(10, 2)` na coluna `price` do PostgreSQL.

#### 3. Condição para o Estado Ready
- **Status:** **`Backlog`** — A atividade deve aguardar a estabilização da entidade `Part` (SUB-01) e da interface `IPartsRepository` (SUB-02) para ser promovida a `Ready`.
```

---

### Comentário para a Issue #9 (`[SUB-04] feat(application): implementar serviço de aplicação CreatePartUseCase`)
```markdown
### 🔍 Auditoria Técnica de Planejamento — Sub-Issue #9 (SUB-04)

**Revisor Responsável:** Auditoria Técnica de Software / @peaga21  
**Fase de Avaliação:** Pré-análise de Definition of Ready (DoR)

#### 1. Elementos Avaliados
- [x] Orquestração do caso de uso de aplicação (`CreatePartUseCase`).
- [x] Verificação de unicidade de SKU via método `findByCode(code)`.
- [x] Persistência desacoplada através da porta de saída.

#### 2. Recomendações Técnicas
- **Lançamento de Conflito:** Caso o SKU já exista na consulta prévia, disparar `PartAlreadyExistsException` contendo o código colidente para permitir retorno HTTP `409 Conflict`.
- **Testabilidade:** Implementar testes unitários rápidos utilizando um `InMemoryPartsRepository` para validar os caminhos de sucesso e duplicação sem depender de banco de dados.

#### 3. Condição para o Estado Ready
- **Status:** **`Backlog`** — Aguarda a conclusão dos contratos e do repositório de persistência.
```

---

### Comentário para a Issue #10 (`[SUB-05] feat(api): expor endpoint POST /parts no PartsController`)
```markdown
### 🔍 Auditoria Técnica de Planejamento — Sub-Issue #10 (SUB-05)

**Revisor Responsável:** Auditoria Técnica de Software / @peaga21  
**Fase de Avaliação:** Pré-análise de Definition of Ready (DoR)

#### 1. Elementos Avaliados
- [x] Rota HTTP `POST /parts` no `PartsController` do NestJS.
- [x] Ativação do `ValidationPipe` global/local.
- [x] Tradução dos códigos de status HTTP (`201`, `400`, `409`, `422`, `500`).

#### 2. Recomendações Técnicas
- **Filtro de Exceções:** Integrar com o `HttpExceptionFilter` global do projeto para que exceções de domínio e aplicação sejam traduzidas automaticamente sem necessidade de `try/catch` manual no controller.
- **Códigos de Resposta:** Anotar explicitamente `@HttpCode(HttpStatus.CREATED)` para garantir o código `201` no retorno de criação.

#### 3. Condição para o Estado Ready
- **Status:** **`Backlog`** — Aguarda a implementação do serviço de aplicação (SUB-04).
```

---

### Comentário para a Issue #11 (`[SUB-06] test(e2e): implementar testes automatizados unitários e de integração com Vitest`)
```markdown
### 🔍 Auditoria Técnica de Planejamento — Sub-Issue #11 (SUB-06)

**Revisor Responsável:** Auditoria Técnica de Software / @peaga21  
**Fase de Avaliação:** Pré-análise de Definition of Ready (DoR)

#### 1. Elementos Avaliados
- [x] Suíte de testes unitários do domínio e da aplicação.
- [x] Suíte de testes E2E com Vitest disparando requisições HTTP reais contra o PostgreSQL.
- [x] Cobertura de todos os cenários felizes e fluxos alternativos (FA1 a FA4).

#### 2. Recomendações Técnicas
- **Isolamento de Base:** Configurar rotina no hook `beforeEach` do Vitest para limpar a tabela `parts` (`TRUNCATE TABLE parts CASCADE`), assegurando que a execução de um teste não afete os demais.
- **Execução Determinística:** Garantir que o container PostgreSQL local esteja ativo via `docker compose up -d` antes da suíte de teste.

#### 3. Condição para o Estado Ready
- **Status:** **`Backlog`** — Aguarda a conclusão de todas as camadas produtivas de código.
```

---

### Comentário para a Issue #12 (`[SUB-07] docs(governance): atualizar OpenAPI/Swagger, README e governança do repositório`)
```markdown
### 🔍 Auditoria Técnica de Planejamento — Sub-Issue #12 (SUB-07)

**Revisor Responsável:** Auditoria Técnica de Software / @peaga21  
**Fase de Avaliação:** Pré-análise de Definition of Ready (DoR)

#### 1. Elementos Avaliados
- [x] Anotações Swagger no Controller e DTO (`@ApiTags`, `@ApiOperation`, `@ApiResponse`).
- [x] Atualização das instruções de execução no `README.md`.
- [x] Fechamento formal do épico e registro de governança de software.

#### 2. Recomendações Técnicas
- **Exemplo Realista:** Adicionar no `@ApiBody` um exemplo JSON realista de cadastro de autopeça (ex.: pastilha de freio ou amortecedor).
- **Rastreabilidade:** Vincular o hash do commit final aos artefatos de entrega no repositório.

#### 3. Condição para o Estado Ready
- **Status:** **`Backlog`** — Atividade final de entrega e consolidação do caso de uso.
```

