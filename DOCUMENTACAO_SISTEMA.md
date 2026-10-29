# 📚 Dossiê de Arquitetura & Contexto — Ecossistema Integrado de Medicina
### UNINASSAU · Holding Ser Educacional · Versão Executiva & Técnica 2026
> **Documento Mestre para Análise de IA, Engenharia de Software e Expansão do Sistema**  
> **Última Atualização:** 29 de Outubro de 2026  
> **Unidade:** UNINASSAU Boa Viagem (Recife - PE)  
> **Status Geral do Projeto:** 🚀 Em Expansão / Integração de Módulos Enterprise  

---

## 🧭 Guia Rápido para a IA que está analisando este documento

Se você é um modelo de linguagem (LLM) ou agente autônomo analisando este repositório para nos ajudar a construir algo maior, aqui está a essência em 30 segundos:

1. **O que é este projeto (`ecomed_bv`)?**  
   É o **Portal / Shell Central** do *Ecossistema Integrado de Medicina da UNINASSAU Boa Viagem*. Ele foi concebido em React 19 + TypeScript + Vite + Tailwind CSS v4 para unificar todas as frentes acadêmicas, clínicas e operacionais do curso de Medicina.
2. **O que já funciona nele hoje?**  
   - **SimulaMed:** Plataforma completa de monitoramento dos alunos do Internato para o exame ENAMED (dados reais de notas, simulados, orientadores, tutores e exportações).  
   - **Convênios Hospitalares:** Gestão dos 21 convênios da unidade (vigências, Gantt 2023–2033, contrapartidas financeiras, divisão de vagas por curso e **contrato renovado da Hapvida com 37 alunos e R$ 122.100,00/semestre**).  
3. **O que precisa ser integrado como módulo?**  
   - O **Sistema de Preceptoria Real** (`D:\PROJETOS\MEDICINA\sistema-preceptoria`), que hoje é um sistema de produção à parte, maduro (v1.18), com backend **Supabase** (`tdmrscavrdoekrzdlmpf`), 27+ tabelas, 40+ RPCs no PostgreSQL, bloqueio automático de conflito de escalas, assinatura de presença móvel via link/token (`/p/:token`), conferência financeira em lote e integração de e-mails via Outlook. No `ecomed_bv`, a Preceptoria ainda é apenas uma interface com dados mockados em memória.
4. **Qual é o objetivo maior?**  
   Unificar a Preceptoria real, o SimulaMed, os Convênios e futuramente a **Clínica-Escola** (`D:\PROJETOS\clinica-escola`) sob uma única arquitetura modular, com autenticação centralizada (Supabase Auth/SSO Ser Educacional), controle de perfis (RBAC: Diretor, Coordenador, Preceptor, Aluno) e interface corporativa coesa.

---

## 📋 Índice Geral

1. [Visão Geral & Modelo de Negócio](#1-visão-geral--modelo-de-negócio)
2. [Inventário dos Sistemas no Workspace](#2-inventário-dos-sistemas-no-workspace)
3. [Stack Tecnológica Completa](#3-stack-tecnológica-completa)
4. [Arquitetura de Software & Estrutura de Pastas](#4-arquitetura-de-software--estrutura-de-pastas)
5. [Módulos do Ecossistema](#5-módulos-do-ecossistema)
   - [5.1 Módulo: Gestão de Preceptoria (Sistema Real Supabase)](#51-módulo-gestão-de-preceptoria-sistema-real-supabase)
   - [5.2 Módulo: SimulaMed (Preparação ENAMED)](#52-módulo-simulamed-preparação-enamed)
   - [5.3 Módulo: Convênios Hospitalares (com Renovação Hapvida 2026/2027)](#53-módulo-convênios-hospitalares)
   - [5.4 Módulos Futuros: Clínica-Escola & Internato](#54-módulos-futuros-clínica-escola--internato)
6. [Engenharia de Dados & Schemas](#6-engenharia-de-dados--schemas)
7. [Plano de Integração Passo a Passo](#7-plano-de-integração-passo-a-passo)
8. [Diretrizes de Implementação para a IA Parceira](#8-diretrizes-de-implementação-para-a-ia-parceira)

---

## 1. Visão Geral & Modelo de Negócio

O curso de Medicina da UNINASSAU Boa Viagem possui três grandes pilares operacionais que demandam governança rigorosa:

```
                            ┌────────────────────────────────────────┐
                            │    ECOSSISTEMA INTEGRADO DE MEDICINA   │
                            │       (UNINASSAU Boa Viagem / PE)      │
                            └───────────────────┬────────────────────┘
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼                                      ▼                                      ▼
┌──────────────────┐                  ┌──────────────────┐                  ┌──────────────────┐
│   PRECEPTORIA    │                  │    SIMULAMED     │                  │    CONVÊNIOS     │
│   & INTERNATO    │                  │  (ENAMED 2026)   │                  │  HOSPITALARES    │
├──────────────────┤                  ├──────────────────┤                  ├──────────────────┤
│• 127 Preceptores │                  │• 78+ Internos    │                  │• 21 Convênios    │
│• Escalas & Setor │                  │• 5 Simulados     │                  │• Vagas por curso │
│• Presença Mobile │                  │• 5 Classificações│                  │• Contrapartidas  │
│• RPA / PJ / Lotes│                  │• Mentores/Tutores│                  │• Hapvida, HARF,  │
│• Saldo Semestral │                  │• Ação no WhatsApp│                  │  SES-PE, HCP     │
└──────────────────┘                  └──────────────────┘                  └──────────────────┘
```

- **Pilar 1 — Preceptoria Médica:** Gestão da equipe médica que orienta alunos nos campos práticos e hospitais. Envolve montagem de escalas de rodízio, conferência de presença em tempo real pelo celular, cálculo de honorários (RPA para pessoa física e faturamento para pessoas jurídicas) e controle do saldo orçamentário semestral liberado pela diretoria.
- **Pilar 2 — Performance Acadêmica (SimulaMed):** Acompanhamento analítico e individualizado de cada estudante do 10º e 11º períodos do Internato para maximizar a nota institucional no **ENAMED** (Exame Nacional da Medicina), categorizando alunos por proficiência e direcionando tutorias.
- **Pilar 3 — Relações Institucionais (Convênios):** Monitoramento dos 21 convênios firmados com hospitais públicos, filantrópicos e privados (ex: Hapvida, Força Aérea Brasileira - HARF, Secretaria Estadual de Saúde - SES-PE, Hospital de Câncer de Pernambuco - HCP), controlando prazos de vigência, contrapartidas em dinheiro/bolsas e garantia de vagas.

---

## 2. Inventário dos Sistemas no Workspace

Os seguintes repositórios e ativos compõem a infraestrutura do ecossistema:

### Ativo A: `d:\PROJETOS\ecomed_bv` (O Portal Central)
- **Papel:** Host do Ecossistema, Single Page Application.
- **Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion.
- **Estado atual:** Contém layout definitivo (Sidebar UNINASSAU, Header com notificações e busca global), módulo SimulaMed completo com dados de alunos e módulo de Convênios completo. A Preceptoria atual é mockada.

### Ativo B: `D:\PROJETOS\MEDICINA\sistema-preceptoria` (O Sistema de Preceptoria de Produção)
- **Papel:** Sistema oficial de Gestão de Preceptoria da UNINASSAU Medicina (versão 1.18, Outubro/2026).
- **Stack:** React, JavaScript (.jsx), Vite, CSS puro (`styles.css` 215KB), `@supabase/supabase-js`, `jspdf`, `jspdf-autotable`.
- **Backend:** Supabase PostgreSQL (`https://tdmrscavrdoekrzdlmpf.supabase.co`).
  - 27+ tabelas de banco de dados.
  - 40+ RPCs (Remote Procedure Calls) nativas em PostgreSQL para cálculos de impostos, lote de pagamentos e validação de conflitos.
  - 61 migrações versionadas.
  - Row Level Security (RLS) e Edge Functions ativas.
  - Rota Mobile `/p/:token`: página pública ultraleve para médicos registrarem presença sem precisar baixar aplicativo ou fazer login.
  - Arquivo mestre de serviços: `src/services/queries.js` (~1.800 linhas de funções Supabase).

### Ativo C: `D:\PROJETOS\clinica-escola` (Clínica-Escola de Saúde)
- **Papel:** Sistema de atendimento ao paciente, agendamento de consultas, especialidades e prontuário integrado para estudantes de saúde.
- **Stack:** React, TypeScript, Supabase, Tailwind.

### Ativo D: Mapeamento de Bancos de Dados Supabase (`D:\PROJETOS\bancos-supabase.txt`)
- O grupo utiliza projetos dedicados no Supabase gerenciados pelas contas de TI da instituição, permitindo integração via REST API e MCP Supabase.

---

## 3. Stack Tecnológica Completa

| Categoria | Tecnologia | Versão | Função no Ecossistema |
| :--- | :--- | :--- | :--- |
| **Framework UI** | React | `^19.0.1` | Renderização reativa de alto desempenho |
| **Linguagem Principal** | TypeScript | `~5.8.2` | Segurança de tipos no Core e módulos modernos |
| **Compilação Híbrida** | TypeScript (`allowJs: true`) | — | Permite importar módulos legados em `.jsx` sem reescrita forçada |
| **Bundler & DevServer**| Vite | `^6.2.3` | Hot Module Replacement veloz e build otimizado |
| **Estilização Global** | Tailwind CSS v4 | `^4.1.14` | Variáveis temáticas via `@tailwindcss/vite` |
| **Estilização Legada** | CSS Escopado (`.preceptoria-root`) | — | Isola os estilos do sistema de preceptoria |
| **Ícones** | Lucide React | `^0.546.0` | Iconografia institucional uniforme |
| **Animações** | Motion (Framer Motion) | `^12.23.24` | Transições suaves de abas e modais |
| **Backend & Banco** | Supabase (PostgreSQL 15+) | Cloud | Banco relacional, Auth JWT, Edge Functions, RPCs e Storage |
| **SDK Supabase** | `@supabase/supabase-js` | `^2.49.0` | Cliente oficial para chamadas de RPCs e tabelas |
| **Relatórios / PDF** | `jspdf` + `jspdf-autotable` | `^4.2.1` | Geração client-side de espelhos de escala e pagamentos |
| **Manipulação Excel** | `xlsx` | `^0.18.5` | Exportação de tabelas e relatórios para coordenadores |
| **Inteligência Artificial**| `@google/genai` | `^2.4.0` | Suporte futuro a assistentes clínicos e triagem acadêmica |

---

## 4. Arquitetura de Software & Estrutura de Pastas

Para receber múltiplos sistemas sem conflitos de variáveis globais, escopos de CSS ou quebras de build, a arquitetura-alvo adotada é a **Modular Nativa por Domínio (Feature-Driven Architecture)**:

```text
d:\PROJETOS\ecomed_bv\
├── index.html                        # Ponto de entrada do SPA
├── vite.config.ts                    # Configuração Vite + Tailwind v4 + React
├── tsconfig.json                     # TypeScript com "allowJs": true
├── package.json                      # Dependências globais unificadas
├── .env                              # VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
│
├── public/                           # Logos brancas, favicons e manifest
│   └── uninassau_logo_white.png
│
└── src/
    ├── main.tsx                      # ReactDOM bootstrap
    ├── App.tsx                       # Roteador Master (chaveia módulos e rota mobile)
    ├── index.css                     # Tailwind v4 tema institucional
    ├── types.ts                      # Interfaces TypeScript compartilhadas
    │
    ├── core/                         # Núcleo da plataforma
    │   ├── auth/                     # Autenticação Supabase, contexto do usuário e RBAC
    │   ├── components/
    │   │   ├── Header.tsx            # Cabeçalho com breadcrumb, busca global e perfil
    │   │   ├── Sidebar.tsx           # Menu unificado com permissões de acesso
    │   │   └── EmDesenvolvimento.tsx # Placeholder padronizado para expansões
    │   └── services/                 # Instância Supabase Singleton
    │
    └── modules/                      # Módulos Funcionais Autônomos
        │
        ├── preceptoria/              # Módulo Real de Preceptoria (Migrado de MEDICINA)
        │   ├── PreceptoriaModule.tsx # Invólucro com layout do ecossistema
        │   ├── PreceptoriaApp.jsx    # Componente administrativo completo (7.6k linhas)
        │   ├── mobile/
        │   │   └── RegistroPresencaToken.jsx # Rota /p/:token sem menu, mobile-first
        │   ├── services/
        │   │   ├── supabase.js       # Client configurado com import.meta.env
        │   │   ├── queries.js        # ~1.800 linhas de RPCs e queries de produção
        │   │   └── xlsx.js           # Funções de exportação analítica
        │   └── styles/
        │       └── preceptoria.css   # 215KB escopados sob .preceptoria-module-root
        │
        ├── simulamed/                # Módulo ENAMED
        │   ├── SimulaMedModule.tsx   # Dashboard analítico de notas e alunos
        │   └── simulamedData.ts      # Dataset de estudantes, tutores e classificações
        │
        ├── convenios/                # Módulo de Convênios
        │   └── ConveniosModule.tsx   # Painel com Gantt, 21 convênios e contrato Hapvida
        │
        └── clinica-escola/           # (Preparado para incorporar D:\PROJETOS\clinica-escola)
```

---

## 5. Módulos do Ecossistema

### 5.1 Módulo: Gestão de Preceptoria (Sistema Real Supabase)

O módulo de preceptoria controla todo o ciclo de vida dos médicos preceptores nos hospitais parceiros.

#### Principais Funcionalidades de Produção:
1. **Cadastro de Preceptores e Vínculos:**
   - 127 preceptores ativos e 45 vínculos de internato registrados.
   - Suporte a múltiplos vínculos por médico (ex: atua em Pediatria no Hospital A e em Cirurgia no Hospital B).
   - Suporte a múltiplos e-mails de notificação por preceptor (`preceptor_emails_copia`).
   - Identificação fiscal flexível: CPF (com validação formatada) ou CNPJ de empresa médica (PJ).
2. **Motor de Escalas e Bloqueio de Conflito:**
   - Seleção de setor hospitalar por item da escala (sem amarrar o preceptor a um único setor fixo).
   - Validação transacional de conflitos via RPC: impede que um preceptor seja escalado em horários coincidentes no mesmo dia em hospitais diferentes.
3. **Registro de Presença Mobile (`/p/:token`):**
   - Cada escala gera um token seguro de presença.
   - O médico acessa no celular pelo navegador sem login, assina e envia confirmação com geolocalização e data/hora oficial.
   - Possui também tela de conferência para coordenadores aprovarem presenças manuais com justificativa.
4. **Ciclo Financeiro & Pagamento em Lote:**
   - Cálculo automático de turnos × valor da hora/vínculo.
   - Dedução de faltas não justificadas.
   - Fluxo simplificado de status: `Calculado` → `Conferido` → `E-mail Preparado` → `Não Pago` → `Pago`.
   - **Geração de Lote de Pagamento:** Confirmação em massa de pagamentos de dezenas de preceptores via RPCs `previa_pagamento_lote` e `executar_pagamento_lote`.
   - **Disparo de E-mails com Deep Link Outlook:** Gera link formatado para envio direto via Outlook Web preenchendo destinatário, assunto, corpo oficial com espelho de cálculo e cópias (Cc).
5. **Acompanhamento de Saldo Semestral:**
   - Visualização gráfica de ranking de vínculos que mais consom a verba semestral da unidade.
   - Alertas visuais para vínculos acima de 80% do saldo utilizado e saldo esgotado.
   - Exportação completa de relatórios em Excel (`.xlsx`) e PDF executivo.

---

### 5.2 Módulo: SimulaMed (Preparação ENAMED)

O SimulaMed é a ferramenta estratégica da direção para garantir a aprovação dos alunos no Exame Nacional de Medicina (ENAMED).

#### Regras e Métricas:
- **Público:** 78+ alunos matriculados no 10º e 11º períodos (Internato).
- **Classificação em 5 Faixas de Proficiência:**
  - 🟢 **Proficiente** (Desempenho excelente)
  - 🔵 **Semi Proficiente** (Desempenho regular/estável)
  - 🟡 **Não Proficiente +** (Atenção moderada)
  - 🟠 **Não Proficiente -** (Risco acadêmico)
  - 🔴 **Alerta Máximo** (Intervenção pedagógica urgente da diretoria)
- **Painel de Ações Rápidas:**
  - Botão de contato direto via WhatsApp institucional da diretoria com mensagem pré-formatada personalizada com nome do aluno e notas.
  - Alocação de professores orientadores/tutores individuais.
  - Filtros cruzados por simulado (Simulado 1 ao Simulado 5), período e presença em sala.
  - Exportação de listas completas em CSV e modo de impressão formatado.

---

### 5.3 Módulo: Convênios Hospitalares

O módulo de convênios gerencia todos os acordos jurídicos e financeiros da UNINASSAU Boa Viagem com hospitais e redes de saúde.

#### O Novo Contrato HAPVIDA (Atualizado em Julho/2026):
O contrato foi renovado e homologado formalmente em **13/07/2026** (Chamado nº `16.902.214`, assinado via D4Sign / Autentique por Dr. Adriano Lisboa, Dr. Janyo Janguiê Diniz e diretoria do Hapvida). Seus dados no sistema refletem as condições exatas:

| Cláusula Contratual | Dado Oficial Homologado |
| :--- | :--- |
| **Concedente / Conveniada** | HAPVIDA ASSISTÊNCIA MÉDICA S.A. (Matriz: CNPJ `63.554.067/0001-98`) |
| **Unidade de Estágio** | Rua da Baixa Verde, 305, Recife - PE, CEP 52010-250 (CNPJ Filial `63.554.067/0210-04`) |
| **IES Contratante** | SER EDUCACIONAL S.A. / UNINASSAU RECIFE - BOA VIAGEM (CNPJ `04.986.320/0019-42`) |
| **Especialidades do Internato** | **Cirurgia, Pediatria, Urgência e Emergência** |
| **Capacidade de Vagas** | **37 alunos / semestre** no campo de estágio de internato |
| **Contrapartida por Aluno** | **R$ 3.300,00** (três mil e trezentos reais) por aluno |
| **Valor Total por Semestre** | **R$ 122.100,00** (Cento e vinte e dois mil e cem reais) |
| **Vigência** | **2026.1 a 2027.1 (12 meses)**, renovável por termo aditivo |
| **Reajuste Monetário** | Reajuste anual pelo **IPCA** no aniversário do contrato |
| **Exigências Sanitárias** | Carteira de vacinação obrigatória (dT, Tríplice Viral, Hep B, Varicela, Influenza e Covid-19), termo de compromisso assinado e seguro-aluno com apólice vigente |

#### Outros Destaques dos 21 Convênios:
- **HARF (Hospital de Aeronáutica de Recife):** Edital 01/2025 (12/06/2026 a 12/06/2028), 75 vagas/semestre sem contrapartida financeira, com cotas legais (10% PcD e 30% negros/pardos).
- **HCP (Hospital de Câncer de Pernambuco):** R$ 36.242,46/mês (18 vagas medicina + equipe multiprofissional).
- **SES-PE:** 336 vagas em 9 cursos com contrapartida de bolsas de estudo aos servidores estaduais (10% Medicina / 7,5% demais).
- **Fundação CAS / PMPE:** 186+ vagas com desconto institucional de 60% nas mensalidades para dependentes da Polícia Militar.

#### Mapa completo dos dados e números atuais

> **Origem:** todos os números abaixo foram extraídos do código-fonte do módulo — `src/components/ConveniosModule.tsx` (961 linhas; **não existe** `src/modules/convenios/` no projeto atual). Constantes: `conveniosData` (l.37-59) e `ganttData` (l.12-34). `src/types.ts` **não possui** interface `Convenio` (apenas `ModuleId` e `Hospital.convenioStatus`).
> **Natureza:** 100% **dados simulados fixos no código** — sem localStorage, sem fetch, sem Supabase. Nada persiste após recarregar a página.

##### 1. Lista completa dos convênios (21 registros)

| ID | Nome | Status | Contrapartida | Urgente |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Hospital de Aeronáutica de Recife – HARF | vigente | nocp | não |
| 2 | Fundação CAS – PMPE | vigente | cp | não |
| 3 | Prefeitura Municipal de São Lourenço da Mata | renovar | cp | não |
| 4 | Fundo Municipal de Saúde – São Lourenço da Mata | vigente | cp | não |
| 5 | Hospital de Câncer de Pernambuco – HCP/SPCC | renovar | cp | **sim** |
| 6 | IASSEPE / Hospital dos Servidores do Estado – HSE | vigente | cp | não |
| 7 | Irmandade da Santa Casa de Misericórdia de PE | urgente renovar | cp | **sim** |
| 8 | Hospital Santa Joana | urgente renovar | cp | **sim** |
| 9 | Associação Evangélica Beneficente | urgente | nocp | **sim** |
| 10 | Hapvida – Assistência Médica | vigente | cp | não |
| 11 | APAE-SER – Associação de Pais e Amigos | vigente | cp | não |
| 12 | Secretaria Estadual de Saúde – SES-PE | vigente | cp | não |
| 13 | Município de Paulista – Secretaria de Saúde | vigente | nocp | não |
| 14 | Município de Camaragibe – Secretaria de Saúde | vigente | nocp | não |
| 15 | Município de Jaboatão dos Guararapes | vigente | nocp | não |
| 16 | Município de Olinda – Secretaria de Saúde | vigente | nocp | não |
| 17 | Município de Recife – Secretaria de Saúde | renovar | nocp | não |
| 18 | Fundação Altino Ventura – Oftalmologia | vigente | nocp | não |
| 19 | HMG e HMJ – Hospitais Maternidade | vigente | nocp | não |
| 20 | Hospital Memorial do Agreste | vigente | nocp | não |
| 21 | FEAPAES-PE – Fed. das APAEs de Pernambuco | renovar | nocp | não |

**Contagens por status:** `vigente` = **14** (1,2,4,6,10,11,12,13,14,15,16,18,19,20) · `renovar` = **4** (3,5,17,21) · `urgente renovar` = **2** (7,8) · `urgente` = **1** (9) · **cp = 10** · **nocp = 11** · `urgente: true` = **4** (5,7,8,9).

##### 2. Dados individuais de cada convênio (campo `sub`, vigência, cursos, vagas, contrapartida)

| ID | `sub` (texto completo) | Vigência | Período/`anos` | Cursos (rótulo · classe) | Vagas | Contrapartida (texto) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Edital Nº 01/2025 · Chamado 16.627.199 · Comando da Aeronáutica | 12/06/2026 – 12/06/2028 | 2 anos · recém-assinado | Medicina·med, Enfermagem·enf, Fisioterapia, +10 | 75/sem. | Sem contrapartida |
| 2 | Cooperação Técnica · CNPJ 32.982.258/0001-49 | Jan/2026 – Jan/2031 | 5 anos | Medicina·med, Enfermagem·enf, Odontologia, +8 | 186+ (Med.) | Desconto 60% mensalidades |
| 3 | CNPJ 11.251.832/0001-05 · Vinicius Labanca (Prefeito) · Convênio assinado 22/02/2021 · Vigência encerrada Fev/2025 | Fev/2021 – Fev/2025 | Vencido | Medicina·med, Enfermagem·enf, +8 | A definir | Equipamentos (100 esf. + 25 comp.) |
| 4 | CNPJ 12.257.765/0001-90 · Otaviano Eduardo Souza (Sec. Municipal de Saúde) · Convênio assinado 16/12/2025 · Chamado 16.356.936 | Dez/2025 – Dez/2030 | 5 anos | Medicina·med, Enfermagem·enf, +7 | 176 vagas | 10 bolsas integrais (1º Termo Aditivo · valor não informado) |
| 5 | CNPJ 10.894.988/0001-33 · Sidney Batista Neves (Sup. Geral) · 1º Aditivo assinado 19/01/2026 · R$ 36.242,46/mês | 21/05/2024 – 21/05/2026 | Vencido · 2ª renovação em curso | Medicina, Multiprofissional, 18+ vagas | 18+ vagas | R$ 36.242,46/mês |
| 6 | Instituto de Atenção à Saúde | Set/2025 – Set/2029 | 4 anos | Medicina·med, Enfermagem·enf, +6 | A definir | Cursos + descontos |
| 7 | R$ 1.478–1.700/vaga · Prazo iminente | Vence Set/2026 | ~3 meses restantes | Medicina·med, Enfermagem·enf, +outros | A confirmar | R$ 1.478–1.700/vaga |
| 8 | R$ 4.500/vaga · Vence 2026 | 2024 – 2026 | Meses restantes | Medicina·med | A confirmar | R$ 4.500/vaga + EAD |
| 9 | Possível vencimento em 2026 – status a confirmar | 2019 – 2026 (est.) | Possível expiração | Medicina·med | — | Sem contrapartida |
| 10 | Unidade Baixa Verde (CNPJ 63.554.067/0210-04) · Chamado 16.902.214 · Assinado Jul/2026 | 2026.1 – 2027.1 (12 meses) | Vigente (Renovado Jul/2026) | Medicina·med | 37 alunos/sem. | R$ 3.300/aluno (R$ 122.100/sem.) · Cirurgia, Pediatria, Urgência |
| 11 | SER Educacional · Minuta vigente | Nov/2025 – Nov/2027 | 2 anos | Fisioterapia, T. Ocupacional, Fonoaudiologia | A definir | R$ 2.000/mês + eventos |
| 12 | 336 vagas mapeadas · Bolsas integrais a servidores | Jul/2023 – Jul/2028 | 5 anos | Medicina·med, Enfermagem·enf, Fisioterapia, Biomedicina, +4 | 336 vagas | Bolsas 10% / 7,5% |
| 13 | Prefeitura Municipal de Paulista | 2021 – 2027 (est.) | 6 anos | Medicina·med, Enfermagem·enf | — | Sem contrapartida |
| 14 | *(vazio)* | 2021 – 2027 (est.) | 6 anos | Medicina·med, Enfermagem·enf | — | Sem contrapartida |
| 15 | Fundo Municipal de Saúde | 2022 – 2027 (est.) | 5 anos | Medicina·med, Enfermagem·enf | — | Sem contrapartida |
| 16 | *(vazio)* | 2022 – 2032 | 10 anos | Medicina·med, Enfermagem·enf | — | Sem contrapartida |
| 17 | SESAU Declaração out/2024 · Medicina, Nutrição e Psicologia | **A confirmar** | *(vazio)* | Medicina·med, Nutrição, Psicologia | — | Sem contrapartida |
| 18 | *(vazio)* | 2025 – 2027 (est.) | 2 anos | Medicina·med, Enfermagem·enf | — | Sem contrapartida |
| 19 | Hospitais Municipais de Goiana e Jaboatão | desde 2016 – ~2028 | Convênio longo prazo | Medicina·med, Enfermagem·enf | — | Sem contrapartida |
| 20 | Caruaru-PE | 2023 – 2033 | 10 anos | Medicina·med, Enfermagem·enf | — | Sem contrapartida |
| 21 | CNPJ 01.156.276/0001-26 · Caruaru-PE · Dr. Gilvan Florêncio | Em tramitação | *(vazio)* | Fisioterapia, T. Ocupacional, Fonoaudiologia | — | Sem contrapartida |

**Distribuição do campo `vagas`:** numéricas = 6 registros (**75**, **186+**, **176**, **18+**, **37**, **336** → soma derivada = **828+ vagas**) · `A definir` = 3 (3,6,11) · `A confirmar` = 2 (7,8) · `—` = 10 (9,13-21). O código **não calcula nenhum total de vagas**. (Somando os 24 da Santa Joana — que só existem em views fixas — a soma visual chega a 852+.)

##### 3. Vagas por curso

**Cobertura por curso (view "Cursos & Vagas", l.585-590 — array fixo, não calculado):**

| Curso | Convênios | % da barra |
| :--- | :--- | :--- |
| Medicina | 19 | 90% |
| Enfermagem | 17 | 80% |
| Fisioterapia | 14 | 65% |
| Nutrição | 12 | 55% |
| Biomedicina | 11 | 50% |
| Farmácia | 10 | 45% |
| Odontologia | 9 | 40% |
| Psicologia | 9 | 40% |
| Terapia Ocupacional | 7 | 30% |
| Fonoaudiologia | 6 | 28% |
| Serviço Social | 5 | 25% |
| Educação Física | 4 | 20% |
| Téc. Radiologia | 3 | 14% |
| Estética e Cosmético | 2 | 10% |
| Téc. Laboratório | 2 | 10% |
| Téc. Enfermagem | 2 | 8% |

⚠️ O dashboard (l.376-381) traz **Fisioterapia 15 (70%)** — divergente dos 14 (65%) da view de Cursos.

**Vagas detalhadas por convênio (painéis fixos, l.603-609):** Hapvida **37** vagas Med. · HARF **75**/semestre · HCP **18** vagas · CAS **186+** · SES-PE **336** · Santa Joana **24** vagas Med.
**Breakdowns fixos:** SES-PE 336 = Enf. 130 + Med. 80 + Fisio. 42 + Bio. 28 + Farm. 28 + Nutr. 7 + Odonto. 7 + S.Social 7 + Psico. 7 (soma = 336 ✓). Santa Joana 24 = Clínica Médica 6 + Pediatria 6 + UTI 6 + Cirurgia Geral 4 + Urgência/Emergência 2 (soma = 24 ✓). FMS SLM: 176 vagas em 9 cursos. HARF: 13 cursos listados na view dedicada (l.716).

##### 4. Vigências

Todas como **string livre** no campo `vigencia` (não há datas tipadas nem cálculo de vencimento). Registradas na tabela do item 2. Destaques: vigências vencidas/expirando = ID 3 (Fev/2025), 5 (21/05/2026), 7 (Set/2026), 8 (2026), 9 (2026 est.); “A confirmar” = ID 17; “Em tramitação” = ID 21; maior prazo = ID 20 (2023–2033). Nenhum alerta é calculado — o booleano `urgente` e a barra de urgência são fixos.

##### 5. Contrapartidas

**Classificação:** `cp` = 10 (IDs 2,3,4,5,6,7,8,10,11,12) · `nocp` = 11 (IDs 1,9,13-21). ⚠️ A legenda do donut (l.311-312) exibe "**11** convênios · 52% com / **10** · 48% sem" — **invertida** em relação aos dados; a view Contrapartidas (l.460) exibe "10" (correto); o chip de Obrigações exibe "**11 convênios**" (l.644, incorreto para cp).

**Modalidades cadastradas:**

| Modalidade | Convênio | Valor/quantidade exibida |
| :--- | :--- | :--- |
| Financeira mensal | HCP | R$ 36.242,46/mês (R$ 434.909,52/ano) |
| Financeira por aluno | Hapvida | R$ 3.300,00/aluno → R$ 122.100,00/semestre (37 alunos) |
| Financeira por vaga | Santa Casa | R$ 1.478 – R$ 1.700/vaga/mês |
| Financeira por vaga | Santa Joana | R$ 4.500/vaga/mês |
| Financeira mensal | APAE-SER | R$ 2.000,00/mês + eventos |
| Bolsas | FMS São Lourenço da Mata | 10 bolsas integrais (1º Termo Aditivo) — valor não informado no aditivo |
| Bolsas % | SES-PE | Bolsas integrais 10% Medicina / 7,5% demais |
| Desconto | Fundação CAS | 60% nas mensalidades presenciais (exceto Medicina) |
| Descontos/cursos | IASSEPE/HSE | Cursos + formação continuada (sem valor) |
| Equipamentos | Prefeitura SLM | 100 esfigmomanômetros, 15 turbinas, 15 canetas, 25 computadores, 25 balanças |
| EAD/plataformas | Santa Joana | UPTODATE + ISEP + vagas EAD |
| Sem contrapartida | HARF e mais 10 (nocp) | "Sem contrapartida" / HARF = R$ 0 |

##### 6. Valores financeiros exibidos (todos fixos no JSX)

| Valor | Significado | Onde aparece |
| :--- | :--- | :--- |
| R$ 36.242,46/mês · R$ 434.909,52/ano | HCP total (1º aditivo) | l.490, 648 |
| R$ 1.487,17/vaga/mês × 18 = R$ 26.769,06 | HCP Medicina | l.493 |
| R$ 9.473,40/mês | HCP Multiprofissional | l.493 |
| R$ 3.300,00/aluno · R$ 122.100,00/semestre | Hapvida (37 alunos) | l.474, 647 |
| R$ 1.478 – R$ 1.700/vaga/mês | Santa Casa | l.503, 649 |
| R$ 4.500/vaga/mês | Santa Joana | l.509, 650 |
| R$ 2.000,00/mês | APAE-SER | l.524, 651 |
| Valor não informado no aditivo | FMS SLM — contrapartida do 1º Termo Aditivo (10 bolsas integrais) | l.566-567 |
| R$ 36k/mês · R$ 2k · 60% | KPIs da faixa Contrapartidas | l.459-462 |
| R$ 0 | HARF contrapartida financeira | l.708 |
| "R$ 4.500/vaga/mês em risco" | barra de urgência | l.347 |

**Nenhum total financeiro é somado pelo sistema.** Verificações aritméticas dos valores fixos: 18 × 1.487,17 = 26.769,06 ✓ · 26.769,06 + 9.473,40 = 36.242,46 ✓ · 36.242,46 × 12 = 434.909,52 ✓ · 37 × 3.300 = 122.100 ✓.

##### 7. Bolsas e descontos

- **FMS São Lourenço da Mata (1º Termo Aditivo do convênio celebrado em 16/12/2025 · vigência até 15/12/2030):** **10 bolsas integrais** — Direito presencial **1** · Farmácia semipresencial **3** · Biomedicina semipresencial **1** · Nutrição semipresencial **1** · Recursos Humanos EAD **1** · ABA, pós-graduação EAD **1** · Gestão em Saúde Pública, pós-graduação EAD **2** (soma = **10** ✓). **Valor financeiro não informado no aditivo** — a composição simulada anterior foi removida e nenhum novo valor foi calculado ou estimado.
- **SES-PE:** bolsas integrais a servidores — **10%** das vagas de Medicina e **7,5%** das demais, por semestre; 336 vagas mapeadas.
- **Fundação CAS:** **60%** de desconto em mensalidades de cursos presenciais (exceto Medicina) para colaboradores da PMPE; EAD com desconto negociado separadamente.
- **IASSEPE/HSE:** cursos e treinamentos oferecidos à equipe (sem percentual/valor).

##### 8. Indicadores e fórmulas

| Indicador | Valor exibido | Fórmula/regra no código | Automático ou fixo | Registros |
| :--- | :--- | :--- | :--- | :--- |
| Vigentes (KPI hero) | **14** | `conveniosData.filter(r => r.status === 'vigente').length` (l.122) | **Automático** | status exato `vigente` |
| Em renovação (KPI hero) | **6** | `filter(r => r.status.includes('renovar'))` (l.123) | **Automático** | 3,5,7,8,17,21 (inclui `urgente renovar`) |
| Urgentes (KPI hero) | **3** | `filter(r => r.status.includes('urgente'))` (l.124) | **Automático** | 7,8,9 |
| Total de convênios | **21** | `conveniosData.length` (l.288, 308) | **Automático** | todos |
| Badge "21" da sub-sidebar | 21 | literal `21` (l.207) | **Fixo** | — |
| Chips de filtro | Todos 21 · Vigente 14 · Renovação 6 · Urgente 3 | reutilizam os KPIs (l.406); cp/nocp **sem contagem** | Automático | — |
| Filtro da tabela | varia | `filteredConvenios` com `includes()`/igualdade (l.127-137) | Automático | — |
| % do donut/barras | 66,7% / 28,6% / 14,3% | `(kpi/21)*100` com **divisor fixo 21** (l.301-332) | Automático (divisor fixo) | todos |
| Legenda do donut | 11 (52%) / 10 (48%) cp vs nocp | **Texto fixo** (l.311-312) — invertido vs dados (10/11) | **Fixo** | — |
| "Convênios com contrapartida" | 10 | literal (l.460) | **Fixo** (coincide com dados) | — |
| Chip "11 convênios" (obrigações) | 11 | literal (l.644) | **Fixo** (diverge: cp = 10) | — |
| Distribuição contrapartidas | 4 (40%) · 3 (28%) · 3 (28%) · 1 (14%) | array fixo l.361-365 (soma = 11; % soma 110%) | **Fixo** | — |
| Cobertura de cursos (dashboard) | 19/17/15/13/11 | array fixo l.376-381 | **Fixo** | — |
| Cobertura de cursos (view) | 19/17/14/12/11/10/9/9/7/6/5/4/3/2/2/2 | array fixo l.585-590 | **Fixo** | — |
| Status dot/label | Vigente/Urgente/Verificar/Em renovação | `statusDot` e `statusLabel` (l.153-166) | Automático (por string) | — |
| KPIs da faixa Contrapartidas | R$ 36k · 10 · R$ 2k · 60% | literais (l.459-462) | **Fixo** | — |
| HARF: 75 / 13 / R$ 0 / cotas 8·23·44 | literais (l.706-708, 723) | 10% de 75 = 8 (arred.), 30% = 23, gerais 44 (8+23+44 = 75 ✓) | **Fixo** | — |

⚠️ Sobreposição: IDs 7 e 8 entram **ao mesmo tempo** em "Em renovação" (6) e "Urgentes" (3); 14 + 6 + 3 = 23 > 21, por isso os segmentos do donut somam mais que 100% do círculo.

##### 9. Dados dos gráficos

| Gráfico | Fonte | Cálculo |
| :--- | :--- | :--- |
| Donut "Distribuição por Status" (SVG, l.297-309) | `kpiVigente/kpiRenovar/kpiUrgente` | `strokeDasharray = (kpi/21)*219.9` (circunferência 2π·35 = 219.9); offsets encadeados; centro = `conveniosData.length` |
| Barras de breakdown (l.316-335) | mesmos KPIs | `width = (kpi/21)*100%` |
| Legenda cp/nocp (l.311-312) | texto fixo | sem cálculo (valores invertidos) |
| Barra de urgência (l.340-350) | texto fixo | Assoc. Evangélica "Vencimento 2026" · Santa Casa "Set/2026 · ~3 meses" · Santa Joana "2026 · 24 vagas · R$ 4.500/vaga/mês" |
| Painel "Contrapartidas por tipo" (l.361-365) | array fixo | Financeira 4/40% · Bolsas-Descontos 3/28% · Serviços 3/28% · Vagas EAD 1/14% |
| Painel "Cobertura de cursos" (l.376-381) | array fixo | 19/90% · 17/80% · 15/70% · 13/60% · 11/50% |
| Cobertura view Cursos (l.585-594) | array fixo | 16 linhas com `v` e `pct` independentes (sem relação com `conveniosData`) |
| Cotas HARF (l.723-727) | array fixo | 75 (100%) · 8 PcD (10%) · 23 negros (30%) · 44 gerais (60%) |

##### 10. Dados do Gantt

Fonte: `ganttData` (l.12-34) — **array paralelo e independente** de `conveniosData` (alterar a vigência na tabela **não** altera o Gantt, e vice-versa).

| # | Convênio (name) | sub | start | end | cor |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Município de Olinda | 10 anos · 2022–2032 | 2022 | 2032 | #059669 |
| 2 | HMG / HMJ | desde 2016 | 2023 | 2028 | #059669 |
| 3 | Hosp. Memorial Agreste | 10 anos · Caruaru | 2023 | 2033 | #059669 |
| 4 | Município de Paulista | 6 anos · 2021–2027 | 2021 | 2027 | #059669 |
| 5 | Município de Camaragibe | 6 anos · 2021–2027 | 2021 | 2027 | #059669 |
| 6 | Município de Jaboatão | 5 anos · 2022–2027 | 2022 | 2027 | #059669 |
| 7 | SES-PE | Bolsas 10%/7,5% · 336 vagas | 2023 | 2028 | #2563EB |
| 8 | IASSEPE / HSE | Set/2025 – Set/2029 | 2025.67 | 2029.67 | #059669 |
| 9 | Fundação Altino Ventura | 2 anos · 2025–2027 | 2025 | 2027 | #059669 |
| 10 | APAE-SER | Nov/2025 – Nov/2027 | 2025.83 | 2027.83 | #2563EB |
| 11 | Pref. São Lourenço da Mata | Vencido · Fev/2021–Fev/2025 | 2021.12 | 2025.12 | #D97706 |
| 12 | FMS São Lourenço da Mata | 10 bolsas integrais · 9 cursos · 176 vagas | 2025.92 | 2030.92 | #2563EB |
| 13 | HCP – Câncer de PE | 1º Aditivo · Venc. 21/05/2026 | 2024.38 | 2026.38 | #F59E0B |
| 14 | HARF – Aeronáutica | Edital 01/2025 · 75 vagas/sem. | 2026.45 | 2028.45 | #059669 |
| 15 | Irmandade Santa Casa | Vence Set/2026 — URGENTE | 2023 | 2026.75 | #DC2626 |
| 16 | Hosp. Santa Joana | Vence 2026 · 24 vagas Medicina | 2024 | 2026.5 | #DC2626 |
| 17 | Assoc. Evangélica Benfeit. | Vence 2026 — verificar | 2024 | 2026 | #DC2626 |
| 18 | Município de Recife | Em formalização · SESAU out/2024 | 2025 | 2027 | #9CA3AF |
| 19 | FEAPAES-PE | Em tramitação · nov/2025 | 2025 | 2027 | #9CA3AF |
| 20 | Hapvida – Assist. Médica | R$ 3.300/aluno · 37 vagas · 2026.1–2027.1 | 2026.0 | 2027.5 | #059669 |
| 21 | Fundação CAS – PMPE | Jan/2026 – Jan/2031 · 5 anos | 2026.05 | 2031.05 | #059669 |

- **Cores (valores fixos, não derivados de `status`):** `#059669` verde = vigente (11 barras) · `#2563EB` azul = com contrapartida (3) · `#D97706` âmbar = vencido (1) · `#F59E0B` âmbar claro = HCP (1) · `#DC2626` vermelho = urgente (3) · `#9CA3AF` cinza = em formalização/tramitação (2).
- **Posicionamento (l.62-104):** grid fixo `YEAR_START = 2023`, 8 colunas (2023…2030, rótulo da última = "2030+"); por célula: `segStart = max(start, ano)`, `segEnd = min(end, ano+1)`, `left% = (segStart-ano)×100`, `width% = (segEnd-segStart)×100`, barra renderizada só se `segEnd > segStart`.
- **Efeito de mudança de vigência:** alterar `start/end` **apenas nesta constante** reposiciona a barra; não afeta KPIs, tabela, donut nem filtros. Vigências anteriores a 2023 e posteriores a 2031 são **visualmente cortadas** pela grade (ex.: Olinda 2032, Memorial 2033, CAS 2031.05 terminam na última coluna).
- **Título da seção:** "Vigências · Linha do Tempo 2023–2033" (l.353) — o grid real vai até 2030+.

##### 11. Origem de cada informação

| Informação | Arquivo · constante/faixa | Consumido por |
| :--- | :--- | :--- |
| 21 convênios (tabela) | `src/components/ConveniosModule.tsx` · `conveniosData` (l.37-59) | KPIs (l.122-124), filtros (l.127-137), view Todos (l.423), donut/barras (l.301-332), badge implicit via `.length` |
| 21 barras do Gantt | idem · `ganttData` (l.12-34) | `<GanttChart />` (l.62-113) |
| KPIs/fórmulas | `useMemo` l.122-124 | hero (l.276-288), chips (l.406), donut, barras |
| Status label/dot | `statusDot`/`statusLabel` (l.153-166) | tabela (l.429) |
| Views Contrapartidas/Cursos/Obrigações/HARF | **JSX fixo** (l.456-751) | essas 4 views |
| CSS `cm-*` | `convenioCss` (l.758-961), injetado via `useEffect` (l.140-151) | todo o módulo |
| Montagem/rota | `src/App.tsx:166-168` (`<ConveniosModule />` sem props) | — |
| Item de menu | `src/components/Sidebar.tsx:66-79` | navegação |
| Tipos | `src/types.ts` — **sem** interface Convenio | — |

**Confirmação de fonte:** dados **diretamente no código** (constantes de módulo + JSX). **Não** há arquivo de dados separado, **não** há localStorage, **não** há Supabase, **não** há outra fonte.

##### 12. Identificação clara dos dados simulados

**Todos os números deste mapa são simulados/fixos**, exceto os KPIs e filtros automaticamente derivados dos mocks (item 8). Não existe nenhum dado real de contrato persistido ou recebido por integração. Blocos 100% hardcoded: toda a view Contrapartidas (inclusive CNPJs, endereços e dados bancários), Cursos, Obrigações, HARF, barra de urgência, painéis de distribuição, legendas e o próprio `ganttData`.

##### 13. Campos que podem ser atualizados com dados reais

Cada registro de `conveniosData` aceita atualização pontual de: `nome`, `sub` (CNPJ/chamado/assinatura), `status`, `cp`, `vigencia`, `anos`, `cursos[]`, `vagas`, `contrapartida`, `urgente` — e, de forma associada (mas independente), `start/end/color` em `ganttData`. Nas views fixas: valores financeiros, breakdowns de vagas, cotas e datas nas linhas 456-751. **Campos inexistentes** hoje (não há onde gravar sem alterar código/tipos): razão social estruturada, CNPJ próprio, município/UF, endereço, tipo de instrumento, número de contrato, objeto, datas tipadas, anexos, observações, responsáveis, nº de aditivo, histórico e auditoria.

##### 14. Riscos de alterar um número sem atualizar os totais relacionados

1. **`conveniosData` × `ganttData`:** mudar vigência/tabela sem mover `start/end` desalinha a linha do tempo (e vice-versa) — fontes independentes.
2. **KPIs vs divisor fixo 21:** os KPIs são automáticos, mas o donut/barras usam `21` literal (l.301-332) — incluir/remover registros quebra as proporções; além disso os segmentos (14+6+3) já somam 23/21 > 100%.
3. **Badge "21" fixo** (l.207) e **chip "11 convênios"** (l.644) não acompanham mudanças de `conveniosData`.
4. **Legenda do donut** (l.311-312) já divergente dos dados (11/10 vs 10/11) — alterar `cp` de um registro aprofunda a divergência.
5. **Painéis de distribuição/cobertura** são arrays literais: mudar um convênio (ex.: novo com contrapartida, novo curso) não os atualiza (4+3+3+1 = 11 e Fisioterapia 15 vs 14 já são exemplos).
6. **Redundância de valores:** cada R$ aparece em 2-4 lugares (tabela, view Contrapartidas, Obrigações, urgência) — ex.: R$ 4.500/vaga em l.45, 509, 650, 347; R$ 36.242,46 em l.42, 490, 494, 648, 606.
7. **Sobreposição renovar/urgente:** alterar `status` pode inflar duplamente os KPIs 6 e 3.
8. **Breakdowns fixos** (SES 336, Santa Joana 24, FMS 10 bolsas) têm soma conferida — alterar o total sem ajustar os componentes quebra a aritmética visível.

---

### 5.4 Módulos Futuros: Clínica-Escola & Internato

1. **Clínica-Escola (`D:\PROJETOS\clinica-escola`):** Sistema com agendamento de consultas da comunidade, prontuários eletrônicos de pacientes, triagem multiprofissional e validação de relatórios clínicos pelos preceptores.
2. **Internato & Rodízios Médicos:** Gestão centralizada do ciclo de rotação dos alunos pelos 5 grandes eixos do internato (Clínica Médica, Cirurgia, Ginecologia e Obstetrícia, Pediatria e Saúde Coletiva).

---

## 6. Engenharia de Dados & Schemas

### 6.1 Tipos Principais no Frontend (`src/types.ts`)

```typescript
export type ModuleId = 'home' | 'preceptores' | 'simulamed' | 'convenios';

export interface Preceptor {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  email: string;
  telefone: string;
  status: 'Ativo' | 'Pendente' | 'Inativo';
  hospitalPrincipal: string;
  disciplinasVinculadas: string[];
  camposVinculados: string[];
  valorHora: number;
  dataAdmissao: string;
}

export interface Escala {
  id: string;
  preceptorId: string;
  preceptorNome: string;
  hospitalId: string;
  hospitalNome: string;
  disciplinaId: string;
  disciplinaNome: string;
  campoId: string;
  campoNome: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  status: 'Pendente' | 'Confirmada' | 'Cancelada';
}

export interface ConvenioData {
  id: number;
  nome: string;
  sub: string;
  status: 'vigente' | 'renovar' | 'urgente';
  cp: 'cp' | 'nocp';
  vigencia: string;
  anos: string;
  cursos: { l: string; c: string }[];
  vagas: string;
  contrapartida: string;
  urgente: boolean;
}
```

### 6.2 Principais Tabelas do Supabase (`tdmrscavrdoekrzdlmpf`)

| Tabela | Função / Conteúdo |
| :--- | :--- |
| `preceptores` | Registro do médico preceptor (nome, CRM, telefone, e-mail, tipo_chave_pix, chave_pix, dados PJ) |
| `preceptor_emails_copia` | E-mails adicionais de cópia (Cc) para cada preceptor |
| `vinculos_internato` | Vínculos de cada preceptor com hospitais, disciplinas, saldo semestral e valor da hora |
| `escalas` | Cabeçalho das escalas periódicas |
| `escalas_itens` | Turnos específicos da escala (data, horário, turno, preceptor_id, setor_id) |
| `setores` | Setores e alas hospitalares credenciadas |
| `presencas` | Registro de presença com data/hora, geolocalização e método (token mobile vs coordenador) |
| `calculos_financeiros` | Fila financeira com cálculos por competência, deduções, status e valores liquidados |
| `pagamentos_lote` | Histórico dos lotes de pagamento aprovados |
| `audit_logs` | Trilha de auditoria completa de todas as inserções, alterações e exclusões |

---

## 7. Plano de Integração Passo a Passo

O roteiro oficial para unificar o sistema sem quebras está estruturado em 5 fases:

```
FASE 1: INFRAESTRUTURA
  ├── Instalar @supabase/supabase-js, jspdf, jspdf-autotable
  ├── Configurar tsconfig.json com "allowJs": true
  └── Configurar .env com URL e Chave Anon do Supabase

FASE 2: MIGRAÇÃO DOS SERVIÇOS & TELAS
  ├── Criar src/modules/preceptoria/
  ├── Copiar queries.js, xlsx.js e supabase.js
  ├── Copiar RegistroPresencaToken.jsx para rota mobile
  └── Encapsular styles.css (215KB) sob .preceptoria-module-root

FASE 3: ROTEAMENTO MESTRE & ACESSO MOBILE
  ├── Tratar rota /p/:token no App.tsx para renderizar tela cheia sem Sidebar
  └── Carregar PreceptoriaModule dentro da área principal para rotas administrativas

FASE 4: CENTRALIZAÇÃO DA NAVEGAÇÃO & PERMISSÕES
  ├── Conectar Sidebar.tsx com sub-menus reais de Preceptoria
  └── Configurar controle de papéis (Admin, Coordenador, Visualizador)

FASE 5: HOMOLOGAÇÃO & DEPLOY
  ├── npm run lint & npm run build
  └── Validação ponta a ponta: presença móvel, bloqueio de conflitos e pagamento em lote
```

---

## 8. Diretrizes de Implementação para a IA Parceira

Ao trabalhar neste código, qualquer IA ou desenvolvedor deve seguir rigorosamente os princípios abaixo:

1. **Preservar a integridade das 40 RPCs do Supabase:**  
   As RPCs em PostgreSQL (`tdmrscavrdoekrzdlmpf`) controlam regras financeiras críticas, lotes de pagamento e bloqueios de escala. **Não altere nomes de parâmetros nem assinaturas de funções no backend sem consultar o changelog oficial.**
2. **Isolamento de Estilos:**  
   O `ecomed_bv` utiliza **Tailwind CSS v4**. O sistema de preceptoria original possui um `styles.css` de 215KB. Jamais importe o `styles.css` de forma global no `main.tsx`, pois ele sobrescreverá resets de fonte e botões do Tailwind. Sempre mantenha-o contido dentro do módulo de preceptoria.
3. **Respeito à Rota Pública Mobile:**  
   O endereço `/p/:token` é acessado diariamente por médicos nos corredores dos hospitais. Essa tela deve carregar instantaneamente, sem exigir login no portal e sem renderizar a barra lateral nem o rodapé do ecossistema.
4. **Mantenha os Dados de Convênios Atualizados:**  
   O contrato Hapvida deve permanecer sincronizado conforme os dados do **Chamado 16.902.214** (37 vagas em Cirurgia, Pediatria e Urgência a R$ 3.300/aluno, total R$ 122.100/semestre na Unidade Baixa Verde).
5. **Código Limpo e TypeScript Progressivo:**  
   Novos componentes devem ser criados em TypeScript (`.tsx`). Ao refatorar componentes existentes do monólito de 7.6k linhas da preceptoria, extraia subcomponentes progressivamente para `src/modules/preceptoria/components/`.

---

*Fim do Dossiê · UNINASSAU Medicina · Todos os direitos reservados.*
