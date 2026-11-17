# Artefato 10 — Roteiro Operacional de Configuração no GitHub

Este roteiro fornece o guia de execução passo a passo para que o estudante configure manualmente no GitHub todo o planejamento técnico elaborado a partir do caso de uso **`[UC12] Cadastrar Peça`**.

---

## Passo 1 — Acessar o Repositório do Projeto no GitHub
1. Abra o navegador e acesse o repositório: `https://github.com/peaga21/AutoFlow`.
2. Certifique-se de estar autenticado com a sua conta GitHub (`@peaga21`).
3. Verifique se a aba **Issues** e a aba **Projects** estão habilitadas nas configurações do repositório (*Settings $\rightarrow$ Features*).

---

## Passo 2 — Configurar o Conjunto Padronizado de Labels
1. No repositório, clique na aba **Issues** e, no topo direito da listagem, clique no botão **Labels**.
2. Remova ou ajuste labels pré-existentes genéricas que causem duplicidade.
3. Clique em **New label** e cadastre cada uma das labels padronizadas no **Artefato 7**:
   * `area:parts` — Cor `#1D76DB` — Descrição: *Bounded Context de Peças e Estoque*
   * `type:epic` — Cor `#3E2723` — Descrição: *Caso de uso completo / Épico*
   * `type:feature` — Cor `#A2EEEF` — Descrição: *Funcionalidade nova*
   * `type:test` — Cor `#FBCA04` — Descrição: *Testes automatizados unitários/E2E*
   * `type:documentation` — Cor `#0075CA` — Descrição: *Swagger, README e governança*
   * `layer:domain` — Cor `#D93F0B` — Descrição: *Núcleo puro de domínio*
   * `layer:contracts` — Cor `#B60205` — Descrição: *DTOs e interfaces de portas*
   * `layer:infra` — Cor `#5319E7` — Descrição: *Persistência, TypeORM e PostgreSQL*
   * `layer:application` — Cor `#0E8A16` — Descrição: *Casos de uso e serviços*
   * `layer:api` — Cor `#006B75` — Descrição: *Controllers e rotas HTTP*
   * `priority:critical` — Cor `#B60205` — Descrição: *Bloqueador de esteira*
   * `priority:high` — Cor `#D93F0B` — Descrição: *Alta prioridade / caminho crítico*
   * `priority:medium` — Cor `#FBCA04` — Descrição: *Média prioridade*

---

## Passo 3 — Criar a Issue Principal (Epic)
1. Na aba **Issues**, clique no botão verde **New issue**.
2. Preencha o campo **Title** com:
   ```text
   [UC12] Cadastrar Peça
   ```
3. No corpo da Issue (**Description**), copie e cole o conteúdo completo disponibilizado no **Artefato 3** (`01-03-issue-principal-epic.md`).
4. Na barra lateral direita:
   * **Assignees:** Atribua a você mesmo (`@peaga21`).
   * **Labels:** Selecione `area:parts`, `type:epic`, `priority:critical`.
5. Clique em **Submit new issue**.
6. Anote o número da Issue gerada (exemplo: `#12`).

---

## Passo 4 — Criar Cada uma das Sub-Issues
Crie individualmente as 7 Sub-Issues utilizando o modelo do **Artefato 4** (`01-04-sub-issues.md`):

1. **SUB-01:**
   * **Título:** `[SUB-01] feat(domain): modelar entidade Part e regras de negócio`
   * **Corpo:** Copiar o texto da Sub-Issue 01 do Artefato 4.
   * **Labels:** `area:parts`, `layer:domain`, `type:feature`, `priority:high`.
   * **Assignee:** `@peaga21`.
   * Clique em **Submit new issue** e guarde o número gerado (ex.: `#13`).

2. **SUB-02:**
   * **Título:** `[SUB-02] feat(contracts): definir DTOs de entrada/saída e porta IPartsRepository`
   * **Corpo:** Copiar o texto da Sub-Issue 02 do Artefato 4.
   * **Labels:** `area:parts`, `layer:contracts`, `type:feature`, `priority:high`.
   * **Assignee:** `@peaga21`.
   * Guarde o número (ex.: `#14`).

3. **SUB-03:**
   * **Título:** `[SUB-03] feat(infra): implementar persistência TypeORM, PartOrmEntity e migration PostgreSQL`
   * **Corpo:** Copiar o texto da Sub-Issue 03 do Artefato 4.
   * **Labels:** `area:parts`, `layer:infra`, `type:feature`, `priority:high`.
   * **Assignee:** `@peaga21`.
   * Guarde o número (ex.: `#15`).

4. **SUB-04:**
   * **Título:** `[SUB-04] feat(application): implementar serviço de aplicação CreatePartUseCase`
   * **Corpo:** Copiar o texto da Sub-Issue 04 do Artefato 4.
   * **Labels:** `area:parts`, `layer:application`, `type:feature`, `priority:high`.
   * **Assignee:** `@peaga21`.
   * Guarde o número (ex.: `#16`).

5. **SUB-05:**
   * **Título:** `[SUB-05] feat(api): expor endpoint POST /parts no PartsController`
   * **Corpo:** Copiar o texto da Sub-Issue 05 do Artefato 4.
   * **Labels:** `area:parts`, `layer:api`, `type:feature`, `priority:high`.
   * **Assignee:** `@peaga21`.
   * Guarde o número (ex.: `#17`).

6. **SUB-06:**
   * **Título:** `[SUB-06] test(e2e): implementar testes automatizados unitários e de integração com Vitest`
   * **Corpo:** Copiar o texto da Sub-Issue 06 do Artefato 4.
   * **Labels:** `area:parts`, `type:test`, `priority:high`.
   * **Assignee:** `@peaga21`.
   * Guarde o número (ex.: `#18`).

7. **SUB-07:**
   * **Título:** `[SUB-07] docs(governance): atualizar OpenAPI/Swagger, README e governança do repositório`
   * **Corpo:** Copiar o texto da Sub-Issue 07 do Artefato 4.
   * **Labels:** `area:parts`, `type:documentation`, `priority:medium`.
   * **Assignee:** `@peaga21`.
   * Guarde o número (ex.: `#19`).

---

## Passo 5 — Vincular as Sub-Issues à Issue Principal (Epic)
1. Abra a Issue Principal `[UC12] Cadastrar Peça` recém-criada.
2. Clique no ícone de edição (lápis) no canto superior direito da descrição.
3. Na seção **"5. Relação das Sub-Issues Planejadas"**, substitua os identificadores genéricos pelos números reais das Issues criadas no passo anterior com markdown tasklists:
   ```markdown
   - [ ] #13 [SUB-01] feat(domain): modelar entidade Part e regras de negócio
   - [ ] #14 [SUB-02] feat(contracts): definir DTOs de entrada/saída e porta IPartsRepository
   - [ ] #15 [SUB-03] feat(infra): implementar persistência TypeORM, PartOrmEntity e migration PostgreSQL
   - [ ] #16 [SUB-04] feat(application): implementar serviço de aplicação CreatePartUseCase
   - [ ] #17 [SUB-05] feat(api): expor endpoint POST /parts no PartsController
   - [ ] #18 [SUB-06] test(e2e): implementar testes automatizados unitários e de integração com Vitest
   - [ ] #19 [SUB-07] docs(governance): atualizar OpenAPI/Swagger, README e governança do repositório
   ```
4. Clique em **Update comment**. O GitHub transformará automaticamente a lista em tasklist interativa rastreável.
*(Nota: Caso a organização possua GitHub Enterprise ou o recurso nativo de Sub-issues ativo, utilize também o botão "+ Add sub-issue" nativo do GitHub).*

---

## Passo 6 — Criar e Configurar o GitHub Project (Board Kanban)
1. No menu superior da organização ou do seu perfil, acesse a aba **Projects** e clique em **New project**.
2. Selecione o template **Board** (ou Blank Table) e defina o nome do projeto como:
   ```text
   AutoFlow — Implementação UC12
   ```
3. Acesse a configuração das colunas do campo **Status** (*clicando no cabeçalho do campo Status $\rightarrow$ Edit options*).
4. Configure rigorosamente os **5 estados metodológicos**, removendo qualquer outro:
   1. `Backlog`
   2. `Ready`
   3. `In Progress`
   4. `In Review`
   5. `Done`
5. Salve as alterações do campo Status.

---

## Passo 7 — Inserir as Issues no GitHub Project e Definir Status Inicial
1. No board do projeto, clique em **+ Add item** na parte inferior das colunas ou pressione `Space`.
2. Digite `#` e pesquise pelas Issues do repositório `peaga21/AutoFlow`.
3. Adicione a Issue Principal e todas as 7 Sub-Issues criadas.
4. Distribua os cards conforme o **Artefato 8**:
   * **Coluna `Ready`:**
     * `[SUB-01]` (Entidade Part / Domínio)
     * `[SUB-02]` (DTOs e Porta / Contratos)
   * **Coluna `Backlog`:**
     * `[UC12]` (Issue Principal / Epic)
     * `[SUB-03]` (Infraestrutura / Persistência)
     * `[SUB-04]` (Aplicação / Use Case)
     * `[SUB-05]` (API / Controller)
     * `[SUB-06]` (Testes E2E / Vitest)
     * `[SUB-07]` (Documentação e Governança)

---

## Passo 8 — Revisão Final do Board
1. Certifique-se de que nenhum card está órfão de responsável (`Assignee`).
2. Certifique-se de que todas as labels de camada e prioridade estão visíveis nos cards.
3. O board está pronto para a futura fase de implementação!

