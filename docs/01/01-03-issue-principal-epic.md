# Artefato 3 — Issue Principal (Epic)

> **Observação:** O conteúdo abaixo foi estruturado no formato Markdown nativo do GitHub, pronto para cópia e colagem direta na criação da Issue Épica no repositório `peaga21/AutoFlow`.

---

```markdown
# [UC12] Cadastrar Peça

## 1. Objetivo Geral do Épico
Implementar no sistema **AutoFlow** o comportamento completo de cadastro de peças no módulo de Estoque e Almoxarifado (*Inventory / Parts*), permitindo que o Gestor de Estoque registre novos componentes com código SKU exclusivo, descrição, valor monetário e saldo físico inicial, garantindo integridade de domínio, persistência relacional e exposição via API REST.

---

## 2. Contexto e Escopo no Projeto
O cadastro de peças representa o alicerce operacional do sistema AutoFlow. Sem a existência e integridade do catálogo de peças, os fluxos comerciais de atendimento (como elaboração de orçamentos e abertura de ordens de serviço) tornam-se inviáveis.

* **Dentro do Escopo:**
  * Recepção e validação do payload HTTP `POST /parts`;
  * Verificação de unicidade do código comercial SKU (`code`);
  * Enforçamento das invariantes de domínio da entidade `Part` (preço $> 0$, estoque $\ge 0$);
  * Persistência na base de dados relacional PostgreSQL via TypeORM;
  * Respostas HTTP estruturadas (`201`, `400`, `409`, `422`, `500`);
  * Testes automatizados (unitários e de integração E2E com Docker Compose);
  * Documentação no OpenAPI/Swagger e atualização de governança.
* **Fora do Escopo:**
  * Gestão de fornecedores e compras externas;
  * Upload de imagens e fotografias técnicas;
  * Movimentações históricas de kardex e baixa por consumo em ordens de serviço.

---

## 3. Referência Formal à Documentação
* **Documento de Caso de Uso:** `CasoDeUso.md` (Linhas 1-159)
* **Blueprint Técnico de Implementação:** `blueprint_autoflow.md` (Seção 06 — Especificações Funcionais do UC12 e Seções 10-22)
* **Arquitetura e Domínio:** `Autoflow_Dominio.md` e `Autoflow_Dominio2.md`
* **Padrões de Governança:** `governanca_e_repositorio.md`

---

## 4. Requisitos Funcionais Contemplados
* **RF-01 (Entrada de Dados):** O sistema deve permitir a entrada de `code`, `name`, `price`, `stockQuantity` e `categoryId`.
* **RF-02 (Validação Sintática):** O sistema deve barrar requisições com dados obrigatórios ausentes ou de tipo inválido (`400 Bad Request`).
* **RF-03 (Unicidade de SKU):** O sistema deve garantir que nenhum código de peça seja duplicado no catálogo (`409 Conflict`).
* **RF-04 (Invariantes de Domínio):** O sistema deve impedir cadastros com preços nulos/negativos ou estoques negativos (`422 Unprocessable Entity`).
* **RF-05 (Persistência Transacional):** O sistema deve gravar o registro em tabela física com identificador primário UUID e data de criação.
* **RF-06 (Disponibilização de Recurso):** O sistema deve retornar o recurso recém-criado com status `201 Created`.

---

## 5. Relação das Sub-Issues Planejadas (Checklist de Execução)
- [ ] **[SUB-01]** `feat(domain): modelar entidade Part e regras de negócio`
- [ ] **[SUB-02]** `feat(contracts): definir DTOs de entrada/saída e porta IPartsRepository`
- [ ] **[SUB-03]** `feat(infra): implementar persistência TypeORM, PartOrmEntity e migration PostgreSQL`
- [ ] **[SUB-04]** `feat(application): implementar serviço de aplicação CreatePartUseCase`
- [ ] **[SUB-05]** `feat(api): expor endpoint POST /parts no PartsController`
- [ ] **[SUB-06]** `test(e2e): implementar testes automatizados unitários e de integração com Vitest`
- [ ] **[SUB-07]** `docs(governance): atualizar OpenAPI/Swagger, README e governança do repositório`

---

## 6. Critérios Gerais de Aceite (Definition of Done)
- [ ] **CA-01:** O endpoint `POST /parts` responde com status `201 Created` e retorna os dados completos da peça criada (incluindo UUID e `createdAt`) para dados válidos.
- [ ] **CA-02:** Tentativa de cadastro com código SKU idêntico a um já existente é rejeitada com status `409 Conflict`.
- [ ] **CA-03:** Tentativa de cadastro com preço $\le 0$ é rejeitada com status `422 Unprocessable Entity`.
- [ ] **CA-04:** Tentativa de cadastro com estoque $< 0$ é rejeitada com status `422 Unprocessable Entity`.
- [ ] **CA-05:** Requisições com formato inválido ou ausência de dados obrigatórios são rejeitadas com status `400 Bad Request`.
- [ ] **CA-06:** Migration executada com sucesso e integridade relacional preservada no PostgreSQL (`autoflow_db`).
- [ ] **CA-07:** Cobertura de testes unitários da entidade/serviço e testes E2E executando no Vitest com 100% de aprovação.
- [ ] **CA-08:** Documentação OpenAPI/Swagger disponível e atualizada em `/api/docs`.

---

## 7. Dependências Externas e Bloqueios
* **Container PostgreSQL:** Dependência do ambiente local `docker compose up -d` operacional e acessível na porta `5432`.
* **Configuração de Ambiente:** Existência do arquivo `.env` configurado conforme `.env.example`.
* **Bloqueios Funcionais:** Nenhum bloqueio externo prévio. O UC12 é o ponto de partida do primeiro slice do módulo de Estoque.

---

## 8. Condições de Prontidão e Conclusão
* **Definition of Ready (DoR):**
  * Especificação técnica do caso de uso revisada e aprovada;
  * Contratos e invariantes de negócio plenamente definidos;
  * Sub-Issues detalhadas com critérios de aceite individuais.
* **Definition of Done (DoD):**
  * Todas as 7 Sub-Issues concluídas e mescladas na branch principal após revisão por pares;
  * Suíte de testes automatizados executando com sucesso em pipeline;
  * Registro de governança devidamente assinado e versionado.
```

