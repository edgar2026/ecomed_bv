# 📚 Documentação do Sistema — Ecossistema Integrado de Medicina
### UNINASSAU · Holding Ser Educacional · Versão Executiva 2026

> **Última atualização:** Julho/2026  
> **Responsável técnico:** Hesdras Viana (Diretor de Unidade · UNINASSAU Boa Viagem)  
> **Status geral do projeto:** ✅ Produção — 3 módulos ativos

---

## 📋 Índice

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Estrutura de Arquivos](#3-estrutura-de-arquivos)
4. [Arquitetura do Sistema](#4-arquitetura-do-sistema)
5. [Módulos Ativos](#5-módulos-ativos)
   - [5.1 Gestão de Preceptoria](#51-gestão-de-preceptoria)
   - [5.2 SimulaMed](#52-simulamed)
   - [5.3 Convênios](#53-convênios)
6. [Tipos de Dados (TypeScript)](#6-tipos-de-dados-typescript)
7. [Mock Data (Dados de Demonstração)](#7-mock-data-dados-de-demonstração)
8. [Design System](#8-design-system)
9. [Componentes da UI](#9-componentes-da-ui)
10. [Roadmap de Expansão](#10-roadmap-de-expansão)
11. [Sub-módulos em Desenvolvimento](#11-sub-módulos-em-desenvolvimento)
12. [Configuração & Setup](#12-configuração--setup)
13. [Convenções de Código](#13-convenções-de-código)

---

## 1. Visão Geral do Sistema

O **Ecossistema Integrado de Medicina** é uma plataforma web SPA (Single Page Application) desenvolvida para a **UNINASSAU Boa Viagem** como centro unificado de operações do curso de Medicina. Ele consolida em uma única interface três grandes vertentes operacionais:

| Módulo | Descrição | Status |
|--------|-----------|--------|
| **Gestão de Preceptoria** | Controle total dos médicos preceptores, escalas, faturamentos, NF/RPA, chamados e saldos orçamentários | ✅ Ativo |
| **SimulaMed** | Acompanhamento individual de alunos internos na preparação para o ENAMED — simulados, rankings, orientadores | ✅ Ativo |
| **Convênios** | Painel institucional com todos os 21 convênios de estágio da unidade — vigências, contrapartidas, Gantt e alertas | ✅ Ativo |

### Contexto Institucional
- **Instituição:** UNINASSAU (Grupo Ser Educacional)
- **Unidade:** Boa Viagem, Recife-PE
- **Usuário principal:** Hesdras Viana — Diretor de Unidade
- **Contato suporte:** contato@sereducacional.com
- **URL de execução local:** `http://localhost:3000`

---

## 2. Stack Tecnológica

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| **Framework UI** | React | ^19.0.1 |
| **Linguagem** | TypeScript | ~5.8.2 |
| **Bundler** | Vite | ^6.2.3 |
| **Estilização** | TailwindCSS v4 (via `@tailwindcss/vite`) | ^4.1.14 |
| **Ícones** | Lucide React | ^0.546.0 |
| **Animações** | Motion (Framer Motion fork) | ^12.23.24 |
| **IA (integração futura)** | @google/genai | ^2.4.0 |
| **Servidor (futuro)** | Express.js | ^4.21.2 |
| **Env vars** | dotenv | ^17.2.3 |
| **Fontes** | Inter, Outfit (Google Fonts) | — |

### Scripts disponíveis

```bash
npm run dev       # Inicia servidor de desenvolvimento em localhost:3000
npm run build     # Build de produção (dist/)
npm run preview   # Prévia do build de produção
npm run lint      # Verifica erros TypeScript (tsc --noEmit)
npm run clean     # Remove dist/ e server.js
```

---

## 3. Estrutura de Arquivos

```
ecossistema-de-medicina/
├── index.html                        # HTML raiz (ponto de entrada do Vite)
├── vite.config.ts                    # Configuração do Vite + TailwindCSS + React
├── tsconfig.json                     # Configuração TypeScript
├── package.json                      # Dependências e scripts
├── .env.example                      # Variáveis de ambiente (template)
├── .gitignore
├── README.md                         # README básico inicial
├── DOCUMENTACAO_SISTEMA.md           # Este arquivo
│
├── assets/                           # Assets estáticos
│   ├── uninassau_logo_white.png      # Logo branca para sidebar
│   └── uninassau_favicon.png         # Ícone da aba do navegador
│
├── public/                           # Arquivos públicos (copiados para dist/)
│   └── uninassau_logo_white.png      # Referenciado no Sidebar como /uninassau_logo_white.png
│
├── convenios_uninassau_minimal.html  # Versão standalone HTML do módulo Convênios
│                                     # (arquivo legado/referência visual)
│
└── src/
    ├── main.tsx                      # Ponto de entrada React (ReactDOM.createRoot)
    ├── App.tsx                       # Componente raiz — gerencia estado global + roteamento
    ├── types.ts                      # Todos os tipos TypeScript do domínio
    ├── data.ts                       # Mock data inicial para todos os módulos
    ├── index.css                     # Design system (tema Tailwind + variáveis CSS)
    │
    ├── components/                   # Componentes de página e UI
    │   ├── Header.tsx                # Header fixo com breadcrumb, busca e perfil
    │   ├── Sidebar.tsx               # Sidebar fixa com navegação principal
    │   ├── HomeModule.tsx            # Tela inicial / dashboard geral
    │   ├── EmDesenvolvimento.tsx     # Card de "Módulo em Desenvolvimento" (placeholder)
    │   │
    │   ├── PreceptoresModule.tsx     # Router do módulo Preceptoria (8 sub-páginas)
    │   ├── PreceptoresDashboard.tsx  # Dashboard analítico de Preceptoria (sub-página 1)
    │   ├── EscalasModule.tsx         # Gestão de escalas (sub-componente de Preceptoria)
    │   ├── HospitaisModule.tsx       # Gestão de hospitais (sub-componente, não roteado)
    │   ├── DisciplinasModule.tsx     # Gestão de disciplinas (sub-componente, não roteado)
    │   ├── PagamentosModule.tsx      # Faturamentos/pagamentos (sub-componente)
    │   ├── SolicitacoesModule.tsx    # NF/RPA solicitações (sub-componente)
    │   ├── ChamadosSaldoModule.tsx   # Chamados orçamentários (sub-componente)
    │   ├── ControleSaldosModule.tsx  # Controle de saldos (sub-componente)
    │   │
    │   ├── SimulaMedModule.tsx       # Módulo SimulaMed completo (dashboard único)
    │   └── ConveniosModule.tsx       # Módulo Convênios completo (dashboard único)
    │
    └── data/
        ├── preceptoriaData.ts        # Dados financeiros de internato e práticas (2026)
        └── simulamedData.ts          # Dados de alunos do ENAMED (CSV inline parseado)
```

---

## 4. Arquitetura do Sistema

### Padrão de Roteamento

O sistema utiliza roteamento **client-side por estado React** — não usa `react-router-dom`. A navegação é controlada por dois estados globais em `App.tsx`:

```typescript
const [activeModule, setActiveModule] = useState<ModuleId>('home');
const [activeSubPage, setActiveSubPage] = useState<string>('dashboard');
```

#### Fluxo de Navegação

```
Sidebar (click no módulo)
  └─> setActiveModule('preceptores')
      └─> setActiveSubPage('dashboard')
          └─> App.tsx renderiza <PreceptoresModule>
              └─> PreceptoresModule renderiza sub-páginas por activeTab
```

### Módulos disponíveis (`ModuleId`)

```typescript
type ModuleId = 'home' | 'preceptores' | 'simulamed' | 'convenios';
```

### Gerenciamento de Estado

Todo o estado é gerenciado em `App.tsx` com `useState` e repassado via **props drilling** para os módulos filhos. Não há uso de Context API, Redux ou Zustand nesta versão.

**Estados globais em `App.tsx`:**

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `activeModule` | `ModuleId` | Módulo ativo na navegação |
| `activeSubPage` | `string` | Sub-página ativa dentro do módulo |
| `searchTerm` | `string` | Termo de busca global |
| `preceptors` | `Preceptor[]` | Lista de preceptores |
| `hospitals` | `Hospital[]` | Lista de hospitais |
| `campos` | `CampoEstagio[]` | Campos de estágio |
| `disciplines` | `Disciplina[]` | Disciplinas |
| `scales` | `Escala[]` | Escalas de preceptoria |
| `financialRecords` | `FinanceiroRecord[]` | Registros financeiros |
| `solicitacoes` | `Solicitacao[]` | Solicitações NF/RPA |
| `payments` | `Pagamento[]` | Pagamentos |
| `chamados` | `ChamadoSaldo[]` | Chamados de saldo |
| `saldos` | `ControleSaldo[]` | Controle de saldos |
| `isNewScaleOpen` | `boolean` | Modal de nova escala |

---

## 5. Módulos Ativos

### 5.1 Gestão de Preceptoria

**Componente principal:** [`PreceptoresModule.tsx`](file:///d:/PROJETOS/ecossistema-de-medicina/src/components/PreceptoresModule.tsx)  
**Dashboard analítico:** [`PreceptoresDashboard.tsx`](file:///d:/PROJETOS/ecossistema-de-medicina/src/components/PreceptoresDashboard.tsx)

#### Sub-páginas do Módulo de Preceptoria

O módulo tem 8 sub-páginas, roteadas internamente por `activeTab`:

| ID | Label | Componente | Status |
|----|-------|-----------|--------|
| `dashboard` | Dashboard | `PreceptoresDashboard` | ✅ Ativo |
| `lista` | Cadastro & Lista | `EmDesenvolvimento` | 🔒 Q3/2026 |
| `escalas` | Escalas | `EmDesenvolvimento` | 🔒 Q3/2026 |
| `pagamentos` | Pagamentos | `EmDesenvolvimento` | 🔒 Q4/2026 |
| `nf_rpa` | NF / RPA | `EmDesenvolvimento` | 🔒 Q4/2026 |
| `processos` | Processos & Chamados | `EmDesenvolvimento` | 🔒 Q1/2027 |
| `saldos` | Controle de Saldos | `EmDesenvolvimento` | 🔒 Q1/2027 |
| `relatorios` | Relatórios | `EmDesenvolvimento` | 🔒 Q2/2027 |

> **Nota:** A Sidebar atual exibe apenas o módulo pai sem sub-menus. As sub-páginas são acessadas via tabs internas dentro do `PreceptoresModule`. A estrutura de sub-páginas está preservada em `MODULES` no `Sidebar.tsx` para ativação futura.

#### Dashboard de Preceptoria (`PreceptoresDashboard`)

O dashboard é o componente mais complexo do sistema (**1491 linhas**, **82KB**). Possui 6 abas analíticas:

| Aba | ID | Descrição |
|-----|----|-----------|
| Visão Geral | `geral` | KPIs gerais de custo total, breakdown internato vs práticas |
| Por Período | `periodos` | Análise financeira por período acadêmico |
| Atividades Práticas | `praticas` | Tabela detalhada com busca e filtros das práticas |
| Internato | `internato` | Tabela de valores do internato por disciplina e mês |
| Comparativo | `comparativo` | Comparação mensal entre internato e práticas |
| Qualidade | `qualidade` | Indicadores de conformidade e satisfação |

**Dados utilizados:** [`src/data/preceptoriaData.ts`](file:///d:/PROJETOS/ecossistema-de-medicina/src/data/preceptoriaData.ts)
- Meses cobertos: **Fevereiro a Julho de 2026**
- Estruturas: `internato[]` e `praticas[]` (arrays de `PreceptoriaRecord`)
- `textCells[]` para registros de status textual (ex.: "NÃO PAGA")

**KPIs computados dinamicamente:**
- Total geral de custos (Internato + Práticas)
- Total por mês
- % de participação por disciplina
- Taxas de conformidade e pagamento

#### Modal Global de Nova Escala

Existe um modal flutuante em `App.tsx` (`isNewScaleOpen`) para criação rápida de escalas, com:
- Seleção de Preceptor, Hospital, Campo de Estágio, Disciplina
- Data, Hora de início e Hora de fim
- Ao salvar, redireciona para `preceptores > escalas`

---

### 5.2 SimulaMed

**Componente:** [`SimulaMedModule.tsx`](file:///d:/PROJETOS/ecossistema-de-medicina/src/components/SimulaMedModule.tsx)  
**Dados:** [`src/data/simulamedData.ts`](file:///d:/PROJETOS/ecossistema-de-medicina/src/data/simulamedData.ts)

#### Funcionalidades

O módulo exibe um dashboard único (sub-navegação travada em `dashboard`). Contém:

1. **Tabela paginada de alunos** — 10 por página, com sort por nome, média ou período
2. **Filtros dinâmicos** — Período, Categoria de desempenho, Orientador
3. **Busca full-text** — por nome do aluno
4. **KPIs de cabeçalho** — Total de alunos, média geral, proficientes, alertas
5. **Modal de detalhes do aluno** — histórico de simulados, contato, orientador, plataforma, feedback

#### Estrutura de dados do aluno (`AlunoSimulaMed`)

```typescript
interface AlunoSimulaMed {
  nome: string;
  periodo: string;       // "10º" ou "11º"
  s1: string;            // Nota Simulado 1
  s2: string;            // Nota Simulado 2
  s3: string;            // Nota Simulado 3
  rep: string;           // Nota de reposição
  s4: string;            // Nota Simulado 4
  media: number | null;  // Média calculada
  categoria: string;     // "Proficiente", "Semi Proficiente", "Não Proficiente +/−", "Alerta Máximo", etc.
  telefone: string;
  orientador: string;
  plataforma: string;    // "MEDCOF", "PAPO DE RESIDÊNCIA", "EU MÉDICO RESIDENTE", etc.
  contato: string;       // "SIM" / "NÃO" / vazio
  feedback: string;      // Observações do orientador
}
```

#### Categorias de desempenho

| Categoria | Significado |
|-----------|------------|
| `Proficiente` | Média ≥ 65 |
| `Semi Proficiente` | Média ~58–64 |
| `Não Proficiente +` | Média ~53–57 |
| `Não Proficiente -` | Média ~48–52 |
| `Alerta Máximo` | Média < 48 |
| `Sem possibilidade de acompanhamento` | Não realizou simulados |

#### Orientadores cadastrados

- Pablo Gualberto
- Lívia Bandeira
- Heytor Neco
- Maria da Conceição
- Fábio Fidelis
- Karla Melo
- Andréa Apolinário / Andréa Gomes
- Jorge Luiz

---

### 5.3 Convênios

**Componente:** [`ConveniosModule.tsx`](file:///d:/PROJETOS/ecossistema-de-medicina/src/components/ConveniosModule.tsx)  
**Linhas:** 944 | **Tamanho:** ~71KB

#### Funcionalidades

O módulo tem **6 abas internas** (roteamento por tabs dentro do componente):

| Aba | ID | Descrição |
|-----|----|-----------|
| Dashboard | `dashboard` | Resumo geral com KPIs e ações urgentes |
| Todos Convênios | `todos` | Tabela completa dos 21 convênios com filtros |
| Contrapartidas | `contrapartidas` | Detalhamento financeiro das contrapartidas |
| Cursos & Vagas | `cursos` | Distribuição de vagas por curso |
| Obrigações | `obrigacoes` | Controle de obrigações e vencimentos |
| Destaque: HARF | `harf` | Aba especial para o Hospital de Aeronáutica de Recife |

#### Dados dos 21 Convênios

Os 21 convênios estão embutidos diretamente no componente como constante `conveniosData[]`. Situação atual:

**✅ Vigentes (ativos):**
- HARF – Hospital de Aeronáutica de Recife (Jun/2026–Jun/2028)
- Fundação CAS – PMPE (Jan/2026–Jan/2031)
- Fundo Municipal de Saúde – São Lourenço (Dez/2025–Dez/2030)
- IASSEPE / HSE (Set/2025–Set/2029)
- APAE-SER (Nov/2025–Nov/2027)
- SES-PE (Jul/2023–Jul/2028)
- Município de Paulista, Camaragibe, Jaboatão, Olinda (2021–2027)
- HMG e HMJ – Hospitais Maternidade (desde 2016)
- Hospital Memorial do Agreste – Caruaru (2023–2033)
- Fundação Altino Ventura (2025–2027)
- Hapvida (Nov/2025–Nov/2027)

**🔴 URGENTE – Vence em 2026:**
- Irmandade da Santa Casa de Misericórdia (~3 meses restantes)
- Hospital Santa Joana (2026)
- Associação Evangélica Beneficente (2026)
- HCP – Hospital de Câncer de PE (21/05/2026 – em 2ª renovação)

**🟡 Em Renovação / Formalização:**
- Prefeitura de São Lourenço da Mata (vencido Fev/2025)
- Município de Recife (em formalização, SESAU out/2024)
- FEAPAES-PE (em tramitação)

#### Gantt de Vigências

O componente `GanttChart` (embutido no `ConveniosModule`) exibe visualmente os 21 convênios em linha do tempo de 2023 a 2030+. Cada barra tem cor conforme status:

| Cor | Significado |
|-----|------------|
| `#059669` (verde) | Vigente, sem urgência |
| `#2563EB` (azul) | Vigente com contrapartida financeira |
| `#F59E0B` (âmbar) | Renovação em andamento |
| `#DC2626` (vermelho) | Urgente — vence em breve |
| `#9CA3AF` (cinza) | Em tramitação / não formalizado |

---

## 6. Tipos de Dados (TypeScript)

Todos os tipos estão em [`src/types.ts`](file:///d:/PROJETOS/ecossistema-de-medicina/src/types.ts):

```typescript
// Identificador dos módulos
type ModuleId = 'home' | 'preceptores' | 'simulamed' | 'convenios';

// Preceptor de Medicina
interface Preceptor {
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
  documentos: { nome: string; status: 'Validado' | 'Pendente' | 'Vencido'; dataEnvio: string }[];
  escalas: { data: string; horaInicio: string; horaFim: string; local: string }[];
  pagamentos: { mes: string; valor: number; status: 'Pago' | 'Pendente' | 'Processando' }[];
  solicitacoes: { id: string; tipo: string; valor: number; data: string; status: string }[];
  historico: { data: string; acao: string; usuario: string }[];
}

// Hospital parceiro
interface Hospital {
  id: string;
  nome: string;
  cidade: string;
  capacidadeAlunos: number;
  ocupacaoAtual: number;
  status: 'Ativo' | 'Revisão' | 'Inativo';
  especialidades: string[];
  camposEstagio: string[];
  preceptoresAlocados: string[];
  disciplinasOferecidas: string[];
  contratoNumero: string;
  contratoVencimento: string;
  valorMensal: number;
  convenioStatus: 'Vigente' | 'Expirado' | 'Em Renovação';
  indicadores: { conformidade: number; avaliacaoAlunos: number; instalacoes: number };
}

// Outros tipos: CampoEstagio, Disciplina, Escala, FinanceiroRecord, Solicitacao,
//               Pagamento, ChamadoSaldo, ControleSaldo
// → Ver src/types.ts para detalhes completos
```

---

## 7. Mock Data (Dados de Demonstração)

### `src/data.ts` — Dados iniciais dos estados globais

Exporta 10 arrays de dados mockados:

| Exportação | Tipo | Qtd. registros |
|-----------|------|----------------|
| `preceptoresInicial` | `Preceptor[]` | ~5 preceptores |
| `hospitaisInicial` | `Hospital[]` | ~4 hospitais |
| `camposInicial` | `CampoEstagio[]` | ~4 campos |
| `disciplinasInicial` | `Disciplina[]` | ~5 disciplinas |
| `escalasInicial` | `Escala[]` | ~5 escalas |
| `financeiroInicial` | `FinanceiroRecord[]` | ~5 registros |
| `solicitacoesInicial` | `Solicitacao[]` | ~3 solicitações |
| `pagamentosInicial` | `Pagamento[]` | ~4 pagamentos |
| `chamadosInicial` | `ChamadoSaldo[]` | ~3 chamados |
| `saldosInicial` | `ControleSaldo[]` | ~3 saldos |

**Preceptores de exemplo:**
- `PR001` — Dr. Roberto Almeida (Cirurgia Geral · R$120/h · Hospital Esperança · Ativo)
- `PR002` — Dra. Camila Moraes (Clínica Médica · R$110/h · Real Hospital Português · Pendente)

### `src/data/preceptoriaData.ts` — Financeiro de Preceptoria 2026

Dados reais financeiros de Fev–Jul 2026:

```typescript
export const months = ["FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO"];
export const monthsP = ["FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO"]; // práticas (5 meses)

// Arrays principais:
export const internato: PreceptoriaRecord[];  // Disciplinas do internato
export const praticas: PreceptoriaRecord[];   // Atividades práticas
export const textCells: TextCellRecord[];     // Células com status textual
```

### `src/data/simulamedData.ts` — Alunos SimulaMed

Dados dos alunos em formato **CSV inline** parseado em runtime pela função `getAlunosSimulaMed()`. Contém aproximadamente **100 alunos** dos períodos 10º e 11º com notas dos simulados S1, S2, S3, S4 e média.

---

## 8. Design System

Definido em [`src/index.css`](file:///d:/PROJETOS/ecossistema-de-medicina/src/index.css) via diretiva `@theme` do TailwindCSS v4.

### Paleta de Cores

| Token | Cor | Uso |
|-------|-----|-----|
| `--color-primary` | `#0f172a` (slate-900) | Sidebar, textos principais |
| `--color-primary-container` | `#1e293b` (slate-800) | Hover na sidebar |
| `--color-secondary` | `#2563eb` (blue-600) | Botões, links, destaques |
| `--color-surface` | `#ffffff` | Fundo de cards |
| `--color-surface-container-low` | `#f8fafc` (slate-50) | Fundo geral da página |
| `--color-error` | `#f43f5e` (rose-500) | Erros e alertas |
| `--color-outline-variant` | `#e2e8f0` (slate-200) | Bordas de cards |

### Tipografia

- **Fonte principal:** `Inter` (pesos 300–800)
- **Fonte display:** `Outfit` (pesos 400–800)
- Carregadas via Google Fonts

### Variáveis de Espaçamento e Sombra

```css
--spacing-sidebar-width: 256px;      /* Largura fixa da Sidebar */
--shadow-level-1 a level-4           /* Sombras progressivas para elevação */
```

### Scrollbar customizada

Scrollbar discreta (6px de largura) com estilo minimalista slate.

---

## 9. Componentes da UI

### `Sidebar.tsx`

- Sidebar fixa (256px) no lado esquerdo
- Exibe logo da UNINASSAU (branca)
- 4 módulos: Home, Gestão de Preceptoria, SimulaMed, Convênios
- Clique no módulo navega diretamente para o dashboard do módulo
- Sub-menus **desabilitados** na UI, mas preservados em código para ativação futura
- Footer com botão de suporte e versão

**Estrutura de dados da sidebar:**
```typescript
const MODULES: ModuleInfo[] = [
  { id: 'home', label: 'Home', icon: Home, subPages: [...] },
  { id: 'preceptores', label: 'Gestão de Preceptoria', icon: GraduationCap, subPages: [...] },
  { id: 'simulamed', label: 'SimulaMed', icon: Sparkles, subPages: [...] },
  { id: 'convenios', label: 'Convênios', icon: Handshake, subPages: [...] }
];
```

### `Header.tsx`

- Header fixo (64px altura) com `marginLeft: 256px` para compensar sidebar
- **Esquerda:** Breadcrumb "Ecossistema de Medicina > Módulo > Sub-página"
- **Direita:** Barra de busca global (>lg), perfil do usuário
- Usuário exibido: Hesdras Viana · Diretor de Unidade · UNINASSAU Boa Viagem
- Notificações mockadas (3 exemplos): Divergência de Saldo, Preceptor Credenciado, RPA Emitido

### `HomeModule.tsx`

- Hero section com gradiente azul-índigo
- Grid 3 colunas com cards de módulos
- Botões de acesso rápido para cada módulo
- Seção de aviso sobre arquitetura de expansão

### `EmDesenvolvimento.tsx`

Componente reutilizável de placeholder para sub-módulos em desenvolvimento. Props:
- `titulo`, `objetivo`, `escopo`
- `recursosPrevistos: string[]`
- `statusAtual`, `roadmap`, `arquitetura`
- `proximasEtapas: string[]`

---

## 10. Roadmap de Expansão

### Módulos Planejados (ainda não no sistema)

| Módulo | Descrição | Previsão |
|--------|-----------|---------|
| **Internato** | Gestão completa do internato médico (9º/10º) | Futuro |
| **Docentes** | Gestão de professores teóricos (não preceptores) | Futuro |
| **Relatórios Corporativos** | BI consolidado multi-unidade | Futuro |
| **Portal do Aluno** | Acesso do aluno ao próprio histórico SimulaMed | Futuro |
| **Portal do Preceptor** | Self-service para médicos (upload de docs, ver escalas) | Futuro |

### Integrações Planejadas

| Integração | Descrição | Previsão |
|------------|-----------|---------|
| **CFM** | Validação automática de CRM | Q3/2026 |
| **Sispag** | Processamento de pagamentos bancários | Q4/2026 |
| **OCR/NFS-e** | Leitura automática de Notas Fiscais | Q4/2026 |
| **Prefeituras** | APIs de emissão de NFS-e | Q4/2026 |
| **ERP Central** | Barramento de processos BPMS | Q1/2027 |
| **Big Data / BI** | Pipeline analítico corporativo | Q2/2027 |

---

## 11. Sub-módulos em Desenvolvimento

Dentro do módulo **Gestão de Preceptoria**, as seguintes sub-páginas estão planejadas:

### 📋 Cadastro & Lista (`lista`) — Q3/2026

**Objetivo:** Gerenciar cadastro unificado de médicos preceptores.

**Recursos planejados:**
- Integração em tempo real com CFM/Portal de Convênios
- Upload seguro de documentos (CRM, Diploma, Especializações)
- Assinatura digital de termos de compromisso

**Arquitetura:** Servidor de arquivos em nuvem com criptografia + banco relacional (LGPD compliant)

---

### 📅 Escalas (`escalas`) — Q3/2026

**Objetivo:** Organização e distribuição inteligente dos rodízios práticos.

**Recursos planejados:**
- Distribuição automatizada por disciplina e ala hospitalar
- Alertas de conflitos de horário e sobrecarga
- Assinatura digital via geolocalização e QR Code

**Arquitetura:** Microsserviço dedicado de agendamento + motor de regras acadêmicas

---

### 💰 Pagamentos (`pagamentos`) — Q4/2026

**Objetivo:** Processamento de honorários para preceptores.

**Recursos planejados:**
- Cálculo automático por valor/hora × horas registradas
- Dedução automática de impostos (conforme regime)
- Histórico de lotes e comprovantes

**Arquitetura:** APIs bancárias com criptografia e tokenização de transações

---

### 🧾 NF / RPA (`nf_rpa`) — Q4/2026

**Objetivo:** Recepção, auditoria e conciliação de Notas Fiscais e RPA.

**Recursos planejados:**
- OCR inteligente para leitura automatizada de NFS-e
- Cálculo de retenções (ISS, INSS, IRRF, PIS/COFINS)
- Painel de conciliação entre escala e documento fiscal

**Arquitetura:** Engine de processamento de documentos com IA

---

### ⚙️ Processos & Chamados (`processos`) — Q1/2027

**Objetivo:** Gestão centralizada de solicitações administrativas e liberação orçamentária.

**Recursos planejados:**
- Controle automático de SLA
- Fluxo de aprovação multinível de verbas (alçadas)
- Notificações push e alertas por e-mail

**Arquitetura:** Engine BPMS integrada ao ERP central

---

### 📊 Controle de Saldos (`saldos`) — Q1/2027

**Objetivo:** Monitoramento rígido de teto orçamentário por hospital/centro de custo.

**Recursos planejados:**
- Monitoramento gráfico em tempo real planejado vs. realizado
- Travas automáticas ao atingir limites de segurança
- Remanejamento flexível de saldos residuais

**Arquitetura:** Módulo analítico + BI financeiro

---

### 📈 Relatórios (`relatorios`) — Q2/2027

**Objetivo:** Geração de insumos estratégicos para tomada de decisões.

**Recursos planejados:**
- Relatórios customizados com filtros multidimensionais
- Visualizador gráfico interativo de custos
- Exportação em PDF, XLSX, CSV

**Arquitetura:** Pipeline de Big Data corporativo

---

## 12. Configuração & Setup

### Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9

### Instalação

```bash
# Clone o projeto
cd d:\PROJETOS\ecossistema-de-medicina

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
# Acesse: http://localhost:3000
```

### Variáveis de Ambiente

Copiar `.env.example` para `.env` e preencher:

```env
# Chave da API Google GenAI (para funcionalidades de IA futuras)
GOOGLE_API_KEY=sua_chave_aqui

# Configurações do servidor Express (futuro backend)
PORT=3001
```

### Observações do Vite

O arquivo `vite.config.ts` inclui suporte especial para ambientes AI Studio:

```typescript
hmr: process.env.DISABLE_HMR !== 'true',      // HMR desabilitado no AI Studio
watch: process.env.DISABLE_HMR === 'true' ? null : {},  // Sem file watching no AI Studio
```

---

## 13. Convenções de Código

### Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `PreceptoresModule` |
| Arquivos de componente | PascalCase.tsx | `ConveniosModule.tsx` |
| Hooks | camelCase com `use` | `useState`, `useMemo` |
| Props interfaces | PascalCase + "Props" | `PreceptoresModuleProps` |
| IDs de dados mock | Prefixo + número | `PR001`, `HP002`, `ESC001` |

### Padrões de Componente

- Todos os componentes usam **functional components** com TypeScript
- Props tipadas com interfaces
- Estado local com `useState` / computações com `useMemo`
- Notificações de feedback: estado `notif: string | null` com `setTimeout` de 2500–3500ms
- Classes CSS: TailwindCSS v4 com tokens personalizados do `@theme`

### Convenções de Dados

- Datas formatadas em `DD/MM/YYYY HH:MM` para históricos
- Datas de input em `YYYY-MM-DD`
- Valores monetários em `number` (float), formatados com `toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })`
- IDs sempre em formato `PREFIXOnnn` (ex.: PR001, HP002, DS003)

### Importações

Ícones exclusivamente de `lucide-react`. Nenhuma outra biblioteca de ícones.

---

## ⚠️ Pontos de Atenção para o Futuro

> [!WARNING]
> **Estado apenas em memória:** Todos os dados são `useState` em `App.tsx`. Qualquer atualização de página recarrega para os dados mockados. A implementação de persistência (API / banco de dados) é o próximo passo crítico.

> [!IMPORTANT]
> **Convênios urgentes:** Irmandade da Santa Casa (~3 meses), Hospital Santa Joana e Associação Evangélica Beneficente **vencem em 2026**. Renovação é prioridade institucional.

> [!NOTE]
> **Sub-menus da Sidebar desabilitados:** Os sub-menus do Sidebar estão comentados na UI mas preservados em código. Para reativá-los, editar o loop de renderização em `Sidebar.tsx` para incluir os sub-pages. A estrutura já está pronta.

> [!TIP]
> **Dados reais de SimulaMed:** O arquivo `simulamedData.ts` contém dados reais de alunos (nomes, telefones, notas). Para produção, esses dados devem ser carregados de API segura, não embutidos no bundle.

> [!CAUTION]
> **Sem autenticação:** O sistema não possui autenticação/autorização. Qualquer usuário com acesso à URL pode ver todos os dados. Implementar autenticação antes de qualquer deploy em ambiente não-controlado.

---

## 📞 Contato e Suporte

| Papel | Nome | Contato |
|-------|------|---------|
| Diretor de Unidade | Hesdras Viana | (via sistema interno) |
| Suporte Técnico | Ser Educacional TI | contato@sereducacional.com |

---

*Documentação gerada em Julho/2026 · Versão Executiva 2026 · UNINASSAU Boa Viagem*
