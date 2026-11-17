# Artefato 05-04 — Implementação do Comportamento Mínimo (Fase GREEN)

## 1. Identificação Geral da Alteração
* **Sub-Issue Vinculada:** [#6 — [SUB-01] feat(domain): modelar entidade Part e regras de negócio](https://github.com/peaga21/AutoFlow/issues/6)
* **Branch:** `feat/sub-01-domain-part`
* **Arquivo Modificado:** [`src/modules/parts/domain/part.entity.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/domain/part.entity.ts)
* **Arquivo de Teste Preservado:** [`src/modules/parts/domain/part.entity.spec.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/domain/part.entity.spec.ts)

---

## 2. Código de Produção Implementado

O arquivo [`src/modules/parts/domain/part.entity.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/domain/part.entity.ts) foi atualizado com a seguinte implementação estrita:

```typescript
import { randomUUID } from 'node:crypto';

export interface CreatePartProps {
  id?: string;
  code: string;
  name: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  createdAt?: Date;
}

export class Part {
  id!: string;
  code!: string;
  name!: string;
  price!: number;
  stockQuantity!: number;
  categoryId!: string;
  createdAt!: Date;

  static create(props: CreatePartProps): Part {
    const part = new Part();
    part.id = props.id || randomUUID();
    part.code = props.code;
    part.name = props.name;
    part.price = props.price;
    part.stockQuantity = props.stockQuantity;
    part.categoryId = props.categoryId;
    part.createdAt = props.createdAt || new Date();
    return part;
  }
}
```

---

## 3. Explicação Técnica Linha a Linha

1. **`import { randomUUID } from 'node:crypto';`**
   * Importa a função padrão de geração de identificadores UUID v4 nativa do Node.js, dispensando pacotes de terceiros e mantendo o domínio puro e performático.
2. **`export interface CreatePartProps`**
   * Contrato de dados aceito para a criação de uma nova peça. Permite opcionalmente fornecer `id` e `createdAt` (útil para reconstituição de dados ou testes) e exige `code`, `name`, `price`, `stockQuantity` e `categoryId`.
3. **`export class Part`**
   * Representação da entidade central do módulo de inventário automotivo.
4. **`static create(props: CreatePartProps): Part`**
   * Método de fábrica de domínio responsável por construir a entidade válida.
5. **`const part = new Part();`**
   * Instanciação direta da entidade em memória.
6. **`part.id = props.id || randomUUID();`**
   * Garante a geração de um UUID v4 único e universal para a entidade quando o chamador não fornecer um ID explícito.
7. **`part.code = props.code;` a `part.categoryId = props.categoryId;`**
   * Atribuição direta dos atributos de negócio informados na entrada.
8. **`part.createdAt = props.createdAt || new Date();`**
   * Garante o registro temporal da criação da entidade, atribuindo a data/hora corrente se não especificada.
9. **`return part;`**
   * Retorna a entidade completamente configurada para o chamador.

---

## 4. Matriz de Rastreabilidade: Código GREEN vs. Asserções do Teste

| Asserção no Teste (`part.entity.spec.ts`) | Trecho Implementado no Código | Objetivo Alcançado |
| :--- | :--- | :--- |
| `expect(part).toBeDefined()` | `const part = new Part(); ... return part;` | A fábrica instancia e retorna o objeto. |
| `expect(part.id).toBeDefined()` | `part.id = props.id \|\| randomUUID();` | Garante a presença do identificador. |
| `expect(typeof part.id).toBe('string')` | `randomUUID()` retorna string UUID | O tipo retornado é estritamente uma string. |
| `expect(part.id.length).toBeGreaterThan(0)` | UUID possui 36 caracteres | Garante que o ID não seja uma string vazia. |
| `expect(part.code).toBe(validProps.code)` | `part.code = props.code;` | Preserva a integridade do código SKU da peça. |
| `expect(part.name).toBe(validProps.name)` | `part.name = props.name;` | Preserva a descrição/nome da peça. |
| `expect(part.price).toBe(validProps.price)` | `part.price = props.price;` | Preserva o valor monetário da peça. |
| `expect(part.stockQuantity).toBe(...)` | `part.stockQuantity = props.stockQuantity;` | Preserva o saldo em estoque. |
| `expect(part.categoryId).toBe(...)` | `part.categoryId = props.categoryId;` | Preserva a amarração com a categoria. |
| `expect(part.createdAt).toBeInstanceOf(Date)` | `part.createdAt = props.createdAt \|\| new Date();` | Garante a atribuição de instância de `Date`. |

---

## 5. Justificativa de Decisões de Design e Deliberações do TDD

* **O que foi mantido simples de propósito:**
  O método utiliza atribuição direta nos atributos públicos da classe `Part`. Isso é uma decisão estrita do **Princípio da Implementação Mínima do TDD**: fazemos o código passar antes de torná-lo perfeito.
* **O que foi postergado deliberadamente para a Fase REFACTOR (Material 06):**
  1. Tornar propriedades privadas com getters públicos ou `readonly` para garantir imutabilidade externa;
  2. Introduzir construtor privado para forçar o uso da fábrica estática `create`;
  3. Lançamento de exceções de domínio de regras de negócio (`InvalidPriceException`, `InvalidStockException`);
  4. Encapsular a geração de ID em um Value Object de Domínio (`PartId`).
