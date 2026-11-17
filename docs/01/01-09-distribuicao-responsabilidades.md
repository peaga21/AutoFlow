# Artefato 9 — Distribuição de Responsabilidades

## 1. Contexto da Equipe e Alocação
Conforme a documentação do projeto AutoFlow (`governanca_e_repositorio.md` e `AutoFlow_Trabalho_Atualizado.md`), o projeto acadêmico tem como autor e desenvolvedor responsável **Pedro Henrique Dias** (`@peaga21`). 

Para simular o ambiente corporativo e viabilizar a colaboração com revisores acadêmicos e eventuais pares de equipe, a matriz considera os seguintes papéis estruturados na governança do repositório:
* **Desenvolvedor Core / Autor (`@peaga21`):** Responsável pela implementação técnica de todas as camadas.
* **Code Reviewer / Avaliador (`@autoflow-reviewers`):** Responsável pela conferência dos critérios de aceite, aprovação de Pull Requests e verificação da qualidade.
* **Tech Lead / Admin (`@autoflow-admin`):** Responsável pela liberação de branches protegidas e governança global.

---

## 2. Matriz de Alocação de Responsabilidades

| Identificador | Atividade Técnica | Responsável Designado | Revisor / Apoio | Dependências | Estado Inicial |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[UC12]** | `[UC12] Cadastrar Peça` (Epic) | Pedro Henrique Dias (`@peaga21`) | `@autoflow-admin` | Nenhuma | `Backlog` |
| **[SUB-01]** | `feat(domain): modelar entidade Part e regras de negócio` | Pedro Henrique Dias (`@peaga21`) | `@autoflow-reviewers` | Nenhuma | `Ready` |
| **[SUB-02]** | `feat(contracts): definir DTOs de entrada/saída e porta IPartsRepository` | Pedro Henrique Dias (`@peaga21`) | `@autoflow-reviewers` | Nenhuma | `Ready` |
| **[SUB-03]** | `feat(infra): implementar persistência TypeORM, PartOrmEntity e migration` | Pedro Henrique Dias (`@peaga21`) | `@autoflow-reviewers` | SUB-01, SUB-02 | `Backlog` |
| **[SUB-04]** | `feat(application): implementar serviço de aplicação CreatePartUseCase` | Pedro Henrique Dias (`@peaga21`) | `@autoflow-reviewers` | SUB-01, SUB-02, SUB-03 | `Backlog` |
| **[SUB-05]** | `feat(api): expor endpoint POST /parts no PartsController` | Pedro Henrique Dias (`@peaga21`) | `@autoflow-reviewers` | SUB-02, SUB-04 | `Backlog` |
| **[SUB-06]** | `test(e2e): implementar testes automatizados unitários e de integração com Vitest` | Pedro Henrique Dias (`@peaga21`) | `@autoflow-reviewers` | SUB-01 a SUB-05 | `Backlog` |
| **[SUB-07]** | `docs(governance): atualizar OpenAPI/Swagger, README e governança` | Pedro Henrique Dias (`@peaga21`) | `@autoflow-admin` | SUB-05, SUB-06 | `Backlog` |

---

## 3. Recomendações de Comunicação e Ritos de Alinhamento

1. **Transição de Estados:**
   * Sempre que uma Sub-Issue for iniciada, o responsável deve movê-la formalmente para `In Progress` no GitHub Projects e criar a branch com o prefixo convencionado (ex.: `feat/sub-01-domain-part`).
   * Não iniciar tarefas que estejam marcadas com dependências pendentes no `Backlog`.
2. **Abertura de Pull Requests (PR):**
   * Ao finalizar o desenvolvimento e os testes da Sub-Issue, o PR deve ser aberto apontando para a branch `main`.
   * O PR deve incluir a menção de fechamento automático: `Closes #<numero_da_sub_issue>`.
   * O card no board deve ser movido para a coluna **`In Review`**.
3. **Revisão por Pares (Code Review):**
   * O revisor designado (`@autoflow-reviewers`) deve verificar a conformidade com o Clean Architecture, checar se não houve vazamento de decorators de TypeORM para a entidade de domínio e validar a passagem da suíte do Vitest.
   * Somente após a aprovação formal do PR a mesclagem (*merge*) é autorizada, movendo a Sub-Issue automaticamente para **`Done`**.
4. **Alinhamento Assíncrono:**
   * Utilizar a aba de comentários da própria Issue no GitHub para registrar bloqueios técnicos ou dúvidas de design, garantindo rastreabilidade histórica.

