# Artefato 1 — Análise Técnica do Caso de Uso

## 1. Identificação e Título do Caso de Uso
* **Identificador:** `UC12`
* **Título:** Cadastrar Peça
* **Sistema:** AutoFlow — Plataforma Corporativa de Gestão Operacional e Atendimento para Oficinas Mecânicas
* **Módulo / Contexto Delimitado (Bounded Context):** Estoque e Almoxarifado (*Inventory / Parts*)
* **Documentos de Referência:** `CasoDeUso.md`, `blueprint_autoflow.md`, `Autoflow_Dominio.md` e `Autoflow_Dominio2.md`

---

## 2. Objetivo e Escopo
* **Objetivo:** Permitir o registro estruturado de uma nova peça automotiva no inventário do sistema AutoFlow, associando identificador exclusivo, código SKU, denominação comercial, preço de venda e saldo físico inicial de estoque.
* **Escopo Funcional (Dentro do Escopo):**
  * Recepção e validação sintática dos dados de entrada via requisição HTTP (`POST /parts`).
  * Validação semântica e verificação de duplicidade do código alfanumérico SKU (`PartCode`).
  * Aplicação das invariantes de negócio na entidade de domínio (`Part`): obrigatoriedade de campos, integridade do código, preço estritamente positivo e quantidade de estoque não negativa.
  * Persistência do registro relacional na tabela `parts` via TypeORM com PostgreSQL.
  * Retorno do recurso criado com identificador único UUID, carimbo temporal (`createdAt`) e status HTTP `201 Created`.
* **Fora do Escopo:**
  * Gestão de fornecedores e cotação de compra externa.
  * Upload de imagens e fotografias técnicas da peça.
  * Controle de movimentações históricas em lote (Kardex / auditoria de transferências físicas).
  * Montagem e vinculação direta a Ordens de Serviço (cobertas em casos de uso subsequentes, como `UC01` e fluxos de execução).

---

## 3. Atores Envolvidos e Papéis
* **Ator Principal:** **Gestor de Estoque / Almoxarife**
  * *Papel:* Responsável pelo gerenciamento do catálogo de autopeças, cadastro de novos componentes no almoxarifado, alimentação dos dados de preço e quantidade inicial em prateleira.
* **Atores Secundários / Consumidores:**
  * **Sistema de Vendas / Atendimento e Orçamentação:** Consumidor indireto que necessita da peça cadastrada para viabilizar orçamentos e propostas comerciais.
  * **Mecânico / Técnico do Box:** Consumidor do catálogo no momento de requisitar componentes no diagnóstico técnico.

---

## 4. Pré-Condições e Pós-Condições

### Pré-Condições
1. O Gestor de Estoque deve possuir credenciais ativas e perfil com permissão de escrita no módulo de estoque/catálogo.
2. A categoria à qual a peça pertence deve existir previamente no sistema (ou identificador válido associado).
3. A infraestrutura de persistência (PostgreSQL via Docker Compose) e a API NestJS devem estar operacionais e conectadas.

### Pós-Condições
1. A nova peça é persistida de forma definitiva no banco de dados relacional com UUID gerado.
2. O código SKU informado torna-se exclusivo e reservado, impedindo cadastros duplicados posteriores.
3. A peça fica imediatamente disponível para consulta e associação em ordens de serviço e orçamentos.
4. O cliente da API recebe a representação completa do recurso criado com código `201 Created`.

---

## 5. Síntese dos Fluxos de Execução

### Fluxo Principal (Caminho Feliz)
1. O Gestor de Estoque envia uma requisição `POST /parts` contendo: `code` (SKU), `name` (nome da peça), `price` (preço unitário), `stockQuantity` (quantidade inicial) e `categoryId` (identificador da categoria).
2. A camada de transporte intercepta a requisição e valida a conformidade sintática e a tipagem dos atributos via DTO.
3. O serviço de aplicação (`PartsService` / `CreatePartUseCase`) recebe o comando de criação.
4. O serviço consulta o repositório (`IPartsRepository.findByCode`) para certificar-se de que não existe peça com o mesmo SKU.
5. Confirmada a inexistência de duplicidade, o serviço invoca o método de fábrica de domínio `Part.create(...)`.
6. A entidade `Part` valida suas invariantes internas (preço positivo $> 0$, quantidade de estoque $\ge 0$ e campos obrigatórios preenchidos).
7. O repositório converte a entidade de domínio em modelo de persistência (`PartOrmEntity`) e grava no banco PostgreSQL.
8. O serviço de aplicação formata o DTO de saída (`CreatePartOutput`) e a camada HTTP retorna o status `201 Created` com o corpo da peça cadastrada.

### Fluxos Alternativos e de Exceção
* **FA1 — Código SKU já existente (Conflito):**
  * *Gatilho:* O repositório localiza uma peça ativa com o mesmo `code` informado.
  * *Ação do Sistema:* A execução é interrompida antes da instanciação de domínio; a aplicação emite uma exceção de conflito de negócio.
  * *Resposta HTTP:* Status `409 Conflict` com mensagem descritiva (ex.: *"Peça com o código 'X' já cadastrada no sistema"*).
* **FA2 — Preço inválido (Violação de Invariante de Domínio):**
  * *Gatilho:* O valor de `price` informado é menor ou igual a zero ($ \text{Price} \le 0 $).
  * *Ação do Sistema:* O domínio rejeita a operação com exceção de domínio (*DomainException*).
  * *Resposta HTTP:* Tradução para status `422 Unprocessable Entity` com detalhamento da regra violada.
* **FA3 — Quantidade de estoque negativa (Violação de Invariante de Domínio):**
  * *Gatilho:* O valor de `stockQuantity` informado é menor que zero ($ \text{StockQuantity} < 0 $).
  * *Ação do Sistema:* O domínio impede a instanciação da entidade.
  * *Resposta HTTP:* Tradução para status `422 Unprocessable Entity`.
* **FA4 — Dados obrigatórios ausentes ou tipos inválidos (Erro de Validação de Entrada):**
  * *Gatilho:* Requisição sem preenchimento de `code`, `name`, ou com formatos incompatíveis (ex.: texto em campo numérico).
  * *Ação do Sistema:* O *ValidationPipe* do NestJS bloqueia a requisição na fronteira HTTP antes de acionar a camada de aplicação.
  * *Resposta HTTP:* Status `400 Bad Request` contendo a lista das violações detectadas pelo `class-validator`.
* **FA5 — Falha de comunicação ou indisponibilidade da base de dados:**
  * *Gatilho:* Falha na conexão com o PostgreSQL / falha no pool de conexões do TypeORM.
  * *Ação do Sistema:* O adaptador de persistência propaga a falha que é interceptada pelo filtro global de exceções.
  * *Resposta HTTP:* Status `500 Internal Server Error`.

---

## 6. Regras de Negócio Identificadas

| Identificador | Regra de Negócio | Classificação | Camada Guardiã |
| :--- | :--- | :--- | :--- |
| **RN01** | Cada peça deve possuir um código SKU único em todo o catálogo do sistema. | Regra de Unicidade / Aplicação | `PartsService` + `IPartsRepository` (e `UNIQUE constraint` no BD) |
| **RN02** | O preço unitário da peça deve ser estritamente positivo ($ \text{Price} > 0 $). Não é permitido cadastro com valor zero ou negativo. | Invariante de Domínio | Entidade `Part` |
| **RN03** | O saldo inicial de estoque não pode ser negativo ($ \text{StockQuantity} \ge 0 $). | Invariante de Domínio | Entidade `Part` |
| **RN04** | A peça deve possuir um nome obrigatório com comprimento mínimo e estar vinculada a uma categoria válida. | Integridade de Domínio | Entidade `Part` + DTO |

---

## 7. Validações de Entrada e Processamento

### Validações Sintáticas (Fronteira HTTP / DTO com `class-validator`)
* `code`: String, não vazia, sem caracteres de controle, trim de espaços.
* `name`: String, não vazia, tamanho mínimo de 2 caracteres e máximo de 150 caracteres.
* `price`: Number, positivo, precisão decimal padrão monetário.
* `stockQuantity`: Integer, maior ou igual a zero.
* `categoryId`: String / UUID válido.

### Validações Semânticas (Núcleo da Aplicação e Domínio)
* Inexistência prévia de registro com a mesma chave de negócio (`findByCode`).
* Enforçamento de invariantes pelo construtor/método estático de fábrica `Part.create(...)`.

---

## 8. Componentes e Camadas Arquiteturais Envolvidas

```
┌────────────────────────────────────────────────────────┐
│               Interface HTTP (NestJS)                  │
│       PartsController (`POST /parts`)                  │
└───────────────────────────┬────────────────────────────┘
                            │ (CreatePartDto / Command)
┌───────────────────────────▼────────────────────────────┐
│              Aplicação (Use Case / Service)            │
│       CreatePartUseCase / PartsService.createPart()    │
└─────────────┬────────────────────────────┬─────────────┘
              │ (Valida Invariantes)       │ (Porta de Saída)
┌─────────────▼──────────────┐ ┌───────────▼─────────────┐
│      Domínio (Puro)        │ │  Contrato de Repositório │
│   Entidade `Part`          │ │    `IPartsRepository`    │
└────────────────────────────┘ └───────────┬─────────────┘
                                           │ (Implementação)
                               ┌───────────▼─────────────┐
                               │ Persistência (Infra)    │
                               │ TypeOrmPartsRepository  │
                               │ PartOrmEntity + Postgres│
                               └─────────────────────────┘
```

1. **Camada de Domínio (`src/modules/parts/domain`):**
   * Classe `Part`: Contém atributos privados, getters, validações de invariantes e métodos encapsulados. Livre de bibliotecas externas ou acoplamentos a banco de dados.
2. **Camada de Contratos e DTOs (`src/modules/parts/contracts` ou `dtos`):**
   * `CreatePartDto`: Contrato de entrada com decoradores de validação.
   * `CreatePartOutput`: Contrato de saída formatado para os consumidores da API.
   * `IPartsRepository`: Interface/Porta de persistência definindo `findByCode(code)` e `save(part)`.
3. **Camada de Aplicação (`src/modules/parts/application`):**
   * `PartsService` / `CreatePartUseCase`: Orquestra o fluxo de execução, verifica duplicidade e comanda a gravação.
4. **Camada de Persistência / Infraestrutura (`src/modules/parts/infra`):**
   * `PartOrmEntity`: Entidade de mapeamento relacional TypeORM com decoradores `@Entity('parts')`, `@Column`, `@PrimaryGeneratedColumn('uuid')`.
   * `PartMapper`: Converte bidirecionalmente entre `Part` (Domínio) e `PartOrmEntity` (Banco).
   * `TypeOrmPartsRepository`: Implementa `IPartsRepository` utilizando o `EntityManager` / `Repository` do TypeORM.
   * Migration SQL: Criação estruturada da tabela `parts` no PostgreSQL.
5. **Camada de Interface HTTP (`src/modules/parts/interfaces/http` ou `controllers`):**
   * `PartsController`: Mapeia a rota `POST /parts`, injeta o caso de uso e converte erros de domínio em códigos HTTP padronizados.
6. **Camada de Qualidade / Testes (`test/` e `*.spec.ts`):**
   * Suíte unitária focada na entidade `Part` e no serviço de aplicação.
   * Suíte E2E testando a integração HTTP-PostgreSQL via Vitest e Docker.

---

## 9. Considerações Arquiteturais Preliminares
* **Agnosticismo do Núcleo:** A entidade `Part` e suas regras não dependem de decorators do TypeORM nem de bibliotecas HTTP, preservando a manutenibilidade e a testabilidade pura em memória.
* **Mapeamento Explícito (Data Mapper Pattern):** O uso de `PartMapper` assegura que a estrutura da tabela física não contamine o modelo do domínio.
* **Transacionalidade e Concorrência:** A garantia de unicidade do código SKU reside no repositório com suporte de restrição única (`UNIQUE CONSTRAINT`) no PostgreSQL.

---

## 10. Restrições e Dúvidas Técnicas Levantadas

### Restrições Documentadas (Fatos do Projeto)
* O banco de dados obrigatório é PostgreSQL 16 rodando isolado via Docker Compose (`compose.yaml`).
* O backend é desenvolvido com NestJS e TypeScript.
* A persistência utiliza TypeORM com migrations explícitas.
* Os testes automatizados utilizam a biblioteca Vitest.

### Propostas Técnicas a Confirmar com a Equipe
* *Proposta de ID:* Adoção de UUID v4 gerado na aplicação ou no banco de dados como identificador primário da entidade `Part`.
* *Tratamento de Exceções:* Adoção de um `HttpExceptionFilter` global no NestJS para mapear erros customizados de domínio (`EntityAlreadyExistsException`, `DomainValidationException`) diretamente para códigos HTTP (`409`, `422`), mantendo o Controller enxuto.

