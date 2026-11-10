# Artefato 07 — Plano de Atualização do GitHub

## 1. Roteiro Operacional de Atualização
Este plano fornece o passo a passo objetivo para que o desenvolvedor aplique e formalize as decisões de organização e revisão diretamente no GitHub (`peaga21/AutoFlow`).

---

## 2. Etapas Sequenciais de Atualização

### Etapa 1 — Conferência de Integridade no Repositório
1. Acesse a listagem de Issues do repositório: `https://github.com/peaga21/AutoFlow/issues`.
2. Certifique-se de que a Issue Principal e as 7 Sub-Issues estão abertas e vinculadas:
   * **#5:** `[UC12] Cadastrar Peça` (Epic)
   * **#6:** `[SUB-01] feat(domain): modelar entidade Part e regras de negócio`
   * **#7:** `[SUB-02] feat(contracts): definir DTOs de entrada/saída e porta IPartsRepository`
   * **#8:** `[SUB-03] feat(infra): implementar persistência TypeORM, PartOrmEntity e migration PostgreSQL`
   * **#9:** `[SUB-04] feat(application): implementar serviço de aplicação CreatePartUseCase`
   * **#10:** `[SUB-05] feat(api): expor endpoint POST /parts no PartsController`
   * **#11:** `[SUB-06] test(e2e): implementar testes automatizados unitários e de integração com Vitest`
   * **#12:** `[SUB-07] docs(governance): atualizar OpenAPI/Swagger, README e governança do repositório`

### Etapa 2 — Confirmação de Responsáveis (*Assignees*)
* Verifique se todas as Sub-Issues (#6 a #12) e o Epic (#5) estão com o campo **Assignees** preenchido com `@peaga21`.
* Caso alguma Issue esteja sem responsável, atribua-a na barra lateral direita do GitHub.

### Etapa 3 — Publicação dos Comentários Técnicos de Revisão
1. Para cada Sub-Issue (de #6 a #12), abra a página correspondente no GitHub.
2. Copie o comentário técnico formatado no **Artefato 05** (`02-05-comentarios-github.md`).
3. Cole na caixa de comentários da Issue (*Leave a comment*) e clique em **Comment**.
4. *(Opcional)* Ao realizar a auto-revisão final de `SUB-01` e `SUB-02`, cole o **Template Padrão de Conclusão de Revisão** confirmando que os critérios de aceite estão validados.

### Etapa 4 — Governança de Estados no GitHub Project (Board Kanban)
1. Acesse o GitHub Project: [Planejamento - UC12 Cadastrar Peça (Project #2)](https://github.com/users/peaga21/projects/2).
2. Verifique o posicionamento dos cards conforme a avaliação da Definition of Ready (Artefato 06):
   * **Coluna `Ready`:**
     * Issue #6 (`SUB-01`)
     * Issue #7 (`SUB-02`)
   * **Coluna `Backlog`:**
     * Issue #5 (Epic `[UC12]`)
     * Issue #8 (`SUB-03`)
     * Issue #9 (`SUB-04`)
     * Issue #10 (`SUB-05`)
     * Issue #11 (`SUB-06`)
     * Issue #12 (`SUB-07`)
3. **Regra Anti-Redundância:** Não crie nem mantenha labels com nomes de estado (como `status:ready` ou `status:in-progress`). O controle de fluxo deve ocorrer exclusivamente através do campo nativo **Status** do Project Board.

### Etapa 5 — Auditoria Final do Board
* Assegure-se de que nenhum card esteja sem responsável ou com status divergente dos 5 estados metodológicos.
* O repositório e o board encontram-se prontos para o início ordenado da implementação!

