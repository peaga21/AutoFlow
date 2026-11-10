# Artefato 05-07 — Registro de Versionamento, Commits e Atualização do Pull Request

## 1. Identificação do Commit da Fase GREEN

* **Branch de Trabalho:** `feat/sub-01-domain-part`
* **Hash do Commit:** `32d2a9c` (`32d2a9cc0e8e60b7d03a11986c7585f67fa4e861`)
* **Padrão Semântico:** *Conventional Commits*
* **Mensagem do Commit:** `feat(parts): implement minimal Part.create for GREEN test (ref #6)`
* **Issue Vinculada:** [#6 — [SUB-01] feat(domain): modelar entidade Part e regras de negócio](https://github.com/peaga21/AutoFlow/issues/6)
* **Escopo das Alterações:** Implementação do método estático de fábrica `Part.create` com suporte a geração de UUID e timestamp, além da documentação formal da etapa 05.

---

## 2. Diff Resumido das Alterações de Produção

```diff
warning: in the working copy of 'src/modules/parts/domain/part.entity.ts', LF will be replaced by CRLF the next time Git touches it
diff --git a/src/modules/parts/domain/part.entity.ts b/src/modules/parts/domain/part.entity.ts
index 31ed2be..3f9deb5 100644
--- a/src/modules/parts/domain/part.entity.ts
+++ b/src/modules/parts/domain/part.entity.ts
@@ -1,3 +1,5 @@
+import { randomUUID } from 'node:crypto';
+
 export interface CreatePartProps {
   id?: string;
   code: string;
@@ -17,8 +19,15 @@ export class Part {
   categoryId!: string;
   createdAt!: Date;
 
-  static create(_props: CreatePartProps): Part {
-    // Fase RED do TDD: Método propositalmente não implementado para evidenciar a falha funcional
-    throw new Error('Method not implemented: Part.create');
+  static create(props: CreatePartProps): Part {
+    const part = new Part();
+    part.id = props.id || randomUUID();
+    part.code = props.code;
+    part.name = props.name;
+    part.price = props.price;
+    part.stockQuantity = props.stockQuantity;
+    part.categoryId = props.categoryId;
+    part.createdAt = props.createdAt || new Date();
+    return part;
   }
 }
```

---

## 3. Publicação da Branch no Repositório Remoto (Git Push)

* **Comando Executado:**
  ```bash
  git push origin feat/sub-01-domain-part
  ```
* **Saída Autêntica do Terminal:**
  ```text
  To https://github.com/peaga21/AutoFlow.git
     0e9d652..32d2a9c  feat/sub-01-domain-part -> feat/sub-01-domain-part
  ```
* **Status do Upstream:** Sincronizado com `origin/feat/sub-01-domain-part`.
* **Políticas de Branch:** A branch principal (`main`) permanece intocada, aguardando as fases subsequentes.

---

## 4. Atualização da Minuta do Pull Request no GitHub

* **URL de Comparação e PR:** [https://github.com/peaga21/AutoFlow/compare/main...feat/sub-01-domain-part](https://github.com/peaga21/AutoFlow/compare/main...feat/sub-01-domain-part)
* **Título Atualizado:** `[DRAFT] feat(parts): implement minimal Part.create (TDD GREEN) (ref #6)`
* **Status:** **Draft (Rascunho)** — *Não mesclar prematuramente.*

### Conteúdo Atualizado da Descrição do PR
```markdown
## 📝 Pull Request (TDD GREEN) — [SUB-01] feat(domain): modelar entidade Part e regras de negócio

### 📌 Issue Vinculada
Ref: #6

### 🎯 Objetivo desta Alteração
Transição formal da fase RED para a fase GREEN no ciclo de desenvolvimento orientado a testes (TDD), satisfazendo o critério de aceite:
> *"O método estático de fábrica `Part.create(...)` instancia com sucesso uma entidade de peça quando fornecidos dados válidos (`code`, `name`, `price > 0`, `stockQuantity >= 0`, `categoryId`), gerando UUID e timestamp `createdAt`."*

### 🛠️ Alterações Incluídas
- Implementação mínima em `src/modules/parts/domain/part.entity.ts`.
- Geração de identificadores únicos via API nativa `node:crypto.randomUUID()`.
- Atribuição direta de propriedades de catálogo (`code`, `name`, `price`, `stockQuantity`, `categoryId`).
- Atribuição do timestamp de criação (`createdAt`).
- Documentação técnica e relatórios da etapa em `docs/05/`.

### 🧪 Evidência da Fase GREEN (Vitest)
\`\`\`text
 RUN  v3.2.7 C:/Users/pedro/.vscode/AutoFlow

 ✓ src/modules/parts/domain/part.entity.spec.ts (1 test) 5ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  15:35:03
   Duration  986ms (transform 93ms, setup 0ms, collect 121ms, tests 5ms, environment 0ms, prepare 372ms)
\`\`\`

### ⏳ Checklist do Ciclo TDD
- [x] Teste automatizado falhando legitimamente (Fase RED - Material 04)
- [x] Implementação mínima de produção executada (Fase GREEN - Material 05)
- [x] Teste unitário e suíte de regressão 100% aprovados
- [ ] Refatoração e isolamento de invariantes (Fase REFACTOR - Material 06)
- [ ] Revisão de código e merge controlado na main

⚠️ **ATENÇÃO: Este Pull Request permanece como DRAFT até a conclusão da fase REFACTOR (Material 06).**
```

---

## 5. Sincronização do GitHub Project e Próximos Passos

1. **Status no Quadro Kanban:**
   * A Sub-Issue [#6](https://github.com/peaga21/AutoFlow/issues/6) permanece em **`In Progress`** no Projeto `#2` (*Planejamento - UC12 Cadastrar Peça*).
   * ⛔ **Regra de Governança:** O card **NÃO** deve ser movido para `Done`, pois o ciclo TDD ainda requer a fase de Refatoração (Material 06) e testes de invariantes (RN02 e RN03).
2. **Próxima Etapa:** Material 06 — *Refatoração com TDD (Fase REFACTOR)*.
