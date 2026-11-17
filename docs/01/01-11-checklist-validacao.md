# Artefato 11 — Checklist de Validação do Planejamento

Antes de submeter a atividade avaliativa ou iniciar o desenvolvimento de código-fonte no repositório, o estudante deve percorrer este checklist de qualidade para assegurar estrita conformidade com os requisitos metodológicos e acadêmicos.

---

## 1. Verificação da Issue Principal (Epic)
- [x] **Identificação Padronizada:** A Issue principal possui título no padrão `[Código-UC] Nome do Caso de Uso` (ex.: `[UC12] Cadastrar Peça`).
- [x] **Contexto e Escopo:** O objetivo do caso de uso, seu valor de negócio para o AutoFlow e as fronteiras funcionais (o que entra e o que não entra) estão explicitados.
- [x] **Relação de Sub-Issues:** A descrição da Issue principal contém uma lista interativa de verificação (`- [ ]`) referenciando formalmente todas as Sub-Issues planejadas.
- [x] **Critérios de Aceite Globais:** Foram definidos critérios de aceite mensuráveis cobrindo tanto o caminho feliz quanto cenários de erro e respostas HTTP (`201`, `400`, `409`, `422`).
- [x] **Definição de Conclusão (DoD):** As condições de prontidão (DoR) e de entrega final (DoD) estão formalmente documentadas.

---

## 2. Verificação das Sub-Issues Técnicas
- [x] **Quantidade Mínima Justificável:** Foram decompostas **7 Sub-Issues** com justificativa técnica legítima, superando o requisito mínimo de 5 unidades de trabalho.
- [x] **Ausência de Fragmentação Artificial de TDD:** Nenhuma Sub-Issue foi dividida em "apenas teste RED" ou "apenas código GREEN". A Sub-Issue de qualidade (`SUB-06`) contempla a suíte integrada sem artificialismo.
- [x] **Independência e Autonomia:** Cada Sub-Issue possui descrição detalhada, escopo claro e critérios de aceite com caixas de seleção `- [ ]` que permitem verificação individual e objetiva.
- [x] **Vinculação:** Cada Sub-Issue indica expressamente o vínculo com a Issue Principal `[UC12]`.
- [x] **Atribuição:** Todas as Sub-Issues possuem responsável definido (`@peaga21`).

---

## 3. Verificação de Dependências e Rastreabilidade
- [x] **Mapeamento de Interdependências:** Todas as dependências técnicas entre Sub-Issues foram mapeadas e justificadas tecnicamente (camadas de Clean Architecture).
- [x] **Ausência de Dependências Circulares:** Não existem bloqueios circulares (ex.: A depende de B que depende de A). O grafo de dependências é acíclico e direcionado (DAG).
- [x] **Matriz de Rastreabilidade 100% Coberta:** Todos os requisitos funcionais, regras de negócio (`RN01` a `RN04`) e fluxos alternativos (`FA1` a `FA4`) estão mapeados para critérios de aceite em Sub-Issues específicas.
- [x] **Ausência de Tarefas Espúrias:** Não há atividades inventadas sem respaldo na documentação de especificação do caso de uso.

---

## 4. Verificação de Taxonomia e Labels
- [x] **Estrutura Multieixo:** O plano de labels contempla os 4 eixos taxonômicos: domínio/área (`area:*`), tipo (`type:*`), camada arquitetural (`layer:*`) e prioridade (`priority:*`).
- [x] **Atribuição Consistente:** Cada Sub-Issue recebeu um conjunto coerente de labels refletindo sua camada e criticidade técnica.
- [x] **Cores Padronizadas:** As cores foram selecionadas para fornecer diferenciação visual clara no board Kanban.

---

## 5. Verificação do GitHub Project (Board Kanban)
- [x] **Estados Padronizados da Metodologia:** O campo **Status** foi planejado contendo **exatamente os 5 estados**: `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- [x] **Ausência de Colunas Divergentes:** Não foram utilizados status como *"Todo"*, *"In Dev"* ou *"No Status"*.
- [x] **Distribuição Inicial Coerente com a Fase de Planejamento:** 
  - Nenhuma atividade iniciou prematuramente em `In Progress`, `In Review` ou `Done`.
  - Apenas as atividades fundacionais sem dependências (`SUB-01` e `SUB-02`) estão em `Ready`.
  - As atividades com pré-requisitos pendentes (`SUB-03` a `SUB-07`) e o Épico estão em `Backlog`.

---

## 6. Verificação de Restrições Metodológicas
- [x] **Não Implementação de Código:** Nenhuma linha de código-fonte produtivo foi implementada nesta etapa de planejamento.
- [x] **Não Abertura de Branches ou PRs:** Nenhuma branch de implementação foi criada no Git e nenhum commit de código ou PR foi aberto.
- [x] **Não Simulação Fictícia de Testes:** Não foram forjados relatórios fictícios declarando funcionalidades já implementadas.
- [x] **Isolamento de Outros Projetos Didáticos:** Nenhum conceito do projeto de exemplo de aula (*CeliLac*) foi aplicado; todo o planejamento é estritamente fundamentado no domínio e no código do **AutoFlow**.

