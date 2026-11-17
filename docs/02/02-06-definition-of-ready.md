# Artefato 06 — Aplicação da Definition of Ready (DoR)

## 1. Critérios Formais da Definition of Ready (DoR)
A **Definition of Ready (DoR)** estabelece o limiar de qualidade e clareza que uma atividade técnica precisa atingir antes de ser autorizada a entrar em desenvolvimento ativo.

Os 7 critérios formais avaliados são:
* **DoR-01 (Objetivo Definido):** O resultado esperado e a finalidade técnica são inequívocos.
* **DoR-02 (Escopo Delimitado):** As fronteiras da atividade estão explícitas (o que deve e o que não deve ser feito).
* **DoR-03 (Critérios de Aceite Verificáveis):** Existem critérios mensuráveis que permitem testar e comprovar objetivamente a conclusão.
* **DoR-04 (Dependências Identificadas):** Todas as interdependências técnicas e a ordem de execução estão documentadas.
* **DoR-05 (Informações Disponíveis):** Contratos, modelos de dados, endpoints e schemas necessários estão acessíveis.
* **DoR-06 (Responsável Definido):** Há um desenvolvedor (*Assignee*) atribuído e ciente da atividade.
* **DoR-07 (Revisão Concluída):** A revisão técnica foi realizada, os apontamentos foram analisados e o parecer foi registrado.

---

## 2. Tabela de Avaliação Cumulativa da DoR por Sub-Issue

| Identificador / Issue | DoR-01 | DoR-02 | DoR-03 | DoR-04 | DoR-05 | DoR-06 | DoR-07 (Revisão) | Resultado Consolidado | Pendências para Prontidão | Status Recomendado no Board |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :---: |
| **SUB-01** (#6)<br>Domínio / `Part` | **Atende** | **Atende** | **Atende** | **Atende** | **Atende** | **Atende** (`@peaga21`) | **Atende** *(Pré-análise aprovada; aguardando confirmação no GitHub)* | **Apto à Prontidão** | Registrar o comentário formal de auto-revisão na Issue #6. | **`Ready`** |
| **SUB-02** (#7)<br>DTOs e Porta | **Atende** | **Atende** | **Atende** | **Atende** | **Atende** | **Atende** (`@peaga21`) | **Atende** *(Pré-análise aprovada; aguardando confirmação no GitHub)* | **Apto à Prontidão** | Registrar o comentário formal de auto-revisão na Issue #7. | **`Ready`** |
| **SUB-03** (#8)<br>Persistência TypeORM | **Atende** | **Atende** | **Atende** | **Atende** | **Pendente** (Depende da compilação de SUB-01/02) | **Atende** (`@peaga21`) | **Pendente de Confirmação** | **Retido em Backlog** | Aguarda a estabilização física do domínio e da porta de persistência antes de iniciar o desenvolvimento. | **`Backlog`** |
| **SUB-04** (#9)<br>Aplicação / Use Case | **Atende** | **Atende** | **Atende** | **Atende** | **Pendente** (Depende de SUB-01, SUB-02 e SUB-03) | **Atende** (`@peaga21`) | **Pendente de Confirmação** | **Retido em Backlog** | Aguarda os contratos e a infraestrutura de persistência estarem prontos. | **`Backlog`** |
| **SUB-05** (#10)<br>Controller HTTP | **Atende** | **Atende** | **Atende** | **Atende** | **Pendente** (Depende de SUB-02 e SUB-04) | **Atende** (`@peaga21`) | **Pendente de Confirmação** | **Retido em Backlog** | Aguarda a disponibilização do caso de uso de aplicação para injeção. | **`Backlog`** |
| **SUB-06** (#11)<br>Testes com Vitest | **Atende** | **Atende** | **Atende** | **Atende** | **Pendente** (Depende da esteira produtiva) | **Atende** (`@peaga21`) | **Pendente de Confirmação** | **Retido em Backlog** | Testes de integração E2E exigem os adaptadores reais e o controller em execução. | **`Backlog`** |
| **SUB-07** (#12)<br>Docs e Governança | **Atende** | **Atende** | **Atende** | **Atende** | **Pendente** (Depende de SUB-05 e SUB-06) | **Atende** (`@peaga21`) | **Pendente de Confirmação** | **Retido em Backlog** | Documentação pública depende do endpoint finalizado e dos testes validados. | **`Backlog`** |

---

## 3. Diretrizes de Promoção para o Estado `Ready`
1. **Regra de Cumulatividade:** Uma Sub-Issue **somente** transita de `Backlog` para `Ready` se cumprir cumulativamente os 7 critérios.
2. **Atividades Imediatamente Aptas:** `SUB-01` e `SUB-02` atendem a todos os critérios substantivos e iniciam na coluna **`Ready`** do GitHub Project, autorizando o desenvolvedor a iniciar a codificação quando desejar.
3. **Atividades Retidas em `Backlog`:** As atividades `SUB-03` a `SUB-07` mantêm-se em **`Backlog`**, transitando ordenadamente para `Ready` à medida que seus pré-requisitos forem concluídos na esteira de software.

