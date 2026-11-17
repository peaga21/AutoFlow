# Artefato 07-02 — Planejamento da Fronteira HTTP e Estratégia de Branch

## 1. Contexto das Issues e Topologia Git

* **Epic Principal:** [#5 — [UC12] Cadastrar Peça](https://github.com/peaga21/AutoFlow/issues/5)
* **Sub-Issue Alvo:** [#10 — [SUB-05] feat(api): expor endpoint POST /parts no PartsController](https://github.com/peaga21/AutoFlow/issues/10)
* **Branch-Base de Partida:** `feat/sub-01-domain-part`
* **Branch de Trabalho Criada:** `feat/sub-05-http-endpoint`
* **Branch-Base de Destino do PR:** `feat/sub-01-domain-part` (ou `main` após encerramento coordenado da cadeia)

---

## 2. Estratégia de Branches Dependentes (Refinamento 2)

Conforme as diretrizes de governança do Material 06 e 07, o serviço de aplicação e o domínio da peça ainda não foram integrados à branch `main` (que permanece protegida e intocada). Portanto, a criação da nova branch deve ramificar a partir da branch onde os contratos e o código da entidade já existem.

```text
main (base estável do projeto)
  |
  +-- feat/sub-01-domain-part (Entidade Part, testes RED/GREEN, Material 05 e 06)
        |
        +-- feat/sub-05-http-endpoint (Fronteira HTTP, DTOs, Controller, Material 07)
```

### Vantagens da Estratégia Adotada:
1. **Acesso Imediato aos Contratos:** A entidade `Part` e seus testes unitários estão disponíveis na branch sem necessidade de cherry-pick ou duplicação.
2. **Proteção da `main` (Green Main):** Nenhuma alteração incompleta é mesclada prematuramente na linha principal de produção.
3. **Isolamento de Commits:** Commits da camada HTTP permanecem claramente identificáveis em relação aos commits da camada de domínio.

---

## 3. Matriz de Planejamento Técnico

| Componente | Responsabilidade | Arquivo (Caminho Real) | Contrato Associado | Sub-Issue | Alteração Realizada | Dependências | Critério de Aceite |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| **Controller HTTP** | Receber requisição HTTP e delegar | `src/modules/parts/controllers/parts.controller.ts` | `POST /parts` | `SUB-05` | Criar `@Controller('parts')` com `@Post()` | `PartsService` | `201 Created` no sucesso |
| **DTO de Entrada** | Validar estrutura do payload JSON | `src/modules/parts/dtos/create-part.dto.ts` | Payload do UC12 | `SUB-02` | Decorar campos com `class-validator` | `class-validator` | `400 Bad Request` se inválido |
| **DTO de Saída** | Contrato de dados da resposta | `src/modules/parts/dtos/create-part-response.dto.ts` | Schema de saída | `SUB-02` | Criar interface `CreatePartResponseDto` | Nenhuma | Retornar campos da peça |
| **Serviço de Aplicação** | Orquestrar regras e persistência | `src/modules/parts/services/parts.service.ts` | `createPart(...)` | `SUB-04` | Implementar verificação de SKU e criação | `PARTS_REPOSITORY` | Rejeitar SKU duplicado |
| **Porta de Persistência** | Contrato abstrato do repositório | `src/modules/parts/repositories/parts.repository.interface.ts` | `PartsRepository` | `SUB-02` | Declarar interface e `PARTS_REPOSITORY` token | Nenhuma | DIP respeitado |
| **Repositório em Memória** | Prover persistência para testes e dev | `src/modules/parts/repositories/in-memory-parts.repository.ts` | `PartsRepository` | `SUB-04` | Implementar `InMemoryPartsRepository` | Nenhuma | Inicialização sem erro |
| **Módulo NestJS** | Compor controllers e providers | `src/modules/parts/parts.module.ts` | Injeção de dependência | `SUB-05` | Registrar controller, service e provider | NestJS DI | Injeção resolvida |
| **Testes HTTP** | Validar fronteira HTTP e pipes | `src/modules/parts/controllers/parts.controller.spec.ts` | Vitest + Supertest | `SUB-06` | Testar cenários 201 e 400 | Supertest | 100% verde |

---

## 4. Análise de Riscos e Decisões de Governança

1. **Risco de falha de conexão com PostgreSQL em ambiente local sem Docker:**
   * *Mitigação:* `InMemoryPartsRepository` provê persistência em memória durante o desenvolvimento da camada HTTP; em `AppModule`, a inicialização do TypeORM é condicional à variável `DB_HOST`.
2. **Risco de quebra de metadados de validação no Vitest (esbuild):**
   * *Mitigação:* O `ValidationPipe` foi configurado explicitamente com `expectedType: CreatePartDto` e `@Inject(PartsService)` foi anotado no construtor do controller para garantir compatibilidade plena com o bundler.
3. **Estratégia de Pull Request:**
   * O Pull Request da Sub-Issue `#10` será aberto apontando como branch-base a branch `feat/sub-01-domain-part`, registrando formalmente a dependência entre as duas frentes.
