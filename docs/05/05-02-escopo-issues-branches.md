# Artefato 05-02 — Escopo, Issues, Responsabilidades e Estratégia de Branches

## 1. Relação de Escopo e Issues

No projeto AutoFlow, o caso de uso `[UC12]` (*Cadastrar Peça*) foi decomposto em 7 sub-issues técnicas orientadas à arquitetura em camadas. Para a modelagem de domínio da peça (`Part`), a equipe adotou o fluxo TDD integrado:

* **Issue Principal (Epic):** [#5 — [UC12] Cadastrar Peça](https://github.com/peaga21/AutoFlow/issues/5)
* **Sub-Issue de Domínio e Implementação:** [#6 — [SUB-01] feat(domain): modelar entidade Part e regras de negócio](https://github.com/peaga21/AutoFlow/issues/6)
* **Cenário Adotado:** **Cenário A — Ciclo TDD Unificado na Sub-Issue de Domínio**.
  * A sub-issue `#6` engloba a especificação do comportamento, o teste unitário de domínio (fase RED) e a respectiva implementação do comportamento mínimo em produção (fase GREEN).
  * Dessa forma, não há fragmentação artificial entre quem cria o teste de domínio e quem escreve a entidade de domínio, mantendo coesão arquitetural e rastreabilidade direta.

---

## 2. Responsáveis Designados e Papéis

Em função da organização operacional em modo solo:
* **Desenvolvedor & Engenheiro de Software:** Pedro Henrique Dias (`@peaga21`)
* **Papel:** Modelagem de domínio puro, escrita de testes unitários, implementação GREEN e automação de entrega contínua.
* **Políticas de Governança:** O desenvolvedor atua sob os preceitos de testes antes do código (TDD), pequenos commits atômicos semânticos e bloqueio de merges diretos na branch principal (`main`).

---

## 3. Verificação da Definition of Ready (DoR)

A Sub-Issue `#6` foi previamente avaliada e atende a todos os critérios formais de prontidão:

| Critério DoR | Situação no Projeto | Avaliação |
| :--- | :--- | :---: |
| **1. Objetivo Claro e Específico** | Modelar a entidade de domínio `Part` com criação segura e identificadores únicos. | Conforme |
| **2. Escopo Delimitado por Camadas** | Restrito à camada `domain` (`src/modules/parts/domain/`), sem acoplamento a ORM ou HTTP. | Conforme |
| **3. Critérios de Aceite Testáveis** | CA-01 formalizado em asserções no arquivo `part.entity.spec.ts`. | Conforme |
| **4. Dependências Mapeadas** | Nenhuma dependência externa bloqueante (domínio puro). Depende apenas de Node.js `node:crypto`. | Conforme |
| **5. Contratos e Tipos Definidos** | Interface `CreatePartProps` e classe `Part` estruturadas. | Conforme |
| **6. Responsável Atribuído** | Atribuído a `@peaga21`. | Conforme |
| **7. Auto-Revisão Crítica** | Revisão cruzada e diagnósticos registrados na etapa anterior. | Conforme |

---

## 4. Estratégia de Branches

Para garantir que o fluxo de trabalho permaneça limpo, rastreável e seguro, adota-se a seguinte estratégia:

* **Branch Base (*Target*):** `main`
* **Branch Ativa de Desenvolvimento:** `feat/sub-01-domain-part` (com upstream sincronizado para `origin/feat/sub-01-domain-part`)
* **Branch Alternativa Registrada:** `feature/issue-6-domain-part`
* **Nomenclatura Convencionada:** `feat/sub-01-domain-part` segue a convenção Git Flow / Trunk-Based com prefixo semântico e número de sub-issue.
* **Isolamento:** Nenhuma alteração é aplicada diretamente na branch `main`.

### Comandos de Inspeção e Validação de Branch
```bash
git branch --show-current
# Saída: feat/sub-01-domain-part

git status
# Confirmação do estado e sincronização com origin
```

---

## 5. Estratégia de Pull Request

* **PR de Referência:** Mantido como **Draft Pull Request** no GitHub:
  * Título: `[DRAFT] feat(parts): first failing test for Part creation (ref #6)`
  * Relação: O mesmo PR receberá os commits da transição para a fase GREEN.
* **Justificativa da Manutenção em Draft:**
  O PR não deve ser mesclado ao término da fase GREEN porque o ciclo TDD ainda requer a fase **REFACTOR** (Material 06) e testes adicionais de regras de negócio (RN02 - preço positivo, RN03 - estoque não negativo).
* **Bloqueio de Merge:** Merges prematuros na `main` estão expressamente proibidos até a conclusão dos 3 materiais do ciclo TDD.

---

## 6. Análise de Riscos e Plano de Integração

1. **Risco de Falsos Positivos:** Implementar stubs fixos que enganem o teste sem atribuir os campos reais.
   * *Mitigação:* Assegurar que os campos recebidos em `props` sejam atribuídos diretamente aos atributos da instância.
2. **Risco de Dependência Externa no Domínio:** Utilizar pacotes externos pesados para geração de IDs (como `uuid` npm) desnecessariamente.
   * *Mitigação:* Utilizar a API nativa e padrão `randomUUID` de `node:crypto`.
3. **Plano de Integração Subsequente:** Após consolidação do GREEN e REFACTOR na entidade `Part`, as Sub-Issues `#7` (Value Objects), `#8` (Repositório) e `#9` (Service de Aplicação) utilizarão a entidade validada como base sólida.
