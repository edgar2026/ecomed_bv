# 🩺 Plano de Arquitetura & Integração — Ecossistema de Medicina

> **Documento Oficial de Transição e Continuidade Técnica**  
> **Data de Criação:** 29 de Outubro de 2026  
> **Status:** Em Planejamento / Execução da Integração  
> **Localização:** `d:\PROJETOS\ecomed_bv\PLANO_INTEGRACAO_ECOSSISTEMA.md`  
> **Objetivo:** Registrar detalhadamente todas as decisões, mapeamentos técnicos, arquitetura e passos de execução para integrar o **Sistema de Preceptoria** ao **Portal Ecossistema de Medicina (`ecomed_bv`)**, garantindo continuidade em caso de reinício ou troca de sessão.

---

## 1. Visão Geral e Contexto do Projeto

O objetivo deste projeto é transformar o **`ecomed_bv`** (atualmente um portal SPA moderno para a UNINASSAU Boa Viagem) em um **Ecossistema Integrado de Medicina**.

Hoje, a solução possui módulos ricos porém divididos em diferentes estágios e pastas no disco:

1. **`ecomed_bv` (Portal Central / Host):**
   - Possui o design moderno (Tailwind CSS v4, React 19, TypeScript, Lucide, Motion).
   - Possui os módulos funcionais **SimulaMed** (preparação ENAMED) e **Convênios** (gestão de 21 contratos hospitalares).
   - O módulo de Preceptoria atual dentro do `ecomed_bv` é apenas uma **versão preliminar / mockup** com dados locais em memória (`src/data/preceptoriaData.ts`).

2. **`sistema-preceptoria` (`D:\PROJETOS\MEDICINA\sistema-preceptoria`):**
   - É o **sistema real de produção** (versão 1.18, atualizada em Outubro/2026).
   - Conectado ao backend **Supabase** (Projeto: `tdmrscavrdoekrzdlmpf`).
   - Contém 27+ tabelas, 40+ RPCs (funções no PostgreSQL), 61 migrações aplicadas e RLS configurado.
   - Regras de negócio completas e homologadas:
     - Gestão de preceptores e múltiplos vínculos acadêmicos.
     - Grade de escalas hospitalares com validação automática de conflitos.
     - Registro de presença mobile via token único (`/p/:token`).
     - Acompanhamento financeiro, saldos orçamentários semestrais e pagamento em lote (RPA/PJ).
     - Integração com Outlook para envio padronizado de e-mails com cópias (Cc).

3. **Demais Projetos Mapeados (Futuros Módulos do Ecossistema):**
   - **Clínica Escola:** `D:\PROJETOS\clinica-escola` (possui backend Supabase próprio e documentação pronta para ser agregada posteriormente).

---

## 2. Diagnóstico Técnico Comparativo

| Componente | ecomed_bv (Host) | sistema-preceptoria (Módulo) | Estratégia de Convergência |
| :--- | :--- | :--- | :--- |
| **Linguagem** | TypeScript (`.ts`, `.tsx`) | JavaScript puro (`.js`, `.jsx`) | Ativar `"allowJs": true` no `tsconfig.json` do host para compilação híbrida sem precisar reescrever 7.6k linhas de imediato. |
| **Estilização** | Tailwind CSS v4 (`@tailwindcss/vite`) | CSS puro legado (`styles.css` ~215KB) | Isolar o CSS de preceptoria com wrapper de classe (`.preceptoria-module-root`) para evitar colisão com o Tailwind. |
| **Backend** | Mock Data local (`data.ts`) | Supabase PostgreSQL + Auth + Edge Functions | Instalar `@supabase/supabase-js` no host e apontar para o projeto `tdmrscavrdoekrzdlmpf`. |
| **Dependências Extras** | `lucide-react`, `motion` | `@supabase/supabase-js`, `jspdf`, `jspdf-autotable` | Adicionar as dependências no `package.json` do `ecomed_bv`. |
| **Rotas Especiais** | Nenhuma rota pública externa | `/p/:token` (Registro de presença de preceptor mobile) | Roteador mestre do host deve interceptar `/p/:token` e renderizar sem Sidebar/Header. |

---

## 3. Decisão de Arquitetura: Abordagem Modular Nativa

A arquitetura adotada é a **Modular Nativa Monolítica no Frontend (Host Shell + Feature Modules)**:

- O **`ecomed_bv`** atua como o **Portal Shell**: gerencia autenticação global, barra lateral única, cabeçalho institucional, controle de perfis de usuário (RBAC) e roteamento de alto nível.
- O código do **`sistema-preceptoria`** passa a residir como um submódulo em `src/modules/preceptoria/`, com sua própria camada de serviços (`queries.js`, `supabase.js`) conectada diretamente ao Supabase.

### Diagrama da Arquitetura:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ECOSSISTEMA INTEGRADO DE MEDICINA                    │
│                               ecomed_bv                                │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │  CORE / SHELL:                                                 │   │
│   │  • Sidebar Unificada (UNINASSAU) • Header com Perfil do Usuário│   │
│   │  • Supabase Auth & Permissões (Admin, Coordenador, etc.)       │   │
│   │  • Roteador Master (inclui rota limpa /p/:token para mobile)   │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│       ┌───────────────────────────┼───────────────────────────┐        │
│       ▼                           ▼                           ▼        │
│ ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐   │
│ │ MÓDULO           │    │ MÓDULO           │    │ MÓDULO           │   │
│ │ PRECEPTORIA      │    │ SIMULAMED        │    │ CONVÊNIOS        │   │
│ │ (Real - Supabase)│    │ (ENAMED)         │    │ (Hospitalares)   │   │
│ └─────────┬────────┘    └──────────────────┘    └──────────────────┘   │
│           │                                                            │
└───────────┼────────────────────────────────────────────────────────────┘
            │
            ▼
┌────────────────────────┐
│ SUPABASE PRODUÇÃO      │
│ Ref: tdmrscavrdoekrzdl │
│ 27+ Tabelas, 40+ RPCs  │
└────────────────────────┘
```

---

## 4. Estrutura de Diretórios Alvo no `ecomed_bv`

```text
d:\PROJETOS\ecomed_bv\
├── src/
│   ├── assets/                       # Logotipos e imagens institucionais
│   ├── core/                         # Núcleo compartilhado da plataforma
│   │   ├── auth/                     # Autenticação Supabase, contexto e RBAC
│   │   ├── components/               # Header, Sidebar, Layout master, Breadcrumbs
│   │   └── types/                    # Tipos TypeScript compartilhados
│   │
│   ├── modules/                      # Módulos do Ecossistema de Medicina
│   │   ├── preceptoria/              # Módulo Preceptoria (importado de MEDICINA)
│   │   │   ├── PreceptoriaModule.tsx # Ponto de entrada do módulo no portal
│   │   │   ├── PreceptoriaApp.jsx    # Componente com as telas e modais reais
│   │   │   ├── services/
│   │   │   │   ├── supabase.js       # Cliente Supabase da preceptoria
│   │   │   │   ├── queries.js        # ~1.800 linhas de RPCs e queries homologadas
│   │   │   │   └── xlsx.js           # Funções de exportação Excel
│   │   │   ├── mobile/
│   │   │   │   └── RegistroPresencaToken.jsx # Tela mobile isolada /p/:token
│   │   │   └── styles/
│   │   │       └── preceptoria.css   # styles.css escopado sob .preceptoria-module
│   │   │
│   │   ├── simulamed/                # Módulo de Preparação para o ENAMED
│   │   │   ├── SimulaMedModule.tsx
│   │   │   └── simulamedData.ts
│   │   │
│   │   ├── convenios/                # Módulo de Gestão dos 21 Convênios
│   │   │   └── ConveniosModule.tsx
│   │   │
│   │   └── clinica-escola/           # (Preparado para expansão futura)
│   │
│   ├── App.tsx                       # Roteador principal do ecossistema
│   ├── main.tsx
│   └── index.css                     # Tailwind CSS v4 base
│
├── .env                              # Variáveis de ambiente Supabase (URL + Anon Key)
├── package.json                      # Scripts e dependências unificadas
├── tsconfig.json                     # Configuração com allowJs: true
└── PLANO_INTEGRACAO_ECOSSISTEMA.md   # Este documento
```

---

## 5. Roteiro de Implementação Passo a Passo (Fases)

### Fase 1: Preparação de Infraestrutura e Dependências no `ecomed_bv`
- [ ] **1.1** Instalar dependências necessárias do sistema de preceptoria:
  ```bash
  npm install @supabase/supabase-js jspdf jspdf-autotable
  ```
- [ ] **1.2** Atualizar `tsconfig.json` para permitir coexistência de arquivos JavaScript (`.jsx`/`.js`) e TypeScript:
  - Definir `"allowJs": true` e `"checkJs": false`.
- [ ] **1.3** Configurar variáveis de ambiente em `.env` do `ecomed_bv` com as credenciais do Supabase:
  - `VITE_SUPABASE_URL=https://tdmrscavrdoekrzdlmpf.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=...` (chave anon pública do projeto).

### Fase 2: Migração e Isolamento do Módulo Preceptoria
- [ ] **2.1** Criar a pasta `src/modules/preceptoria/`.
- [ ] **2.2** Copiar os serviços:
  - `queries.js` e `xlsx.js` para `src/modules/preceptoria/services/`.
  - `supabase.js` configurado para ler `import.meta.env`.
- [ ] **2.3** Copiar a tela mobile de presença:
  - `RegistroPresencaToken.jsx` para `src/modules/preceptoria/mobile/`.
- [ ] **2.4** Encapsular o `styles.css` (215KB) do sistema de preceptoria:
  - Todas as classes de escopo global devem ser aninhadas sob `.preceptoria-module` para não quebrar a tipografia e botões do Tailwind v4 no resto do portal.
- [ ] **2.5** Integrar as telas administrativas de preceptoria (Preceptores, Escalas, Presença, Acompanhamento Financeiro, Pagamento em Lote) no componente `PreceptoriaModule.tsx`.

### Fase 3: Roteamento Master e Preservação da Rota Mobile
- [ ] **3.1** No `App.tsx` do `ecomed_bv`, adicionar detecção de rota:
  - Se a URL contiver `/p/:token` (ex.: `window.location.pathname.startsWith('/p/')`), o app deve renderizar exclusivamente o `RegistroPresencaToken` em tela cheia, sem carregar a Sidebar ou o Header.
  - Para as demais URLs (`/`), renderiza o layout administrativo padrão com a Sidebar.

### Fase 4: Conexão da Barra de Navegação (Sidebar)
- [ ] **4.1** Atualizar o `Sidebar.tsx`:
  - O item **"Gestão de Preceptoria"** deixa de abrir o mock e passa a carregar o `PreceptoriaModule` real conectado ao Supabase.
  - Os sub-menus do sistema de preceptoria (Dashboard, Escalas, Pagamentos, Acompanhamento Financeiro, Usuários) passam a ser coordenados de forma limpa.

### Fase 5: Validação, Testes e Homologação
- [ ] **5.1** Testar compilação do projeto: `npm run build`.
- [ ] **5.2** Validar conexão com o banco Supabase (leitura de preceptores, vínculos e cálculos).
- [ ] **5.3** Testar geração de escala e bloqueio de conflito.
- [ ] **5.4** Testar o fluxo mobile de registro de presença via token.
- [ ] **5.5** Testar exportação de relatórios em Excel e PDF.

---

## 6. Dados Sensíveis e Identificadores do Projeto

- **Projeto Supabase Preceptoria:**
  - **Ref:** `tdmrscavrdoekrzdlmpf`
  - **URL:** `https://tdmrscavrdoekrzdlmpf.supabase.co`
- **Conta Mantenedora:** `edgar.tavares2026@gmail.com`
- **Diretório Origem Preceptoria:** `D:\PROJETOS\MEDICINA\sistema-preceptoria`
- **Diretório Destino Ecossistema:** `D:\PROJETOS\ecomed_bv`
- **Documentação de Referência Oficial da Preceptoria:**
  - `D:\PROJETOS\MEDICINA\sistema-preceptoria\DOCUMENTACAO_OFICIAL_SISTEMA_PRECEPTORIA.md` (v1.18)

---

## 7. Como Continuar Este Trabalho

Caso esta conversa seja encerrada, qualquer novo agente ou desenvolvedor deverá:

1. Abrir este arquivo: `d:\PROJETOS\ecomed_bv\PLANO_INTEGRACAO_ECOSSISTEMA.md`.
2. Verificar no checklist da **Seção 5** qual item está pendente.
3. Seguir exatamente a sequência a partir da **Fase 1** (instalação de pacotes e ajuste de `tsconfig.json`).
4. Manter a integridade das 40 RPCs e 61 migrações do Supabase, não alterando a estrutura de banco existente sem necessidade.

