# Artefato 5 — Matriz de Rastreabilidade

| Requisito / Regra | Sub-Issue Associada | Atividade Técnica Planejada | Critério de Aceite Principal |
| :--- | :--- | :--- | :--- |
| **RN01 (Código SKU Único)** | `SUB-01`, `SUB-03` | Domínio e Persistência TypeORM | Rejeitar duplicidade com HTTP `409 Conflict`. |
| **RN02 (Preço Positivo)** | `SUB-01`, `SUB-04` | Validação na Entidade `Part` | Rejeitar valores $\le 0$ com HTTP `422`. |
| **RN03 (Estoque $\ge 0$)** | `SUB-01`, `SUB-04` | Validação de invariantes | Rejeitar quantidades negativas. |
| **RF05 (Endpoint REST)** | `SUB-05` | `PartsController` (`POST /parts`) | Retornar `201 Created` no sucesso. |
