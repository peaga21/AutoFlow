# Artefato 08-03 — Verificação de Módulos, Providers e Resolução de Dependências

## 1. Módulos e Providers Inspecionados

A arquitetura do backend NestJS do projeto AutoFlow estrutura os componentes do módulo de peças no arquivo [`src/modules/parts/parts.module.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/parts.module.ts):

```typescript
import { Module } from '@nestjs/common';
import { PartsController } from './controllers/parts.controller.js';
import { PartsService } from './services/parts.service.js';
import { PARTS_REPOSITORY } from './repositories/parts.repository.interface.js';
import { InMemoryPartsRepository } from './repositories/in-memory-parts.repository.js';

@Module({
  controllers: [PartsController],
  providers: [
    PartsService,
    {
      provide: PARTS_REPOSITORY,
      useClass: InMemoryPartsRepository,
    },
  ],
  exports: [PartsService, PARTS_REPOSITORY],
})
export class PartsModule {}
```

---

## 2. Padrão de Provider Customizado e Inversão de Dependência (DIP)

Em TypeScript, interfaces puras como `PartsRepository` sofrem remoção de tipos (*type erasure*) durante a transpilação para JavaScript e deixam de existir em tempo de execução. Para viabilizar a injeção de dependência pelo container IoC do NestJS, adota-se um **Token de Injeção**:

* **Declaração do Token:**
  ```typescript
  export const PARTS_REPOSITORY = Symbol('PARTS_REPOSITORY');
  ```
* **Associação no Provider:**
  ```typescript
  {
    provide: PARTS_REPOSITORY,
    useClass: InMemoryPartsRepository,
  }
  ```
* **Consumo no Serviço:**
  ```typescript
  @Injectable()
  export class PartsService {
    constructor(
      @Inject(PARTS_REPOSITORY)
      private readonly partsRepository: PartsRepository,
    ) {}
  }
  ```

---

## 3. Explicação Passo a Passo da Cadeia de Resolução no Container IoC

Quando uma requisição atinge a rota `POST /parts`:

```text
1. Container NestJS identifica rota 'POST /parts' vinculada a PartsController
2. NestJS inspeciona construtor de PartsController -> requer PartsService
3. NestJS localiza PartsService nos providers do PartsModule
4. NestJS inspeciona construtor de PartsService -> requer dependência com token PARTS_REPOSITORY
5. NestJS consulta mapa de providers do PartsModule para PARTS_REPOSITORY
6. NestJS localiza a classe concreta InMemoryPartsRepository associada via useClass
7. NestJS instancia (ou obtém singleton de) InMemoryPartsRepository
8. InMemoryPartsRepository é injetado no construtor de PartsService
9. PartsService é injetado no construtor de PartsController
10. PartsController executa o método createPart(dto) chamando partsService.createPart(dto)
```

Graças a este desacoplamento estrito, o `PartsService` nunca conhece detalhes de implementação do `InMemoryPartsRepository`, comunicando-se estritamente através do contrato da interface `PartsRepository`.

---

## 4. Integração no `AppModule`

No módulo raiz ([`src/app.module.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/app.module.ts)), o `PartsModule` e o `OrdersModule` estão devidamente registrados:

```typescript
@Module({
  imports: [
    ...(process.env.DB_HOST ? [TypeOrmModule.forRoot({ ... })] : []),
    PartsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

A inicialização do TypeORM foi configurada de forma resiliente, permitindo que o container inicialize sem erros em ambientes onde o banco de dados PostgreSQL ainda não esteja ativo.
