# Artefato 5 — Matriz de Rastreabilidade

## 1. Visão Geral da Rastreabilidade
A matriz de rastreabilidade estabelece o vínculo bidirecional entre a especificação funcional do caso de uso **`[UC12] Cadastrar Peça`** (requisitos, regras de negócio e fluxos) e as unidades de trabalho planejadas no GitHub. Essa abordagem assegura que:
1. **Nenhum requisito da especificação fique sem atividade técnica de atendimento** (*cobertura completa*);
2. **Nenhuma atividade técnica seja introduzida sem uma justificativa documental legítima** (*ausência de escopo espúrio*).

---

## 2. Matriz de Rastreabilidade Requisitos $\leftrightarrow$ Atividades

| Requisito / Regra / Fluxo do UC12 | Sub-Issue Associada | Atividade Técnica Planejada | Critério de Aceite Vinculado | Comportamento a Verificar Futuramente |
| :--- | :--- | :--- | :--- | :--- |
| **RF-01 / Passo 1 do Fluxo Principal**<br>Recepção de `code`, `name`, `price`, `stockQuantity`, `categoryId`. | **SUB-02** / **SUB-05** | Definição de `CreatePartDto` e exposição do endpoint `POST /parts` no `PartsController`. | SUB-02.CA-01<br>SUB-05.CA-01 | O controller recebe o JSON e valida a tipagem dos dados antes de repassar à aplicação. |
| **RN01 / FA1 (Código SKU Duplicado)**<br>O código SKU deve ser único em todo o catálogo. | **SUB-03** / **SUB-04** / **SUB-05** | Migration com constraint `UNIQUE(code)`, checagem no `CreatePartUseCase` via `findByCode` e resposta `409 Conflict`. | SUB-03.CA-01<br>SUB-04.CA-01<br>SUB-05.CA-03 | Enviar requisição com código já cadastrado resulta em recusa imediata com status HTTP `409 Conflict`. |
| **RN02 / FA2 (Preço Estritamente Positivo)**<br>O preço da peça deve ser $> 0$. | **SUB-01** / **SUB-04** / **SUB-05** | Validação no método de fábrica `Part.create`, disparo de exceção de domínio e mapeamento para `422 Unprocessable Entity`. | SUB-01.CA-03<br>SUB-04.CA-02<br>SUB-05.CA-04 | Enviar `price: 0` ou `price: -10` é barrado pelo domínio com status HTTP `422`. |
| **RN03 / FA3 (Estoque Não Negativo)**<br>A quantidade de estoque deve ser $\ge 0$. | **SUB-01** / **SUB-04** / **SUB-05** | Validação no método `Part.create`, disparo de erro e mapeamento para `422 Unprocessable Entity`. | SUB-01.CA-04<br>SUB-04.CA-02<br>SUB-05.CA-04 | Enviar `stockQuantity: -5` é barrado com status HTTP `422`. |
| **RN04 / FA4 (Dados Obrigatórios Ausentes)**<br>Campos obrigatórios não podem ser omitidos. | **SUB-02** / **SUB-05** | Validações sintáticas via `class-validator` no DTO e acionamento do `ValidationPipe`. | SUB-02.CA-02<br>SUB-05.CA-02 | Enviar payload sem `name` ou sem `code` é bloqueado na borda com status HTTP `400 Bad Request`. |
| **RF-05 / Passo 5 do Fluxo Principal**<br>Persistência relacional definitiva da nova peça. | **SUB-03** / **SUB-04** | Migration da tabela `parts`, implementação de `PartOrmEntity`, `PartMapper` e `TypeOrmPartsRepository.save()`. | SUB-03.CA-04<br>SUB-03.CA-05<br>SUB-04.CA-03 | A peça é gravada fisicamente no banco PostgreSQL (`autoflow_db`) com UUID gerado e timestamp `createdAt`. |
| **RF-06 / Passo 6 do Fluxo Principal**<br>Retorno do recurso cadastrado com status 201. | **SUB-04** / **SUB-05** | Retorno de `CreatePartOutput` no caso de uso e resposta com `@HttpCode(201)` no controller. | SUB-04.CA-04<br>SUB-05.CA-01 | A requisição HTTP retorna cabeçalho `201 Created` e JSON da peça contendo seu novo ID. |
| **Garantia de Qualidade e Regressão**<br>Comprovação empírica de todos os cenários. | **SUB-06** | Testes automatizados unitários do domínio/serviço e testes E2E com Vitest e PostgreSQL no Docker. | SUB-06.CA-01<br>SUB-06.CA-02<br>SUB-06.CA-03 | Execução de `pnpm test:e2e` executando todos os 5 cenários descritos e finalizando com 100% de sucesso. |
| **Governança e Contrato Público**<br>Documentação OpenAPI e rastreabilidade no repositório. | **SUB-07** | Decoradores Swagger no Controller/DTO, atualização do `README.md` e relatório de governança. | SUB-07.CA-01<br>SUB-07.CA-02<br>SUB-07.CA-03 | Acessar `/api/docs` no navegador exibe a documentação completa e testável do endpoint `POST /parts`. |

---

## 3. Análise de Cobertura e Conformidade

### Verificação de Regras sem Cobertura
* **Resultado:** **0 regras órfãs.** Todas as regras de negócio catalogadas no caso de uso (`RN01`, `RN02`, `RN03`, `RN04`) e todos os fluxos de exceção (`FA1`, `FA2`, `FA3`, `FA4`) possuem atividades técnicas diretamente responsáveis por sua implementação e testes específicos designados.

### Verificação de Atividades sem Justificativa
* **Resultado:** **0 atividades espúrias.** Todas as Sub-Issues planejadas (`SUB-01` a `SUB-07`) decorrem estritamente dos requisitos funcionais, não funcionais e arquiteturais documentados para o projeto AutoFlow (Clean Architecture, persistência com TypeORM/PostgreSQL, NestJS, Vitest e governança de repositório).

