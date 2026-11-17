# Artefato 02 — Matriz de Permissões do GitHub

## 1. Princípios de Governança de Acesso
A gestão de acessos do repositório `peaga21/AutoFlow` fundamenta-se no **Princípio do Menor Privilégio (*Least Privilege*)**, assegurando que cada entidade ou colaborador possua estritamente as autorizações necessárias para desempenhar suas atribuições operacionais, mitigando riscos de perda acidental de dados, configurações indevidas em branches de produção e vazamento de segredos.

### Os 5 Níveis Formais de Permissão do GitHub
1. **`Read`:** Permite clonar o código, visualizar commits, branches, issues, discussões e pull requests. Não permite criar ou editar issues nem enviar código.
2. **`Triage`:** Permite aplicar labels, atribuir issues/PRs, fechar e reabrir tickets, além de moderar discussões. Não permite escrita direta em código nem push de branches.
3. **`Write`:** Permite clonar, criar branches, realizar push e abrir/atualizar Pull Requests. Permite gerenciamento completo de issues e branches de desenvolvimento.
4. **`Maintain`:** Permite gerenciar regras de proteção de branch (*Branch Protection Rules*), hooks, automações e releases, sem autorização para transferir ou deletar o repositório.
5. **`Admin`:** Acesso total irrestrito, incluindo concessão de permissões a outros membros, integração de chaves de deploy, gestão de segredos e exclusão do repositório.

---

## 2. Matriz de Permissões Recomendada para o Projeto AutoFlow

| Integrante / Identificador | Papel Funcional | Operações Práticas Necessárias | Permissão de Repositório Recomendada | Permissão no GitHub Project (Board) | Justificativa Técnica e de Segurança |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Pedro Henrique Dias** (`@peaga21`) | Autor, Tech Lead e Desenvolvedor Core | • Criar/editar branches e submeter commits.<br>• Abrir Pull Requests e fechar issues concluídas.<br>• Configurar migrations, Docker e pipelines.<br>• Gerenciar configurações do repositório e chaves. | **`Admin`** *(Proprietário da conta pessoal)* | **`Admin`** | Por se tratar de um repositório pessoal (`peaga21/AutoFlow`), o criador detém a titularidade administrativa. No fluxo diário de desenvolvimento, opera como `Write` (usando branches e PRs para manter a rastreabilidade). |
| **Avaliadores Acadêmicos / Revisores** (`@autoflow-reviewers` / Docente) | Auditor de Requisitos e Revisor de Código | • Inspecionar o planejamento de Issues e Sub-Issues.<br>• Adicionar comentários de revisão técnica e validação.<br>• Aprovar ou solicitar alterações em Pull Requests.<br>• Mover cards no board Kanban. | **`Triage`** (ou **`Write`** em repositório acadêmico compartilhado) | **`Write`** *(Collaborator)* | Concede a faculdade de interagir ativamente nas Issues, registrar revisões formais e gerenciar o status das atividades sem risco de sobrescrever diretamente o código-fonte da branch principal. |
| **Observadores / Comunidade Acadêmica** (`@everyone`) | Consulta e Avaliação Externa | • Clonar o repositório para conferência.<br>• Visualizar o histórico de governança e documentação. | **`Read`** | **`Read`** | Preserva a integridade do ativo de software, garantindo transparência pública sem autorização para alteração de metadados. |

---

## 3. Segregação entre Repositório e GitHub Project (v2)

É fundamental diferenciar o nível de acesso ao **Repositório Git** do nível de acesso ao **GitHub Project**:

* **Permissões de Repositório:** Regulam o acesso aos artefatos de código, commits, tags, branches e pipelines de CI/CD.
* **Permissões de Projeto (Project v2):** Regulam a capacidade de criar visualizações (Kanban/Tabela), reordenar colunas, alterar campos personalizados (como o campo `Status`) e adicionar/remover cards.
  * O desenvolvedor `@peaga21` mantém privilégio `Admin` no projeto [Planejamento - UC12 Cadastrar Peça](https://github.com/users/peaga21/projects/2).
  * O revisor necessita de acesso de nível `Write` no Project para conseguir transitar cards entre `Backlog` e `Ready` durante as cerimônias de refinamento.

---

## 4. Salvaguardas Adicionais Recomendadas (Branch Protection Rules)
Mesmo em projetos individuais, a adoção de boas práticas de engenharia recomenda configurar na branch `main`:
1. **Bloqueio de Push Direto:** Todo código deve ser integrado via Pull Request, forçando a criação de branches temáticas (ex.: `feat/sub-01-domain-part`).
2. **Checagem de CI Obrigatória:** O merge só deve ser permitido caso a suíte de testes automatizados (`pnpm test:e2e`) seja executada com 100% de sucesso.
3. **Histórico Linear:** Preferir *Squash and Merge* ou *Rebase* para manter o log de commits limpo e atômico.

