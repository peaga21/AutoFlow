# Artefato 07-04 — Validação e Composição de Módulos e Providers

## 1. Configuração do `ValidationPipe` Global e Local

A validação de entrada foi estabelecida em duas camadas de garantia:

### 1.1. Configuração Global no Bootstrap (`main.ts`)
**Arquivo:** [`src/main.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/main.ts)
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
```

* **`whitelist: true`**: Descarta automaticamente qualquer propriedade enviada no corpo da requisição que não esteja explicitamente mapeada com decoradores no DTO correspondente, prevenindo ataques de *mass assignment*.
* **`transform: true`**: Converte os payloads brutos nas instâncias reais das classes DTO utilizando `class-transformer`.

### 1.2. Configuração com `expectedType` no Controller
**Arquivo:** [`src/modules/parts/controllers/parts.controller.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/controllers/parts.controller.ts)
```typescript
@Post()
@HttpCode(HttpStatus.CREATED)
async createPart(
  @Body(new ValidationPipe({ whitelist: true, transform: true, expectedType: CreatePartDto }))
  dto: CreatePartDto,
): Promise<CreatePartResponseDto> {
  return this.partsService.createPart(dto);
}
```
A declaração explícita de `expectedType: CreatePartDto` garante interoperabilidade completa com empacotadores modernos como esbuild (usado internamente pelo Vitest), assegurando que o `ValidationPipe` identifique os metadados do DTO mesmo quando a reflexão de tipos do TypeScript não é emitida para parâmetros individuais.

---

## 2. Composição do Módulo da Feature (`PartsModule`)

**Arquivo:** [`src/modules/parts/parts.module.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/parts.module.ts)

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

### Análise da Composição:
* **Controllers:** `PartsController` expõe a rota REST `POST /parts`.
* **Providers:**
  1. `PartsService`: Caso de uso / serviço de aplicação injetado no controller.
  2. `PARTS_REPOSITORY`: Token de injeção associado à classe `InMemoryPartsRepository`, resolvendo o contrato `PartsRepository` por Inversão de Dependência (DIP).
* **Exports:** O serviço e o token são disponibilizados para eventuais módulos consumidores.

---

## 3. Composição no Módulo Raiz (`AppModule`)

**Arquivo:** [`src/app.module.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/app.module.ts)

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app/app.controller.js';
import { AppService } from './app/app.service.js';
import { PartsModule } from './modules/parts/parts.module.js';
import { OrdersModule } from './modules/orders/orders.module.js';

@Module({
  imports: [
    ...(process.env.DB_HOST
      ? [
          TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: false,
          }),
        ]
      : []),
    PartsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

* **Resiliência de Ambiente:** A configuração do `TypeOrmModule` foi condicionada à presença da variável de ambiente `DB_HOST`. Isso permite que a aplicação inicialize e responda localmente e nos testes com os repositórios em memória, sem travar por ausência de um PostgreSQL externo.

---

## 4. Evidências da Compilação e Build

Comando executado:
```bash
pnpm build
```

Saída real do terminal:
```text
$ nest build
[build concluído com sucesso — exit code 0]
```
A compilação via `nest build` processou integralmente todos os controllers, DTOs, módulos e decorators sem nenhum erro de tipagem ou de resolução de módulos.
