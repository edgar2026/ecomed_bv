# MAPA_CONVENIOS_ATUAL.md

> **Documento temporário de diagnóstico — etapa exclusivamente de análise.**
> Nenhum código, dado, interface, rota, estilo ou registro de banco foi alterado na produção deste mapa.
> Os dados do módulo Convênios são **simulados** e não devem ser tratados como dados contratuais oficiais.
> Gerado em: 29/10/2026 · Branch: `main` · Commit de base: `f7ded25`.

---

## 1. Visão geral do módulo

O módulo Convênios é um painel visual de acompanhamento de convênios de estágio da UNINASSAU Boa Viagem. É o módulo **mais autocontido** do portal: todo o conteúdo (dados, lógica, estilos) vive em **um único arquivo React de 961 linhas**, sem props, sem serviços, sem tipos formais e **sem nenhuma persistência**.

- **Rota (estado de navegação):** `activeModule === 'convenios'` — não há react-router; a "rota" é estado React em `src/App.tsx:30-31`.
- **Renderização:** `src/App.tsx:166-168` → `<ConveniosModule />` **sem props**.
- **Sub-views internas:** `dashboard`, `todos`, `contrapartidas`, `cursos`, `obrigacoes`, `harf`, alternadas por `useState` local (`ConveniosModule.tsx:118`).
- **Dados:** 21 convênios simulados em constante de módulo + 21 barras de Gantt paralelas. Recarregados do bundle a cada montagem; **nada sobrevive a F5**.
- **Backend:** inexistente no código. Zero ocorrências de `supabase`, `createClient`, `fetch(`, `localStorage` em `src/` (verificado por grep em todo o diretório).

---

## 2. Arquivos envolvidos

| Arquivo | Papel | Relevância |
|---|---|---|
| `src/components/ConveniosModule.tsx` (961 l.) | **Módulo completo**: mocks (`ganttData` l.12-34, `conveniosData` l.37-59), componente `GanttChart` (l.62-113), estado (l.118-119), KPIs (l.122-124), filtro (l.127-137), injeção de CSS (l.140-151), 6 views (l.169-751), CSS próprio `convenioCss` (l.758-961) | **Principal — único arquivo do domínio** |
| `src/App.tsx:10,166-168` | Import e montagem do módulo | Montagem |
| `src/components/Sidebar.tsx:66-79` | Item "Convênios" (ícone `Handshake`), subPages `dashboard/todos/contrapartidas/cursos/obrigacoes/harf` marcadas *"Hidden from UI"*; ordem do menu l.93-99 | Navegação |
| `src/types.ts:1-5,27-43` | `ModuleId` inclui `'convenios'`; **nenhuma interface `Convenio`** — só `Hospital.convenioStatus/contratoNumero/contratoVencimento` (l.38-41) | Tipos |
| `src/data.ts:222-325` | `hospitaisInicial` com campos de convênio (`contratoNumero`, `convenioStatus`) — usado por **PreceptoresModule**, não pelo módulo Convênios | Dados adjacentes |
| `src/components/HospitaisModule.tsx:509-530` | Subviews `convenios`/`contratos` com 1 aditivo hardcoded — **módulo órfão, não importado pelo App** | Sobreposição conceitual |
| `convenios_uninassau_minimal.html` (raiz, ~2000 l.) | Protótipo HTML estático de origem da UI (mesmas 6 views, mesmos dados) | Referência/duplicata |
| `DOCUMENTACAO_SISTEMA.md:229-254,302-314,317-331` | Seção do módulo, interface `ConvenioData` **só documentada**, schema Supabase planejado (só preceptoria) | Docs |
| `PLANO_INTEGRACAO_ECOSSISTEMA.md:44-45,119-120,141-147` | Plano "mock → Supabase" pendente | Docs |
| `src/components/Header.tsx`, `src/components/ConveniosModule.tsx` (CSS) | Breadcrumb do módulo; fontes Inter/Outfit, paleta `cm-*` | Estilo |

**Não existem:** `src/services/`, `src/hooks/`, `src/modules/`, JSON de convênios, biblioteca de gráficos, dependência `@supabase/supabase-js` (ausente do `package.json`).

---

## 3. Rotas

Não há rotas de URL. A navegação é 100% estado React:

```tsx
// src/App.tsx:166-168
{activeModule === 'convenios' && (<ConveniosModule />)}

// src/components/Sidebar.tsx:154-159 — clique no menu
setActiveModule(mod.id); setActiveSubPage('dashboard');
```

- `activeSubPage` do sidebar global **não** controla o ConveniosModule (ele é renderizado sem props).
- As 6 sub-views são alcançadas pela **sub-sidebar interna** (`ConveniosModule.tsx:170-260`), embora os submenus correspondentes do sidebar global estejam ocultos (`Sidebar.tsx:72`).
- Link externo do menu "Gestão de Preceptoria" (`Sidebar.tsx:83-90`) — sem relação com este módulo.

---

## 4. Estrutura dos dados

Shape real de **todos** os 21 registros (sem tipo formal — objetos inline em `conveniosData`, l.37-59):

```ts
{
  id: number;            // 1..21
  nome: string;          // nome exibido da instituição
  sub: string;           // "lixo misto": CNPJ, chamado, assinatura, responsável, observações — tudo embutido em texto
  status: string;        // 'vigente' | 'renovar' | 'urgente renovar' | 'urgente'
  cp: 'cp' | 'nocp';     // com/sem contrapartida
  vigencia: string;      // ex.: 'Jan/2026 – Jan/2031' ou 'A confirmar'
  anos: string;          // texto de duração/observação
  cursos: { l: string; c: string }[];  // l = rótulo, c = classe de cor ('med'|'enf'|'')
  vagas: string;         // ex.: '75/sem.', '336 vagas', '—', 'A definir'
  contrapartida: string; // descrição textual
  urgente: boolean;
}
```

`ganttData` (l.12-34) é uma **segunda cópia paralela** dos mesmos 21 convênios com `{ name, sub, start, end, color }` (datas em anos decimais, ex. `2025.67`).

Distribuição de status: 14 `vigente`, 4 `renovar`, 2 `urgente renovar`, 1 `urgente`. cp = 10, nocp = 11.

**Campos calculados:** KPIs em `useMemo` (l.122-124): `kpiVigente` (14), `kpiRenovar` (6, via `includes('renovar')`), `kpiUrgente` (3, via `includes('urgente')`), total (`conveniosData.length` = 21); chips de filtro com contagens (l.127-137, rótulos l.406).

**Dados completos registro a registro** — ver Tabela A no Anexo I (todos os campos existentes, incluindo vazios).

---

## 5. Dados simulados identificados

| Onde | O quê | Natureza |
|---|---|---|
| `ConveniosModule.tsx:37-59` | 21 convênios | **Mock fixo no código** (const de módulo) |
| `ConveniosModule.tsx:12-34` | 21 barras do Gantt | **Mock fixo**, duplicado dos dados acima |
| `ConveniosModule.tsx:207` | Badge "21" na sub-sidebar | **Hardcoded** (não usa `.length`) |
| `ConveniosModule.tsx:301-332` | Divisor `21` do donut e barras de breakdown | **Hardcoded** |
| `ConveniosModule.tsx:311-312` | Legenda do donut "Com contrapartida 11 · 52% / Sem 10 · 48%" | **Hardcoded e invertida** vs dados reais (10 cp / 11 nocp) |
| `ConveniosModule.tsx:340-350` | Barra de urgência (Assoc. Evangélica, Santa Casa, Santa Joana) | **Texto fixo**, não deriva de `conveniosData` |
| `ConveniosModule.tsx:361-365,376-381` | Painéis "Contrapartidas por tipo" e "Cobertura de cursos" | **Arrays inline hardcoded** |
| `ConveniosModule.tsx:456-571` | View Contrapartidas inteira (faixa de resumo + strips Hapvida/HCP/Santa Casa/Joana/APAE/CAS/SES/IASSEPE/SLM, inclusive dados bancários e endereços) | **100% hardcoded no JSX** |
| `ConveniosModule.tsx:574-621` | View Cursos & Vagas (16 cursos + painéis de vagas) | **Hardcoded** |
| `ConveniosModule.tsx:624-693` | View Obrigações (listas IES/concedente/HARF) | **Hardcoded** |
| `ConveniosModule.tsx:696-751` | View Destaque HARF (stats, cotas, obrigações) | **Hardcoded** (usa `dangerouslySetInnerHTML` com `.replace()` para bold, l.737,745) |
| `src/data.ts:222-325` | 6 hospitais com `contratoNumero/contratoVencimento/convenioStatus` | Mock de **outro** módulo (Preceptoria) |

**Persistência:** nenhuma. Nada em `localStorage`/`sessionStorage`/`fetch`/IndexedDB. Após atualizar a página, tudo é recriado do bundle → **somente demonstração visual**.

---

## 6. Integração com Supabase

- **No código-fonte: zero integração.** Grep por `supabase|createClient|\.rpc\(` em `src/` → nenhuma ocorrência. `package.json` **não** possui `@supabase/supabase-js`. `.env.example` só tem `GEMINI_API_KEY` e `APP_URL`.
- **Nenhuma tabela de Convênios existe ou está planejada.** O schema documentado (`DOCUMENTACAO_SISTEMA.md:317-331`) refere-se só à preceptoria: `preceptores`, `preceptor_emails_copia`, `vinculos_internato`, `escalas`, `escalas_itens`, `setores`, `presencas`, `calculos_financeiros`, `pagamentos_lote`, `audit_logs`.
- A verificação de tabelas no projeto remoto Supabase **não foi realizada**: a listagem retornou erro de permissão na ferramenta disponível, e nenhuma consulta SQL foi executada (restrição da tarefa). Pelo código, não há expectativa de tabelas de convênios.
- Plano futuro registrado em `PLANO_INTEGRACAO_ECOSSISTEMA.md:44-45,141-147` (Fase 1 pendente: instalar SDK e configurar `VITE_SUPABASE_URL`) — genérico, sem menção a convênios.
- **Nenhum bucket/armazenamento de documentos, RPC, trigger, função ou política RLS** relacionado a convênios é usado ou criado.

---

## 7. Interface e componentes

**Casca (Tailwind):** wrapper `conv-module flex flex-col md:flex-row gap-6 min-h-[calc(100vh-120px)] items-start` (l.169) + sub-sidebar interna `w-full md:w-60` (l.171).

**Sub-sidebar interna (l.170-260):** grupos *Painel* (Dashboard), *Convênios* (Todos / Contrapartidas / Cursos & Vagas / Obrigações), *Destaques* (HARF). Ativo: `bg-blue-600 text-white`.

**Views (renderização condicional por `activeView`):**

| View | Conteúdo principal | Fonte dos dados |
|---|---|---|
| Dashboard (l.265-396) | Hero + 4 KPIs; donut SVG manual (l.297-309); barras de status; barra de urgência; **GanttChart** "Linha do Tempo 2023–2033" (l.62-113); painéis de distribuição | KPIs: `conveniosData`; donut/barras: divisor 21 hardcoded; urgência/distribuição: **hardcoded**; Gantt: `ganttData` |
| Todos os Convênios (l.399-453) | Chips de filtro (`all/vigente/renovar/urgente/cp/nocp`) + tabela de 6 colunas (Instituição, Status, Vigência, Cursos, Vagas, Contrapartida) | `filteredConvenios` (useMemo sobre `conveniosData`) |
| Contrapartidas (l.456-571) | Faixa escura 4 KPIs + strips detalhados por convênio | **Hardcoded no JSX** |
| Cursos & Vagas (l.574-621) | Tabela de cobertura de 16 cursos com barras + painel de vagas por convênio | **Hardcoded** |
| Obrigações (l.624-693) | Listas de obrigações da IES, da concedente e da HARF | **Hardcoded** |
| Destaque HARF (l.696-751) | Hero escuro (75 vagas/13 cursos/R$0), tags de cursos, cotas PcD/negros/gerais, obrigações | **Hardcoded** |

**O que NÃO existe:** formulários de cadastro/edição, modais, tela de detalhe clicável, botões de ação, upload de anexos, validações, paginação, busca (o `searchTerm` do Header **não é repassado** ao módulo).

**Gráficos:** sem biblioteca — SVG inline (donut), `div` com largura % (todas as barras), Gantt HTML/CSS com posicionamento absoluto (l.92-104). Ícones: `lucide-react` (6).

**Estilos:** CSS custom injectado via `useEffect` (id `conv-module-styles`, l.140-151), classes prefixadas `cm-*` (l.758-961); fontes Inter/Outfit; paleta `#2563EB` azul, `#059669` verde, `#D97706/#F59E0B` âmbar, `#DC2626/#f43f5e` vermelho, `#0f172a` escuro.

**Responsividade parcial:** só a casca usa `md:`; as views internas usam grids fixos via CSS (`1fr 320px` l.766, `1fr 280px` l.576, `repeat(4,1fr)` l.865) — **tabelas e strips não colapsam em telas pequenas**.

---

## 8. Fluxo atual de cadastro

**Inexistente.** Não há formulário, modal, botão "novo convênio" nem gravação de qualquer tipo. Os 21 registros entram no sistema apenas por edição manual do código-fonte (`conveniosData` e `ganttData`, que precisam ser mantidos em sincronia manualmente).

## 9. Fluxo atual de edição

**Inexistente.** A tabela é somente leitura: sem clique para detalhe, sem edição, sem ações. As únicas "interações" do módulo são: troca de view na sub-sidebar, chips de filtro da tabela e hover.

---

## 10. Tratamento atual de renovação e aditivos

**Resumo: renovação existe apenas como rótulo de status; aditivos existem apenas como texto; histórico/auditoria não existem.**

- **Convênio original vs renovação:** sem distinção estrutural. `status: 'renovar'` (ou `'urgente renovar'`) é uma string de apresentação, interpretada por `statusLabel()` (l.160-166) → "Em renovação". Vocabulário paralelo e não ligado ao de `Hospital.convenioStatus` (`types.ts:41`: `'Vigente' | 'Expirado' | 'Em Renovação'`).
- **Termo aditivo:** só aparece embutido em strings:
  - `ConveniosModule.tsx:25` (Gantt, HCP): `'1º Aditivo · Venc. 21/05/2026 · 2ª renovação'`
  - `ConveniosModule.tsx:42` (HCP): `'1º Aditivo assinado 19/01/2026 · R$ 36.242,46/mês'`
  - `ConveniosModule.tsx:493-495` (view Contrapartidas): "1º Termo Aditivo (19/01/2026)"
  - `ConveniosModule.tsx:47` (Hapvida): `"Vigente (Renovado Jul/2026)"`
  - `HospitaisModule.tsx:524-527` (módulo órfão): "Aditivo Contratual Nº 2 - 2025 — Reajuste de repasse em 5,4%"
- **Alteração de vigência/contrapartida/objeto:** não modelada; qualquer mudança exigiria editar string no mock.
- **Encerramento:** não modelado (só status textual "Vencido"/"Vence Set/2026").
- **Estrutura permite múltiplos aditivos por convênio?** **Não.** Não existe campo `aditivos[]`, `vigenciaAnterior`, `numeroAditivo`, `alteracoes[]` — registrar um 2º aditivo sobrescreveria/alteraria o texto do original.
- **Preserva dados originais?** Não — não há camada original/derivada.
- **Histórico de alterações / vigências anteriores / contrapartidas por período / auditoria:** **não existem** para convênios. (Auditoria só aparece no plano da preceptoria: `audit_logs`, `DOCUMENTACAO_SISTEMA.md:330`.)
- **Regra de renovação automática (HARF):** apenas texto (l.685): "renovação automática por igual período salvo manifestação contrária com 60 dias" — sem lógica de cálculo; a "urgência" é o boolean `urgente` fixo (ids 5,7,8,9) + barra hardcoded (l.340-350).

---

## 11. Campos disponíveis (no código)

**Estruturados (nos 21 registros):** `id`, `nome`, `sub`, `status`, `cp`, `vigencia`, `anos`, `cursos[].l`, `cursos[].c`, `vagas`, `contrapartida`, `urgente`.
**No Gantt:** `name`, `sub`, `start`, `end`, `color`.
**Em `Hospital` (outro módulo, `types.ts:27-43`):** `contratoNumero`, `contratoVencimento`, `valorMensal`, `convenioStatus`.
**Só no JSX das views:** endereços, CNPJs de unidades, dados bancários, responsáveis, datas de assinatura, chamados, vacinas/anexo I, cotas, condições de pagamento — tudo textual e hardcoded.

## 12. Campos ausentes (não existem em lugar nenhum como dados estruturados)

razão social · CNPJ (campo próprio) · município/UF (campo) · endereço · tipo de instrumento jurídico · número de contrato · número de chamado (campo) · objeto · data de assinatura (campo) · início/término de vigência como datas tipadas (só string) · situação tipada padronizada · modalidades · unidades/filiais · anexos/documentos · observações · responsável pelo convênio · campos de renovação (data, número, prazo) · campos de aditivo (nº, data, conteúdo, vigência resultante) · histórico contratual · alertas de vencimento calculados · diferentes contrapartidas por período · auditoria.

---

## 13. Riscos encontrados

1. **Dupla fonte de verdade:** `conveniosData` e `ganttData` são cópias manuais dos mesmos 21 convênios — divergência garantida com o tempo.
2. **Dados críticos hardcoded no JSX** (views Contrapartidas/Cursos/Obrigações/HARF): não derivam dos mocks; KPIs da faixa escura (l.458-463) podem contradizer a tabela.
3. **Inconsistências numéricas já presentes:** legenda do donut invertida (11/10 vs 10/11, l.311-312); badge "21" fixo (l.207); divisor `21` hardcoded no donut/barras (l.301-332); KPIs de renovação/urgência com sobreposição (ids 7 e 8 contam nos dois).
4. **Sem modelagem contratual:** impossível registrar aditivos/histórico sem sobrescrever o original (ver §10).
5. **Sem tipos:** registros sem interface em `types.ts` → refatorações silenciosamente frágeis; `ConvenioData` documentada mas nunca implementada.
6. **Sem persistência nem backend:** qualquer atualização real exige criar camada de dados do zero.
7. **Responsividade incompleta:** grids CSS fixos; em mobile a tabela de 6 colunas e os strips de 3 colunas não colapsam.
8. **CSS injetado em runtime** (~200 linhas em string, prefixo `cm-`): difícil de manter; risco de colisão/duplicação se o módulo montar duas vezes.
9. **Conteúdo sensível hardcoded:** dados bancários do HCP (ag./cc., l.494) e nomes de servidores estão no bundle público.
10. **Protótipo HTML duplicado** na raiz (`convenios_uninassau_minimal.html`) pode induzir a edições no arquivo errado.
11. **`HospitaisModule.tsx` órfão** contém lógica de contratos/aditivos sobreposta — risco de duplicação futura.
12. **`dangerouslySetInnerHTML`** nas listas da HARF (l.737,745) — ponto de atenção de segurança se os textos forem algum dia dinâmicos.

---

## 14. Pontos que exigirão decisão

1. **Fonte dos dados reais do termo aditivo:** quais informações do documento serão consideradas oficiais (contrato base + aditivo, vigências, valores, contrapartidas).
2. **Onde persistir:** Supabase (novo schema de convênios — nenhuma tabela existe) × manter mocks atualizados × arquivo/JSON local. Decide se haverá login/RLS/uploads.
3. **Modelagem:** convênio base + coleção de aditivos/renovações (histórico) × registro único "vigente atual" (sobrescreve) — recomendada a primeira (§15).
4. **Escopo da atualização:** atualizar só a tabela/dashboard × também as views hardcoded (Contrapartidas/Cursos/Obrigações/HARF).
5. **Origem dos mocks:** manter os 21 convênios demonstrativos, substituir por dados oficiais, ou mesclar (base real + demais como demonstração).
6. **Identidade do convênio:** manter `id` numérico 1..21 ou adotar identificador estável (ex.: `chamado`/`contrato`) para vincular aditivos.
7. **Datas tipadas:** converter `vigencia` string em `inicio`/`fim` `date` (permite alertas automáticos de vencimento) mantendo compatibilidade com a UI atual.
8. **Correção das inconsistências** (legenda donut, badge 21, divisor 21, KPIs sobrepostos): corrigir junto ou preservar comportamento atual?
9. **Dados bancários/servidores** hardcoded: manter, mover para arquivo protegido ou remover do bundle.
10. **Responsividade:** corrigir grids fixos nesta mesma atualização ou deixar para etapa posterior.
11. **Sorteio/limpeza do protótipo HTML** e do `HospitaisModule.tsx` órfão: excluir, manter ou ignorar?

---

## 15. Recomendação técnica para incorporar contratos e aditivos reais

1. **Criar tipos primeiro** em `src/types.ts`: `Convenio` (base: id, nome/razão social, cnpj, municipio/uf, endereco, tipoInstrumento, numeroContrato, chamado, objeto, dataAssinatura, situacao, observacoes, responsavel) e `ConvenioAditivo` (id, convenioId, numero, tipo `renovacao|aditivo|prorrogacao|alteracao_objeto|alteracao_contrapartida|encerramento`, dataAssinatura, vigenciaInicio, vigenciaFim, valor/contrapartida, objetoAlterado, observacoes, anexos) — **múltiplos aditivos por convênio, sem sobrescrever a base**.
2. **Extrair os mocks** de `ConveniosModule.tsx` para um arquivo de dados dedicado (ex.: `src/data/convenios.ts`), eliminando a duplicação `conveniosData` × `ganttData` (gerar o Gantt a partir de uma única fonte, com vigências derivadas dos aditivos).
3. **Preservar a UI existente:** a tabela/dashboard já consomem o shape atual (`nome`, `status`, `vigencia`, `cp`, `cursos`, `vagas`, `contrapartida`) — adaptar com um *adapter* que calcule status/vigência vigente a partir do contrato base + aditivo mais recente, para não quebrar filtros, KPIs e Gantt.
4. **Persistência:** se for optar por Supabase, planejar tabelas `convenios` e `convenios_aditivos` (+ `convenios_anexos` ou bucket) com RLS — **nada disso existe hoje**; exigirá migration, SDK (`@supabase/supabase-js`), variáveis de ambiente e decisão de auth. Alternativa sem backend: manter estrutura idêntica em arquivo local enquanto o volume for pequeno.
5. **Auditoria mínima:** campos `criado_em/atualizado_em/por` desde a primeira versão real.
6. **Corrigir na mesma leva** as inconsistências numéricas (§13.3) e o badge fixo, pois passarão a conflitar com dados reais.
7. **Separar conteúdo oficial de demonstração:** marcar registros mock (ex.: flag `demo: true`) para evitar confusão com contratos reais.
8. **Validações futuras:** CNPJ, datas (`inicio < fim`), nº de aditivo sequencial por convênio, proibição de aditivo com vigência anterior ao último vigente.

---

## 16. Lista exata de arquivos que provavelmente precisarão ser modificados posteriormente

**Obrigatórios:**
1. `src/components/ConveniosModule.tsx` — extrair mocks, consumir dados reais/adapter, telas de detalhe/edição/aditivo, corrigir KPIs/badge/donut.
2. `src/types.ts` — criar `Convenio` e `ConvenioAditivo` (e subtipos).
3. `src/data.ts` (ou novo `src/data/convenios.ts`) — fixtures/adapter das vigências.

**Prováveis (dependem das decisões da §14):**
4. `src/App.tsx` — apenas se o módulo passar a receber props (dados, searchTerm, handlers).
5. `src/components/Sidebar.tsx` — somente se novas sub-views/aditivos ganharem item de navegação (hoje ocultos em `Sidebar.tsx:72`).
6. `src/components/Header.tsx` — somente se breadcrumb/subpágina do módulo mudar.

**Condicional à escolha de Supabase (nada existe hoje):**
7. Novo arquivo de cliente/serviço (ex.: `src/services/` ou `src/lib/supabase.ts`) + `.env`/`.env.example`.
8. Migration SQL nova (`supabase/migrations/...`) — tabelas `convenios`, `convenios_aditivos`, storage de anexos, RLS — **a criar, não a editar**.
9. `package.json` — apenas se instalar `@supabase/supabase-js` (restrição atual: não instalar dependências).

**Documentação:**
10. `DOCUMENTACAO_SISTEMA.md` §5.3 (l.229-254) e interface `ConvenioData` (l.302-314) — atualizar após implementação.

**Não tocar:** páginas dos demais módulos, `src/data.ts` dos preceptores, rotas/estado de navegação, autenticação, estilos globais, protótipo `convenios_uninassau_minimal.html` (manter como referência).

---

## Anexo I — Tabela A: os 21 convênios simulados (todos os campos existentes)

Legenda de status no código: `vigente` · `renovar` · `urgente renovar` · `urgente`. `cp` = com contrapartida, `nocp` = sem.

| # (l.) | nome | sub (conteúdo completo) | status | cp | vigencia | anos | cursos (rótulo/classe) | vagas | contrapartida | urgente |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 (38) | Hospital de Aeronáutica de Recife – HARF | Edital Nº 01/2025 · Chamado 16.627.199 · Comando da Aeronáutica | vigente | nocp | 12/06/2026 – 12/06/2028 | 2 anos · recém-assinado | Medicina/med, Enfermagem/enf, Fisioterapia/'', +10/'' | 75/sem. | Sem contrapartida | false |
| 2 (39) | Fundação CAS – PMPE | Cooperação Técnica · CNPJ 32.982.258/0001-49 | vigente | cp | Jan/2026 – Jan/2031 | 5 anos | Medicina/med, Enfermagem/enf, Odontologia/'', +8/'' | 186+ (Med.) | Desconto 60% mensalidades | false |
| 3 (40) | Prefeitura Municipal de São Lourenço da Mata | CNPJ 11.251.832/0001-05 · Vinicius Labanca (Prefeito) · Convênio assinado 22/02/2021 · Vigência encerrada Fev/2025 | renovar | cp | Fev/2021 – Fev/2025 | Vencido | Medicina/med, Enfermagem/enf, +8/'' | A definir | Equipamentos (100 esf. + 25 comp.) | false |
| 4 (41) | Fundo Municipal de Saúde – São Lourenço da Mata | CNPJ 12.257.765/0001-90 · Otaviano Eduardo Souza (Sec. Municipal de Saúde) · Convênio assinado 16/12/2025 · Chamado 16.356.936 | vigente | cp | Dez/2025 – Dez/2030 | 5 anos | Medicina/med, Enfermagem/enf, +7/'' | 176 vagas | 10 bolsas integrais (1º Termo Aditivo · valor não informado) | false |
| 5 (42) | Hospital de Câncer de Pernambuco – HCP/SPCC | CNPJ 10.894.988/0001-33 · Sidney Batista Neves (Sup. Geral) · 1º Aditivo assinado 19/01/2026 · R$ 36.242,46/mês | renovar | cp | 21/05/2024 – 21/05/2026 | Vencido · 2ª renovação em curso | Medicina/'', Multiprofissional/'', 18+ vagas/'' | 18+ vagas | R$ 36.242,46/mês | **true** |
| 6 (43) | IASSEPE / Hospital dos Servidores do Estado – HSE | Instituto de Atenção à Saúde | vigente | cp | Set/2025 – Set/2029 | 4 anos | Medicina/med, Enfermagem/enf, +6/'' | A definir | Cursos + descontos | false |
| 7 (44) | Irmandade da Santa Casa de Misericórdia de PE | R$ 1.478–1.700/vaga · Prazo iminente | urgente renovar | cp | Vence Set/2026 | ~3 meses restantes | Medicina/med, Enfermagem/enf, +outros/'' | A confirmar | R$ 1.478–1.700/vaga | **true** |
| 8 (45) | Hospital Santa Joana | R$ 4.500/vaga · Vence 2026 | urgente renovar | cp | 2024 – 2026 | Meses restantes | Medicina/med | A confirmar | R$ 4.500/vaga + EAD | **true** |
| 9 (46) | Associação Evangélica Beneficente | Possível vencimento em 2026 – status a confirmar | urgente | nocp | 2019 – 2026 (est.) | Possível expiração | Medicina/med | — | Sem contrapartida | **true** |
| 10 (47) | Hapvida – Assistência Médica | Unidade Baixa Verde (CNPJ 63.554.067/0210-04) · Chamado 16.902.214 · Assinado Jul/2026 | vigente | cp | 2026.1 – 2027.1 (12 meses) | Vigente (Renovado Jul/2026) | Medicina/med | 37 alunos/sem. | R$ 3.300/aluno (R$ 122.100/sem.) · Cirurgia, Pediatria, Urgência | false |
| 11 (48) | APAE-SER – Associação de Pais e Amigos | SER Educacional · Minuta vigente | vigente | cp | Nov/2025 – Nov/2027 | 2 anos | Fisioterapia/'', T. Ocupacional/'', Fonoaudiologia/'' | A definir | R$ 2.000/mês + eventos | false |
| 12 (49) | Secretaria Estadual de Saúde – SES-PE | 336 vagas mapeadas · Bolsas integrais a servidores | vigente | cp | Jul/2023 – Jul/2028 | 5 anos | Medicina/med, Enfermagem/enf, Fisioterapia/'', Biomedicina/'', +4/'' | 336 vagas | Bolsas 10% / 7,5% | false |
| 13 (50) | Município de Paulista – Secretaria de Saúde | Prefeitura Municipal de Paulista | vigente | nocp | 2021 – 2027 (est.) | 6 anos | Medicina/med, Enfermagem/enf | — | Sem contrapartida | false |
| 14 (51) | Município de Camaragibe – Secretaria de Saúde | *(vazio)* | vigente | nocp | 2021 – 2027 (est.) | 6 anos | Medicina/med, Enfermagem/enf | — | Sem contrapartida | false |
| 15 (52) | Município de Jaboatão dos Guararapes | Fundo Municipal de Saúde | vigente | nocp | 2022 – 2027 (est.) | 5 anos | Medicina/med, Enfermagem/enf | — | Sem contrapartida | false |
| 16 (53) | Município de Olinda – Secretaria de Saúde | *(vazio)* | vigente | nocp | 2022 – 2032 | 10 anos | Medicina/med, Enfermagem/enf | — | Sem contrapartida | false |
| 17 (54) | Município de Recife – Secretaria de Saúde | SESAU Declaração out/2024 · Medicina, Nutrição e Psicologia | renovar | nocp | **A confirmar** | *(vazio)* | Medicina/med, Nutrição/'', Psicologia/'' | — | Sem contrapartida | false |
| 18 (55) | Fundação Altino Ventura – Oftalmologia | *(vazio)* | vigente | nocp | 2025 – 2027 (est.) | 2 anos | Medicina/med, Enfermagem/enf | — | Sem contrapartida | false |
| 19 (56) | HMG e HMJ – Hospitais Maternidade | Hospitais Municipais de Goiana e Jaboatão | vigente | nocp | desde 2016 – ~2028 | Convênio longo prazo | Medicina/med, Enfermagem/enf | — | Sem contrapartida | false |
| 20 (57) | Hospital Memorial do Agreste | Caruaru-PE | vigente | nocp | 2023 – 2033 | 10 anos | Medicina/med, Enfermagem/enf | — | Sem contrapartida | false |
| 21 (58) | FEAPAES-PE – Fed. das APAEs de Pernambuco | CNPJ 01.156.276/0001-26 · Caruaru-PE · Dr. Gilvan Florêncio | renovar | nocp | Em tramitação | *(vazio)* | Fisioterapia/'', T. Ocupacional/'', Fonoaudiologia/'' | — | Sem contrapartida | false |

**Contagens derivadas:** `vigente` = 14 (ids 1,2,4,6,10,11,12,13,14,15,16,18,19,20) · `renovar` = 4 (3,5,17,21) · `urgente renovar` = 2 (7,8) · `urgente` = 1 (9) · cp = 10 (2,3,4,5,6,7,8,10,11,12) · nocp = 11 (1,9,13–21) · `urgente:true` = 4 (5,7,8,9).

**Campos ausentes em TODOS os registros:** razão social, CNPJ estruturado, município/UF estruturados, endereço, tipo de instrumento, número de contrato, objeto, data de assinatura tipada, modalidades, unidades, anexos, observações estruturadas, responsável estruturado, campos de renovação/aditivo, histórico, alertas calculados.

---

*Fim do diagnóstico. Nenhum dado simulado foi removido ou substituído; nenhum código, rota, interface ou registro de banco foi alterado; nenhuma consulta SQL foi executada; nada foi publicado no GitHub.*
