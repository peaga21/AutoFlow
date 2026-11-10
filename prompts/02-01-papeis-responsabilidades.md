# Artefato 01 — Matriz de Papéis e Responsabilidades

## 1. Contexto Organizacional da Equipe
* **Sistema:** AutoFlow — Plataforma Corporativa de Gestão Operacional e Atendimento para Oficinas Mecânicas
* **Caso de Uso:** `[UC12] Cadastrar Peça`
* **Natureza da Equipe:** **Projeto Acadêmico Individual**
* **Autor / Desenvolvedor:** Pedro Henrique Dias (`@peaga21`)
* **Papel de Revisão Externa / Avaliação:** Avaliador Acadêmico / Equipe Docente (`@autoflow-reviewers`)

> **Nota Metodológica sobre Projetos Individuais:**
> Em projetos acadêmicos individuais, a segregação física de papéis entre diferentes desenvolvedores é naturalmente condensada em uma única pessoa. Para atender às boas práticas da Engenharia de Software e governança corporativa, o desenvolvedor acumula papéis funcionais distintos em momentos separados do ciclo de vida, enquanto a **revisão independente** é formalmente endereçada através de auto-revisão estruturada com critérios objetivos e validação pelo avaliador/docente da disciplina.

---

## 2. Definição das Funções Organizacionais

| Função Organizacional | Propósito Principal no Projeto AutoFlow | Atividades Típicas |
| :--- | :--- | :--- |
| **Coordenador do Projeto** | Gestão de escopo, prazos, comunicação do fluxo de entrega e desbloqueio de dependências. | • Acompanhamento das colunas do GitHub Project.<br>• Definição de prioridades e sequência de execução.<br>• Planejamento dos marcos de entrega. |
| **Responsável Técnico (Tech Lead / Arquiteto)** | Garantia da integridade arquitetural, padrões de código e decisões de design. | • Definição do Clean Architecture e isolamento do domínio.<br>• Escolha de tecnologias e bibliotecas (NestJS, TypeORM, PostgreSQL, Vitest).<br>• Resolução de dúvidas técnicas e modelagem relacional. |
| **Desenvolvedor Core** | Implementação técnica das Sub-Issues planejadas. | • Escrita de entidades, DTOs, casos de uso, migrations e endpoints.<br>• Implementação de testes automatizados unitários e de integração E2E.<br>• Abertura de Pull Requests atômicos rastreáveis. |
| **Revisor de Issues / Auditor de Qualidade** | Validação da conformidade da especificação com a Definition of Ready (DoR). | • Conferência minuciosa dos critérios de aceite antes do código.<br>• Identificação de ambiguidades e lacunas técnicas.<br>• Registro formal de comentários de revisão e aprovação. |

---

## 3. Matriz de Atribuição Individual

### Integrante: Pedro Henrique Dias (`@peaga21`)

* **Função Principal:** Desenvolvedor Core & Responsável Técnico (Tech Lead).
* **Funções Secundárias:** Coordenador do Projeto & Auditor Interno de Requisitos (auto-revisão técnica).
* **Conhecimentos e Competências Técnicas:**
  * Domínio da stack Node.js/TypeScript com NestJS;
  * Modelagem de banco de dados relacional (PostgreSQL 16) com ORM TypeORM e Migrations;
  * Práticas de Clean Architecture, Domain-Driven Design (DDD) e testes automatizados com Vitest;
  * Controle de versão distribuído (Git), GitHub CLI (`gh`), GitHub Issues e Projects.
* **Responsabilidades Claras:**
  1. Executar a modelagem da entidade pura `Part` e garantir a inviolabilidade de suas invariantes (`SUB-01`).
  2. Estruturar os contratos de fronteira e a interface da porta de persistência `IPartsRepository` (`SUB-02`).
  3. Criar e versionar migrations e o repositório concreto TypeORM (`SUB-03`).
  4. Implementar o serviço de aplicação `CreatePartUseCase` com tratamento de concorrência e exceções (`SUB-04`).
  5. Expor o endpoint RESTful `POST /parts` no NestJS com validações sintáticas (`SUB-05`).
  6. Desenvolver a suíte de testes unitários e de integração E2E com container Docker (`SUB-06`).
  7. Atualizar a documentação Swagger e histórico de governança (`SUB-07`).
  8. Manter a árvore de trabalho e o Project Board rigorosamente atualizados.
* **Justificativa Técnica da Alocação:**
  Por ser o autor exclusivo do projeto `peaga21/AutoFlow`, Pedro centraliza o conhecimento técnico de ponta a ponta, garantindo consistência entre a camada de negócio e a infraestrutura física.

---

## 4. Estrutura de Revisão Independente e Segregação de Funções

Para assegurar que o projeto individual mantenha o rigor metodológico de revisão cruzada exigido na disciplina:

1. **Auto-Revisão Técnica Estruturada:** Antes de transitar qualquer Sub-Issue para `Ready`, o desenvolvedor assume temporariamente o "chapéu" de auditor de qualidade, aplicando um checklist formal de critérios de aceite e requisitos.
2. **Revisão Externa / Avaliação Docente (`@autoflow-reviewers`):** Os Pull Requests e as especificações de Issues ficam submetidos à apreciação e aprovação do professor / equipe avaliadora da disciplina antes da conclusão definitiva (*Done*).
3. **Registro de Evidências:** Todas as decisões técnicas e apontamentos de melhoria são formalizados na aba de comentários da respectiva Issue no GitHub.

---

## 5. Diferenciação entre Papel Funcional, Permissão Técnica e Atribuição

| Dimensão | O que Representa | Como se Aplica no Projeto AutoFlow |
| :--- | :--- | :--- |
| **Papel Funcional** | Responsabilidade metodológica perante o processo de software (ex.: Tech Lead, Desenvolvedor). | Pedro atua como Tech Lead e Desenvolvedor; a disciplina atua como Avaliador. |
| **Permissão Técnica no GitHub** | Nível de privilégio concedido na plataforma (`Admin`, `Write`, `Triage`, `Read`). | Definida no Artefato 02 com base no Princípio do Menor Privilégio. |
| **Atribuição (*Assignee*)** | Designação operacional de quem executa uma unidade específica de trabalho no GitHub. | `peaga21` é o responsável direto atribuído em todas as Sub-Issues (#6 a #12). |

