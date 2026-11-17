# Artefato 07-05 — Evidências das Requisições HTTP Reais

## 1. Contexto e Ambiente de Execução

* **Servidor:** Aplicação NestJS inicializada em tempo de execução real (`AppModule` com `PartsModule`)
* **Porta:** `3333`
* **Protocolo:** HTTP/1.1
* **Endpoint Testado:** `POST http://localhost:3333/parts`
* **Data e Hora da Execução:** 17 de Novembro de 2026, 14:05:19
* **Ferramenta Utilizada:** Node.js Fetch API / HTTP Client nativo disparando contra o socket local aberto

---

## 2. Cenário 1 — Requisição com Dados Válidos (Sucesso)

### 2.1. Requisição Enviada
* **Método:** `POST`
* **URL:** `http://localhost:3333/parts`
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

### 2.2. Resposta Real Recebida
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

### 2.3. Análise Observacional
* O servidor processou a requisição na rota `/parts` com sucesso.
* O DTO foi validado e passado ao `PartsService`.
* A entidade `Part` foi instanciada com geração do identificador UUID (`98369685-502c-4eb2-9897-2d48d622becd`) e timestamp `createdAt`.
* A resposta retornou código `201 Created` e payload íntegro.

---

## 3. Cenário 2 — Requisição com Dados Inválidos (Rejeição na Fronteira)

### 3.1. Requisição Enviada
* **Método:** `POST`
* **URL:** `http://localhost:3333/parts`
* **Headers:** `Content-Type: application/json`
* **Payload JSON com Múltiplas Violações:**
```json
{
  "code": "",
  "name": "",
  "price": -10,
  "stockQuantity": -5,
  "categoryId": "invalid-uuid"
}
```

### 3.2. Resposta Real Recebida
* **Código de Status HTTP:** `400 Bad Request`
* **Corpo da Resposta JSON:**
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

### 3.3. Análise Observacional
* A requisição foi interceptada e **rejeitada imediatamente na fronteira HTTP** pelo `ValidationPipe`.
* Todas as 5 violações de restrição do `CreatePartDto` foram detectadas e listadas:
  1. `code should not be empty` (violação de `@IsNotEmpty()`)
  2. `name should not be empty` (violação de `@IsNotEmpty()`)
  3. `price must be a positive number` (violação de `@IsPositive()`)
  4. `stockQuantity must not be less than 0` (violação de `@Min(0)`)
  5. `categoryId must be a UUID` (violação de `@IsUUID()`)
* O serviço de aplicação e o repositório **não foram acionados**, garantindo a proteção da aplicação contra dados corrompidos.

---

## 4. Registro Autêntico da Saída do Terminal

```text
Server started on port 3333
VALID STATUS: 201
VALID BODY: {
  "id": "98369685-502c-4eb2-9897-2d48d622becd",
  "code": "PART-2026-X",
  "name": "Vela de Ignição Bosch Super Plus",
  "price": 29.9,
  "stockQuantity": 50,
  "categoryId": "2c62c3e2-8924-4f81-a67b-1188371192e2",
  "createdAt": "2026-11-17T17:05:19.019Z"
}
INVALID STATUS: 400
INVALID BODY: {
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
Server closed successfully
```

---

## 5. Conclusão da Verificação Prática

A fronteira HTTP implementada em `PartsController` opera com total correção sintática e semântica, respondendo com precisão de status codes e mensagens estruturadas para requisições válidas e inválidas.
