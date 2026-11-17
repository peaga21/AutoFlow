# Artefato 08-06 — Diagnóstico de Falhas de Integração e Injeção de Dependências

## 1. Categorização das Falhas Típicas de Integração

Na arquitetura modular do NestJS, problemas na fronteira entre camadas dividem-se em três grandes categorias:

| Categoria | Sintoma Típico | Causa Raiz | Exemplo |
| :--- | :--- | :--- | :--- |
| **1. Composição de DI** | `UnknownDependenciesException` | Provider esquecido em `providers` ou token não resolvido | Omitir token de repositório no módulo |
| **2. Fronteira HTTP** | `400 Bad Request` ou `500` inesperado | DTO com decoradores incorretos ou `ValidationPipe` desativado | Enviar tipos trocados sem transformação |
| **3. Comportamento** | `ConflictException (409)` ou erro de lógica | Regra de negócio violada entre Service e Repository | Cadastrar SKU duplicado no repositório |

---

## 2. Experimento Controlado em Ambiente de Teste Isolado (Refinamento da Fase 9)

Para comprovar a capacidade de diagnóstico de falhas de injeção sem corromper o módulo de produção (`PartsModule`), foi executado um teste isolado no arquivo [`parts.integration.spec.ts`](file:///c:/Users/pedro/.vscode/AutoFlow/src/modules/parts/test/parts.integration.spec.ts):

### Configuração do Módulo com Falha Induzida:
```typescript
await Test.createTestingModule({
  controllers: [PartsController],
  providers: [PartsService], // Propositalmente sem o provider de PARTS_REPOSITORY
}).compile();
```

---

## 3. Mensagem Real de Erro Emitida pelo NestJS

Ao compilar esse módulo com dependência não resolvida, o container de IoC do NestJS lança a seguinte exceção estruturada:

```text
[Nest] ERROR [ExceptionHandler] Nest can't resolve dependencies of the PartsService (?).
Please make sure that the argument PARTS_REPOSITORY at index [0] in the PartsService constructor is available in the RootTestModule context.

Potential solutions:
- Is RootTestModule a valid NestJS module?
- If PARTS_REPOSITORY is a provider, is it part of the current RootTestModule?
- If PARTS_REPOSITORY is exported from a separate @Module, is that module imported within RootTestModule?
  @Module({
    imports: [ /* the Module containing PARTS_REPOSITORY */ ]
  })
```

---

## 4. Anatomia Técnica da Falha

1. **Classe Afetada:** `PartsService`.
2. **Posição do Argumento:** `index [0]` no construtor do serviço (`constructor(@Inject(PARTS_REPOSITORY) private readonly partsRepository: PartsRepository)`).
3. **Dependência Ausente:** Token `PARTS_REPOSITORY` (identificado como `?` no erro por ser um Symbol em tempo de execução).
4. **Causa Raiz:** O módulo de teste declarou o `PartsService`, mas omitiu o provider que mapeia o token `PARTS_REPOSITORY` para uma classe concreta (`useClass: InMemoryPartsRepository`).

---

## 5. Correção Técnica Demonstrada

A solução definitiva consiste em registrar expressamente o provider associado ao token no array `providers`:

```typescript
providers: [
  PartsService,
  {
    provide: PARTS_REPOSITORY,
    useClass: InMemoryPartsRepository, // Ou TypeOrmPartsRepository na futura etapa de banco real
  },
]
```

### Comprovação Automatizada:
O cenário automatizado no teste integrado valida que a ausência do provider de fato rejeita a compilação:
```typescript
await expect(
  Test.createTestingModule({
    controllers: [PartsController],
    providers: [PartsService],
  }).compile(),
).rejects.toThrow();
```
Essa validação comprova que o sistema falha de forma segura e inteligível caso ocorra uma quebra acidental de fiação no container de injeção.
