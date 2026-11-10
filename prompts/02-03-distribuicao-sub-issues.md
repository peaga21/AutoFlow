# Artefato 03 — Matriz de Distribuição das Sub-Issues

## 1. Diretrizes de Distribuição e Balanceamento
A alocação das atividades técnicas do caso de uso **`[UC12] Cadastrar Peça`** respeita o grafo de dependências arquiteturais (Clean Architecture) e a complexidade intrínseca de cada camada de software.

Por se tratar de um **projeto acadêmico individual**, o autor **Pedro Henrique Dias (`@peaga21`)** assume a execução técnica de todas as Sub-Issues. Para viabilizar a segregação e evitar o vício de confirmação, estabelece-se a dinâmica de **dupla auditoria**:
* **Desenvolvedor (*Assignee*):** Pedro Henrique Dias (`@peaga21`) — responsável pela codificação e evidências.
* **Revisor de Planejamento e Código (*Reviewer*):** Auto-revisão técnica estruturada baseada em critérios cegos e validação formal pela equipe avaliadora docente (`@autoflow-reviewers` / Professor da disciplina).

---

## 2. Matriz Completa de Distribuição das Sub-Issues

| Identificador | Título da Sub-Issue | Issue GitHub | Complexidade Técnica | Dependências Técnicas | Responsável (*Assignee*) | Revisor Designado (*Reviewer*) | Status Atual no Board | Status Recomendado | Justificativa Técnica da Atribuição |
| :---: | :--- | :---: | :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **SUB-01** | `feat(domain): modelar entidade Part e regras de negócio` | **#6** | **Média** | *Nenhuma* (Ponto de partida) | `@peaga21` | Auto-revisão + `@autoflow-reviewers` | `Ready` | **`Ready`** | Exige sólido entendimento das invariantes de domínio (`price > 0`, `stockQuantity >= 0`). Tarefa fundacional independente. |
| **SUB-02** | `feat(contracts): definir DTOs de entrada/saída e porta IPartsRepository` | **#7** | **Baixa** | *Nenhuma* (Paralelizável com SUB-01) | `@peaga21` | Auto-revisão + `@autoflow-reviewers` | `Ready` | **`Ready`** | Foco em validações sintáticas (`class-validator`) e contratos de interface pura em TypeScript. |
| **SUB-03** | `feat(infra): implementar persistência TypeORM, PartOrmEntity e migration PostgreSQL` | **#8** | **Alta** | SUB-01, SUB-02 | `@peaga21` | Auto-revisão + `@autoflow-reviewers` | `Backlog` | **`Backlog`** | Envolve comandos DDL relacionais, integridade referencial com índice único no PostgreSQL e mapeamento de dados (`PartMapper`). |
| **SUB-04** | `feat(application): implementar serviço de aplicação CreatePartUseCase` | **#9** | **Média** | SUB-01, SUB-02, SUB-03 | `@peaga21` | Auto-revisão + `@autoflow-reviewers` | `Backlog` | **`Backlog`** | Orquestração da regra de duplicidade de SKU, coordenação do domínio e acionamento da porta de persistência. |
| **SUB-05** | `feat(api): expor endpoint POST /parts no PartsController` | **#10** | **Média** | SUB-02, SUB-04 | `@peaga21` | Auto-revisão + `@autoflow-reviewers` | `Backlog` | **`Backlog`** | Mapeamento de rotas NestJS, injeção de dependências e tradução precisa de erros para códigos HTTP (`201`, `400`, `409`, `422`). |
| **SUB-06** | `test(e2e): implementar testes automatizados unitários e de integração com Vitest` | **#11** | **Alta** | SUB-01 a SUB-05 | `@peaga21` | Auto-revisão + `@autoflow-reviewers` | `Backlog` | **`Backlog`** | Suíte de testes automatizados ponta a ponta com Docker Compose real e Vitest cobrindo 100% dos caminhos felizes e de falha. |
| **SUB-07** | `docs(governance): atualizar OpenAPI/Swagger, README e governança do repositório` | **#12** | **Baixa** | SUB-05, SUB-06 | `@peaga21` | Auto-revisão + `@autoflow-reviewers` | `Backlog` | **`Backlog`** | Formalização contratual pública da API em `/api/docs` e consolidação das evidências de governança. |

---

## 3. Análise da Carga de Trabalho e Fluxo Sequencial

1. **Volume por Complexidade:**
   * **Baixa Complexidade:** 2 tarefas (`SUB-02`, `SUB-07`) — 28,6%
   * **Média Complexidade:** 3 tarefas (`SUB-01`, `SUB-04`, `SUB-05`) — 42,8%
   * **Alta Complexidade:** 2 tarefas (`SUB-03`, `SUB-06`) — 28,6%
2. **Estratégia de Execução Unipessoal:**
   * Para evitar sobrecarga cognitiva e troca excessiva de contexto (*context switching*), o desenvolvedor deve adotar o princípio de **fluxo puxado unitário**: focar em uma Sub-Issue por vez, avançando-a de `Ready` para `In Progress`, gerando testes e submetendo o PR correspondente antes de puxar a próxima tarefa desbloqueada.
3. **Respeito aos Bloqueios Arquiteturais:**
   * As atividades fundacionais `SUB-01` e `SUB-02` são as únicas aptas a iniciar de imediato.
   * Nenhuma atividade de infraestrutura ou aplicação pode ser antecipada antes da estabilização dos contratos e do modelo de domínio.

