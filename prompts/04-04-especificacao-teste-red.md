# Artefato 04-04 — Especificação do Primeiro Teste Automatizado (Fase RED do TDD)

## 1. Identificação do Teste
* **Sub-Issue Vinculada:** [#6 — [SUB-01] feat(domain): modelar entidade Part e regras de negócio](https://github.com/peaga21/AutoFlow/issues/6)
* **Critério de Aceite Coberto (CA-01):** *"O método estático de fábrica `Part.create(...)` instancia com sucesso uma entidade de peça quando fornecidos dados válidos (`code`, `name`, `price > 0`, `stockQuantity >= 0`, `categoryId`), gerando identificador UUID e data de criação (`createdAt`)."*
* **Caminho do Arquivo de Teste:** [`src/modules/parts/domain/part.entity.spec.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/domain/part.entity.spec.ts)
* **Caminho da Definição de Contrato:** [`src/modules/parts/domain/part.entity.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/domain/part.entity.ts)
* **Framework e Ferramenta:** Vitest (`v3.2.7`) / TypeScript
* **Nível de Teste:** Teste Unitário de Domínio Puro (sem acoplamento a banco de dados ou HTTP)

---

## 2. Justificativa da Escolha do Nível de Teste
Segundo a pirâmide de testes e os princípios da Clean Architecture, a camada de **Domínio Puro** deve ser o ponto de partida do ciclo de desenvolvimento guiado por testes (TDD). 
* Testes unitários de domínio executam em milissegundos na memória;
* Não exigem containers Docker ativos nem dependências de rede;
* Protegem o núcleo de negócio e as invariantes da entidade `Part` antes que qualquer persistência relacional ou controller seja implementado.

---

## 3. Código-Fonte do Teste Automatizado (Padrão AAA)

```typescript
import { describe, it, expect } from 'vitest';
import { Part, CreatePartProps } from './part.entity';

describe('Part Domain Entity (TDD RED)', () => {
  it('should instantiate a valid Part entity with generated ID and timestamp when valid data is provided (CA-01)', () => {
    // Arrange (Preparação de dados válidos)
    const validProps: CreatePartProps = {
      code: 'PART-2026-X',
      name: 'Vela de Ignição Bosch Super Plus',
      price: 29.90,
      stockQuantity: 50,
      categoryId: '2c62c3e2-8924-4f81-a67b-1188371192e2',
    };

    // Act (Ação: Invocação do método de fábrica de domínio)
    const part = Part.create(validProps);

    // Assert (Verificação: Garantia do estado da entidade)
    expect(part).toBeDefined();
    expect(part.id).toBeDefined();
    expect(typeof part.id).toBe('string');
    expect(part.id.length).toBeGreaterThan(0);
    expect(part.code).toBe(validProps.code);
    expect(part.name).toBe(validProps.name);
    expect(part.price).toBe(validProps.price);
    expect(part.stockQuantity).toBe(validProps.stockQuantity);
    expect(part.categoryId).toBe(validProps.categoryId);
    expect(part.createdAt).toBeInstanceOf(Date);
  });
});
```

---

## 4. Contrato e Stub de Borda Mínima (`part.entity.ts`)

```typescript
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

  static create(_props: CreatePartProps): Part {
    // Fase RED do TDD: Método propositalmente não implementado para evidenciar a falha funcional
    throw new Error('Method not implemented: Part.create');
  }
}
```

---

## 5. Comando de Execução Previsto
```bash
pnpm vitest run src/modules/parts/domain/part.entity.spec.ts
```
