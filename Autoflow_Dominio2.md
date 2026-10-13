# Do Domínio às Fronteiras: Organizando a Arquitetura do Sistema (AutoFlow)

## Parte 1 — Retomada do Domínio

### Síntese do Sistema AutoFlow
1. **Problema Central:** Ineficiência operacional, falta de transparência na aprovação de orçamentos e elevado risco de litígios jurídicos na gestão de oficinas mecânicas por ausência de provas probatórias (vistorias) e controle rigoroso do saldo de peças e apontamento de mão de obra.
2. **Principais Atores:** Cliente (Proprietário do Veículo), Recepcionista / Consultor Técnico, Mecânico / Técnico de Reparo e Gerente da Oficina.
3. **Principais Fluxos:** 
   * Admissão do veículo com Vistoria Cautelar Fotográfica.
   * Diagnóstico Técnico e Elaboração da Proposta de Orçamento.
   * Deliberação e Aprovação Granular pelo Cliente.
   * Reserva e Baixa de Peças no Almoxarifado.
   * Execução e Apontamento de Mão de Obra nos Boxes.
   * Faturamento, Liquidação Financeira e Finalização da Ordem de Serviço (OS).
4. **Conceitos Centrais:** Ordem de Serviço, Vistoria Cautelar, Proposta de Orçamento, Reserva de Estoque, Apontamento de Execução, Box de Trabalho.
5. **Regras de Negócio e Invariantes:**
   * É proibido executar qualquer serviço ou utilizar qualquer peça sem autorização prévia e assinada do cliente.
   * A vistoria de admissão é imutável após a assinatura/confirmação do cliente.
   * Uma reserva de peça só é efetuada se houver saldo físico disponível no inventário real.
6. **Agregados Identificados:** `OrdemDeServico`, `VistoriaCautelar`, `PropostaOrcamento`, `ReservaEstoque`, `ItemEstoque`.

### Questão de Análise
> **O que na modelagem anterior forneceu pistas para a divisão do sistema em áreas de responsabilidade?**

A análise das razões de mudança (*Single Responsibility Principle* no nível de arquitetura do domínio) e dos ciclos de vida das entidades revelou fronteiras naturais:
* A **Vistoria Cautelar** evolui sob o ritmo de conformidade legal e verificação física no momento do recebimento do veículo.
* A **Proposta de Orçamento** evolui sob a dinâmica comercial, negociação de valores e consentimento granular do cliente.
* O **Estoque de Peças** responde ao controle logístico de prateleira, entradas de fornecedores e garantia de saldo.
* A **Execução de Oficina** responde à produtividade operacional dos mecânicos, ocupação física dos boxes e cronometragem de serviço.

Esses ritmos desacoplados indicaram claramente que unificar esses conceitos em um único módulo geraria acoplamento prejudicial e retrabalho em cascata.

---

## Parte 2 — Descoberta das Áreas de Responsabilidade

### Candidatas a Áreas de Responsabilidade

| Área Candidata | Propósito Principal | Conceitos e Regras Envolvidos |
| :--- | :--- | :--- |
| **Atendimento e Orçamentação** | Registrar a admissão do veículo, realizar a vistoria fotográfica e formalizar o orçamento comercial com o cliente. | Vistoria Cautelar, Proposta de Orçamento, Item Aprovado, Regra de consentimento prévio e autorização granular. |
| **Execução de Oficina** | Coordenar a alocação dos boxes/elevadores, acompanhar o diagnóstico e gerenciar o tempo dos mecânicos. | Ordem de Serviço (Execução), Apontamento de Tempo, Box de Trabalho, Regra de alocação de box único por veículo. |
| **Estoque e Almoxarifado** | Assegurar a disponibilidade física de autopeças e gerenciar os bloqueios e baixas de saldo. | SKU, Peça, Reserva de Estoque, Saldo Disponível, Regra de impedimento de saldo negativo. |
| **Faturamento e Finanças** | Consolidar os valores finais autorizados e processar os pagamentos antes da liberação do veículo. | Fatura, Transação Financeira, Comprovante, Regra de liquidação integral para encerramento da OS. |

### Análise de Consistência
* **Mudança pelo mesmo motivo?** Sim. O Atendimento altera-se com regras de direitos do consumidor; o Estoque altera-se por dinâmicas de fornecedores e suprimentos.
* **Propósito claro?** Sim. Cada área cobre uma fase distinta e bem identificada da jornada do veículo na oficina.
* **Atração natural de conceitos?** Sim. A Vistoria atrai arquivos de imagens e avarias; o Estoque atrai SKUs, lotes e localizações físicas.
* **Regras de negócio específicas?** Sim. Cada área gerencia e defende suas próprias invariantes de domínio.

---

## Parte 3 — Investigação dos Bounded Contexts

### 1. Contexto: Atendimento e Orçamentação
* **Propósito:** Gerenciar a recepção probatória do veículo e conduzir o ciclo comercial de aprovação de serviços e peças com o cliente.
* **Responsabilidades:** Registrar a vistoria cautelar com fotos; emitir propostas de orçamento; capturar a aprovação/recusa granular do cliente.
* **O que não pertence:** Controle de posições físicas em prateleiras; apontamento de cronômetro do mecânico; liquidação financeira via cartão.
* **Vocabulário:** *Proposta de Orçamento, Vistoria Cautelar, Item Cotado, Consentimento Granular, Cliente, Recusa.*
* **Regras e Invariantes:** Nenhuma intervenção pode ser marcada como aprovada sem consentimento registrado; a vistoria não pode ser alterada após a assinatura do cliente.
* **Agregados Relacionados:** `VistoriaCautelar` (Agregado), `PropostaOrcamento` (Agregado).
* **Justificativa da Fronteira:** Isolamento das regras legais e comerciais do cliente, evitando que interações na oficina afetem acordos comerciais vigentes.

### 2. Contexto: Execução de Oficina
* **Propósito:** Coordenar a operação mecânica nos boxes de trabalho, a alocação dos elevadores e o apontamento do tempo técnico.
* **Responsabilidades:** Gerenciar a fila de veículos nos boxes; atribuir tarefas aos mecânicos; registrar laudos de diagnóstico; apontar horas de trabalho.
* **O que não pertence:** Negociação de descontos com clientes; compras com fornecedores externos; controle de faturamento financeiro.
* **Vocabulário:** *Ordem de Serviço, Box de Trabalho, Elevador, Apontamento de Tempo, Mecânico, Laudo Técnico.*
* **Regras e Invariantes:** Um box/elevador comporta no máximo um veículo; o mecânico só pode apontar tempo em itens formalmente aprovados.
* **Agregados Relacionados:** `OrdemDeServico` (Visão de Execução/Agregado Principal), `BoxDeTrabalho`.

### 3. Contexto: Estoque e Almoxarifado
* **Propósito:** Garantir a precisão e a rastreabilidade do inventário físico de peças e insumos.
* **Responsabilidades:** Bloquear peças para orçamentos aprovados (reserva); realizar a baixa definitiva no momento da aplicação; emitir alertas de ponto de ressuprimento.
* **O que não pertence:** Definição da margem de lucro e preço de venda ao cliente; gestão da rotina de trabalho dos mecânicos.
* **Vocabulário:** *SKU, Item de Estoque, Saldo Físico, Saldo Reservado, Saldo Disponível, Baixa de Almoxarifado.*
* **Regras e Invariantes:** A soma de peças reservadas e disponíveis não pode exceder o saldo físico; reservas de propostas vencidas expiram automaticamente.
* **Agregados Relacionados:** `ReservaEstoque` (Agregado), `ItemEstoque` (Agregado).
* **Justificativa da Fronteira:** A exatidão do inventário físico deve ser preservada contra alterações indesejadas promovidas por outros setores.

---

## Parte 4 — Mudanças de Significado entre Contextos

| Conceito | Significado em *Atendimento e Orçamentação* | Significado em *Estoque e Almoxarifado* | Significado em *Execução de Oficina* |
| :--- | :--- | :--- | :--- |
| **Peça** | Item comercial de orçamento associado a preço de venda e margem de lucro. | Unidade física de inventário com SKU, saldo de prateleira e lote. | Componente técnico a ser instalado no veículo durante o procedimento do box. |
| **Ordem de Serviço (OS)** | Contrato comercial e proposta de autorização assinada pelo cliente. | Referência externa (`osId`) utilizada unicamente para atrelar reservas de peças. | Ficha de trabalho técnica composta por lista de tarefas, tempos e alocação de boxes. |
| **Cliente** | Pessoa física/jurídica com dados cadastrais, histórico comercial e preferências. | Conceito inexistente (o estoque não necessita de identificação do cliente final). | Proprietário vinculado ao veículo em manutenção (utilizado apenas para identificação da viatura). |

> **Conclusão Arquitetural:** Tentar impor uma entidade única `Peça` ou `OrdemDeServiço` para todo o sistema causaria alto acoplamento e poluição de modelo. Cada contexto mantém a sua representação especializada.

---

## Parte 5 — Mapa das Fronteiras

```mermaid
graph TD
    subgraph Atendimento_Orcamentacao[Contexto: Atendimento e Orçamentação]
        A[Gestão de Vistorias e Propostas Comercial]
    end

    subgraph Execucao_Oficina[Contexto: Execução de Oficina]
        B[Gestão de Ordens de Trabalho e Execução]
    end

    subgraph Estoque_Almoxarifado[Contexto: Estoque e Almoxarifado]
        C[Gestão de Inventário e Reservas de Peças]
    end

    %% Relacionamentos e Fluxos entre Fronteiras
    A -- "1. Solicita Reserva de Peça [Síncrona | Upstream: C, Downstream: A]" --> C
    A -- "2. Notifica Orçamento Aprovado [Assíncrona | Evento: OrcamentoAprovado]" --> B
    B -- "3. Solicita Baixa Definitiva de Peça [Assíncrona | Evento: PecaAplicada]" --> c
   ``` 
   ## Parte 6 — Conhecimento que atravessa as Fronteiras

### Relato de Fronteira: Atendimento $\rightarrow$ Estoque

1. **Quem inicia a interação?** Contexto de Atendimento e Orçamentação.
2. **Por que a interação é necessária?** Para garantir o bloqueio imediato das peças aprovadas pelo cliente na prateleira, impedindo a venda duplicada a outro cliente enquanto o carro aguarda a manutenção.
3. **Quais informações precisam atravessar a fronteira?** Identificador do item aprovado, código de referência do catálogo (SKU), quantidade autorizada e identificador da OS (`osId`).
4. **Quais informações NÃO deveriam atravessar?** Nome e CPF do cliente, valor da margem de lucro, fotos da vistoria e detalhes de pagamento.
5. **A fronteira consumidora precisa conhecer detalhes internos do emissor?** Não. O Estoque apenas processa a solicitação com base nos parâmetros da reserva e no `osId`.
6. **Existe risco de acoplamento desnecessário?** Sim. Se o Estoque tentasse validar o status financeiro ou comercial da OS no banco do Atendimento antes de efetuar a reserva.
7. **Como a resposta pode ser reduzida?** A resposta limita-se ao contrato mínimo: `sucesso: true/false`, `idReserva` (quando bem-sucedido) e `motivoFalha` (quando sem saldo).

---

## Parte 7 — Comunicação entre Fronteiras

| Origem | Destino | Necessidade / Evento | Tipo | Justificativa de Arquitetura |
| :--- | :--- | :--- | :--- | :--- |
| **Atendimento** | **Estoque** | Reservar peça imediatamente após o aceite do cliente no orçamento. | **Síncrona** | O consultor e o cliente necessitam da confirmação instantânea do bloqueio para garantir o prazo de entrega antes de alocar o veículo em um box. |
| **Atendimento** | **Execução** | Notificar a aprovação do orçamento para liberar o início da manutenção. | **Assíncrona** | O mecânico não precisa iniciar a reparação no exato milissegundo do aceite; a OS ingressa na fila de despacho operacional. |
| **Execução** | **Estoque** | Registrar a aplicação da peça reservada e solicitar a baixa física. | **Assíncrona** | A baixa contábil/física do almoxarifado é o fechamento do ciclo da reserva e pode ocorrer em segundo plano sem travar a oficina. |

---

## Parte 8 — Contratos entre Fronteiras

### Contrato 1: Reserva de Peça Aprovada
* **Origem:** Contexto de Atendimento e Orçamentação
* **Destino:** Contexto de Estoque e Almoxarifado
* **Objetivo:** Bloquear a quantidade necessária de peças no inventário para atender a uma OS aprovada.
* **Informações Enviadas:**
  * `idOrdemServico` (String, Obrigatório)
  * `codigoReferenciaPeca` (String/SKU, Obrigatório)
  * `quantidadeSolicitada` (Integer, Obrigatório, $>= 1$)
* **Resultado Esperado (Morfologia da Resposta):**
  * *Sucesso:* `{ status: "RESERVADO", idReserva: "RES-9876", quantidadeBloqueada: 2 }`
  * *Falha:* `{ status: "FALHA_SALDO_INSUFICIENTE", saldoDisponivel: 0 }`
* **Semântica Importante:** `quantidadeSolicitada` deve ser um número positivo maior que zero. A reserva expira se não for confirmada em até 48 horas.
* **Possíveis Falhas:** Indisponibilidade de saldo físico em prateleira ou código de SKU não cadastrado.
* **O que NÃO faz parte:** Preço de venda, descontos comerciais e dados cadastrais do cliente.

---

### Contrato 2: Notificação de Orçamento Autorizado
* **Origem:** Contexto de Atendimento e Orçamentação
* **Destino:** Contexto de Execução de Oficina
* **Objetivo:** Informar à oficina que determinado veículo recebeu autorização comercial para execução de reparos.
* **Informações Enviadas:**
  * `idOrdemServico` (String, Obrigatório)
  * `placaVeiculo` (String, Obrigatório)
  * `itensServicoAprovados` (Array de Objetos, Obrigatório)
* **Resultado Esperado:**
  * *Sucesso:* `{ status: "ORDEM_INCLUIDA_NA_FILA", posicaoFila: 3 }`
  * *Falha:* `{ status: "REJEITADO", motivo: "ORDEM_JA_CANCELADA" }`
* **Semântica Importante:** Envia estritamente os itens e serviços que o cliente aprovou na proposta.
* **Possíveis Falhas:** OS já cancelada antes do consumo do evento ou veículo sem registro de vistoria de entrada.
* **O que NÃO faz parte:** Condições de parcelamento, formas de pagamento ou valores monetários envolvidos.

---

