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
