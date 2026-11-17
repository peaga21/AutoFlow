# Artefato 04-03 — Preparação e Publicação da Branch de Trabalho

## 1. Identificação da Branch
* **Nome da Branch:** `feature/issue-6-domain-part`
* **Convenção Adotada:** `feature/<issue-id>-<descricao-curta>` (padrão de fluxo colaborativo do projeto AutoFlow)
* **Issue Vinculada:** [#6 — [SUB-01] feat(domain): modelar entidade Part e regras de negócio](https://github.com/peaga21/AutoFlow/issues/6)
* **Branch de Origem (Base):** `main` (commit `6d7b415`)
* **Upstream Remoto:** `origin/feature/issue-6-domain-part`

---

## 2. Comandos Executados e Evidências

### 2.1. Criação e Alternância para a Branch Local
```bash
git switch -c feature/issue-6-domain-part
```
* **Saída do Terminal:**
```text
Switched to a new branch 'feature/issue-6-domain-part'
```

### 2.2. Publicação com Configuração de Upstream
```bash
git push -u origin feature/issue-6-domain-part
```
* **Saída do Terminal:**
```text
branch 'feature/issue-6-domain-part' set up to track 'origin/feature/issue-6-domain-part'.
To https://github.com/peaga21/AutoFlow.git
 * [new branch]      feature/issue-6-domain-part -> feature/issue-6-domain-part
```

### 2.3. Verificação do Rastreamento
```bash
git branch --show-current
git branch -vv
```
* **Saída do Terminal:**
```text
feature/issue-6-domain-part
* feature/issue-6-domain-part 6d7b415 [origin/feature/issue-6-domain-part] docs: consolidacao dos artefatos de organizacao, revisao e DoR
  main                        6d7b415 [origin/main] docs: consolidacao dos artefatos de organizacao, revisao e DoR
```

---

## 3. Justificativa Técnica do Upstream (`-u`)
A flag `-u` (`--set-upstream`) estabelece a associação permanente entre o ramo local e a respectiva referência no servidor remoto (`origin`). Com essa configuração:
1. Futuros comandos `git push` e `git pull` nesta branch não exigem a especificação de argumentos de repositório e branch.
2. O Git passa a alertar automaticamente se a branch local está adiantada (*ahead*) ou atrasada (*behind*) em relação ao remoto.
3. Garante-se o isolamento absoluto da alteração, impedindo qualquer contaminação inadvertida na branch de produção `main`.
