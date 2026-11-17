#!/usr/bin/env bash
# Script de Automação Total - AutoFlow (Modo Solo)
# Executa sem interrupções ou solicitações de confirmação

echo "==> Iniciando a criacao automatizada da estrutura e documentacao..."

# 1. Criar diretorios de documentacao
mkdir -p docs/planejamento
mkdir -p docs/etapa-04

echo "==> Pastas criadas com sucesso."

# 2. Gerar Artefato 1: Análise Técnica
cat << 'EOF' > docs/planejamento/01-analise-tecnica.md
# Artefato 1 — Análise Técnica do Caso de Uso

## 1. Identificação e Título do Caso de Uso
* **Identificador:** `UC08`
* **Título:** Cadastrar Peça
* **Sistema:** AutoFlow — Plataforma Corporativa de Gestão Operacional para Oficinas Mecânicas
* **Módulo:** Estoque e Almoxarifado (*Inventory / Parts*)

## 2. Objetivo e Escopo
Permitir o registro estruturado de uma nova peça automotiva no inventário do sistema AutoFlow, validando regras de negócio essenciais (unicidade de SKU, preço positivo, estoque não negativo) e expondo o recurso via API REST.
EOF

# 3. Gerar Artefato 5: Matriz de Rastreabilidade
cat << 'EOF' > docs/planejamento/05-matriz-rastreabilidade.md
# Artefato 5 — Matriz de Rastreabilidade

| Requisito / Regra | Sub-Issue Associada | Atividade Técnica Planejada | Critério de Aceite Principal |
| :--- | :--- | :--- | :--- |
| **RN01 (Código SKU Único)** | `SUB-01`, `SUB-03` | Domínio e Persistência TypeORM | Rejeitar duplicidade com HTTP `409 Conflict`. |
| **RN02 (Preço Positivo)** | `SUB-01`, `SUB-04` | Validação na Entidade `Part` | Rejeitar valores $\le 0$ com HTTP `422`. |
| **RN03 (Estoque $\ge 0$)** | `SUB-01`, `SUB-04` | Validação de invariantes | Rejeitar quantidades negativas. |
| **RF05 (Endpoint REST)** | `SUB-05` | `PartsController` (`POST /parts`) | Retornar `201 Created` no sucesso. |
EOF

# 4. Gerar Artefato de DoR (Definition of Ready)
cat << 'EOF' > docs/planejamento/06-definition-of-ready.md
# Relatório de Aplicação da Definition of Ready (DoR)

Todas as Sub-Issues (`SUB-01` a `SUB-07`) do caso de uso `[UC08]` foram auditadas e atendem aos 7 critérios formais da DoR para projetos em modo solo:
1. Objetivo definido;
2. Escopo isolado por camadas (Clean Architecture);
3. Critérios de aceite testáveis;
4. Dependências mapeadas;
5. Contratos e DTOs especificados;
6. Responsável atribuído (`@peaga21`);
7. Auto-revisão crítica formalizada.
EOF

# 5. Gerar Artefato da Etapa 04 (TDD RED & Draft PR)
cat << 'EOF' > docs/etapa-04/04-01-verificacao-prontidao.md
# Artefato 04-01 — Verificação de Prontidão (TDD RED)

* **Sub-Issue Alvo:** `[SUB-01]` / `[SUB-06]` (Início do Ciclo TDD)
* **Status DoR:** Aprovado para execução local.
* **Estratégia:** Isolação do teste unitário de domínio para a entidade `Part` na fase RED, garantindo falha legítima antes de qualquer código de produção.
EOF

echo "==> Todos os arquivos e pastas foram gerados com sucesso de forma automatizada!"