| Candidato | De onde surgiu? | Por que parece necessário? | C / H / ? |
| :--- | :--- | :--- | :---: |
| **Ordem de Serviço (OS)** | Fluxo principal (Etapas 1 a 7) e Operação `ConcluirOrdemServico` | Centraliza e coordena todo o ciclo de atendimento no chão de fábrica, amarrando veículo, técnico, tarefas executadas e faturamento. | **C** |
| **Vistoria Cautelar / Checklist** | Etapa 1 do fluxo e Fato F02 | Resguarda juridicamente a oficina contra contestações de riscos, avarias pré-existentes e pertences deixados no carro antes da admissão. | **C** |
| **Diagnóstico Técnico** | Operação `RegistrarDiagnosticoTecnico` e Etapa 1 do fluxo | Registra formalmente a avaliação do mecânico sobre a causa raiz do defeito relatado e delimita as necessidades de reparo. | **C** |
| **Item de Serviço** | Etapa 2 do fluxo e Fato F04 | Discrimina a mão de obra individual a ser executada e o tempo estimado de dedicação do técnico no veículo. | **C** |
| **Item de Peça** | Etapa 2 do fluxo e Fato F03 | Identifica os componentes físicos e quantidades exatas que deverão ser substituídos ou aplicados na manutenção. | **C** |
| **Proposta de Orçamento** | Operação `GerarPropostaOrcamento` e Fato F01 | Consolida os valores parciais e totais com prazo de validade determinado, atendendo à exigência legal de autorização prévia. | **C** |
| **Decisão do Cliente (Aceite Granular)** | Operação `RegistrarDecisaoCliente` e Decisão D01 | Registra a escolha formal de aprovação ou recusa item a item, evitando o cancelamento total do serviço e delimitando o que pode ser feito. | **C** |
| **Reserva de Estoque** | Operação `ReservarItensEstoque` e Decisão D02 | Bloqueia a quantidade física da peça no armazém exclusivamente para a OS autorizada, impedindo que outro mecânico a utilize. | **C** |
| **Box de Trabalho (Posto Operacional)** | Fato F05 e alocação física do veículo | Representa o recurso físico limitado (elevador automotivo e ferramental) que só pode receber e erguer um veículo por vez. | **C** |
| **Apontamento de Execução** | Operação `ApontarExecucaoServico` e Etapa 6 do fluxo | Mede o tempo efetivo de trabalho do mecânico em cada tarefa para fins de produtividade e cálculo real de margem de mão de obra. | **H** |
| **Histórico de Manutenção do Veículo** | Etapa 9 (Informações Necessárias ao Sistema) | Permite rastrear intervenções passadas e embasar diagnósticos futuros com base na quilometragem e no uso do carro. | **C** |
| **Solicitação de Compra Urgente** | Situação de Falha (Ruptura de Estoque na aprovação) e Hipótese H04 | Dispara a reposição emergencial junto a distribuidores locais caso a peça esgote durante o período de resposta do cliente. | **H** |
| **Protocolo de Vício Oculto** | Questão em aberto Q01 | Trata o procedimento operacional e jurídico caso um defeito grave não previsto seja encontrado após a desmontagem inicial do motor. | **?** |









# Análise de Candidatos a Entidades / Agregados do Sistema AutoFlow

Nesta etapa, selecionamos os três candidatos centrais do domínio levantados na análise anterior: **Ordem de Serviço (OS)**, **Vistoria Cautelar / Checklist** e **Reserva de Estoque**.

---

## 1. Candidato 1: Ordem de Serviço (OS)

* **1. Duas ocorrências podem possuir os mesmos dados e ainda assim serem coisas diferentes?**
  * **Sim.** Dois atendimentos distintos podem envolver o mesmo modelo de veículo, o mesmo proprietário, os mesmos serviços orçados e o mesmo mecânico responsável. Ainda assim, tratam-se de duas Ordens de Serviço totalmente independentes, abertas em datas diferentes ou correspondentes a passagens distintas pela oficina.

* **2. Os dados podem mudar e ainda continuarmos falando do mesmo elemento?**
  * **Sim.** Ao longo do atendimento, a OS altera seu status (de *Recepcionada* até *Concluída*), tem valores recalculados após a aprovação parcial de itens pelo cliente, recebe novos apontamentos de horas e agrega laudos adicionais, mantendo sua identidade original.

* **3. Existe um ciclo de vida que interessa ao negócio?**
  * **Sim.** A OS passa por transições bem delimitadas de estado: *Recepcionada* $\rightarrow$ *Vistoriada* $\rightarrow$ *Em Diagnóstico* $\rightarrow$ *Aguardando Aprovação* $\rightarrow$ *Em Execução* $\rightarrow$ *Controle de Qualidade* $\rightarrow$ *Pronta para Faturamento* $\rightarrow$ *Concluída e Entregue*.

* **4. Precisamos reconhecer essa mesma ocorrência posteriormente?**
  * **Sim.** É essencial recuperar uma OS específica por meio de um identificador único para fins de histórico veicular, garantia de peças e mão de obra, auditoria fiscal e cobrança.

> **Conclusão:** A **Ordem de Serviço** atende a todos os critérios de uma **Entidade** e atua como o **Agregado Raiz (*Aggregate Root*)** principal do domínio.

---

## 2. Candidato 2: Vistoria Cautelar / Checklist

* **1. Duas ocorrências podem possuir os mesmos dados e ainda assim serem coisas diferentes?**
  * **Sim.** O mesmo veículo pode apresentar exatamente o mesmo nível de combustível (ex.: meio tanque) e o mesmo risco na lataria em duas visitas separadas à oficina. Cada vistoria permanece sendo um evento legal único e isolado no tempo.

* **2. Os dados podem mudar e ainda continuarmos falando do mesmo elemento?**
  * **Sim.** Durante a triagem de entrada, o recepcionista pode adicionar fotos complementares de avarias, retificar a quilometragem anotada ou anexar a assinatura digital do condutor antes de concluir o fechamento da vistoria.

* **3. Existe um ciclo de vida que interessa ao negócio?**
  * **Sim.** A vistoria inicia no estado *Em Preenchimento*, transita para *Registrada/Assinada* e atinge o estado *Imutável* (congelada juridicamente para proteger a oficina contra contestações de danos pré-existentes).

* **4. Precisamos reconhecer essa mesma ocorrência posteriormente?**
  * **Sim.** Em caso de contestação de avarias pelo cliente na retirada do veículo ou disputa judicial, a oficina precisa resgatar exatamente a vistoria assinada vinculada àquela entrada do veículo.

> **Conclusão:** A **Vistoria Cautelar** comporta-se como uma **Entidade**, com forte ciclo de vida inicial e exigência de imutabilidade probatória após a assinatura.

---

## 3. Candidato 3: Reserva de Estoque

* **1. Duas ocorrências podem possuir os mesmos dados e ainda assim serem coisas diferentes?**
  * **Sim.** Podem existir duas reservas com os mesmos atributos (ex.: reserva de 2 unidades da pastilha de freio código `PF-1002`). Uma pertence à OS do cliente A e a outra à OS do cliente B, constituindo bloqueios independentes de saldo físico.

* **2. Os dados podem mudar e ainda continuarmos falando do mesmo elemento?**
  * **Sim.** A reserva pode ter sua quantidade ajustada caso o cliente altere a decisão no orçamento, ou ter seu prazo de expiração renovado, permanecendo a mesma vinculação de saldo enquanto estiver ativa.

* **3. Existe um ciclo de vida que interessa ao negócio?**
  * **Sim.** A reserva nasce no estado *Ativa/Pendente* (no aceite do cliente), pode transitar para *Cancelada/Expirada* (caso o serviço seja cancelado ou a proposta expire) ou para *Consumida/Efetivada* (quando a peça é retirada do estoque físico para aplicação no veículo).

* **4. Precisamos reconhecer essa mesma ocorrência posteriormente?**
  * **Sim.** O sistema precisa rastrear a reserva de forma unívoca para liberar o saldo de volta à prateleira se houver desistência, ou para justificar a divergência temporária entre o saldo físico total e o saldo disponível para venda.

> **Conclusão:** A **Reserva de Estoque** atua como uma **Entidade de Controle Operacional**, garantindo a integridade transacional entre o aceite do cliente e o consumo de peças.



# Atividade — Classifique, mas assuma que pode estar errado

A tabela a seguir apresenta a classificação conceitual preliminar de cada candidato identificado no domínio do **AutoFlow**, acompanhada da justificativa atual e dos fatores críticos que poderiam invalidar ou alterar essa decisão arquitetural:

| Conceito Candidato | Classificação | Por quê? | O que poderia nos fazer mudar de ideia? |
| :--- | :--- | :--- | :--- |
| **Ordem de Serviço (OS)** | **Provável Entidade** | Possui identidade única, dados mutáveis ao longo do tempo e ciclo de vida crítico que governa todo o fluxo da oficina. | Se a oficina operasse apenas com balcão de vendas rápidas e sem esteira de serviço, tornando-se um simples recibo imutável. |
| **Vistoria Cautelar / Checklist** | **Provável Entidade** | Precisa ser rastreada de forma unívoca, pode receber dados complementares na entrada e possui valor probatório para resguardo jurídico. | Se as vistorias fossem tratadas como um snapshot estático, assinado e congelado no ato da recepção, comportando-se como Objeto de Valor da OS. |
| **Diagnóstico Técnico** | **Provável Objeto de Valor** | Representa o parecer técnico e a descrição do problema em um momento específico; se dois técnicos descreverem a mesma avaria, o significado técnico é o mesmo. | Se o diagnóstico precisar de versionamento independente, histórico de reavaliações por outros mecânicos ou ciclo de vida próprio com aprovações formais de chefia. |
| **Item de Serviço** | **Provável Entidade** | Possui ciclo de vida de aprovação granular individual (pode ser aprovado ou recusado separadamente pelo cliente) e apontamento de execução próprio. | Se a oficina adotasse pacotes fechados onde os serviços não pudessem ser aprovados ou rejeitados isoladamente, virando itens imutáveis de uma lista. |
| **Item de Peça** | **Provável Entidade** | Possui estado próprio atrelado à aprovação do cliente e transita entre reserva lógica, cancelamento e consumo físico definitivo. | Se o controle de peças fosse puramente nominal no orçamento, delegando a reserva e rastreabilidade integralmente a um sistema externo de ERP. |
| **Proposta de Orçamento** | **Outro tipo de conceito** *(Estágio / Processo do Agregado OS)* | Não é uma entidade separada; reflete a etapa de negociação e composição de valores da própria Ordem de Serviço. | Se a oficina exigisse suporte a múltiplos orçamentos concorrentes e comparativos para a mesma OS com validade comercial distinta. |
| **Decisão do Cliente (Aceite Granular)** | **Outro tipo de conceito** *(Evento de Domínio)* | Representa o fato temporal em que o proprietário autorizou ou recusou um determinado item, disparando recálculos e reservas. | Se o aceite precisasse armazenar logs complexos de geolocalização, IP e termos contratuais com ciclo de vida de contestação, tornando-se uma Entidade de Contrato. |
| **Reserva de Estoque** | **Provável Entidade** | Possui identidade operacional, ciclo de vida (pendente, confirmada, expirada, baixada) e vincula quantidade física à OS. | Se a reserva fosse apenas uma coluna de saldo deduzida imediatamente no estoque central sem necessidade de rastrear para quem foi reservada. |
| **Histórico de Manutenção do Veículo** | **Outro tipo de conceito** *(Visão de Leitura / Read Model)* | É a consolidação histórica das ordens de serviço e serviços executados no veículo ao longo do tempo, sem comportamento transacional ativo. | Se o histórico acumulasse garantias ativas com regras de expiração e sinistros gerenciados ativamente pelo sistema como um prontuário vivo. |
| **Solicitação de Compra Urgente** | **Provável Entidade** | Possui ciclo de vida próprio (solicitada, cotada, faturada, entregue) e relaciona-se com fornecedores externos. | Se a oficina utilizasse um serviço externo de mensageria direta para peças sem registrar a solicitação formal no sistema interno. |



# Atividade - Selecionar quatro relações importantes no Sistema

| Ordem de serviço AGREGA itens |

Significado: Ordem de serviço agrega as tarefas necessárias para o reparo do veículo.

Cardinalidade: 1 para 0..1

| Ordem de serviço EXIGE Vistoria cautelar |

Significado: Representa a blindagem jurídica da oficina na entrada do carro.

Cardinalidade : 0..1 para 0..1

|Ordem de serviço OCUPA box de trabalho |

Significado: indica a alocação do veículo de uma OS em um espaço fisico da oficina.

Cardinalidade : 0.1 para 0..1


|Item de peça ORIGINA reservas de estoque |

Significado: Quando é aprovada a troca de uma peça, ela é enviada no seu celular, o sistema bloqueia a unidade na prateleira física da oficina.

Cardinalidade: 1 para 0..1



# Atividade - Extrair regras do Fluxo

| 1- Quando o cliente recusar um serviço por orçamento, é proibido o mecanico mexer nessa peça. |

|2- Quando o cliente separar o serviço, é necessário separar a peça do estoque na mesma hora. |

|3 - Quando o pagamento da Ordem de Serviço não estiver quitado ou aprovado, é proibido liberar o veículo para saída da oficina. |


| Regra | De onde ela surgiu? | Evidência | Certeza |
| :--- | :--- | :--- | :---: |
| **Quando** o cliente recusar um serviço, **é proibido** o mecânico mexer nessa peça. | Etapa de aprovação do orçamento. | O cliente só paga e autoriza o que marcou no Sistema. | **Confirmada** |
| **Quando** o cliente aprovar o serviço, **é necessário** separar a peça na prateleira na mesma hora. | Etapa de confirmação de peças. | Se outro mecânico pegar a peça para outro carro, o elevador fica travado esperando peça nova chegar. | **Confirmada** |
| **Quando** o pagamento da Ordem de Serviço não estiver quitado ou aprovado, **é proibido** liberar o veículo para saída da oficina. | Etapa final de faturamento e entrega do veícul. | Prática padrão para evitar Dívida e garantir a conciliação financeira antes da entrega das chaves. | **Confirmada** |