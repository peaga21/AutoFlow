# Artefato 7 — Plano de Labels

## 1. Estratégia de Rotulagem no GitHub
O plano de labels para o repositório `peaga21/AutoFlow` foi concebido para fornecer taxonomia clara, visibilidade operacional no GitHub Projects e facilidade de filtragem por camadas de arquitetura, tipo de demanda e prioridade de negócio.

As labels dividem-se em 4 eixos taxonômicos:
1. **Domínio / Módulo Funcional (`area:*`):** Identifica o Bounded Context do sistema AutoFlow.
2. **Tipo de Atividade (`type:*`):** Qualifica a natureza do trabalho (Épico, Feature, Teste, Documentação).
3. **Camada Arquitetural (`layer:*`):** Indica em qual camada do Clean Architecture a atividade atua.
4. **Prioridade de Negócio (`priority:*`):** Define a urgência e precedência no fluxo de trabalho.

---

## 2. Catálogo Padronizado de Labels

| Nome da Label | Cor Sugerida (HEX) | Finalidade / Descrição | Onde Será Aplicada |
| :--- | :--- | :--- | :--- |
| `area:parts` | `#1D76DB` (Azul Forte) | Identifica atividades vinculadas ao Bounded Context de Peças, Almoxarifado e Estoque (*Inventory*). | `[UC12]` e todas as Sub-Issues (`SUB-01` a `SUB-07`) |
| `type:epic` | `#3E2723` (Marrom Escuro) | Identifica uma Issue que representa um caso de uso completo ou agregação de alto nível. | Issue Principal `[UC12]` |
| `type:feature` | `#A2EEEF` (Ciano Claro) | Desenvolvimento de funcionalidade produtiva nova no sistema. | `SUB-01`, `SUB-02`, `SUB-03`, `SUB-04`, `SUB-05` |
| `type:test` | `#FBCA04` (Amarelo Ouro) | Construção de testes automatizados unitários, de integração ou E2E. | `SUB-06` |
| `type:documentation`| `#0075CA` (Azul Médio) | Produção ou atualização de documentação técnica, Swagger, README e governança. | `SUB-07` |
| `layer:domain` | `#D93F0B` (Laranja Avermelhado) | Atividades restritas ao núcleo de domínio puro (entidades, regras, objetos de valor). | `SUB-01` |
| `layer:contracts` | `#B60205` (Vermelho Vivo) | Atividades de definição de DTOs, interfaces de portas e schemas de borda. | `SUB-02` |
| `layer:infra` | `#5319E7` (Roxo Intenso) | Atividades ligadas a banco de dados, TypeORM, migrations, drivers e adaptadores externos. | `SUB-03` |
| `layer:application` | `#0E8A16` (Verde Floresta) | Atividades de orquestração de casos de uso e serviços de aplicação. | `SUB-04` |
| `layer:api` | `#006B75` (Verde Petróleo) | Atividades de exposição HTTP, rotas REST, controllers e pipes do NestJS. | `SUB-05` |
| `priority:critical` | `#B60205` (Vermelho) | Bloqueador imediato para a evolução da esteira do primeiro slice. | Issue Principal `[UC12]` |
| `priority:high` | `#D93F0B` (Laranja) | Atividades no caminho crítico de execução da funcionalidade. | `SUB-01`, `SUB-02`, `SUB-03`, `SUB-04`, `SUB-05`, `SUB-06` |
| `priority:medium` | `#FBCA04` (Amarelo) | Atividades de finalização documental e governança do repositório. | `SUB-07` |

---

## 3. Matriz de Aplicação das Labels nas Atividades

| Identificador da Issue | Título Resumido | Labels Atribuídas |
| :--- | :--- | :--- |
| **[UC12]** | Cadastrar Peça (Epic) | `area:parts`, `type:epic`, `priority:critical` |
| **[SUB-01]** | Modelar entidade Part e regras de negócio | `area:parts`, `layer:domain`, `type:feature`, `priority:high` |
| **[SUB-02]** | Definir DTOs de entrada/saída e porta IPartsRepository | `area:parts`, `layer:contracts`, `type:feature`, `priority:high` |
| **[SUB-03]** | Implementar persistência TypeORM, PartOrmEntity e migration | `area:parts`, `layer:infra`, `type:feature`, `priority:high` |
| **[SUB-04]** | Implementar serviço de aplicação CreatePartUseCase | `area:parts`, `layer:application`, `type:feature`, `priority:high` |
| **[SUB-05]** | Expor endpoint POST /parts no PartsController | `area:parts`, `layer:api`, `type:feature`, `priority:high` |
| **[SUB-06]** | Implementar testes unitários e de integração com Vitest | `area:parts`, `type:test`, `priority:high` |
| **[SUB-07]** | Atualizar OpenAPI/Swagger, README e governança | `area:parts`, `type:documentation`, `priority:medium` |

