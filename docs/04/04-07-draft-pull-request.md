# Artefato 04-07 — Minuta e Abertura do Draft Pull Request

## 1. Identificação do Pull Request
* **Título do PR:** `[DRAFT] feat(parts): first failing test for Part creation (ref #6)`
* **Issue Vinculada:** [#6 — [SUB-01] feat(domain): modelar entidade Part e regras de negócio](https://github.com/peaga21/AutoFlow/issues/6)
* **Branch de Origem (*Compare Branch*):** `feature/issue-6-domain-part`
* **Branch de Destino (*Base Branch*):** `main`
* **Tipo do Pull Request:** **Draft Pull Request (Rascunho)**
* **Link de Abertura:** [https://github.com/peaga21/AutoFlow/pull/new/feature/issue-6-domain-part](https://github.com/peaga21/AutoFlow/pull/new/feature/issue-6-domain-part)

---

## 2. Conteúdo Integral Submetido no Pull Request

```markdown
## 📝 Draft Pull Request — [SUB-01] feat(domain): modelar entidade Part e regras de negócio

### 📌 Issue Vinculada
Ref: #6

### 🎯 Objetivo desta Alteração
Estabelecer o primeiro teste automatizado na fase RED do ciclo TDD, validando o critério de aceite:
> *"O método estático de fábrica `Part.create(...)` instancia com sucesso uma entidade de peça quando fornecidos dados válidos (`code`, `name`, `price > 0`, `stockQuantity >= 0`, `categoryId`), gerando UUID e timestamp `createdAt`."*

### 🛠️ Alterações Incluídas
- Criação do arquivo de teste: `src/modules/parts/domain/part.entity.spec.ts`
- Definição do contrato e stub de borda: `src/modules/parts/domain/part.entity.ts`
- Implementação do cenário de teste para dados válidos seguindo o padrão AAA (Arrange, Act, Assert).

### 🧪 Evidência da Fase RED (TDD)
O teste foi executado via Vitest e falhou conforme o esperado devido à ausência da implementação funcional de produção:
\`\`\`text
 RUN  v3.2.7 C:/Users/pedro/.vscode/AutoFlow

 ❯ src/modules/parts/domain/part.entity.spec.ts (1 test | 1 failed) 7ms
   × Part Domain Entity (TDD RED) > should instantiate a valid Part entity with generated ID and timestamp when valid data is provided (CA-01) 6ms
     → Method not implemented: Part.create

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/modules/parts/domain/part.entity.spec.ts > Part Domain Entity (TDD RED) > should instantiate a valid Part entity with generated ID and timestamp when valid data is provided (CA-01)
Error: Method not implemented: Part.create
 ❯ Part.create src/modules/parts/domain/part.entity.ts:22:11
 ❯ src/modules/parts/domain/part.entity.spec.ts:16:23

 Test Files  1 failed (1)
      Tests  1 failed (1)
\`\`\`

### ⏳ Estado Atual e Próximos Passos
- [x] Branch de trabalho criada a partir da main (`feature/issue-6-domain-part`)
- [x] Teste automatizado escrito e falhando legitimamente (RED)
- [x] Commit atômico registrado (`f01b4b1`)
- [ ] Implementação de código de produção para satisfazer o teste (fase GREEN - Material 05)
- [ ] Refatoração e limpeza de código (fase REFACTOR)

⚠️ **ATENÇÃO: Este Pull Request é um RASCUNHO (DRAFT) e NÃO DEVE SER INTEGRADO (MERGE) até a conclusão das fases GREEN e REFACTOR.**
```

---

## 3. Diretrizes de Governança
1. **Natureza Draft:** O PR deve permanecer como *Draft* para sinalizar à equipe e aos avaliadores que o trabalho está em desenvolvimento ativo.
2. **Impedimento de Merge:** Nenhum merge deve ser realizado na branch `main` nesta fase. A integração ocorrerá somente após os testes passarem (GREEN) e o código ser refatorado (REFACTOR) no Material 05.
