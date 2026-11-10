# Artefato 04-01 — Verificação de Prontidão (Definition of Ready - DoR)

## 1. Identificação da Atividade Priorizada
* **Sistema:** AutoFlow — Gestão Operacional para Oficinas Mecânicas
* **Caso de Uso:** `[UC12] Cadastrar Peça`
* **Issue Principal (Epic):** [#5 — [UC12] Cadastrar Peça](https://github.com/peaga21/AutoFlow/issues/5)
* **Sub-Issue Selecionada:** [#6 — [SUB-01] feat(domain): modelar entidade Part e regras de negócio](https://github.com/peaga21/AutoFlow/issues/6)
* **Responsável Técnico (*Assignee*):** Pedro Henrique Dias (`@peaga21`)
* **Revisor de Planejamento (*Reviewer*):** Auto-revisão técnica estruturada e `@autoflow-reviewers` (Equipe Docente)
* **Data da Avaliação:** 10 de Novembro de 2026

---

## 2. Matriz de Avaliação da Definition of Ready (DoR)

| Código | Condição de Prontidão | Situação | Evidência e Justificativa no Projeto AutoFlow |
| :---: | :--- | :---: | :--- |
| **DoR-01** | **Objetivo claramente definido** | **Atende** | O objetivo está explicitado na Issue #6: criar a entidade pura de domínio `Part` encapsulando atributos e regras de negócio essenciais, sem acoplamento a bibliotecas externas. |
| **DoR-02** | **Escopo delimitado** | **Atende** | Dentro do escopo: atributos (`id`, `code`, `name`, `price`, `stockQuantity`, `categoryId`, `createdAt`), método de fábrica `Part.create(...)` e exceções de domínio. Fora do escopo: persistência SQL, decorators TypeORM e controllers HTTP. |
| **DoR-03** | **Critérios de aceite verificáveis** | **Atende** | Critério primário para o primeiro teste TDD: *"O método de fábrica estático `Part.create(...)` instancia com sucesso uma entidade de peça quando fornecidos dados válidos (`code`, `name`, `price > 0`, `stockQuantity >= 0`, `categoryId`), gerando UUID e timestamp `createdAt`."* |
| **DoR-04** | **Dependências identificadas** | **Atende** | Não possui bloqueios técnicos prévios. Trata-se do núcleo fundacional da Clean Architecture (camada de domínio puro). |
| **DoR-05** | **Informações técnicas disponíveis** | **Atende** | Tipagem dos atributos e invariantes de negócio especificadas em `CasoDeUso.md` e `blueprint_autoflow.md`. Framework de teste (Vitest) configurado no `package.json`. |
| **DoR-06** | **Responsável definido** | **Atende** | Atribuído formalmente a Pedro Henrique Dias (`@peaga21`), com responsabilidade técnica confirmada. |
| **DoR-07** | **Revisão de planejamento concluída** | **Atende** | Auditoria e revisão registradas no Artefato 02-04 e 02-05, com comentários técnicos formatados e status **`Ready`** atribuído no GitHub Project. |

---

## 3. Parecer de Prontidão
* **Resultado Consolidado:** **APROVADO (7 de 7 critérios atendidos).**
* **Classificação:** **`Ready`** para início do desenvolvimento prático.
* **Autorização Formal:** Fica autorizado o isolamento da atividade na branch de trabalho `feature/issue-6-sub-01-domain-part` e a implementação do primeiro teste automatizado na fase RED do TDD.
