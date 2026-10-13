### Escolher 3 conceitos importantes do projeto

| Termo | Área A | Significado | Área B | Significado |
| :--- | :--- | :--- | :--- | :--- |
| **Peça** | **Orçamento** | Item no qual é necessário para a realização de melhorias no veículo do cliente, com um preço de venda, e necessidade de aprovação para sua liberação. | **Estoque** | Unidade física em prateleira com código de referência. |
| **Serviço** | **Recepção** | Descrição comercial de um serviço com valor baseado na mão de obra e prazo. | **Oficina** | Tarefa a ser executada no veículo, envolvendo tempo necessário pelo mecânico, e uso de elevador para a sua realização. |
| **Veículo** | **Vistoria** | Bem do cliente que fica temporariamente na oficina. | **Chão da oficina ou box(elevador)** | Patrimônio do cliente no qual são realizadas alterações mecânicas, sendo um conserto ou alguma melhoria no veículo, onde possui históricos de realização. |



### Propor primeiros contextos limitados

### Proposta Simples de Contextos Delimitados (AutoFlow)

---

### Contexto 1: Atendimento e Orçamento

* **Nome provisório:** Atendimento/Orçamento
* **Objetivo:** Receber o cliente, fazer a vistoria do veículo e mandar o orçamento para aprovação.
* **Vocabulário principal:** Cliente, Veículo, Vistoria, Fotos, Orçamento, Aprovação.
* **Agregados ou conceitos importantes:** Vistoria, Orçamento.
* **Regras principais:** 
  * Não pode começar nada sem uma vistoria adequada, tirando fotos do veículo.
  * O mecânico só pode mexer no que o cliente aprovar.
* **Responsabilidades que pertencem:** Tirar fotos do veículo na entrada, montar a lista de preços do conserto e recolher a resposta do cliente.
* **Responsabilidades que não pertencem:** Fazer o conserto mecânico e controlar prateleira de peças.
* **Outros contextos com os quais precisa colaborar:** Oficina (avisa o que foi aprovado) e Estoque (pede para reservar as peças).

---

### Contexto 2: Chão de Oficina

* **Nome provisório:** Oficina
* **Objetivo:** Organizar os mecânicos (ou somente o mecânico) e os elevadores para consertar os veículos aprovados.
* **Vocabulário principal:** Ordem de Serviço, Box, Elevador, Mecânico, Conserto.
* **Agregados ou conceitos importantes:** Ordem de Serviço, Box.
* **Regras principais:** 
  * Só cabe um veículo por elevador (box).
  * O mecânico só faz os serviços aprovados pelo cliente.
* **Responsabilidades que pertencem:** Colocar o veículo no elevador, descobrir o defeito, fazer a manutenção.
* **Responsabilidades que não pertencem:** Negociar valor com cliente e comprar peças fora (a menos que seja uma oficina simples).
* **Outros contextos com os quais precisa colaborar:** Atendimento (recebe a lista de serviços) e Estoque (pega as peças no balcão).

---

### Contexto 3: Estoque de Peças

* **Nome provisório:** Estoque
* **Objetivo:** Guardar as peças e garantir que não haja falta na hora do conserto.
* **Vocabulário principal:** Peça, Código, Prateleira, Quantidade, Reserva.
* **Agregados ou conceitos importantes:** Peça, Reserva.
* **Regras principais:** 
  * Aprovou a peça no orçamento, tem que separar na prateleira na hora.
  * Não pode reservar mais peças do que realmente existem no armazém.
* **Responsabilidades que pertencem:** Contar peças na prateleira, reservar peças aprovadas e entregar os componentes para o mecânico.
* **Responsabilidades que não pertencem:** Escolher preço de venda da peça para o cliente e fazer serviços no veículo.
* **Outros contextos com os quais precisa colaborar:** Atendimento (recebe o pedido de reserva) e Oficina (entrega as peças aos mecânicos).

-


### Desenhar colaboração

### Colaboração entre Contextos Delimitados

* **Contexto solicitante:** Atendimento e Orçamentação
* **Contexto responsável:** Estoque e Almoxarifado
* **Objetivo da interação:** Reservar imediatamente no estoque físico as peças aprovadas pelo cliente na proposta de orçamento, garantindo que os componentes fiquem bloqueados para aquele serviço e não sejam usados em outro carro.

---

### Desenho da Colaboração

```mermaid
sequenceDiagram
    autonumber
    actor Cliente
    participant Atendimento as Contexto de Atendimento
    participant Estoque as Contexto de Estoque
    participant Oficina as Contexto de Oficina

    Cliente->>Atendimento: Aprova itens de peça no orçamento
    Note over Atendimento: Identifica peças que precisam ser separadas
    Atendimento->>Estoque: Solicitar reserva de peças (Código, Quantidade, OS_ID)
    alt Saldo disponível em prateleira
        Estoque-->>Atendimento: Reserva confirmada com sucesso (Reserva_ID)
        Atendimento->>Oficina: Liberar veículo para execução no box
    else Falta de peça física
        Estoque-->>Atendimento: Falha na reserva (Item esgotado)
        Atendimento->>Oficina: Bloquear avanço e notificar compra urgente
    end
  ```


  ### O que atravessa a fronteira?

* **Quais informações são enviadas?**
  * Identificador da Ordem de Serviço (`osId`), identificador do item aprovado, código de referência da peça, quantidade solicitada e prazo de validade da reserva.

* **O que é obrigatório?**
  * O código da peça (`codigoPeca`), a quantidade requerida (`quantidade`) e o identificador da OS vinculada (`osId`).

* **O que não deveria ser enviado?**
  * Dados pessoais do cliente (nome, contacto), histórico de avarias da vistoria cautelar, laudo textual do diagnóstico técnico e preços de venda ou margens de lucro aplicadas ao consumidor (detalhes que pertencem unicamente ao contexto comercial/atendimento).

* **Qual resultado é esperado?**
  * Confirmação da reserva com o identificador criado (`reservaId`), confirmação da quantidade bloqueada e registo do novo saldo disponível no armazém.

* **Quais falhas podem ocorrer?**
  * Saldo de armazém insuficiente para cobrir a quantidade pedida (ruptura de stock), código de peça não encontrado ou concorrência simultânea em que outro atendimento reserve a última unidade em stock antes da confirmação.

---

### Como a comunicação deve ocorrer?

* **Escolha provisória:** **Síncrona**
* **Justificativa:** A aprovação precisa de garantir consistência imediata entre a decisão do cliente e o bloqueio físico na prateleira; caso a reserva não se confirme no instante do aceite, o sistema deve impedir a alocação imediata do veículo para o posto de trabalho, evitando paragens indesejadas do elevador.

### Justificação da Temporalidade da Resposta

* **Por que a resposta precisa acontecer imediatamente?**
  * A confirmação da reserva precisa ocorrer de forma imediata porque o próximo passo operacional — alocar o veículo num box com elevador e dar início à reparação — depende criticamente da garantia física da peça em armazém. 
  * Se a resposta não for instantânea, a oficina corre dois riscos graves: colocar um carro a desmontar no elevador sem ter a peça assegurada (bloqueando o posto de trabalho) ou sofrer condições de corrida (*race conditions*), em que outro mecânico no balcão retira a mesma peça antes da consolidação do pedido.

---

### Contrato Mínimo de Significado

| Campo | Significado | Obrigatório? |
| :--- | :--- | :---: |
| **idOrdemServico** | Identificador unívoco do atendimento que originou a requisição e ao qual a peça ficará associada. | Sim |
| **idItemPeca** | Identificador do componente específico aprovado na proposta de orçamento. | Sim |
| **codigoReferenciaPeca** | Código de catálogo/referência física da peça para localização na prateleira do armazém. | Sim |
| **quantidadeSolicitada** | Número de unidades físicas do componente necessárias para a execução do serviço. | Sim |
| **prazoValidadeReserva** | Limite temporal até ao qual o bloqueio do item permanece ativo antes de expirar. | Não |



### O que os atores realmente querem alcançar?

* **Cliente:**
  * "Este ator usa o sistema para conseguir **avaliar e autorizar de forma transparente as reparações necessárias no seu veículo**, garantindo que apenas os serviços e peças expressamente aprovados sejam cobrados e executados."

* **Mecânico / Técnico de Reparo:**
  * "Este ator usa o sistema para conseguir **consultar os serviços aprovados, requisitar as peças necessárias e apontar o tempo de mão de obra despendido**, garantindo que o trabalho seja executado de forma contínua sem paragens no elevador."

* **Recepcionista / Consultor Técnico:**
  * "Este ator usa o sistema para conseguir **registar a entrada do veículo com vistoria fotográfica e formalizar a proposta de orçamento**, garantindo a proteção jurídica da oficina e a comunicação clara com o cliente."

---

### Entregável

| Ator | Objetivo principal | Resultado esperado |
| :--- | :--- | :--- |
| **Cliente** | Consultar e aprovar os itens de serviço e peças do orçamento de forma granular. | Orçamento respondido com consentimento formal registado, prevenindo cobranças indevidas e autorizando o início dos trabalhos. |
| **Mecânico** | Consultar as tarefas autorizadas, solicitar peças reservadas ao armazém e registrar a execução da manutenção. | Veículo reparado segundo as especificações técnicas, com tempo de intervenção apontado e peças baixadas com sucesso. |
| **Recepcionista** | Registrar e validar a vistoria de entrada do veículo, gerando a Ordem de Serviço e enviando a proposta orçamental. | Vistoria fotográfica assinada com resguardo probatório de avarias prévias e proposta entregue ao cliente para deliberação. |


### Auditoria dos Atores do Sistema AutoFlow

| Ator / Candidato identificado | Classificação | Justificação no Domínio |
| :--- | :--- | :--- |
| **Cliente (Proprietário do Veículo)** | **Ator humano** | Pessoa física que interage diretamente com a solução para deliberar e autorizar serviços e peças. |
| **Recepcionista / Consultor Técnico** | **Ator humano** | Operador humano encarregado da admissão física, vistoria fotográfica e orçamentação. |
| **Mecânico / Técnico de Reparo** | **Ator humano** | Profissional técnico que realiza o diagnóstico e executa as manutenções no elevador. |
| **Gerente da Oficina** | **Ator humano** | Responsável pela gestão global, alocação dos postos de trabalho e acompanhamento de produtividade. |
| **Fornecedor / Distribuidor de Peças** | **Sistema externo** | Plataforma externa ou catálogo de terceiros consultado para cotações e compras de peças fora do armazém. |
| **Gateway de Pagamento / Terminal POS** | **Sistema externo** | Entidade tecnológica externa responsável pela liquidação financeira antes da entrega da viatura. |
| **Módulo Preditivo de Áudio (AutoPredict AI)** | **Elemento interno do sistema** | Componente de software inicialmente concebido como ator/módulo inteligente, posteriormente descontinuado. |
| **Ordem de Serviço (OS)** | **Elemento interno do sistema** | Conceito central e entidade agregadora do próprio domínio, frequentemente confundida com ator em fases preliminares. |
| **Peritagem Externa / Seguradora** | **Processo externo relevante** | Fluxo externo de regulação de sinistros que condiciona autorizações em reparações cobertas por apólices. |