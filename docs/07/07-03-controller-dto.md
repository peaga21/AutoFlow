# Artefato 07-03 — Implementação do Controller e DTO

## 1. Sub-Issues Atendidas e Vinculação

* **Sub-Issue do Controller:** [#10 — [SUB-05] feat(api): expor endpoint POST /parts no PartsController](https://github.com/peaga21/AutoFlow/issues/10)
* **Sub-Issue dos Contratos e DTO:** [#7 — [SUB-02] feat(contracts): definir DTOs de entrada/saída e porta IPartsRepository](https://github.com/peaga21/AutoFlow/issues/7)
* **Sub-Issue do Serviço de Aplicação:** [#9 — [SUB-04] feat(application): implementar serviço de aplicação PartsService](https://github.com/peaga21/AutoFlow/issues/9)

---

## 2. Código de Produção do Controller HTTP

**Arquivo:** [`src/modules/parts/controllers/parts.controller.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/controllers/parts.controller.ts)

```typescript
import { Body, Controller, HttpCode, HttpStatus, Inject, Post, ValidationPipe } from '@nestjs/common';
import { PartsService } from '../services/parts.service.js';
import { CreatePartDto } from '../dtos/create-part.dto.js';
import { CreatePartResponseDto } from '../dtos/create-part-response.dto.js';

@Controller('parts')
export class PartsController {
  constructor(
    @Inject(PartsService)
    private readonly partsService: PartsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPart(
    @Body(new ValidationPipe({ whitelist: true, transform: true, expectedType: CreatePartDto }))
    dto: CreatePartDto,
  ): Promise<CreatePartResponseDto> {
    return this.partsService.createPart(dto);
  }
}
```

### Análise de Responsabilidade Arquitetural do Controller:
* **Entrada:** Recebe a requisição HTTP `POST /parts` com o corpo da mensagem anotado pelo `@Body()`.
* **Validação Sintática:** O `ValidationPipe` integrado intercepta o JSON bruto, aplicando o schema de `CreatePartDto`.
* **Delegação:** Não executa validações de regras de negócio internas ou queries SQL; delega estritamente a chamada ao método `partsService.createPart(dto)`.
* **Resposta:** Retorna o status HTTP `201 Created` e o payload serializado da peça criada.

---

## 3. Código de Produção do DTO de Entrada

**Arquivo:** [`src/modules/parts/dtos/create-part.dto.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/dtos/create-part.dto.ts)

```typescript
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, Min } from 'class-validator';

export class CreatePartDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsNumber()
  @Min(0)
  stockQuantity!: number;

  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}
```

### Análise das Restrições e Decoradores:
* `@IsString()` e `@IsNotEmpty()` em `code` e `name`: Garante que os campos textuais existam, sejam strings e não estejam vazios.
* `@IsNumber()` e `@IsPositive()` em `price`: Garante que o preço seja numérico e estritamente positivo ($> 0$).
* `@IsNumber()` e `@Min(0)` em `stockQuantity`: Garante que o estoque seja numérico e não negativo ($\ge 0$).
* `@IsUUID()` e `@IsNotEmpty()` em `categoryId`: Garante que a chave estrangeira da categoria seja um identificador UUID válido.

---

## 4. Código do DTO de Saída

**Arquivo:** [`src/modules/parts/dtos/create-part-response.dto.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/dtos/create-part-response.dto.ts)

```typescript
export interface CreatePartResponseDto {
  id: string;
  code: string;
  name: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  createdAt: Date;
}
```

---

## 5. Distinção Crítica: Validação da Fronteira HTTP vs. Regra de Negócio

| Dimensão | Validação da Fronteira HTTP (DTO + Pipe) | Regra de Negócio (Aplicação / Domínio) |
| :--- | :--- | :--- |
| **Onde ocorre** | Na camada HTTP (Controller / Pipe), antes do serviço | No serviço de aplicação (`PartsService`) e na entidade (`Part`) |
| **Finalidade** | Proteger a API contra payloads malformados, tipos incompatíveis ou campos vazios | Proteger as invariantes de negócio e consistência do modelo |
| **Resposta HTTP** | `400 Bad Request` com lista de violações sintáticas | `409 Conflict` (duplicidade de SKU) ou `422 Unprocessable` |
| **Independência** | Específica do protocolo HTTP e do framework NestJS | Totalmente agnóstica de protocolo (funciona em CLI, eventos, filas) |

> ⚠️ **Princípio Respeitado:** O fato de o DTO rejeitar campos vazios com `400 Bad Request` não substitui as validações de invariantes de negócio da entidade `Part` nem a verificação de unicidade de SKU realizada pelo serviço de aplicação.
