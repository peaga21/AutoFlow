# Artefato 08-02 — Comparação Técnica dos Três Níveis de Teste

## 1. Contexto e Justificativa da Comparação

Na evolução do caso de uso `[UC12] Cadastrar Peça`, diferentes níveis de teste automatizado foram construídos para responder a perguntas arquiteturais específicas. Esta análise formal compara os objetivos, componentes e limites de cada nível.

---

## 2. Matriz Comparativa Obrigatória

| Critério | Nível A — Unitário do Service (Materiais 04 a 06) | Nível B — HTTP com Service Simulado (Material 07) | Nível C — Integrado do Backend (Material 08) |
| :--- | :--- | :--- | :--- |
| **Arquivo(s) no Projeto** | `part.entity.spec.ts`<br>`parts.service.spec.ts` | `parts.controller.spec.ts` | `parts.integration.spec.ts` |
| **Componentes Reais** | `Part` (Domínio)<br>`PartsService` (Aplicação) | `PartsController`<br>`CreatePartDto`<br>`ValidationPipe` | `PartsModule`<br>`PartsController`<br>`PartsService`<br>`InMemoryPartsRepository`<br>`CreatePartDto`<br>`ValidationPipe`<br>`Part` |
| **Componentes Simulados (Mocks)** | Dublê de `PartsRepository` (`vi.fn()`) | Dublê de `PartsService` (`vi.fn()`) | **Nenhum mock no fluxo operacional** |
| **Dependências Exercitadas** | Lógica pura de domínio e serviço em memória | Pipeline HTTP do NestJS, serialização, decorators | Injeção de dependência completa pelo container IoC, roteamento HTTP, validação, aplicação e repositório em memória |
| **Comportamento Verificado** | Criação da entidade, validação de unicidade de SKU | Mapeamento de rota, status `201`/`400`/`409`, filtro de payload | Fluxo ponta a ponta desde a requisição HTTP até o armazenamento no repositório em memória |
| **Evidência Produzida** | Retorno de métodos e exceções disparadas | Código de status HTTP e corpo da resposta JSON | Resposta HTTP + verificação direta do estado interno do repositório em memória |
| **Limitações** | Não comprova se o endpoint HTTP ou os pipes funcionam | Não comprova se o Service real funciona nem se os providers de IoC resolvem | Não comprova persistência em banco relacional (PostgreSQL), transações ACID ou restrições SQL reais |
| **Requisitos / CAs Não Cobertos** | Não cobre RF-06 (Interface HTTP) | Não cobre persistência nem orquestração real de serviço | Não cobre migrações SQL, índices únicos no banco ou durabilidade pós-reinicialização |

---

## 3. Conclusão Pedagógica Central

> 💡 **Princípio de Confiabilidade da Pirâmide de Testes:**
> O teste HTTP com Service simulado (Nível B), construído no Material 07, valida apenas o contrato da borda Web. Ele **não substitui** o teste integrado (Nível C), pois um erro na resolução de dependências no `PartsModule` ou uma falha de conversão entre `PartsService` e `InMemoryPartsRepository` passaria despercebido caso testássemos apenas com mocks.
> Somente o teste do Nível C garante que todos os blocos construídos conversam harmonicamente em tempo de execução.
