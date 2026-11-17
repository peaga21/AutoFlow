# Artefato 08-04 — Execução do Fluxo HTTP Integrado em Tempo Real

## 1. Contexto e Ambiente de Execução

* **Ambiente:** Servidor NestJS inicializado em tempo de execução real na porta `3333`
* **Módulos Ativos:** `AppModule` contendo `PartsModule`
* **Componentes Exercitados no Fluxo:**
  `HTTP Request ➔ PartsController ➔ ValidationPipe ➔ PartsService ➔ PARTS_REPOSITORY (InMemoryPartsRepository)`
* **Data da Execução:** 17 de Novembro de 2026

---

## 2. Cenário Válido — Execução Integrada Completa

### 2.1. Requisição Enviada
* **Método e URL:** `POST http://localhost:3333/parts`
* **Headers:** `Content-Type: application/json`
* **Payload JSON:**
```json
{
  "code": "PART-2026-X",
  "name": "Vela de Ignição Bosch Super Plus",
  "price": 29.90,
  "stockQuantity": 50,
  "categoryId": "2c62c3e2-8924-4f81-a67b-1188371192e2"
}
```

### 2.2. Resposta Observada no Terminal
* **Código de Status HTTP:** `201 Created`
* **Corpo da Resposta JSON:**
```json
{
  "id": "98369685-502c-4eb2-9897-2d48d622becd",
  "code": "PART-2026-X",
  "name": "Vela de Ignição Bosch Super Plus",
  "price": 29.9,
  "stockQuantity": 50,
  "categoryId": "2c62c3e2-8924-4f81-a67b-1188371192e2",
  "createdAt": "2026-11-17T17:05:19.019Z"
}
```

### 2.3. Rastreamento dos Componentes Reais Ativados
1. O socket HTTP recebeu o payload JSON.
2. O `ValidationPipe` validou todas as propriedades com `class-validator` e `class-transformer`.
3. O `PartsController` real recebeu a instância validada de `CreatePartDto`.
4. O `PartsService` real foi acionado através do método `createPart`.
5. O `PartsService` consultou o `InMemoryPartsRepository` real para checar unicidade de SKU via `findByCode`.
6. A entidade `Part` de domínio foi instanciada com geração de UUID e timestamp.
7. O `InMemoryPartsRepository` real executou o método `save(part)`, gravando o objeto na coleção em memória (`Map`).
8. O resultado retornou ao cliente com status `201 Created`.

---

## 3. Cenário Inválido — Rejeição na Fronteira HTTP

### 3.1. Requisição Enviada
```json
{
  "code": "",
  "name": "",
  "price": -10,
  "stockQuantity": -5,
  "categoryId": "invalid-uuid"
}
```

### 3.2. Resposta Observada
* **Código de Status:** `400 Bad Request`
* **Corpo Retornado:**
```json
{
  "message": [
    "code should not be empty",
    "name should not be empty",
    "price must be a positive number",
    "stockQuantity must not be less than 0",
    "categoryId must be a UUID"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 4. Distinção Rigorosa sobre a Evidência de Armazenamento

> ⚠️ **Princípio Arquitetural Crucial:**
> * **A Resposta HTTP:** Demonstra apenas os dados que saíram da camada de controle em direção ao cliente.
> * **A Evidência de Armazenamento:** Exige constatação inequívoca de que o estado interno do repositório foi alterado (ex.: consulta subsequente com `findByCode` no repositório retornando a peça persistida).
> Não se deve afirmar que os dados estão seguramente gravados apenas porque a resposta HTTP devolveu um identificador gerado; a confirmação definitiva requer inspeção direta no repositório (comprovada no Artefato 08-05).
