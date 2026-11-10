# Artefato 8 — Planejamento do GitHub Project

## 1. Estrutura do GitHub Project (Kanban Board)
Para assegurar a governança visual do desenvolvimento e o rastreamento em tempo real do avanço das atividades do caso de uso **`[UC12] Cadastrar Peça`**, será criado um GitHub Project (Projects v2) associado ao repositório `peaga21/AutoFlow`.

Em estrita conformidade com a metodologia didática **"Do Caso de Uso ao Planejamento da Implementação"**, o campo customizado **Status** deve ser configurado contendo **exatamente os 5 estados padronizados**, sem inclusão de colunas divergentes como *"Todo"*, *"In Dev"* ou *"No Status"*:

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Backlog   │──>│    Ready    │──>│ In Progress │──>│  In Review  │──>│    Done     │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

### Significado e Políticas de Transição entre Estados

1. **`Backlog`:**
   * *Conceito:* Atividades planejadas cuja execução ainda depende do desbloqueio de pré-requisitos técnicos ou que ainda não foram priorizadas para a sprint/ciclo corrente.
   * *Critério de Entrada:* Atividades que possuem dependências não finalizadas de outras Sub-Issues.
2. **`Ready`:**
   * *Conceito:* Atividades plenamente refinadas que atendem à *Definition of Ready (DoR)*. Estão desbloqueadas e prontas para serem puxadas por um desenvolvedor.
   * *Critério de Entrada:* Dependências resolvidas, escopo delimitado, critérios de aceite objetivos e responsáveis cientes.
3. **`In Progress`:**
   * *Conceito:* A atividade está ativamente em desenvolvimento por um membro da equipe em branch de trabalho específica.
   * *Critério de Entrada:* Sub-Issue atribuída formalmente a um desenvolvedor e branch correspondente criada.
4. **`In Review`:**
   * *Conceito:* O código foi implementado, os testes locais passaram e um Pull Request (PR) foi aberto para validação por pares e execução de CI.
   * *Critério de Entrada:* Abertura de PR referenciando a Sub-Issue (`Closes #X`), com descrição de alterações e evidências de testes anexadas.
5. **`Done`:**
   * *Conceito:* A entrega atende à *Definition of Done (DoD)*. O PR foi revisado, aprovado e mesclado na branch `main`.
   * *Critério de Entrada:* PR mesclado, testes automatizados integrados com sucesso na pipeline e Sub-Issue fechada automaticamente.

---

## 2. Tabela de Distribuição Inicial das Atividades no Board

Por estarmos rigorosamente na **fase de planejamento técnico**, nenhuma atividade produtiva foi iniciada ainda. Portanto, todas as atividades distribuem-se exclusivamente entre **`Ready`** (aquelas que não possuem dependências prévias e estão aptas a iniciar imediatamente) e **`Backlog`** (aquelas que aguardam a conclusão das camadas fundacionais).

| Identificador | Título da Atividade | Tipo | Status Inicial Recomendado | Justificativa Técnica do Status |
| :--- | :--- | :--- | :--- | :--- |
| **[UC12]** | `[UC12] Cadastrar Peça` | Epic | **`Backlog`** | O Épico permanece em Backlog (ou em acompanhamento geral) até que a primeira Sub-Issue seja iniciada; transitará para *Done* apenas quando todas as 7 Sub-Issues forem concluídas. |
| **[SUB-01]** | `feat(domain): modelar entidade Part e regras de negócio` | Sub-Issue | **`Ready`** | Atende 100% à DoR. Não depende de nenhuma outra atividade técnica; pode ser iniciada imediatamente. |
| **[SUB-02]** | `feat(contracts): definir DTOs de entrada/saída e porta IPartsRepository` | Sub-Issue | **`Ready`** | Atende à DoR. Pode iniciar de imediato em paralelo com SUB-01 para adiantar contratos e validações de borda. |
| **[SUB-03]** | `feat(infra): implementar persistência TypeORM, PartOrmEntity e migration` | Sub-Issue | **`Backlog`** | Bloqueada: requer a definição prévia da entidade `Part` (SUB-01) e do contrato `IPartsRepository` (SUB-02). |
| **[SUB-04]** | `feat(application): implementar serviço de aplicação CreatePartUseCase` | Sub-Issue | **`Backlog`** | Bloqueada: depende da consolidação do domínio, dos DTOs e da infraestrutura de persistência. |
| **[SUB-05]** | `feat(api): expor endpoint POST /parts no PartsController` | Sub-Issue | **`Backlog`** | Bloqueada: requer a conclusão prévia do caso de uso de aplicação (SUB-04). |
| **[SUB-06]** | `test(e2e): implementar testes automatizados unitários e de integração com Vitest` | Sub-Issue | **`Backlog`** | Bloqueada: testes de integração E2E exigem a esteira completa operacional (HTTP $\rightarrow$ PostgreSQL). |
| **[SUB-07]** | `docs(governance): atualizar OpenAPI/Swagger, README e governança` | Sub-Issue | **`Backlog`** | Bloqueada: documentação pública e governança dependem da consolidação final do endpoint e dos testes. |

---

## 3. Visualizações Recomendadas no GitHub Project
* **Visão Kanban (Padrão):** Agrupamento por colunas do campo `Status` (`Backlog`, `Ready`, `In Progress`, `In Review`, `Done`).
* **Visão Roadmap / Tabela:** Agrupamento por `area` ou `layer`, permitindo visualizar a ordem de execução arquitetural e os responsáveis designados.

