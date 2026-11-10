# Artefato 06-04 — Evidências de Verificação de Regressões

## 1. Contexto da Verificação

Após a fase de avaliação de refatoração, com a decisão de **preservar o código sem alterações**, a verificação formal de regressões confirma a integridade total da suíte de testes. A execução a seguir representa o estado pós-análise na branch `feat/sub-01-domain-part`.

---

## 2. Comandos Executados e Saídas Reais do Terminal

### 2.1. Teste Específico — Entidade `Part` (CA-01)

**Comando:**
```bash
pnpm vitest run src/modules/parts/domain/part.entity.spec.ts
```

**Saída Autêntica:**
```text
 RUN  v3.2.7 C:/Users/pedro/.vscode/AutoFlow

 ✓ src/modules/parts/domain/part.entity.spec.ts (1 test) 4ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  16:32:37
   Duration  1.13s (transform 92ms, setup 0ms, collect 121ms, tests 4ms, environment 0ms, prepare 458ms)
```

### 2.2. Suíte de Regressão — Módulo `Orders`

**Comando:**
```bash
pnpm vitest run src/modules/orders/services/orders.service.spec.ts
```

**Saída Autêntica:**
```text
 RUN  v3.2.7 C:/Users/pedro/.vscode/AutoFlow

 ✓ src/modules/orders/services/orders.service.spec.ts (6 tests) 26ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  16:32:44
   Duration  2.37s (transform 166ms, setup 0ms, collect 1.33s, tests 26ms, environment 0ms, prepare 447ms)
```

---

## 3. Matriz Comparativa — Linha de Base vs. Pós-Avaliação de Refatoração

| Teste / Arquivo de Teste | Comportamento Verificado | Resultado Linha de Base (06-01) | Resultado Pós-Avaliação (06-04) | Situação |
| :--- | :--- | :---: | :---: | :---: |
| `part.entity.spec.ts` — *CA-01* | Instanciação de `Part` com dados válidos, UUID gerado, `createdAt` como `Date` | **1 passed** | **1 passed** | ✅ Preservado |
| `orders.service.spec.ts` — *Teste 1* | Fluxo de confirmação de pedido com pagamento aprovado | **Passed** | **Passed** | ✅ Preservado |
| `orders.service.spec.ts` — *Teste 2* | Lançar exceção quando pedido não encontrado | **Passed** | **Passed** | ✅ Preservado |
| `orders.service.spec.ts` — *Teste 3* | Lançar exceção quando pagamento não encontrado | **Passed** | **Passed** | ✅ Preservado |
| `orders.service.spec.ts` — *Teste 4* | Lançar exceção quando pagamento não aprovado | **Passed** | **Passed** | ✅ Preservado |
| `orders.service.spec.ts` — *Teste 5* | Lançar exceção quando pedido já confirmado | **Passed** | **Passed** | ✅ Preservado |
| `orders.service.spec.ts` — *Teste 6* | Verificar comportamento de criação de pedido | **Passed** | **Passed** | ✅ Preservado |
| **Totais** | — | **7 passed / 0 failed** | **7 passed / 0 failed** | ✅ Zero regressões |

---

## 4. Verificação Formal dos Contratos Arquiteturais

| Contrato | Estado Verificado |
| :--- | :--- |
| Interface `CreatePartProps` (exportada) | ✅ Inalterada |
| Assinatura `Part.create(props: CreatePartProps): Part` | ✅ Inalterada |
| Propriedades públicas da entidade `Part` | ✅ Inalteradas |
| Importação `randomUUID` de `node:crypto` | ✅ Inalterada |
| Isolamento da camada de Domínio (sem ORM ou HTTP) | ✅ Confirmado |
| Contratos do módulo `Orders` (entidades, repositórios) | ✅ Inalterados e independentes |

---

## 5. Delimitação dos Limites de Cobertura

> ⚠️ **Transparência sobre a abrangência dos testes:**
>
> 1. Os testes unitários confirmam o comportamento isolado de cada componente no seu escopo específico.
> 2. Regras de negócio RN02 (preço positivo) e RN03 (estoque não negativo) **não possuem testes automatizados ainda** e, portanto, não são garantidas pelos testes atuais.
> 3. Fluxos de integração (HTTP, ORM, banco de dados) não estão cobertos por testes unitários — pertencem a testes de integração/E2E futuros.
> 4. Os dois arquivos `app.controller.spec.ts` e `app.service.spec.ts` utilizam globals do Jest sem importação explícita e não são contemplados nesta suíte Vitest (pré-existentes ao projeto).

---

## 6. Parecer Conclusivo

A suíte de testes foi reexecutada com sucesso e demonstra **ausência total de regressões no escopo testado**. O código da entidade `Part` e o módulo `Orders` permanecem íntegros e estáveis. A branch `feat/sub-01-domain-part` está pronta para a fase de **Versionamento e Revisão Técnica dos Pull Requests**.
