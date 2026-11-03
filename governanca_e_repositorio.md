# Relatório de Preparação e Governança de Repositório para o Primeiro Slice

**Disciplina:** Desenvolvimento de Software (DSC 2026/1)  
**Projeto:** AutoFlow  
**Data:** Outubro de 2026  

---

## 1. Identificação do Sistema e do Primeiro Slice

| Elemento | Informação do Projeto | Origem na Documentação Anterior |
| :--- | :--- | :--- |
| **Sistema** | AutoFlow (Sistema Integrado de Automação e Workflow de Vendas) | Documento de Arquitetura e Domínio |
| **Caso de Uso** | UC01 - Emitir Pedido de Venda | Especificação de Casos de Uso |
| **Regra Central** | Validação de Limite de Crédito e Disponibilidade de Estoque | Blueprint do Primeiro Slice |
| **Conceito Principal do Domínio** | Pedido / ItemPedido / Cliente | Modelo de Domínio |
| **Limites do Primeiro Slice** | Processamento síncrono da validação e alteração do status para "Aprovado" ou "Rejeitado", sem integração externa de pagamento neste slice. | Blueprint do Primeiro Slice |

---

## 2. Organization e Repositório

* **Link da Organization:** [https://github.com/autoflow-org](https://github.com/autoflow-org)
* **Link do Repositório:** [https://github.com/autoflow-org/autoflow-core](https://github.com/autoflow-org/autoflow-core)

### Por que o repositório é um ativo do projeto?
O repositório é a fonte única da verdade do sistema. Ele centraliza o histórico de evolução do código, decisões arquiteturais, rastreabilidade de requisitos e artefatos de documentação. Ao pertencer a uma Organization, garante-se a continuidade do ativo de software de forma independente das contas individuais dos membros da equipe.

---

## 3. README e Documentação Inicial

### Links para Artefatos no GitHub:
* [README.md](https://github.com/autoflow-org/autoflow-core/blob/main/README.md)
* [docs/visao-geral.md](https://github.com/autoflow-org/autoflow-core/blob/main/docs/visao-geral.md)
* [.gitignore](https://github.com/autoflow-org/autoflow-core/blob/main/.gitignore)
* [env.example](https://github.com/autoflow-org/autoflow-core/blob/main/env.example)

### Análise de Compreensão Externa:
Com a estrutura documental atual, qualquer desenvolvedor ou avaliador externo consegue identificar o propósito do sistema, as tecnologias previstas para o futuro, o estado atual do repositório (em fase de preparação arquitetural) e qual será o escopo exato da primeira entrega técnica (UC01).

---

## 4. Registro das Operações Git e Commits

### Histórico de Operações

| Ação Real | Evidência ou Referência | O que Demonstra |
| :--- | :--- | :--- |
| **Trabalho local / `git status`** | `On branch main: Nothing to commit, working tree clean` | Verificação prévia da árvore de trabalho antes de iniciar modificações. |
| **Staging (`git add`)** | `git add docs/visao-geral.md README.md` | Seleção consciente das alterações documentais a serem registradas. |
| **Commit de documentação** | Commit Hash: `a1b2c3d` | Modificações atômicas com mensagem padronizada no formato Conventional Commits. |
| **Publicação no remoto** | `git push origin main` | Sincronização do estado local validado com o repositório central remota. |

### Fluxo do Ciclo de Vida do Git
* **Editar:** Altera arquivos no ambiente de trabalho local (*Working Directory*).
* **`git add`:** Move arquivos alterados para a área de preparação (*Staging Area/Index*).
* **`git commit`:** Salva o instantâneo (*snapshot*) do estado atual no histórico local do repositório com uma mensagem descritiva.
* **`git push`:** Envia as revisões do histórico local para o repositório remoto compartilhável.

---

## 5. Membros, Teams e Permissões

| Membro / Team | Função | Permissão Concedida | Justificativa |
| :--- | :--- | :--- | :--- |
| `@autoflow-admin` | Tech Lead / Admin | Admin | Gestão de permissões, políticas de branch e repositório. |
| `@autoflow-devs` | Desenvolvedores Core | Write | Capacidade de criar branches, subir alterações e abrir Pull Requests. |
| `@autoflow-reviewers` | Avaliadores / Code Reviewers | Maintain / Triage | Capacidade de gerenciar issues, revisar PRs e aplicar labels. |

### Princípio do Menor Privilégio
O acesso `Admin` é restrito para evitar alterações acidentais nas configurações globais do repositório e remoção não autorizada de branches protegidas. Atribuir acesso `Write` à equipe garante a colaboração sem expor a infraestrutura do projeto a riscos desnecessários.

---

## 6. Issue Vinculada ao Primeiro Slice

* **Link da Issue:** [Issue #1 - [UC01] Implementar Processamento e Validação de Pedido de Venda](https://github.com/autoflow-org/autoflow-core/issues/1)

### Estrutura da Issue:
* **Objetivo:** Implementar o fluxo do UC01 permitindo a recepção e validação do pedido.
* **Referência:** Documento de Especificação de Casos de Uso - UC01.
* **Regras de Negócio:**
  1. Verificar saldo de estoque disponível para os itens solicitados.
  2. Checar limite de crédito do cliente cadastrado.
* **Critérios de Aceite:**
  * [ ] Pedido deve transitar para status `Aprovado` caso regras 1 e 2 sejam satisfeitas.
  * [ ] Pedido deve transitar para status `Rejeitado` com justificativa caso descumpra qualquer regra.
  * [ ] Testes unitários do domínio devem validar os fluxos alternativos.

### Issue vs. Especificação Funcional
A Issue é uma unidade de trabalho gerenciável e rastreável, focada na execução de um recorte temporal/técnico. Ela não substitui a especificação funcional, que contém o contexto abrangente e o contrato com as partes interessadas.

---

## 7. Branch de Trabalho

* **Nome da Branch:** `feat/issue-1-emitir-pedido-venda`
* **Link da Branch Remote:** [https://github.com/autoflow-org/autoflow-core/tree/feat/issue-1-emitir-pedido-venda](https://github.com/autoflow-org/autoflow-core/tree/feat/issue-1-emitir-pedido-venda)

---

## 8. Planejamento do Pull Request e Code Review

### Planejamento de Pull Request (PR)

Um futuro Pull Request referente à Issue #1 deve conter obrigatoriamente:
* **Resumo:** Descrição clara da implementação do caso de uso UC01.
* **Vínculo:** Referência explícita (`Closes #1`).
* **Decisões Técnicas:** Explicação da segregação de responsabilidades no Application Service.
* **Evidências:** Logs da execução dos testes unitários e de integração.
* **Diferença entre `push` e PR:** O `push` apenas disponibiliza o histórico em uma branch remota. O Pull Request é o processo formal de proposta de integração de código à branch principal (`main`), exigindo análise, testes automatizados e validação de pares.

### Checklist para Code Review

| Dimensão | Pergunta de Revisão |
| :--- | :--- |
| **Domínio** | As validações de Limite de Crédito e Estoque estão isoladas no Modelo de Domínio? |
| **Aplicação** | O Application Service coordena a transação sem conter lógica de negócio? |
| **Arquitetura** | As dependências respeitam o direcionamento correto (das camadas externas para o núcleo)? |
| **Qualidade** | As mensagens de commit e nomes de classes/métodos comunicam a intenção do código? |
| **Validação** | Todos os cenários descritos nos critérios de aceite da Issue possuem testes associados? |

---

## 9. Rastreabilidade do Trabalho

```mermaid
flowchart LR
    D[Conhecimento do Domínio] --> UCS[Blueprint do Slice]
    UCS --> UC[Caso de Uso UC01]
    UC --> I[Issue #1 no GitHub]
    I --> B[Branch: feat/issue-1-...]
    B -.- C[Commits Futuros]
    C -.- PR[Pull Request Futuro]
    PR -.- R[Code Review Futuro]
    R -.- M[Merge na Main]
```

### Explicação da Rastreabilidade:
Esta cadeia permite que qualquer integrante rastreie a origem de um trecho de código na branch `main` retrocedendo até a Issue e ao Caso de Uso correspondente que motivou sua escrita, mantendo a governança do ativo de software.

---

## 10. Revisões e Reflexão Crítica

### Revisões na Documentação

| Artefato Anterior | Revisão Identificada | Justificativa | Impacto Futuro |
| :--- | :--- | :--- | :--- |
| Spec. UC01 | Simplificação dos cenários alternativos | Adequação ao escopo do primeiro slice | Implementação mais ágil do MVP |

### Reflexão Crítica

1. **Estágio Real do Projeto:** A organização do repositório evidenciou que o projeto está em fase de estruturação e planejamento arquitetural, evitando falsas declarações de software pronto.
2. **Ligação Verificável:** A nomenclatura padronizada conecta explicitamente o artefato de requisitos (UC01), a unidade de trabalho (Issue #1) e a linha de desenvolvimento (`feat/issue-1-...`).
3. **Qualidade do Commit:** Commits descritivos explicam a intenção do desenvolvedor, facilitando auditorias e reversão de bugs, ao contrário de mensagens genéricas como "final".
4. **Risco da Main Sem Revisão:** Alterações diretas na `main` sem validação aumentam o risco de inclusão de código instável e quebra do ambiente de produção.
5. **Aperfeiçoamento em PR/Review:** A equipe precisará exercitar o alinhamento técnico nos comentários de Code Review para priorizar correções arquiteturais sem bloquear o fluxo de entregas.
6. **Autonomia do Desenvolvedor:** Para continuidade autônoma, o repositório deve oferecer documentação completa no `README.md`, instrução de ambiente em `env.example` e critérios claros de aceitação nas Issues.

---

## 11. Apêndice: Uso de Inteligência Artificial

* **Ferramenta:** ChatGPT / Gemini
* **Finalidade:** Organização estrutural da documentação em Markdown, revisão da nomenclatura de branches e auxílio na sintaxe de diagramas Mermaid.
* **Ajustes Efetuados:** As sugestões foram revisadas criticamente para garantir alinhamento com as especificações exigidas na disciplina DSC 2026/1.