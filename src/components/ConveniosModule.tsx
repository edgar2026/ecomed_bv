import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  List,
  Coins,
  Layers,
  ClipboardList,
  Star
} from 'lucide-react';

// ─── Gantt data (all 21 convenios)
const ganttData = [
  { name: 'Município de Olinda',         sub: '10 anos · 2022–2032',                         start: 2022,    end: 2032,    color: '#059669' },
  { name: 'HMG / HMJ',                  sub: 'Hospitais Municipais · desde 2016',            start: 2023,    end: 2028,    color: '#059669' },
  { name: 'Hosp. Memorial Agreste',      sub: '10 anos · Caruaru',                            start: 2023,    end: 2033,    color: '#059669' },
  { name: 'Município de Paulista',       sub: '6 anos · 2021–2027',                           start: 2021,    end: 2027,    color: '#059669' },
  { name: 'Município de Camaragibe',     sub: '6 anos · 2021–2027',                           start: 2021,    end: 2027,    color: '#059669' },
  { name: 'Município de Jaboatão',       sub: '5 anos · 2022–2027',                           start: 2022,    end: 2027,    color: '#059669' },
  { name: 'SES-PE',                      sub: 'Bolsas 10%/7,5% · 336 vagas',                 start: 2023,    end: 2028,    color: '#2563EB' },
  { name: 'IASSEPE / HSE',               sub: 'Set/2025 – Set/2029',                          start: 2025.67, end: 2029.67, color: '#059669' },
  { name: 'Fundação Altino Ventura',     sub: '2 anos · 2025–2027',                           start: 2025,    end: 2027,    color: '#059669' },
  { name: 'APAE-SER',                    sub: 'Nov/2025 – Nov/2027',                          start: 2025.83, end: 2027.83, color: '#2563EB' },
  { name: 'Pref. São Lourenço da Mata',  sub: 'Equipamentos · Fev/2021–Fev/2025 · Vencido',  start: 2021.12, end: 2025.12, color: '#D97706' },
  { name: 'FMS São Lourenço da Mata',    sub: 'R$ 302.474,90 em bolsas · 9 cursos · 176 vagas', start: 2025.92, end: 2030.92, color: '#2563EB' },
  { name: 'HCP – Câncer de PE',          sub: '1º Aditivo · Venc. 21/05/2026 · 2ª renovação',start: 2024.38, end: 2026.38, color: '#F59E0B' },
  { name: 'HARF – Aeronáutica',          sub: 'Edital Nº 01/2025 · 75 vagas/sem.',           start: 2026.45, end: 2028.45, color: '#059669' },
  { name: 'Irmandade Santa Casa',        sub: 'Vence Set/2026 — URGENTE',                     start: 2023,    end: 2026.75, color: '#DC2626' },
  { name: 'Hosp. Santa Joana',           sub: 'Vence 2026 · 24 vagas Medicina',               start: 2024,    end: 2026.5,  color: '#DC2626' },
  { name: 'Assoc. Evangélica Benfeit.',  sub: 'Vence 2026 — verificar',                       start: 2024,    end: 2026,    color: '#DC2626' },
  { name: 'Município de Recife',         sub: 'Em formalização · SESAU out/2024',             start: 2025,    end: 2027,    color: '#9CA3AF' },
  { name: 'FEAPAES-PE',                  sub: 'Em tramitação · nov/2025',                     start: 2025,    end: 2027,    color: '#9CA3AF' },
  { name: 'Hapvida – Assist. Médica',    sub: 'R$ 3.300/aluno · 37 vagas Med. · 2026.1–2027.1', start: 2026.0, end: 2027.5, color: '#059669' },
  { name: 'Fundação CAS – PMPE',         sub: 'Jan/2026 – Jan/2031 · 5 anos',                 start: 2026.05, end: 2031.05, color: '#059669' },
];

// ─── All convenios data for the table
const conveniosData = [
  { id: 1, nome: 'Hospital de Aeronáutica de Recife – HARF', sub: 'Edital Nº 01/2025 · Chamado 16.627.199 · Comando da Aeronáutica', status: 'vigente', cp: 'nocp', vigencia: '12/06/2026 – 12/06/2028', anos: '2 anos · recém-assinado', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'},{l:'Fisioterapia',c:''},{l:'+10',c:''}], vagas: '75/sem.', contrapartida: 'Sem contrapartida', urgente: false },
  { id: 2, nome: 'Fundação CAS – PMPE', sub: 'Cooperação Técnica · CNPJ 32.982.258/0001-49', status: 'vigente', cp: 'cp', vigencia: 'Jan/2026 – Jan/2031', anos: '5 anos', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'},{l:'Odontologia',c:''},{l:'+8',c:''}], vagas: '186+ (Med.)', contrapartida: 'Desconto 60% mensalidades', urgente: false },
  { id: 3, nome: 'Prefeitura Municipal de São Lourenço da Mata', sub: 'CNPJ 11.251.832/0001-05 · Vinicius Labanca (Prefeito) · Convênio assinado 22/02/2021 · Vigência encerrada Fev/2025', status: 'renovar', cp: 'cp', vigencia: 'Fev/2021 – Fev/2025', anos: 'Vencido', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'},{l:'+8',c:''}], vagas: 'A definir', contrapartida: 'Equipamentos (100 esf. + 25 comp.)', urgente: false },
  { id: 4, nome: 'Fundo Municipal de Saúde – São Lourenço da Mata', sub: 'CNPJ 12.257.765/0001-90 · Otaviano Eduardo Souza (Sec. Municipal de Saúde) · Convênio assinado 16/12/2025 · Chamado 16.356.936', status: 'vigente', cp: 'cp', vigencia: 'Dez/2025 – Dez/2030', anos: '5 anos', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'},{l:'+7',c:''}], vagas: '176 vagas', contrapartida: 'R$ 302.474,90 em bolsas', urgente: false },
  { id: 5, nome: 'Hospital de Câncer de Pernambuco – HCP/SPCC', sub: 'CNPJ 10.894.988/0001-33 · Sidney Batista Neves (Sup. Geral) · 1º Aditivo assinado 19/01/2026 · R$ 36.242,46/mês', status: 'renovar', cp: 'cp', vigencia: '21/05/2024 – 21/05/2026', anos: 'Vencido · 2ª renovação em curso', cursos: [{l:'Medicina',c:''},{l:'Multiprofissional',c:''},{l:'18+ vagas',c:''}], vagas: '18+ vagas', contrapartida: 'R$ 36.242,46/mês', urgente: true },
  { id: 6, nome: 'IASSEPE / Hospital dos Servidores do Estado – HSE', sub: 'Instituto de Atenção à Saúde', status: 'vigente', cp: 'cp', vigencia: 'Set/2025 – Set/2029', anos: '4 anos', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'},{l:'+6',c:''}], vagas: 'A definir', contrapartida: 'Cursos + descontos', urgente: false },
  { id: 7, nome: 'Irmandade da Santa Casa de Misericórdia de PE', sub: 'R$ 1.478–1.700/vaga · Prazo iminente', status: 'urgente renovar', cp: 'cp', vigencia: 'Vence Set/2026', anos: '~3 meses restantes', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'},{l:'+outros',c:''}], vagas: 'A confirmar', contrapartida: 'R$ 1.478–1.700/vaga', urgente: true },
  { id: 8, nome: 'Hospital Santa Joana', sub: 'R$ 4.500/vaga · Vence 2026', status: 'urgente renovar', cp: 'cp', vigencia: '2024 – 2026', anos: 'Meses restantes', cursos: [{l:'Medicina',c:'med'}], vagas: 'A confirmar', contrapartida: 'R$ 4.500/vaga + EAD', urgente: true },
  { id: 9, nome: 'Associação Evangélica Beneficente', sub: 'Possível vencimento em 2026 – status a confirmar', status: 'urgente', cp: 'nocp', vigencia: '2019 – 2026 (est.)', anos: 'Possível expiração', cursos: [{l:'Medicina',c:'med'}], vagas: '—', contrapartida: 'Sem contrapartida', urgente: true },
  { id: 10, nome: 'Hapvida – Assistência Médica', sub: 'Unidade Baixa Verde (CNPJ 63.554.067/0210-04) · Chamado 16.902.214 · Assinado Jul/2026', status: 'vigente', cp: 'cp', vigencia: '2026.1 – 2027.1 (12 meses)', anos: 'Vigente (Renovado Jul/2026)', cursos: [{l:'Medicina',c:'med'}], vagas: '37 alunos/sem.', contrapartida: 'R$ 3.300/aluno (R$ 122.100/sem.) · Cirurgia, Pediatria, Urgência', urgente: false },
  { id: 11, nome: 'APAE-SER – Associação de Pais e Amigos', sub: 'SER Educacional · Minuta vigente', status: 'vigente', cp: 'cp', vigencia: 'Nov/2025 – Nov/2027', anos: '2 anos', cursos: [{l:'Fisioterapia',c:''},{l:'T. Ocupacional',c:''},{l:'Fonoaudiologia',c:''}], vagas: 'A definir', contrapartida: 'R$ 2.000/mês + eventos', urgente: false },
  { id: 12, nome: 'Secretaria Estadual de Saúde – SES-PE', sub: '336 vagas mapeadas · Bolsas integrais a servidores', status: 'vigente', cp: 'cp', vigencia: 'Jul/2023 – Jul/2028', anos: '5 anos', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'},{l:'Fisioterapia',c:''},{l:'Biomedicina',c:''},{l:'+4',c:''}], vagas: '336 vagas', contrapartida: 'Bolsas 10% / 7,5%', urgente: false },
  { id: 13, nome: 'Município de Paulista – Secretaria de Saúde', sub: 'Prefeitura Municipal de Paulista', status: 'vigente', cp: 'nocp', vigencia: '2021 – 2027 (est.)', anos: '6 anos', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'}], vagas: '—', contrapartida: 'Sem contrapartida', urgente: false },
  { id: 14, nome: 'Município de Camaragibe – Secretaria de Saúde', sub: '', status: 'vigente', cp: 'nocp', vigencia: '2021 – 2027 (est.)', anos: '6 anos', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'}], vagas: '—', contrapartida: 'Sem contrapartida', urgente: false },
  { id: 15, nome: 'Município de Jaboatão dos Guararapes', sub: 'Fundo Municipal de Saúde', status: 'vigente', cp: 'nocp', vigencia: '2022 – 2027 (est.)', anos: '5 anos', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'}], vagas: '—', contrapartida: 'Sem contrapartida', urgente: false },
  { id: 16, nome: 'Município de Olinda – Secretaria de Saúde', sub: '', status: 'vigente', cp: 'nocp', vigencia: '2022 – 2032', anos: '10 anos', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'}], vagas: '—', contrapartida: 'Sem contrapartida', urgente: false },
  { id: 17, nome: 'Município de Recife – Secretaria de Saúde', sub: 'SESAU Declaração out/2024 · Medicina, Nutrição e Psicologia', status: 'renovar', cp: 'nocp', vigencia: 'A confirmar', anos: '', cursos: [{l:'Medicina',c:'med'},{l:'Nutrição',c:''},{l:'Psicologia',c:''}], vagas: '—', contrapartida: 'Sem contrapartida', urgente: false },
  { id: 18, nome: 'Fundação Altino Ventura – Oftalmologia', sub: '', status: 'vigente', cp: 'nocp', vigencia: '2025 – 2027 (est.)', anos: '2 anos', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'}], vagas: '—', contrapartida: 'Sem contrapartida', urgente: false },
  { id: 19, nome: 'HMG e HMJ – Hospitais Maternidade', sub: 'Hospitais Municipais de Goiana e Jaboatão', status: 'vigente', cp: 'nocp', vigencia: 'desde 2016 – ~2028', anos: 'Convênio longo prazo', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'}], vagas: '—', contrapartida: 'Sem contrapartida', urgente: false },
  { id: 20, nome: 'Hospital Memorial do Agreste', sub: 'Caruaru-PE', status: 'vigente', cp: 'nocp', vigencia: '2023 – 2033', anos: '10 anos', cursos: [{l:'Medicina',c:'med'},{l:'Enfermagem',c:'enf'}], vagas: '—', contrapartida: 'Sem contrapartida', urgente: false },
  { id: 21, nome: 'FEAPAES-PE – Fed. das APAEs de Pernambuco', sub: 'CNPJ 01.156.276/0001-26 · Caruaru-PE · Dr. Gilvan Florêncio', status: 'renovar', cp: 'nocp', vigencia: 'Em tramitação', anos: '', cursos: [{l:'Fisioterapia',c:''},{l:'T. Ocupacional',c:''},{l:'Fonoaudiologia',c:''}], vagas: '—', contrapartida: 'Sem contrapartida', urgente: false },
];

// ─── Gantt component
function GanttChart() {
  const YEAR_START = 2023;
  const COLS = 8;
  const years = Array.from({ length: COLS }, (_, i) => YEAR_START + i);

  return (
    <div className="cm-timeline-wrap">
      {/* Header */}
      <div className="cm-timeline-header">
        <div className="cm-tl-cell cm-tl-cell-first">Conveniada</div>
        {years.map(y => <div key={y} className="cm-tl-cell">{y < 2030 ? y : '2030+'}</div>)}
      </div>
      {/* Rows */}
      {ganttData.map((d, idx) => (
        <div key={idx} className="cm-timeline-row">
          <div className="cm-tl-name">
            {d.name}
            <small>{d.sub}</small>
          </div>
          {years.map((yearNum) => {
            const segStart = Math.max(d.start, yearNum);
            const segEnd = Math.min(d.end, yearNum + 1);
            const hasBar = segEnd > segStart;
            const leftPct = hasBar ? (segStart - yearNum) * 100 : 0;
            const widthPct = hasBar ? (segEnd - segStart) * 100 : 0;
            const rLeft = leftPct > 0.5 ? '4px' : '0';
            const rRight = widthPct < 99 ? '4px' : '0';
            return (
              <div key={yearNum} className="cm-tl-col">
                {hasBar && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '18px',
                      borderRadius: `${rLeft} ${rRight} ${rRight} ${rLeft}`,
                      left: `${leftPct.toFixed(1)}%`,
                      width: `${widthPct.toFixed(1)}%`,
                      background: d.color,
                      opacity: 0.82,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function ConveniosModule() {
  // Active view — only dashboard is shown in navigation
  // All views implemented and ready for future activation
  const [activeView, setActiveView] = useState<'dashboard' | 'todos' | 'contrapartidas' | 'cursos' | 'obrigacoes' | 'harf'>('dashboard');
  const [tableFilter, setTableFilter] = useState<'all' | 'vigente' | 'renovar' | 'urgente' | 'cp' | 'nocp'>('all');

  // Auto-computed KPIs from data
  const kpiVigente = useMemo(() => conveniosData.filter(r => r.status === 'vigente').length, []);
  const kpiRenovar = useMemo(() => conveniosData.filter(r => r.status.includes('renovar')).length, []);
  const kpiUrgente = useMemo(() => conveniosData.filter(r => r.status.includes('urgente')).length, []);

  // Filtered table rows
  const filteredConvenios = useMemo(() => {
    return conveniosData.filter(row => {
      if (tableFilter === 'all') return true;
      if (tableFilter === 'vigente') return row.status.includes('vigente');
      if (tableFilter === 'renovar') return row.status.includes('renovar');
      if (tableFilter === 'urgente') return row.status.includes('urgente');
      if (tableFilter === 'cp') return row.cp === 'cp';
      if (tableFilter === 'nocp') return row.cp === 'nocp';
      return true;
    });
  }, [tableFilter]);

  // Inject scoped CSS
  useEffect(() => {
    const styleId = 'conv-module-styles';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = convenioCss;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  const statusDot = (status: string) => {
    if (status === 'vigente') return <span className="cm-sdot cm-sdot-green"></span>;
    if (status.includes('urgente')) return <span className="cm-sdot cm-sdot-rose"></span>;
    if (status === 'renovar' || status.includes('renovar')) return <span className="cm-sdot cm-sdot-amber"></span>;
    return <span className="cm-sdot cm-sdot-blue"></span>;
  };

  const statusLabel = (status: string) => {
    if (status === 'vigente') return 'Vigente';
    if (status.includes('urgente') && status.includes('renovar')) return 'Urgente';
    if (status === 'urgente') return 'Verificar';
    if (status.includes('renovar')) return 'Em renovação';
    return status;
  };

  return (
    <div className="conv-module flex flex-col md:flex-row gap-6 min-h-[calc(100vh-120px)] items-start">
      {/* Sub-navigation Sidebar inside module */}
      <div className="w-full md:w-60 bg-white border border-slate-200/80 rounded-2xl p-4 shrink-0 space-y-4 shadow-sm select-none">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Painel</div>
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>

        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Convênios</div>
          <div className="space-y-1">
            <button
              onClick={() => setActiveView('todos')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'todos'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <List className="w-4 h-4" />
                <span>Todos os Convênios</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                activeView === 'todos'
                  ? 'bg-blue-500 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                21
              </span>
            </button>
            <button
              onClick={() => setActiveView('contrapartidas')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'contrapartidas'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>Contrapartidas</span>
            </button>
            <button
              onClick={() => setActiveView('cursos')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'cursos'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Cursos & Vagas</span>
            </button>
            <button
              onClick={() => setActiveView('obrigacoes')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'obrigacoes'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Obrigações</span>
            </button>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Destaques</div>
          <button
            onClick={() => setActiveView('harf')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'harf'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Destaque: HARF</span>
          </button>
        </div>
      </div>

      {/* View Content right side */}
      <div className="flex-1 min-w-0 w-full">
        {/* ─── DASHBOARD VIEW ─── */}
      {activeView === 'dashboard' && (
        <div className="cm-view-anim">

          {/* Hero */}
          <div className="cm-hero">
            <div className="cm-hero-left">
              <div className="cm-hero-eyebrow">Convênios de Estágio · UNINASSAU Boa Viagem</div>
              <div className="cm-hero-title">Gestão de Convênios<br />Institucionais</div>
              <div className="cm-hero-desc">Painel de acompanhamento de todos os convênios de campo de estágio da UNINASSAU Boa Viagem. Controle de vigências, contrapartidas e renovações críticas.</div>
              <div className="cm-hero-stats">
                <div className="cm-hero-stat">
                  <div className="cm-stat-n" id="kpi-vigente">{kpiVigente}</div>
                  <div className="cm-stat-l">Vigentes</div>
                </div>
                <div className="cm-hero-stat">
                  <div className="cm-stat-n cm-stat-amber">{kpiRenovar}</div>
                  <div className="cm-stat-l">Em renovação</div>
                </div>
                <div className="cm-hero-stat">
                  <div className="cm-stat-n cm-stat-red">{kpiUrgente}</div>
                  <div className="cm-stat-l">Urgentes</div>
                </div>
                <div className="cm-hero-stat" style={{borderRight: 'none'}}>
                  <div className="cm-stat-n">{conveniosData.length}</div>
                  <div className="cm-stat-l">Total de convênios</div>
                </div>
              </div>
            </div>
            <div className="cm-hero-right">
              <div className="cm-status-ring-label">Distribuição por Status</div>
              {/* SVG Donut */}
              <div className="cm-donut-wrap">
                <svg viewBox="0 0 90 90" width="90" height="90">
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#E5E7EB" strokeWidth="12"/>
                  {/* Green vigente: 13/21=62% → 219.9 of 219.9 (circ=2π*35=219.9) */}
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#059669" strokeWidth="12"
                    strokeDasharray={`${(kpiVigente/21)*219.9} 219.9`} strokeDashoffset="0" strokeLinecap="butt" transform="rotate(-90 45 45)"/>
                  {/* Amber renovar */}
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#D97706" strokeWidth="12"
                    strokeDasharray={`${(kpiRenovar/21)*219.9} 219.9`} strokeDashoffset={`-${(kpiVigente/21)*219.9}`} strokeLinecap="butt" transform="rotate(-90 45 45)"/>
                  {/* Rose urgente */}
                  <circle cx="45" cy="45" r="35" fill="none" stroke="#DC2626" strokeWidth="12"
                    strokeDasharray={`${(kpiUrgente/21)*219.9} 219.9`} strokeDashoffset={`-${((kpiVigente+kpiRenovar)/21)*219.9}`} strokeLinecap="butt" transform="rotate(-90 45 45)"/>
                  <text x="45" y="49" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0D0D0F" fontFamily="system-ui">{conveniosData.length}</text>
                </svg>
                <div className="cm-donut-legend">
                  <div className="cm-dl-item"><div className="cm-dl-swatch" style={{background:'#D97706'}}></div><span>Com contrapartida<br/><strong>11 convênios · 52%</strong></span></div>
                  <div className="cm-dl-item"><div className="cm-dl-swatch" style={{background:'#059669'}}></div><span>Sem contrapartida<br/><strong>10 convênios · 48%</strong></span></div>
                </div>
              </div>
              {/* Status breakdown bars */}
              <div className="cm-status-breakdown">
                <div className="cm-sb-row">
                  <div className="cm-sb-dot" style={{background:'#059669'}}></div>
                  <div className="cm-sb-label">Vigente</div>
                  <div className="cm-sb-track"><div className="cm-sb-fill" style={{width:`${(kpiVigente/21)*100}%`,background:'#059669'}}></div></div>
                  <div className="cm-sb-num">{kpiVigente}</div>
                </div>
                <div className="cm-sb-row">
                  <div className="cm-sb-dot" style={{background:'#D97706'}}></div>
                  <div className="cm-sb-label">Em renovação</div>
                  <div className="cm-sb-track"><div className="cm-sb-fill" style={{width:`${(kpiRenovar/21)*100}%`,background:'#D97706'}}></div></div>
                  <div className="cm-sb-num">{kpiRenovar}</div>
                </div>
                <div className="cm-sb-row">
                  <div className="cm-sb-dot" style={{background:'#DC2626'}}></div>
                  <div className="cm-sb-label">Verificação urgente</div>
                  <div className="cm-sb-track"><div className="cm-sb-fill" style={{width:`${(kpiUrgente/21)*100}%`,background:'#DC2626'}}></div></div>
                  <div className="cm-sb-num">{kpiUrgente}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Urgency Bar */}
          <div className="cm-urgency-bar">
            <div className="cm-urgency-icon">⚠</div>
            <div className="cm-urgency-content">
              <div className="cm-urgency-title">Renovações críticas — ação imediata necessária</div>
              <div className="cm-urgency-items">
                <div className="cm-urgency-item"><span><span className="cm-u-name">Assoc. Evangélica Beneficente</span> — <span className="cm-u-date">Vencimento 2026, verificar se já expirou</span></span></div>
                <div className="cm-urgency-item"><span><span className="cm-u-name">Irmandade Santa Casa de Misericórdia</span> — <span className="cm-u-date">Set/2026 · ~3 meses</span></span></div>
                <div className="cm-urgency-item"><span><span className="cm-u-name">Hospital Santa Joana</span> — <span className="cm-u-date">2026 · 24 vagas Medicina · R$ 4.500/vaga/mês em risco</span></span></div>
              </div>
            </div>
          </div>

          {/* Timeline Gantt */}
          <div className="cm-section-lbl">Vigências · Linha do Tempo 2023–2033</div>
          <GanttChart />

          {/* Distribution */}
          <div className="cm-section-lbl">Distribuição</div>
          <div className="cm-two-col">
            <div className="cm-stat-panel">
              <div className="cm-sp-title">Contrapartidas por tipo</div>
              {[
                {l:'Financeira (R$/mês)', v:4, pct:'40%', color:'#C8102E'},
                {l:'Bolsas / Descontos', v:3, pct:'28%', color:'#D97706'},
                {l:'Serviços / Ações', v:3, pct:'28%', color:'#2563EB'},
                {l:'Vagas EAD', v:1, pct:'14%', color:'#059669'},
              ].map((row, i) => (
                <div key={i} className="cm-distrib-row">
                  <div className="cm-dr-label">{row.l}</div>
                  <div className="cm-dr-track"><div className="cm-dr-fill" style={{width:row.pct,background:row.color}}></div></div>
                  <div className="cm-dr-val">{row.v}</div>
                </div>
              ))}
            </div>
            <div className="cm-stat-panel">
              <div className="cm-sp-title">Cobertura de cursos da saúde</div>
              {[
                {l:'Medicina', v:19, pct:'90%'},
                {l:'Enfermagem', v:17, pct:'80%'},
                {l:'Fisioterapia', v:15, pct:'70%'},
                {l:'Nutrição / Farm. / Bio.', v:13, pct:'60%'},
                {l:'Psicologia / T. Ocup.', v:11, pct:'50%'},
              ].map((row, i) => (
                <div key={i} className="cm-distrib-row">
                  <div className="cm-dr-label">{row.l}</div>
                  <div className="cm-dr-track"><div className="cm-dr-fill" style={{width:row.pct,background:'#C8102E'}}></div></div>
                  <div className="cm-dr-val">{row.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick access to other views — hidden in this version, ready for future */}
          {/* Views: todos, contrapartidas, cursos, obrigacoes, harf — implemented below */}

        </div>
      )}

      {/* ─── TODOS OS CONVÊNIOS VIEW (hidden from nav, implemented) ─── */}
      {activeView === 'todos' && (
        <div className="cm-view-anim">
          <div className="cm-filter-row">
            <span style={{fontSize:'12px',color:'#6B7280',marginRight:'4px'}}>Filtrar:</span>
            {(['all','vigente','renovar','urgente','cp','nocp'] as const).map(f => (
              <button key={f} onClick={() => setTableFilter(f)}
                className={`cm-filter-chip${tableFilter===f?' cm-filter-chip-active':''}`}>
                {f==='all'?`Todos (${conveniosData.length})`:f==='vigente'?`Vigente (${kpiVigente})`:f==='renovar'?`Em renovação (${kpiRenovar})`:f==='urgente'?`Urgente (${kpiUrgente})`:f==='cp'?'Com contrapartida':'Sem contrapartida'}
              </button>
            ))}
          </div>
          <div className="cm-conv-table-wrap">
            <table className="cm-conv-table">
              <thead>
                <tr>
                  <th>Conveniada / Instituição</th>
                  <th>Status</th>
                  <th>Vigência</th>
                  <th>Cursos</th>
                  <th>Vagas</th>
                  <th>Contrapartida</th>
                </tr>
              </thead>
              <tbody>
                {filteredConvenios.map(row => (
                  <tr key={row.id}>
                    <td>
                      <div className="cm-td-name">{row.nome}{row.urgente && <span className="cm-urgency-flag" style={{marginLeft:'8px'}}>Urgente</span>}</div>
                      {row.sub && <div className="cm-td-sub">{row.sub}</div>}
                    </td>
                    <td><div className="cm-status-dot-label">{statusDot(row.status)}{statusLabel(row.status)}</div></td>
                    <td>
                      <div className="cm-date-range" style={row.status.includes('urgente')?{color:'#DC2626'}:row.status==='renovar'&&row.anos.toLowerCase().includes('vencid')?{color:'#D97706'}:{}}>
                        {row.vigencia}
                        {row.anos && <div className="cm-years" style={row.status.includes('urgente')?{color:'#DC2626'}:{}}>{row.anos}</div>}
                      </div>
                    </td>
                    <td>
                      <div className="cm-td-courses">
                        {row.cursos.map((c, i) => (
                          <span key={i} className={`cm-course-tag${c.c?' cm-course-tag-'+c.c:''}`}>{c.l}</span>
                        ))}
                      </div>
                    </td>
                    <td>{row.vagas}</td>
                    <td>
                      <span className={`cm-cp-label ${row.cp==='cp'?'cm-cp-has':'cm-cp-none'}`}>{row.contrapartida}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── CONTRAPARTIDAS VIEW (hidden from nav, implemented) ─── */}
      {activeView === 'contrapartidas' && (
        <div className="cm-view-anim">
          <div className="cm-cp-summary">
            <div className="cm-cps-item"><div className="cm-cps-n" style={{color:'#FF9F44'}}>R$ 36k<span style={{fontSize:'14px'}}>/mês</span></div><div className="cm-cps-l">Maior contrapartida · HCP</div></div>
            <div className="cm-cps-item"><div className="cm-cps-n" style={{color:'white'}}>10</div><div className="cm-cps-l">Convênios com contrapartida</div></div>
            <div className="cm-cps-item"><div className="cm-cps-n" style={{color:'#86EFAC'}}>R$ 2k</div><div className="cm-cps-l">Contrapartida mensal · APAE-SER</div></div>
            <div className="cm-cps-item"><div className="cm-cps-n" style={{color:'white'}}>60%</div><div className="cm-cps-l">Desconto CAS/FCAS (mensalidade)</div></div>
          </div>

          <div className="cm-section-lbl">Contrapartidas Financeiras Diretas</div>

          {/* Hapvida */}
          <div className="cm-cp-strip">
            <div className="cm-cp-strip-header">
              <div>
                <div className="cm-cp-strip-name">Hapvida Assistência Médica S.A. – Unidade Baixa Verde</div>
                <div className="cm-cp-strip-name"><small>Rua da Baixa Verde, 305, Recife-PE · CNPJ Filial: 63.554.067/0210-04 (Matriz: 63.554.067/0001-98) · Chamado 16.902.214</small></div>
              </div>
              <div className="cm-cp-value-big">R$ 122.100,00<span>por semestre · R$ 3.300,00/aluno</span></div>
            </div>
            <div className="cm-cp-strip-body">
              <div className="cm-cp-strip-fact"><div className="cm-csf-label">Vagas & Especialidades (Internato)</div><div className="cm-csf-val">37 alunos no campo de estágio · Especialidades: Cirurgia, Pediatria e Urgência/Emergência</div></div>
              <div className="cm-cp-strip-fact"><div className="cm-csf-label">Vigência & Reajuste</div><div className="cm-csf-val"><div className="cm-status-dot-label"><span className="cm-sdot cm-sdot-green"></span>Vigente (2026.1 a 2027.1 · 12 meses) · Reajuste anual pelo IPCA · Assinado eletronicamente em 13/07/2026</div></div></div>
              <div className="cm-cp-strip-fact"><div className="cm-csf-label">Exigências Contratuais (Anexo I)</div><div className="cm-csf-val">Apólice de seguro-aluno vigente, termos de compromisso assinados e vacinação obrigatória (dT, Tríplice Viral, Hepatite B, Varicela, Influenza e Covid-19)</div></div>
            </div>
          </div>

          {/* HCP */}
          <div className="cm-cp-strip">
            <div className="cm-cp-strip-header">
              <div>
                <div className="cm-cp-strip-name">Hospital de Câncer de Pernambuco – HCP / SPCC</div>
                <div className="cm-cp-strip-name"><small>Av. Cruz Cabugá, 1597, Santo Amaro · CNPJ 10.894.988/0001-33 · Sup. Geral: Sidney Batista Neves</small></div>
              </div>
              <div className="cm-cp-value-big">R$ 36.242,46<span>por mês · R$ 434.909,52/ano</span></div>
            </div>
            <div className="cm-cp-strip-body">
              <div className="cm-cp-strip-fact"><div className="cm-csf-label">Vagas · 1º Termo Aditivo (19/01/2026)</div><div className="cm-csf-val">Medicina: 18 vagas · R$ 1.487,17/vaga/mês = R$ 26.769,06 · Multiprofissional: R$ 9.473,40/mês</div></div>
              <div className="cm-cp-strip-fact"><div className="cm-csf-label">Remuneração atualizada · Dados bancários</div><div className="cm-csf-val">R$ 36.242,46/mês total · Efeito retroativo ago/2025 · Banco Itaú · Ag. 9249 · CC 32065-7</div></div>
              <div className="cm-cp-strip-fact"><div className="cm-csf-label">Vigência · Status</div><div className="cm-csf-val"><div className="cm-status-dot-label"><span className="cm-sdot cm-sdot-amber"></span>Vencido em 21/05/2026 · 1º Aditivo assinado 19/01/2026 · 2ª renovação em andamento</div></div></div>
            </div>
          </div>

          <div className="cm-cp-duo">
            <div className="cm-cp-card">
              <div className="cm-cp-card-name">Irmandade Santa Casa de Misericórdia de PE</div>
              <div className="cm-cp-card-sub">Vence Set/2026 · Ação urgente necessária</div>
              <div className="cm-cp-card-value">R$ 1.478 – R$ 1.700</div>
              <div className="cm-cp-detail"><strong>Por vaga/mês.</strong> Valor varia por curso e nível de complexidade do campo de estágio. Contrapartida financeira direta paga pela IES ao hospital conveniado.</div>
            </div>
            <div className="cm-cp-card">
              <div className="cm-cp-card-name">Hospital Santa Joana</div>
              <div className="cm-cp-card-sub">Vence 2026 · Renovação crítica · 24 vagas mapeadas</div>
              <div className="cm-cp-card-value">R$ 4.500<span style={{fontSize:'11px',fontWeight:500,color:'#9CA3AF'}}>/vaga/mês</span></div>
              <div className="cm-cp-detail">
                <strong>24 vagas de Medicina</strong> por especialidade:<br/>
                Clínica Médica 6 · Pediatria 6 · UTI 6 · Cirurgia Geral 4 · Urgência/Emergência 2<br/><br/>
                Convênio inclui acesso à plataforma <strong>UPTODATE</strong>, espaço no <strong>ISEP</strong> e <strong>vagas EAD</strong> para funcionários como contrapartida adicional.
              </div>
            </div>
          </div>

          <div className="cm-cp-strip" style={{marginBottom:'28px'}}>
            <div className="cm-cp-strip-header">
              <div>
                <div className="cm-cp-strip-name">APAE-SER – Associação de Pais e Amigos dos Excepcionais</div>
                <div className="cm-cp-strip-name"><small>Minuta vigente · Nov/2025 – Nov/2027</small></div>
              </div>
              <div className="cm-cp-value-big">R$ 2.000<span>por mês</span></div>
            </div>
            <div className="cm-cp-strip-body">
              <div className="cm-cp-strip-fact"><div className="cm-csf-label">Cursos beneficiados</div><div className="cm-csf-val">Fisioterapia, Terapia Ocupacional, Fonoaudiologia, Serviço Social</div></div>
              <div className="cm-cp-strip-fact"><div className="cm-csf-label">Obrigações adicionais</div><div className="cm-csf-val">Palestras, capacitações e eventos educativos para equipe da APAE</div></div>
              <div className="cm-cp-strip-fact"><div className="cm-csf-label">Status</div><div className="cm-csf-val"><div className="cm-status-dot-label"><span className="cm-sdot cm-sdot-green"></span>Vigente até Nov/2027</div></div></div>
            </div>
          </div>

          <div className="cm-section-lbl">Contrapartidas em Bolsas e Descontos Acadêmicos</div>
          <div className="cm-cp-duo">
            <div className="cm-cp-card">
              <div className="cm-cp-card-name">Fundação CAS – PMPE</div>
              <div className="cm-cp-card-sub">5 anos · CNPJ 32.982.258/0001-49</div>
              <div className="cm-cp-card-value cm-green">60% de desconto</div>
              <div className="cm-cp-detail"><strong>Cursos presenciais</strong> (exceto Medicina): 60% de desconto nas mensalidades para colaboradores da PMPE.<br/><br/><strong>EAD</strong>: desconto negociado separadamente para cursos a distância.</div>
            </div>
            <div className="cm-cp-card">
              <div className="cm-cp-card-name">Secretaria Estadual de Saúde – SES-PE</div>
              <div className="cm-cp-card-sub">Jul/2023 – Jul/2028 · 5 anos · 336 vagas mapeadas</div>
              <div className="cm-cp-card-value cm-green">Bolsas integrais</div>
              <div className="cm-cp-detail"><strong>10% das vagas</strong> em cursos de Medicina — bolsas integrais a servidores.<br/><strong>7,5% das vagas</strong> em demais cursos de saúde, por semestre.<br/><br/><strong>Breakdown das 336 vagas:</strong><br/>Enfermagem 130 · Medicina 80 · Fisioterapia 42 · Biomedicina 28 · Farmácia 28 · Nutrição 7 · Odontologia 7 · Serviço Social 7 · Psicologia 7</div>
            </div>
          </div>

          <div className="cm-section-lbl">Contrapartidas em Serviços e Obrigações Técnicas</div>
          <div className="cm-cp-duo">
            <div className="cm-cp-card">
              <div className="cm-cp-card-name">IASSEPE / Hospital dos Servidores – HSE</div>
              <div className="cm-cp-card-sub">Set/2025 – Set/2029</div>
              <div className="cm-cp-card-value" style={{color:'#2563EB',fontSize:'14px',fontWeight:700}}>Serviços + formação continuada</div>
              <div className="cm-cp-detail">Prestação de serviços de saúde aos servidores estaduais.<br/>Ações de educação continuada e capacitação profissional.<br/><strong>Cursos e treinamentos</strong> oferecidos à equipe do hospital.</div>
            </div>
            <div className="cm-cp-card">
              <div className="cm-cp-card-name">Prefeitura Municipal de São Lourenço da Mata</div>
              <div className="cm-cp-card-sub">CNPJ 11.251.832/0001-05 · Convênio assinado 22/02/2021 · Fev/2021 – Fev/2025 <span style={{color:'#D97706',fontWeight:600}}>(Vencido — Renovação pendente)</span></div>
              <div className="cm-cp-card-value" style={{color:'#D97706',fontSize:'14px',fontWeight:700}}>Equipamentos para campo de estágio</div>
              <div className="cm-cp-detail">Contrapartida (Cláusula 9ª): equipamentos cedidos pela Prefeitura à SER Educacional.<br/><strong>100</strong> Esfigmomanômetros + Estetoscópio · <strong>15</strong> Turbinas de alta rotação · <strong>15</strong> Canetas de rotação · <strong>25</strong> Computadores de mesa · <strong>25</strong> Balanças pediátricas.<br/><strong>Campo de estágio:</strong> 10 cursos · Medicina, Odontologia, Radiologia, Enfermagem, Fisioterapia, História, Farmácia, Biomedicina, Med. Veterinária e Nutrição.</div>
            </div>
            <div className="cm-cp-card">
              <div className="cm-cp-card-name">Fundo Municipal de Saúde – São Lourenço da Mata</div>
              <div className="cm-cp-card-sub">CNPJ 12.257.765/0001-90 · Convênio assinado 16/12/2025 · Dez/2025 – Dez/2030 · Chamado 16.356.936</div>
              <div className="cm-cp-card-value" style={{color:'#C8102E',fontSize:'15px',fontWeight:700}}>R$ 302.474,90 em bolsas</div>
              <div className="cm-cp-detail">Contrapartida (Cláusula 9ª): <strong>R$ 302.474,90</strong> em bolsas integrais de estudo.<br/><strong>Graduação presencial:</strong> 2 bolsas de Direito (R$ 256.354,80).<br/><strong>Graduação EAD:</strong> Administração, R. Humanos, Nutrição, Ciências Contábeis, Gestão Pública (5 bolsas · R$ 32.161,76).<br/><strong>Pós-graduação EAD:</strong> ABA, Adm. Saúde, Contratos Públicos, Educação Especial, Enfermagem (4 esp.) e Epidemiologia (9 bolsas · R$ 13.958,34).<br/><strong>Campo de estágio:</strong> 176 vagas · 9 cursos de saúde · H. Petronila Campos + CEM + PSF São Lourenço.</div>
            </div>
          </div>
        </div>
      )}

      {/* ─── CURSOS VIEW (hidden from nav, implemented) ─── */}
      {activeView === 'cursos' && (
        <div className="cm-view-anim">
          <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:'24px',marginBottom:'28px',alignItems:'start'}}>
            <div>
              <div className="cm-section-lbl" style={{marginTop:0}}>Cobertura por curso — convênios que contemplam</div>
              <div className="cm-course-coverage-wrap">
                <div className="cm-course-header-row">
                  <div className="cm-chr-name">Curso</div>
                  <div className="cm-chr-bar">Cobertura em convênios</div>
                  <div className="cm-chr-count">Convênios</div>
                </div>
                {[
                  {n:'Medicina',v:19,pct:'90%'},{n:'Enfermagem',v:17,pct:'80%'},{n:'Fisioterapia',v:14,pct:'65%'},{n:'Nutrição',v:12,pct:'55%'},
                  {n:'Biomedicina',v:11,pct:'50%'},{n:'Farmácia',v:10,pct:'45%'},{n:'Odontologia',v:9,pct:'40%'},{n:'Psicologia',v:9,pct:'40%'},
                  {n:'Terapia Ocupacional',v:7,pct:'30%'},{n:'Fonoaudiologia',v:6,pct:'28%'},{n:'Serviço Social',v:5,pct:'25%'},
                  {n:'Educação Física',v:4,pct:'20%'},{n:'Téc. Radiologia',v:3,pct:'14%'},{n:'Estética e Cosmético',v:2,pct:'10%'},
                  {n:'Téc. Laboratório',v:2,pct:'10%'},{n:'Téc. Enfermagem',v:2,pct:'8%'}
                ].map((c,i) => (
                  <div key={i} className="cm-course-row">
                    <div className="cm-cr-name">{c.n}</div>
                    <div className="cm-cr-bar-wrap"><div className="cm-cr-bar-bg"><div className="cm-cr-bar-fill" style={{width:c.pct}}></div></div></div>
                    <div className="cm-cr-count">{c.v} <small>convênios</small></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="cm-section-lbl" style={{marginTop:0}}>Vagas detalhadas por convênio</div>
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                {[
                                    {t:'Hapvida – Assist. Médica',v:'37',vc:' vagas Med.',color:'#059669',detail:'37 alunos/semestre · R$ 3.300,00/aluno\nCirurgia · Pediatria · Urgência e Emergência\nUnidade Baixa Verde (Recife-PE)'},
                  {t:'HARF – Aeronáutica',v:'75',vc:'/semestre',color:'#0D0D0F',detail:'· 8 vagas reservadas PcD (10%)\n· 23 vagas cotas negros (30%)\n· Sem contrapartida financeira'},
                  {t:'HCP – Câncer de PE',v:'18',vc:' vagas',color:'#C8102E',detail:'R$ 36.242,46/mês · Medicina: 18 vagas × R$ 1.487,17 + Multiprofissional'},
                  {t:'Fundação CAS / FCAS',v:'186+',vc:' vagas',color:'#0D0D0F',detail:'Medicina (manutenção) + demais cursos a definir'},
                  {t:'SES-PE – 9 cursos',v:'336',vc:' vagas',color:'#2563EB',detail:'Enf. 130 · Med. 80 · Fisio. 42 · Bio. 28 · Farm. 28\nNutr. 7 · Odonto. 7 · S.Social 7 · Psico. 7'},
                  {t:'Hospital Santa Joana',v:'24',vc:' vagas Med.',color:'#C8102E',detail:'Clínica Médica 6 · Pediatria 6 · UTI 6\nCirurgia Geral 4 · Urgência/Emergência 2'},
                ].map((p,i) => (
                  <div key={i} className="cm-stat-panel">
                    <div className="cm-sp-title">{p.t}</div>
                    <div style={{fontSize:'26px',fontWeight:800,color:p.color,letterSpacing:'-0.5px',fontVariantNumeric:'tabular-nums'}}>{p.v}<span style={{fontSize:'13px',fontWeight:500,color:'#9CA3AF'}}>{p.vc}</span></div>
                    <div style={{fontSize:'11.5px',color:'#9CA3AF',marginTop:'6px',lineHeight:1.5}}>{p.detail.split('\n').map((l,j) => <span key={j}>{l}<br/></span>)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── OBRIGAÇÕES VIEW (hidden from nav, implemented) ─── */}
      {activeView === 'obrigacoes' && (
        <div className="cm-view-anim">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
            <div>
              <div className="cm-ob-section">
                <div className="cm-ob-section-title">Obrigações da IES (UNINASSAU) nos Convênios</div>
                <div className="cm-ob-card">
                  <div className="cm-ob-card-head"><span className="cm-oname">Obrigações gerais — todos os convênios</span><span className="cm-status-chip cm-chip-live">Lei 11.788/2008</span></div>
                  <div className="cm-ob-card-body">
                    <ul className="cm-ob-list">
                      <li>Indicar <strong>supervisor de estágio</strong> formado em área compatível</li>
                      <li>Celebrar <strong>Termo de Compromisso de Estágio</strong> individual por estagiário, com plano de atividades</li>
                      <li>Garantir <strong>seguro contra acidentes pessoais</strong> ao estagiário durante todo o período</li>
                      <li>Apresentar <strong>relatórios de avaliação</strong> a cada 6 meses, compatíveis com o PPC do curso</li>
                      <li>Comunicar ao concedente desligamento ou irregularidade do estagiário</li>
                      <li>Manter <strong>proporção máxima</strong> de 1 supervisor IES por campo de estágio</li>
                    </ul>
                  </div>
                </div>
                <div className="cm-ob-card">
                  <div className="cm-ob-card-head"><span className="cm-oname">Obrigações financeiras — convênios com contrapartida</span><span className="cm-status-chip cm-chip-warn">11 convênios</span></div>
                  <div className="cm-ob-card-body">
                    <ul className="cm-ob-list">
                                            <li><strong>Hapvida:</strong> contrapartida de R$ 3.300,00/aluno (37 vagas = R$ 122.100,00/semestre) para Internato em Cirurgia, Pediatria e Urgência na Unidade Baixa Verde (Chamado 16.902.214)</li>
                      <li><strong>HCP:</strong> pagamento de R$ 36.242,46/mês (1º Aditivo, 18+ vagas · medicina + multiprofissional)</li>
                      <li><strong>Santa Casa:</strong> pagamento por vaga (R$ 1.478–1.700/vaga) conforme utilização</li>
                      <li><strong>Santa Joana:</strong> pagamento de R$ 4.500/vaga contratada</li>
                      <li><strong>APAE-SER:</strong> repasse mensal de R$ 2.000,00 + realização de capacitações</li>
                      <li><strong>SES-PE:</strong> concessão de bolsas integrais (10% Med. / 7,5% demais) a servidores</li>
                      <li><strong>CAS/FCAS:</strong> concessão de desconto de 60% em mensalidades presenciais</li>
                      <li><strong>FMS São Lourenço:</strong> Concessão de campos de estágio para 8 cursos de saúde</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="cm-ob-section">
                <div className="cm-ob-section-title">Obrigações da Parte Concedente (campo de estágio)</div>
                <div className="cm-ob-card">
                  <div className="cm-ob-card-head"><span className="cm-oname">Obrigações dos hospitais e unidades de saúde</span></div>
                  <div className="cm-ob-card-body">
                    <ul className="cm-ob-list">
                      <li>Designar <strong>supervisor local</strong> (profissional da área) para cada estagiário</li>
                      <li>Fornecer <strong>infraestrutura adequada</strong> para desenvolvimento das atividades de estágio</li>
                      <li>Manter as atividades práticas compatíveis com o <strong>plano de atividades</strong> do TCE</li>
                      <li>Comunicar à IES qualquer <strong>alteração das condições</strong> de estágio ou afastamento do aluno</li>
                      <li>Elaborar <strong>avaliação de desempenho</strong> do estagiário, encaminhada à IES semestralmente</li>
                      <li>Garantir que o estagiário não execute atividades operacionais de <strong>caráter exclusivamente trabalhista</strong></li>
                    </ul>
                  </div>
                </div>
                <div className="cm-ob-card">
                  <div className="cm-ob-card-head"><span className="cm-oname">HARF – Obrigações específicas (Edital Nº 01/2025)</span><span className="cm-status-chip cm-chip-live">Aeronáutica</span></div>
                  <div className="cm-ob-card-body">
                    <ul className="cm-ob-list">
                      <li>Reservar <strong>10% das vagas (8 vagas)</strong> para Pessoas com Deficiência, conforme Decreto nº 9.508/2018</li>
                      <li>Reservar <strong>30% das vagas (23 vagas)</strong> para negros e pardos, conforme Lei nº 12.990/2014</li>
                      <li>Encaminhar estagiários ao <strong>SESAU/HARF</strong> para exame admissional antes do início</li>
                      <li>Supervisão pelo <strong>CEL MED Carlos Mauricio Rezende Novoa</strong> como Diretor do HARF</li>
                      <li>Coordenação IES: <strong>Marcela Correa De Araujo Pandolfi</strong></li>
                      <li>Renovação automática por igual período salvo manifestação contrária com <strong>60 dias de antecedência</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── HARF VIEW (hidden from nav, implemented) ─── */}
      {activeView === 'harf' && (
        <div className="cm-view-anim">
          <div className="cm-harf-hero">
            <div className="cm-harf-hero-left">
              <div className="cm-harf-eyebrow">Edital Nº 01/2025 · Ministério da Defesa</div>
              <div className="cm-harf-title">Hospital de Aeronáutica<br/>de Recife – HARF</div>
              <div className="cm-harf-subtitle">Comando da Aeronáutica · Aeroporto dos Guararapes</div>
              <div className="cm-harf-signed">Assinado em <strong>&nbsp;12 de junho de 2026</strong>&nbsp;·&nbsp;Vigência até <strong>12/06/2028</strong></div>
            </div>
            <div className="cm-harf-hero-right">
              <div className="cm-harf-stat cm-harf-stat-accent"><div className="cm-hn">75</div><div className="cm-hl">vagas por semestre</div></div>
              <div className="cm-harf-stat"><div className="cm-hn">13</div><div className="cm-hl">cursos contemplados</div></div>
              <div className="cm-harf-stat"><div className="cm-hn">R$ 0</div><div className="cm-hl">contrapartida financeira</div></div>
            </div>
          </div>

          <div className="cm-harf-grid">
            <div className="cm-harf-panel cm-harf-span2">
              <div className="cm-harf-panel-title">Cursos contemplados</div>
              <div className="cm-course-tag-list">
                {['Medicina','Enfermagem','Fisioterapia','Fonoaudiologia','Biomedicina','Nutrição','Terapia Ocupacional','Psicologia','Farmácia','Assistência Social','Téc. Radiologia','Téc. Laboratório','Téc. Enfermagem'].map((c,i) => (
                  <span key={i} className={`cm-course-tag${c==='Medicina'?' cm-course-tag-med':c==='Enfermagem'?' cm-course-tag-enf':''}`} style={{fontSize:'11px',padding:'4px 10px'}}>{c}</span>
                ))}
              </div>
            </div>
            <div className="cm-harf-panel">
              <div className="cm-harf-panel-title">Reserva de vagas</div>
              {[{l:'Total de vagas/semestre',v:'75',pct:'100%',color:'#E5E7EB'},{l:'Reserva para PcD (10%)',v:'8 vagas',pct:'10%',color:'#2563EB'},{l:'Reserva negros/pardos (30%)',v:'23 vagas',pct:'30%',color:'#059669'},{l:'Vagas gerais restantes',v:'44 vagas',pct:'60%',color:'#C8102E'}].map((q,i) => (
                <React.Fragment key={i}>
                  <div className="cm-quota-row"><div className="cm-quota-label">{q.l}</div><div className="cm-quota-val">{q.v}</div></div>
                  <div className="cm-quota-bar"><div className="cm-quota-fill" style={{width:q.pct,background:q.color}}></div></div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="cm-two-col">
            <div className="cm-stat-panel">
              <div className="cm-sp-title">Obrigações da IES no HARF</div>
              <div className="cm-obligation-list">
                {['Celebrar TCE individual por estagiário e encaminhar ao SESAU para exame admissional','Garantir seguro de acidentes pessoais durante toda a vigência do estágio','Cumprir cotas: 10% PcD (Decreto 9.508/2018) e 30% negros (Lei 12.990/2014)','Comunicar ao HARF qualquer irregularidade ou desligamento do estagiário','Designar Marcela Correa De Araujo Pandolfi como coordenadora responsável','Solicitar renovação ou denúncia com 60 dias de antecedência ao término'].map((o,i) => (
                  <div key={i} className="cm-obligation-item"><div className="cm-oi-text" dangerouslySetInnerHTML={{__html: o.replace('Marcela Correa De Araujo Pandolfi','<strong>Marcela Correa De Araujo Pandolfi</strong>').replace('60 dias','<strong>60 dias</strong>').replace('Cumprir cotas:','<strong>Cumprir cotas</strong>:')}}></div></div>
                ))}
              </div>
            </div>
            <div className="cm-stat-panel">
              <div className="cm-sp-title">Obrigações do HARF</div>
              <div className="cm-obligation-list">
                {['Disponibilizar campos de prática compatíveis com os cursos e plano de atividades','Designar supervisor local com formação compatível por grupo de estagiários','Zelar para que o estagiário não exerça atividades de caráter empregatício','Elaborar avaliações semestrais de desempenho e encaminhá-las à IES','Responsabilidade pela segurança e infraestrutura do ambiente hospitalar','Responsável: CEL MED Carlos Mauricio Rezende Novoa, Diretor do HARF'].map((o,i) => (
                  <div key={i} className="cm-obligation-item"><div className="cm-oi-text" dangerouslySetInnerHTML={{__html: o.replace('campos de prática compatíveis','<strong>campos de prática compatíveis</strong>').replace('CEL MED Carlos Mauricio Rezende Novoa','<strong>CEL MED Carlos Mauricio Rezende Novoa</strong>')}}></div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

// ─── Scoped CSS for the Convenios module
const convenioCss = `
.conv-module { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
.cm-view-anim { animation: cmFadeIn 0.22s ease both; }
@keyframes cmFadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }

.cm-hero-title, .cm-sp-title, .cm-cp-strip-name, .cm-harf-title, .cm-ob-section-title, .cm-oname { font-family: "Outfit", sans-serif; }

/* Hero */
.cm-hero { display:grid; grid-template-columns:1fr 320px; gap:0; background:#fff; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden; margin-bottom:24px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05); }
.cm-hero-left { padding:32px 36px; border-right:1px solid #e2e8f0; }
.cm-hero-right { padding:28px; background:#f8fafc; display:flex; flex-direction:column; gap:18px; }
.cm-hero-eyebrow { font-size:10px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase; color:#64748b; margin-bottom:12px; }
.cm-hero-title { font-size:24px; font-weight:700; letter-spacing:-0.5px; line-height:1.25; color:#0f172a; margin-bottom:12px; }
.cm-hero-desc { font-size:13px; color:#64748b; line-height:1.65; max-width:480px; }
.cm-hero-stats { display:flex; gap:0; margin-top:32px; }
.cm-hero-stat { padding-right:28px; margin-right:28px; border-right:1px solid #e2e8f0; }
.cm-stat-n { font-size:30px; font-weight:700; letter-spacing:-1px; color:#0f172a; line-height:1; font-variant-numeric:tabular-nums; }
.cm-stat-n.cm-stat-red { color:#f43f5e; }
.cm-stat-n.cm-stat-amber { color:#D97706; }
.cm-stat-l { font-size:12px; color:#64748b; margin-top:5px; }
.cm-status-ring-label { font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; }
.cm-status-breakdown { display:flex; flex-direction:column; gap:10px; }
.cm-sb-row { display:flex; align-items:center; gap:10px; font-size:12.5px; }
.cm-sb-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.cm-sb-label { flex:1; color:#334155; font-size:11.5px; }
.cm-sb-track { flex:1.5; height:4px; background:#e2e8f0; border-radius:4px; overflow:hidden; }
.cm-sb-fill { height:100%; border-radius:4px; }
.cm-sb-num { font-size:12px; font-weight:700; color:#0f172a; min-width:20px; text-align:right; font-variant-numeric:tabular-nums; }
.cm-donut-wrap { display:flex; align-items:center; gap:20px; margin-top:4px; }
.cm-donut-legend { display:flex; flex-direction:column; gap:8px; font-size:12px; }
.cm-dl-item { display:flex; align-items:center; gap:7px; }
.cm-dl-swatch { width:10px; height:10px; border-radius:2px; flex-shrink:0; }

/* Urgency Bar */
.cm-urgency-bar { background:#fff; border:1px solid #fee2e2; border-left:3px solid #f43f5e; border-radius:8px; padding:16px 20px; margin-bottom:24px; display:flex; gap:0; align-items:flex-start; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05); }
.cm-urgency-icon { font-size:15px; flex-shrink:0; margin-right:12px; margin-top:1px; }
.cm-urgency-content { flex:1; }
.cm-urgency-title { font-size:12px; font-weight:700; color:#f43f5e; letter-spacing:0.2px; margin-bottom:8px; text-transform:uppercase; }
.cm-urgency-items { display:flex; gap:16px; flex-wrap:wrap; }
.cm-urgency-item { font-size:12.5px; color:#334155; display:flex; align-items:center; gap:6px; }
.cm-urgency-item::before { content:''; width:5px; height:5px; border-radius:50%; background:#f43f5e; flex-shrink:0; }
.cm-u-name { font-weight:600; color:#0f172a; }
.cm-u-date { color:#f43f5e; font-size:11px; font-weight:600; }
.cm-urgency-flag { display:inline-flex; align-items:center; gap:5px; font-size:10.5px; font-weight:600; padding:2px 8px; border-radius:4px; background:#ffe4e6; color:#f43f5e; }

/* Section label */
.cm-section-lbl { font-size:10px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:14px; margin-top:28px; display:flex; align-items:center; gap:8px; }
.cm-section-lbl::after { content:''; flex:1; height:1px; background:#e2e8f0; }

/* Timeline / Gantt */
.cm-timeline-wrap { background:#fff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; margin-bottom:24px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.03); }
.cm-timeline-header { display:grid; grid-template-columns:220px repeat(8,1fr); border-bottom:1px solid #e2e8f0; background:#f8fafc; }
.cm-tl-cell { padding:9px 12px; font-size:11px; font-weight:600; color:#64748b; border-right:1px solid #f1f5f9; text-align:center; }
.cm-tl-cell-first { text-align:left; border-right:1px solid #e2e8f0; }
.cm-timeline-row { display:grid; grid-template-columns:220px repeat(8,1fr); border-bottom:1px solid #f1f5f9; align-items:center; min-height:38px; }
.cm-timeline-row:last-child { border-bottom:none; }
.cm-timeline-row:hover { background:#f8fafc; }
.cm-tl-name { padding:4px 12px; font-size:11.5px; font-weight:600; color:#0f172a; border-right:1px solid #e2e8f0; line-height:1.3; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
.cm-tl-name small { display:block; font-size:10px; color:#64748b; font-weight:400; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.cm-tl-col { border-right:1px solid #f1f5f9; height:38px; display:flex; align-items:center; position:relative; overflow:hidden; }
.cm-tl-col:last-child { border-right:none; }

/* Two col */
.cm-two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; }
.cm-stat-panel { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:24px 26px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.03); }
.cm-stat-panel:hover { border-color:#cbd5e1; }
.cm-sp-title { font-size:12px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:16px; }
.cm-distrib-row { display:flex; align-items:center; gap:10px; margin-bottom:12px; font-size:12.5px; }
.cm-distrib-row:last-child { margin-bottom:0; }
.cm-dr-label { width:130px; flex-shrink:0; color:#334155; line-height:1.3; }
.cm-dr-track { flex:1; height:6px; background:#e2e8f0; border-radius:6px; overflow:hidden; }
.cm-dr-fill { height:100%; border-radius:6px; }
.cm-dr-val { font-size:12px; font-weight:700; color:#0f172a; min-width:28px; text-align:right; font-variant-numeric:tabular-nums; }

/* Filter chips */
.cm-filter-row { display:flex; gap:8px; margin-bottom:20px; align-items:center; flex-wrap:wrap; }
.cm-filter-chip { padding:5px 12px; border-radius:5px; font-size:11.5px; font-weight:500; border:1px solid #e2e8f0; background:#fff; color:#334155; cursor:pointer; transition:all 0.12s; white-space:nowrap; }
.cm-filter-chip:hover { border-color:#64748b; color:#0f172a; }
.cm-filter-chip-active { background:#2563eb !important; color:white !important; border-color:#2563eb !important; }

/* Table */
.cm-conv-table-wrap { background:#fff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.03); }
.cm-conv-table { width:100%; border-collapse:collapse; font-size:13px; }
.cm-conv-table thead tr { border-bottom:1px solid #e2e8f0; background:#f8fafc; }
.cm-conv-table th { padding:10px 16px; font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#64748b; text-align:left; white-space:nowrap; }
.cm-conv-table td { padding:12px 16px; border-bottom:1px solid #f1f5f9; vertical-align:top; }
.cm-conv-table tbody tr:last-child td { border-bottom:none; }
.cm-conv-table tbody tr:hover { background:#f8fafc; }
.cm-td-name { font-weight:600; color:#0f172a; line-height:1.35; }
.cm-td-sub { font-size:11px; color:#64748b; margin-top:2px; }
.cm-td-courses { display:flex; flex-wrap:wrap; gap:4px; }
.cm-course-tag { font-size:10px; font-weight:500; padding:2px 7px; border-radius:4px; background:#f1f5f9; color:#334155; border:1px solid #e2e8f0; white-space:nowrap; }
.cm-course-tag-med { background:#fef2f2; color:#ef4444; border-color:#fee2e2; }
.cm-course-tag-enf { background:#eff6ff; color:#2563eb; border-color:#dbeafe; }
.cm-status-dot-label { display:flex; align-items:center; gap:7px; font-size:12px; white-space:nowrap; }
.cm-sdot { width:7px; height:7px; border-radius:50%; flex-shrink:0; display:inline-block; }
.cm-sdot-green { background:#059669; }
.cm-sdot-amber { background:#D97706; }
.cm-sdot-rose { background:#f43f5e; }
.cm-sdot-blue { background:#2563eb; }
.cm-cp-label { font-size:12px; }
.cm-cp-has { color:#D97706; font-weight:600; }
.cm-cp-none { color:#059669; font-weight:500; }
.cm-date-range { font-size:12px; color:#334155; }
.cm-years { font-size:10.5px; color:#64748b; margin-top:2px; }

/* Contrapartidas */
.cm-cp-summary { background:#0f172a; color:white; border-radius:12px; padding:22px 28px; display:grid; grid-template-columns:repeat(4,1fr); gap:0; margin-bottom:28px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
.cm-cps-item { padding-right:24px; border-right:1px solid rgba(255,255,255,0.12); margin-right:24px; }
.cm-cps-item:last-child { border-right:none; margin-right:0; padding-right:0; }
.cm-cps-n { font-size:26px; font-weight:800; letter-spacing:-0.5px; font-variant-numeric:tabular-nums; }
.cm-cps-l { font-size:11px; color:rgba(255,255,255,0.55); margin-top:4px; }
.cm-cp-strip { background:#fff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; margin-bottom:16px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.03); }
.cm-cp-strip:hover { border-color:#cbd5e1; }
.cm-cp-strip-header { display:grid; grid-template-columns:1fr auto; align-items:center; padding:18px 24px; border-bottom:1px solid #f1f5f9; gap:20px; }
.cm-cp-strip-name { font-size:14px; font-weight:700; color:#0f172a; }
.cm-cp-strip-name small { font-size:11px; font-weight:400; color:#64748b; display:block; margin-top:3px; }
.cm-cp-value-big { font-size:22px; font-weight:800; letter-spacing:-0.5px; color:#0f172a; font-variant-numeric:tabular-nums; white-space:nowrap; }
.cm-cp-value-big span { font-size:11px; font-weight:500; color:#64748b; display:block; text-align:right; margin-top:2px; }
.cm-cp-strip-body { display:grid; grid-template-columns:repeat(3,1fr); gap:0; }
.cm-cp-strip-fact { padding:14px 24px; border-right:1px solid #f1f5f9; font-size:12px; }
.cm-cp-strip-fact:last-child { border-right:none; }
.cm-csf-label { color:#64748b; margin-bottom:4px; font-size:11px; font-weight:500; }
.cm-csf-val { color:#0f172a; font-weight:600; line-height:1.4; }
.cm-cp-duo { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
.cm-cp-card { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:20px 22px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.03); }
.cm-cp-card:hover { border-color:#cbd5e1; }
.cm-cp-card-name { font-size:13px; font-weight:700; color:#0f172a; margin-bottom:4px; }
.cm-cp-card-sub { font-size:11px; color:#64748b; margin-bottom:14px; }
.cm-cp-card-value { font-size:18px; font-weight:800; color:#D97706; margin-bottom:12px; font-variant-numeric:tabular-nums; }
.cm-cp-card-value.cm-green { color:#059669; }
.cm-cp-detail { font-size:12px; color:#334155; line-height:1.55; }
.cm-cp-detail strong { color:#0f172a; }

/* Cursos */
.cm-course-coverage-wrap { background:#fff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; margin-bottom:24px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.03); }
.cm-course-header-row { display:flex; align-items:center; gap:12px; padding:9px 20px; background:#f8fafc; border-bottom:1px solid #e2e8f0; font-size:10.5px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; }
.cm-chr-name { width:180px; flex-shrink:0; }
.cm-chr-bar { flex:1; }
.cm-chr-count { width:60px; text-align:right; }
.cm-course-row { display:flex; align-items:center; gap:12px; padding:12px 20px; border-bottom:1px solid #f1f5f9; }
.cm-course-row:last-child { border-bottom:none; }
.cm-course-row:hover { background:#f8fafc; }
.cm-cr-name { width:180px; flex-shrink:0; font-size:12.5px; font-weight:600; color:#0f172a; }
.cm-cr-bar-wrap { flex:1; }
.cm-cr-bar-bg { height:8px; background:#e2e8f0; border-radius:8px; overflow:hidden; }
.cm-cr-bar-fill { height:100%; border-radius:8px; background:#2563eb; }
.cm-cr-count { width:60px; text-align:right; font-size:12px; font-weight:700; color:#0f172a; font-variant-numeric:tabular-nums; }
.cm-cr-count small { font-weight:400; color:#64748b; font-size:10px; }

/* Obrigações */
.cm-ob-section { margin-bottom:28px; }
.cm-ob-section-title { font-size:13px; font-weight:700; color:#0f172a; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid #e2e8f0; }
.cm-ob-card { background:#fff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; margin-bottom:12px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.03); }
.cm-ob-card:hover { border-color:#cbd5e1; }
.cm-ob-card-head { padding:14px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; background:#f8fafc; }
.cm-oname { font-size:13px; font-weight:700; color:#0f172a; }
.cm-ob-card-body { padding:14px 18px; }
.cm-ob-list { list-style:none; display:flex; flex-direction:column; gap:7px; }
.cm-ob-list li { display:flex; gap:10px; font-size:12.5px; color:#334155; line-height:1.5; }
.cm-ob-list li::before { content:'→'; color:#2563eb; flex-shrink:0; font-weight:700; margin-top:1px; }
.cm-ob-list li strong { color:#0f172a; }
.cm-status-chip { display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:500; padding:3px 10px; border-radius:20px; }
.cm-chip-live { background:rgba(5,150,105,0.09); color:#059669; }
.cm-chip-warn { background:rgba(217,119,6,0.09); color:#D97706; }

/* HARF */
.cm-harf-hero { background:#0f172a; border-radius:16px; padding:36px 40px; display:grid; grid-template-columns:1fr 280px; gap:40px; margin-bottom:24px; position:relative; overflow:hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
.cm-harf-hero::before { content:''; position:absolute; right:-60px; top:-60px; width:260px; height:260px; border-radius:50%; background:rgba(37,99,235,0.12); }
.cm-harf-hero-left { position:relative; }
.cm-harf-eyebrow { font-size:10.5px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:rgba(255,255,255,0.4); margin-bottom:12px; }
.cm-harf-title { font-size:24px; font-weight:700; color:white; letter-spacing:-0.3px; line-height:1.25; margin-bottom:8px; }
.cm-harf-subtitle { font-size:13px; color:rgba(255,255,255,0.5); margin-bottom:24px; }
.cm-harf-signed { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.08); border-radius:6px; padding:8px 14px; font-size:12px; color:rgba(255,255,255,0.7); }
.cm-harf-signed strong { color:white; }
.cm-harf-hero-right { display:flex; flex-direction:column; gap:14px; position:relative; justify-content:center; }
.cm-harf-stat { background:rgba(255,255,255,0.06); border-radius:6px; padding:14px 18px; }
.cm-hn { font-size:28px; font-weight:800; color:white; letter-spacing:-0.5px; font-variant-numeric:tabular-nums; }
.cm-hl { font-size:11px; color:rgba(255,255,255,0.45); margin-top:4px; }
.cm-harf-stat-accent { background:rgba(37,99,235,0.25); }
.cm-harf-stat-accent .cm-hn { color:#93c5fd; }
.cm-harf-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:24px; }
.cm-harf-panel { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:20px 22px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.03); }
.cm-harf-panel:hover { border-color:#cbd5e1; }
.cm-harf-span2 { grid-column:span 2; }
.cm-harf-panel-title { font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:14px; }
.cm-course-tag-list { display:flex; flex-wrap:wrap; gap:5px; }
.cm-quota-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:12.5px; }
.cm-quota-row:last-child { margin-bottom:0; }
.cm-quota-label { color:#334155; }
.cm-quota-val { font-weight:700; color:#0f172a; font-variant-numeric:tabular-nums; }
.cm-quota-bar { height:3px; background:#e2e8f0; border-radius:3px; margin-top:4px; overflow:hidden; margin-bottom:10px; }
.cm-quota-fill { height:100%; border-radius:3px; }
.cm-obligation-list { display:flex; flex-direction:column; gap:8px; }
.cm-obligation-item { display:flex; gap:10px; font-size:12.5px; line-height:1.5; }
.cm-obligation-item::before { content:'—'; color:#cbd5e1; flex-shrink:0; margin-top:1px; }
.cm-oi-text { color:#334155; }
.cm-oi-text strong { color:#0f172a; }

/* Scrollbar */
.conv-module ::-webkit-scrollbar { width:4px; height:4px; }
.conv-module ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:10px; }
.conv-module ::-webkit-scrollbar-thumb:hover { background:#94a3b8; }
`;
