# Artefato 4 — Sub-Issues Completas

Este artefato reúne as 7 Sub-Issues técnicas planejadas para a execução do caso de uso **`[UC12] Cadastrar Peça`**. Cada bloco Markdown está pronto para publicação individual no GitHub, contendo todos os metadados necessários.

---

## Sub-Issue 01

```markdown
# [SUB-01] feat(domain): modelar entidade Part e invariantes de negócio

### 1. Objetivo da Atividade
Implementar a entidade pura de domínio `Part` no contexto de Estoque e Almoxarifado, encapsulando os dados essenciais de uma peça e garantindo a defesa intransigente de suas invariantes de negócio sem acoplamento a bibliotecas externas ou frameworks.

### 2. Descrição Detalhada
Desenvolver no diretório `src/modules/parts/domain/` a classe `Part` e suas estruturas de suporte:
* Implementar propriedades privadas com getters públicos: `id` (UUID), `code` (string), `name` (string), `price` (number), `stockQuantity` (number), `categoryId` (string/UUID) e `createdAt` (Date).
* Criar método estático de fábrica `Part.create(props: CreatePartProps): Part` para instanciar a entidade garantindo que não existam instâncias em estados inválidos.
* Implementar a lógica de validação de invariantes:
  * Lançar erro de domínio caso `price <= 0`.
  * Lançar erro de domínio caso `stockQuantity < 0`.
  * Lançar erro de domínio caso `code` ou `name` sejam vazios ou nulos.
* Implementar classes de exceção de domínio especializadas (ex.: `InvalidPartPriceException`, `InvalidStockQuantityException`).

### 3. Requisito / Regra de Negócio de Origem
* **Regras de Negócio:** RN02 (Preço estritamente positivo), RN03 (Saldo de estoque não negativo) e RN04 (Integridade cadastral).
* **Fluxo de Origem:** Passo 4 do Fluxo Principal do UC12; Fluxos Alternativos FA2 e FA3.

### 4. Escopo e Responsabilidades
* **Dentro do Escopo:** Código TypeScript puro da entidade `Part`, métodos de negócio, tipos/interfaces de criação e exceções de domínio.
* **Fora do Escopo:** Persistência relacional, decoradores de TypeORM, decoradores de `class-validator` e controllers HTTP.

### 5. Critérios de Aceite
- [ ] A classe `Part` não possui importações de `@nestjs/*`, `typeorm` ou bibliotecas externas de infraestrutura.
- [ ] O método `Part.create(...)` instancia com sucesso uma peça quando fornecidos dados válidos.
- [ ] O método `Part.create(...)` rejeita preço menor ou igual a zero disparando exceção específica de domínio.
- [ ] O método `Part.create(...)` rejeita quantidade de estoque negativa disparando exceção específica de domínio.
- [ ] O método `Part.create(...)` rejeita código ou nome nulo/vazio.
- [ ] A entidade gera um UUID v4 válido caso não seja fornecido um identificador prévio.

### 6. Dependências Técnicas
* **Depende de:** Nenhuma (*Ponto de partida da camada de domínio*).
* **Bloqueia:** SUB-03, SUB-04, SUB-06.

### 7. Labels Sugeridas
* `area:parts`, `layer:domain`, `type:feature`, `priority:high`

### 8. Responsável Designado
* **Pedro Henrique Dias** (`@peaga21`)

### 9. Estado Inicial no Board
* `Ready` (Atende aos critérios de Definition of Ready).

### 10. Evidências Esperadas
* Arquivo `src/modules/parts/domain/part.entity.ts` criado.
* Arquivo de testes unitários rápidos `part.entity.spec.ts` validando os caminhos felizes e de exceção das invariantes.
```

---

## Sub-Issue 02

```markdown
# [SUB-02] feat(contracts): definir DTOs de entrada/saída e porta IPartsRepository

### 1. Objetivo da Atividade
Definir os contratos de dados para transporte na camada de borda da aplicação (DTOs) e formalizar a interface da porta de persistência `IPartsRepository`, estabelecendo o desacoplamento formal entre aplicação e infraestrutura.

### 2. Descrição Detalhada
Desenvolver na camada de contratos (`src/modules/parts/contracts/` ou `dtos/`):
* Criar a classe `CreatePartDto` contendo:
  * `code`: string, obrigatório, com validação de formato via `@IsNotEmpty()`, `@IsString()`.
  * `name`: string, obrigatório, com `@IsNotEmpty()`, `@MinLength(2)`.
  * `price`: number, obrigatório, com `@IsNumber()` e `@IsPositive()`.
  * `stockQuantity`: number, obrigatório, com `@IsInt()` e `@Min(0)`.
  * `categoryId`: string/UUID, com `@IsUUID()` ou `@IsNotEmpty()`.
* Criar a interface/tipo `CreatePartOutput` representando o schema retornado ao cliente.
* Definir a interface `IPartsRepository` com as operações essenciais:
  * `findByCode(code: string): Promise<Part | null>`
  * `save(part: Part): Promise<void>`

### 3. Requisito / Regra de Negócio de Origem
* **Requisitos:** RF-01 (Entrada de dados), RF-02 (Validação sintática) e FA4 (Dados obrigatórios ausentes).
* **Arquitetura:** Inversão de Dependência (DIP - Clean Architecture).

### 4. Escopo e Responsabilidades
* **Dentro do Escopo:** Declaração de interfaces TypeScript, decoradores de anotação de validação (`class-validator`) e DTOs de resposta.
* **Fora do Escopo:** Regras de negócio da entidade de domínio e implementação concreta com TypeORM.

### 5. Critérios de Aceite
- [ ] O `CreatePartDto` valida com precisão os tipos de dados e limites utilizando `class-validator`.
- [ ] O DTO bloqueia requisições com campos vazios, tipos invertidos ou valores negativos nos testes sintáticos.
- [ ] A interface `IPartsRepository` declara expressamente as assinaturas `findByCode` e `save` utilizando a entidade `Part` pura.
- [ ] O `CreatePartOutput` desacopla a representação pública de atributos sensíveis ou detalhes de infraestrutura.

### 6. Dependências Técnicas
* **Depende de:** SUB-01 (para tipagem das operações na interface do repositório).
* **Bloqueia:** SUB-03, SUB-04, SUB-05.

### 7. Labels Sugeridas
* `area:parts`, `layer:contracts`, `type:feature`, `priority:high`

### 8. Responsável Designado
* **Pedro Henrique Dias** (`@peaga21`)

### 9. Estado Inicial no Board
* `Ready`

### 10. Evidências Esperadas
* Arquivos `create-part.dto.ts`, `create-part.output.ts` e `parts.repository.interface.ts` implementados e exportados no módulo.
```

---

## Sub-Issue 03

```markdown
# [SUB-03] feat(infra): implementar persistência TypeORM, PartOrmEntity e migration PostgreSQL

### 1. Objetivo da Atividade
Implementar a infraestrutura de persistência relacional para a tabela de peças no PostgreSQL utilizando TypeORM, garantindo o isolamento da camada de banco via adaptador de repositório e mapeador de dados.

### 2. Descrição Detalhada
Desenvolver em `src/modules/parts/infra/`:
* Criar migration no TypeORM para gerar a tabela `parts` no PostgreSQL com as colunas:
  * `id` (UUID, Primary Key);
  * `code` (VARCHAR, Not Null, Unique Index);
  * `name` (VARCHAR, Not Null);
  * `price` (DECIMAL(10,2), Not Null);
  * `stock_quantity` (INTEGER, Not Null);
  * `category_id` (UUID, Not Null);
  * `created_at` (TIMESTAMP WITH TIME ZONE, Default NOW()).
* Criar a entidade relacional `PartOrmEntity` anotada com os decoradores do TypeORM (`@Entity('parts')`, `@PrimaryColumn`, `@Column`).
* Criar a classe `PartMapper` para conversão:
  * `toDomain(ormEntity: PartOrmEntity): Part`
  * `toOrm(part: Part): PartOrmEntity`
* Implementar a classe `TypeOrmPartsRepository` implementando a interface `IPartsRepository` com injeção do `@InjectRepository(PartOrmEntity)`.

### 3. Requisito / Regra de Negócio de Origem
* **Requisitos:** RF-03 (Garantia de unicidade de SKU em nível de banco), RF-05 (Persistência relacional) e Passo 5 do Fluxo Principal.

### 4. Escopo e Responsabilidades
* **Dentro do Escopo:** Scripts de migration SQL, entidade ORM, mapper de conversão e implementação do repositório TypeORM.
* **Fora do Escopo:** Lógica de negócio da aplicação e exposição de rotas HTTP.

### 5. Critérios de Aceite
- [ ] A migration cria a tabela `parts` no PostgreSQL com a constraint `UNIQUE(code)`.
- [ ] A migration executa e reverte (`up` e `down`) de forma determinística sem erros no container PostgreSQL.
- [ ] O `PartMapper` traduz sem perdas de precisão todos os campos entre `Part` e `PartOrmEntity`.
- [ ] O método `findByCode` do repositório localiza corretamente registros persistidos ou retorna `null`.
- [ ] O método `save` persiste novos registros ou atualiza registros existentes sem corromper dados.

### 6. Dependências Técnicas
* **Depende de:** SUB-01 (Entidade de Domínio) e SUB-02 (Contrato `IPartsRepository`).
* **Bloqueia:** SUB-04, SUB-06.

### 7. Labels Sugeridas
* `area:parts`, `layer:infra`, `type:feature`, `priority:high`

### 8. Responsável Designado
* **Pedro Henrique Dias** (`@peaga21`)

### 9. Estado Inicial no Board
* `Backlog` (Aguardando conclusão de SUB-01 e SUB-02).

### 10. Evidências Esperadas
* Arquivo de migration versionado em `src/infra/typeorm/migrations/`.
* Arquivo `part.orm-entity.ts`, `part.mapper.ts` e `typeorm-parts.repository.ts` implementados.
* Tabela `parts` inspecionada no PostgreSQL do Docker.
```

---

## Sub-Issue 04

```markdown
# [SUB-04] feat(application): implementar serviço de aplicação CreatePartUseCase

### 1. Objetivo da Atividade
Implementar o serviço de aplicação responsável por orquestrar o fluxo do caso de uso `[UC12] Cadastrar Peça`, coordenando a verificação de duplicidade, chamada à fábrica de domínio e comando de persistência.

### 2. Descrição Detalhada
Desenvolver em `src/modules/parts/application/`:
* Criar a classe `CreatePartUseCase` (ou método `PartsService.createPart`):
  * Receber os parâmetros validados através do DTO/Command de criação.
  * Consultar a porta `IPartsRepository.findByCode(code)`.
  * Se já existir peça com o mesmo código, lançar exceção de conflito de aplicação (ex.: `PartAlreadyExistsException`).
  * Se não existir, instanciar a entidade via `Part.create(...)`.
  * Persistir a entidade invocando `IPartsRepository.save(part)`.
  * Retornar o DTO de saída `CreatePartOutput`.
* Configurar o módulo NestJS (`PartsModule`) para registrar o caso de uso e prover a injeção do repositório concreto via token.

### 3. Requisito / Regra de Negócio de Origem
* **Requisitos:** RF-01, RF-03, RN01 (Unicidade de SKU), FA1 (Conflito de código) e Passos 2 a 5 do Fluxo Principal.

### 4. Escopo e Responsabilidades
* **Dentro do Escopo:** Orquestração de negócio, verificação de duplicidade, tratamento de fluxo de controle e conversão de saída.
* **Fora do Escopo:** Acesso direto a SQL/TypeORM (deve usar a porta) e serialização de respostas HTTP.

### 5. Critérios de Aceite
- [ ] O caso de uso lança `PartAlreadyExistsException` quando o código informado já existe no repositório.
- [ ] O caso de uso invoca o domínio para validar invariantes e propaga exceções de domínio se houver inconsistências.
- [ ] O caso de uso comanda a persistência no repositório apenas se todas as verificações forem válidas.
- [ ] O caso de uso retorna um objeto compatível com `CreatePartOutput` contendo o ID gerado e os dados da peça.
- [ ] O caso de uso é 100% testável com repositórios em memória (*In-Memory Mock Repository*).

### 6. Dependências Técnicas
* **Depende de:** SUB-01 (Domínio), SUB-02 (Contratos) e SUB-03 (Infraestrutura/Injeção).
* **Bloqueia:** SUB-05, SUB-06.

### 7. Labels Sugeridas
* `area:parts`, `layer:application`, `type:feature`, `priority:high`

### 8. Responsável Designado
* **Pedro Henrique Dias** (`@peaga21`)

### 9. Estado Inicial no Board
* `Backlog`

### 10. Evidências Esperadas
* Arquivo `create-part.use-case.ts` (ou `parts.service.ts`) implementado.
* Teste unitário de aplicação `create-part.use-case.spec.ts` cobrindo cenários com mock da porta `IPartsRepository`.
```

---

## Sub-Issue 05

```markdown
# [SUB-05] feat(api): expor endpoint POST /parts no PartsController

### 1. Objetivo da Atividade
Expor a funcionalidade de cadastro de peças via protocolo HTTP REST através de controller no NestJS, configurando pipes de validação e tratamento estruturado de respostas e códigos de status HTTP.

### 2. Descrição Detalhada
Desenvolver em `src/modules/parts/interfaces/http/`:
* Criar a classe `PartsController` com decorador `@Controller('parts')`.
* Implementar a rota `@Post()` anotada com `@HttpCode(HttpStatus.CREATED)` recebendo `@Body() dto: CreatePartDto`.
* Habilitar o `ValidationPipe` para bloqueio de requisições malformadas na borda HTTP.
* Conectar o controller ao `CreatePartUseCase` injetado via construtor.
* Mapear exceções tratadas:
  * Exceção de conflito de SKU (`PartAlreadyExistsException`) traduzida para `409 Conflict`.
  * Exceções de violação de domínio (`InvalidPartPriceException`, `InvalidStockQuantityException`) traduzidas para `422 Unprocessable Entity`.
  * Erros sintáticos traduzidos para `400 Bad Request`.
  * Falhas genéricas não capturadas propagadas como `500 Internal Server Error`.

### 3. Requisito / Regra de Negócio de Origem
* **Requisitos:** RF-01, RF-06, FA1, FA2, FA3, FA4 e Passo 1 e 6 do Fluxo Principal.

### 4. Escopo e Responsabilidades
* **Dentro do Escopo:** Roteamento HTTP, extração de payload, injeção de pipes, serialização de resposta e mapeamento de status codes.
* **Fora do Escopo:** Regras de negócio internas da entidade ou queries SQL diretas.

### 5. Critérios de Aceite
- [ ] O endpoint `POST /parts` responde no caminho `/parts` com o status HTTP `201 Created` e payload JSON correspondente.
- [ ] Requisições com corpo ausente ou inválido recebem `400 Bad Request`.
- [ ] Requisições com código SKU conflitante recebem `409 Conflict` com mensagem descritiva.
- [ ] Requisições com violações de regras de preço/estoque recebem `422 Unprocessable Entity`.
- [ ] O controller delega estritamente a execução ao caso de uso de aplicação.

### 6. Dependências Técnicas
* **Depende de:** SUB-02 (DTOs) e SUB-04 (Serviço de Aplicação).
* **Bloqueia:** SUB-06, SUB-07.

### 7. Labels Sugeridas
* `area:parts`, `layer:api`, `type:feature`, `priority:high`

### 8. Responsável Designado
* **Pedro Henrique Dias** (`@peaga21`)

### 9. Estado Inicial no Board
* `Backlog`

### 10. Evidências Esperadas
* Arquivo `parts.controller.ts` implementado.
* Teste unitário de controller `parts.controller.spec.ts` validando os retornos e tratamento de erros.
```

---

## Sub-Issue 06

```markdown
# [SUB-06] test(e2e): implementar testes automatizados unitários e de integração com Vitest

### 1. Objetivo da Atividade
Garantir a confiabilidade, robustez e regressão do caso de uso `[UC12] Cadastrar Peça` através da construção de uma suíte abrangente de testes automatizados unitários e testes de integração de ponta a ponta (E2E) com PostgreSQL real.

### 2. Descrição Detalhada
Desenvolver suíte de testes automatizados com Vitest:
* **Testes Unitários:**
  * Testes da entidade `Part` cobrindo cálculo de invariantes, rejeição de preços negativos e inicialização de atributos.
  * Testes do caso de uso `CreatePartUseCase` cobrindo cenários com mock de `IPartsRepository` (fluxo feliz, duplicidade de SKU e falha no repositório).
  * Testes de validação dos DTOs via `class-validator`.
* **Testes E2E (Ponta a Ponta):**
  * Configurar ambiente de teste no Vitest disparando chamadas HTTP reais (`supertest` / `fetch`) contra a aplicação NestJS em execução.
  * Conectar à base de dados PostgreSQL isolada do Docker.
  * Testar o fluxo completo:
    1. Requisição válida retornando `201 Created` e conferência direta no banco via SELECT.
    2. Segunda requisição com o mesmo SKU retornando `409 Conflict`.
    3. Requisição com preço negativo retornando `422 Unprocessable Entity`.
    4. Requisição com estoque negativo retornando `422 Unprocessable Entity`.
    5. Requisição com payload sem campos obrigatórios retornando `400 Bad Request`.

### 3. Requisito / Regra de Negócio de Origem
* **Requisitos:** Todos os requisitos funcionais (RF-01 a RF-06), regras de negócio (RN01 a RN04) e fluxos alternativos (FA1 a FA4).

### 4. Escopo e Responsabilidades
* **Dentro do Escopo:** Arquivos de especificação de teste (`.spec.ts` e `.e2e-spec.ts`), fixtures de teste, helpers de limpeza do banco entre execuções.
* **Fora do Escopo:** Código produtivo das camadas (os testes apenas verificam os componentes implementados).

### 5. Critérios de Aceite
- [ ] Todos os testes unitários da entidade e do serviço executam com sucesso no Vitest.
- [ ] Os testes E2E executam contra o PostgreSQL real comprovando a integridade da persistência e constraints.
- [ ] Todos os 5 cenários E2E (201, 400, 409, 422 preço, 422 estoque) são validados e passam sem falhas.
- [ ] O banco de dados de teste é devidamente limpo entre cada execução E2E evitando efeitos colaterais.

### 6. Dependências Técnicas
* **Depende de:** SUB-01, SUB-02, SUB-03, SUB-04 e SUB-05.
* **Bloqueia:** SUB-07.

### 7. Labels Sugeridas
* `area:parts`, `type:test`, `priority:high`

### 8. Responsável Designado
* **Pedro Henrique Dias** (`@peaga21`)

### 9. Estado Inicial no Board
* `Backlog`

### 10. Evidências Esperadas
* Arquivo `test/parts-create.e2e-spec.ts` implementado.
* Relatório de saída do Vitest com 100% dos testes aprovados e cobertura dos caminhos do UC12.
```

---

## Sub-Issue 07

```markdown
# [SUB-07] docs(governance): atualizar OpenAPI/Swagger, README e governança do repositório

### 1. Objetivo da Atividade
Formalizar a entrega técnica do caso de uso `[UC12] Cadastrar Peça`, disponibilizando a documentação interativa da API via OpenAPI/Swagger, atualizando o `README.md` do repositório e registrando as evidências no histórico de governança de software.

### 2. Descrição Detalhada
Desenvolver e atualizar os artefatos documentais do projeto:
* Decorar o `PartsController` e o `CreatePartDto` com anotações OpenAPI (`@ApiTags('Parts')`, `@ApiOperation()`, `@ApiResponse()`, `@ApiProperty()`).
* Inspecionar e validar a interface interativa Swagger na rota `/api/docs`.
* Atualizar o `README.md` principal do repositório incluindo:
  * Exemplo de payload `cURL` para disparo de cadastro de peça;
  * Comandos de execução de migrations (`pnpm typeorm migration:run`);
  * Instruções de execução dos testes com Vitest (`pnpm test:e2e`).
* Atualizar o relatório de governança do repositório formalizando a conclusão do slice e a rastreabilidade do UC12.

### 3. Requisito / Regra de Negócio de Origem
* **Diretrizes:** Governança de Software, Gestão de Repositório e Práticas de Documentação Técnica Corporativa.

### 4. Escopo e Responsabilidades
* **Dentro do Escopo:** Documentação OpenAPI/Swagger, README, guias de execução e relatório de governança.
* **Fora do Escopo:** Alterações nas regras funcionais de código.

### 5. Critérios de Aceite
- [ ] A rota `/api/docs` renderiza o schema do `POST /parts` com exemplos de requisição e respostas (`201`, `400`, `409`, `422`).
- [ ] O arquivo `README.md` reflete fielmente as novas capacidades do sistema e instruções de teste.
- [ ] O histórico de governança registra a branch, commits atômicos e o fechamento do épico com suas sub-issues.

### 6. Dependências Técnicas
* **Depende de:** SUB-05 (Interface HTTP) e SUB-06 (Validação dos Testes).
* **Bloqueia:** Conclusão formal do Épico `[UC12] Cadastrar Peça`.

### 7. Labels Sugeridas
* `area:parts`, `type:documentation`, `priority:medium`

### 8. Responsável Designado
* **Pedro Henrique Dias** (`@peaga21`)

### 9. Estado Inicial no Board
* `Backlog`

### 10. Evidências Esperadas
* Documentação OpenAPI acessível e compilada.
* Arquivo `README.md` e histórico de governança atualizados no repositório.
```

