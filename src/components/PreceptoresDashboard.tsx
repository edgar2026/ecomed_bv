import React, { useState, useMemo } from 'react';
import {
  months,
  monthsP,
  internato,
  praticas,
  textCells,
  PreceptoriaRecord,
  TextCellRecord
} from '../data/preceptoriaData';
import {
  TrendingUp,
  DollarSign,
  Layers,
  Award,
  AlertTriangle,
  Activity,
  FileText,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  BarChart3,
  Calendar,
  AlertCircle,
  Download,
  Info
} from 'lucide-react';

export function PreceptoresDashboard() {
  const [activeSubTab, setActiveSubTab] = useState<'geral' | 'periodos' | 'praticas' | 'internato' | 'comparativo' | 'qualidade'>('geral');

  // Search & Filter state for "Atividades Práticas" tab
  const [searchPraticas, setSearchPraticas] = useState('');
  const [periodoFilter, setPeriodoFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // 1. Core Calculations
  const sum = (arr: number[]) => arr.reduce((x, y) => x + y, 0);

  const getRecordTotal = (r: PreceptoriaRecord) => {
    return sum(Object.values(r.cells).map(c => c.value || 0));
  };

  const formatBrl = (v: number) => {
    return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatShort = (v: number) => {
    const absV = Math.abs(v);
    if (absV >= 1000000) {
      return `R$ ${(v / 1000000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mi`;
    }
    if (absV >= 1000) {
      return `R$ ${(v / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mil`;
    }
    return formatBrl(v);
  };

  const formatPct = (v: number, decimals = 2) => {
    return `${((v || 0) * 100).toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}%`;
  };

  const capitalize = (s: string) => {
    return s.toLowerCase().replace(/(^|\s|º)(\S)/g, (a, b, c) => b + c.toUpperCase());
  };

  // 2. Compute dynamic metrics
  const totalI = useMemo(() => sum(internato.map(getRecordTotal)), []);
  const totalP = useMemo(() => sum(praticas.map(getRecordTotal)), []);
  const totalC = useMemo(() => totalI + totalP, [totalI, totalP]);

  // Month-wise Totals
  const mi = useMemo(() => {
    const o: Record<string, number> = {};
    months.forEach(m => {
      o[m] = sum(internato.map(r => r.cells[m]?.value || 0));
    });
    return o;
  }, []);

  const mp = useMemo(() => {
    const o: Record<string, number> = {};
    months.forEach(m => {
      // Atividades Práticas only has FEVEREIRO to JUNHO (no JULHO, as JULHO is Internato Forecast)
      o[m] = sum(praticas.map(r => r.cells[m]?.value || 0));
    });
    return o;
  }, []);

  // Group by Period
  const allRecords = useMemo(() => [...internato, ...praticas], []);

  const periodT = useMemo(() => {
    const o: Record<string, number> = {};
    allRecords.forEach(r => {
      o[r.periodo] = (o[r.periodo] || 0) + getRecordTotal(r);
    });
    return o;
  }, [allRecords]);

  const periodA = useMemo(() => {
    const o: Record<string, number> = {};
    praticas.forEach(r => {
      o[r.periodo] = (o[r.periodo] || 0) + getRecordTotal(r);
    });
    return o;
  }, []);

  const periodI = useMemo(() => {
    const o: Record<string, number> = {};
    internato.forEach(r => {
      o[r.periodo] = (o[r.periodo] || 0) + getRecordTotal(r);
    });
    return o;
  }, []);

  const periodEntries = useMemo(() => {
    return (Object.entries(periodT) as [string, number][]).sort((a, b) => b[1] - a[1]);
  }, [periodT]);

  const topPeriod = useMemo(() => {
    return periodEntries[0] || ["-", 0];
  }, [periodEntries]);

  // For Periods tab: details per period
  const periodRows = useMemo(() => {
    return Object.keys(periodT)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(p => {
        const rows = allRecords.filter(r => r.periodo === p);
        const mt: Record<string, number> = {};
        months.forEach(m => {
          mt[m] = sum(rows.map(r => r.cells[m]?.value || 0));
        });
        const sortedRows = [...rows].sort((a, b) => getRecordTotal(b) - getRecordTotal(a));
        const top = sortedRows[0];
        
        let maxMonth = months[0];
        months.forEach(m => {
          if ((mt[m] || 0) > (mt[maxMonth] || 0)) {
            maxMonth = m;
          }
        });

        const txtCount = rows.reduce((acc, r) => {
          return acc + (Object.values(r.cells) as any[]).filter(c => c.type === 'text').length;
        }, 0);

        return {
          periodo: p,
          total: periodT[p],
          ativ: periodA[p] || 0,
          int: periodI[p] || 0,
          rows,
          mt,
          top,
          maxMonth,
          txtCount
        };
      });
  }, [periodT, periodA, periodI, allRecords]);

  // Rankings and orderings
  const sortedPraticas = useMemo(() => {
    return [...praticas].sort((a, b) => getRecordTotal(b) - getRecordTotal(a));
  }, []);

  const sortedInternato = useMemo(() => {
    return [...internato].sort((a, b) => getRecordTotal(b) - getRecordTotal(a));
  }, []);

  // Comparativo Area group calculation
  const areaTotals = useMemo(() => {
    const o: Record<string, number> = {};
    allRecords.forEach(r => {
      const d = r.disciplina;
      const area = (d.includes('PEDIATRIA') || d.includes('NEONATOLOGIA'))
        ? 'PEDIATRIA / NEONATOLOGIA'
        : d.includes('GINECO')
          ? 'GINECOLOGIA / GINECO'
          : d;
      o[area] = (o[area] || 0) + getRecordTotal(r);
    });
    return (Object.entries(o) as [string, number][]).sort((a, b) => b[1] - a[1]);
  }, [allRecords]);

  // Unique filters lists
  const uniquePeriods = useMemo(() => {
    return Array.from(new Set(praticas.map(r => r.periodo))).sort((a, b) => parseInt(a) - parseInt(b));
  }, []);

  const uniqueStatus = useMemo(() => {
    return Array.from(new Set(praticas.map(r => r.status)));
  }, []);

  // Filtered Atividades Práticas rows
  const filteredPraticasRows = useMemo(() => {
    return praticas.filter(r => {
      const matchesSearch = !searchPraticas || r.disciplina.toUpperCase().includes(searchPraticas.toUpperCase());
      const matchesPeriodo = !periodoFilter || r.periodo === periodoFilter;
      const matchesStatus = !statusFilter || r.status === statusFilter;
      return matchesSearch && matchesPeriodo && matchesStatus;
    });
  }, [searchPraticas, periodoFilter, statusFilter]);

  // Heatmap calculations
  const maxHeatmapVal = useMemo(() => {
    return Math.max(...periodRows.map(p => Math.max(...months.map(m => p.mt[m] || 0))), 1);
  }, [periodRows]);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-semibold text-blue-300">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Executivo 2026.1
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Dashboard de Gastos de Preceptoria
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl font-medium">
              Acompanhamento gerencial consolidado do internato e atividades práticas médicas.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 shadow-sm">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Fonte: GASTOS DE PRECEPTORIA 2026.1
            </span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-xs flex flex-wrap gap-1.5 sticky top-0 z-20 backdrop-blur-md bg-white/95">
        {[
          { id: 'geral', label: 'Visão Geral', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'periodos', label: 'Por Período', icon: <Layers className="w-4 h-4" /> },
          { id: 'praticas', label: 'Atividades Práticas', icon: <Activity className="w-4 h-4" /> },
          { 
            id: 'internato', 
            label: 'Internato', 
            icon: <Award className="w-4 h-4" />,
            badge: 'Julho previsão'
          },
          { id: 'comparativo', label: 'Comparativo', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'qualidade', label: 'Qualidade dos Dados', icon: <CheckCircle className="w-4 h-4 text-emerald-600" /> }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10 border-blue-500'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-blue-800 text-blue-200' : 'bg-amber-100 text-amber-800'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: VISÃO GERAL */}
      {activeSubTab === 'geral' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Visão Executiva Consolidada
              </h2>
              <p className="text-slate-500 text-xs font-medium">
                Resumo corporativo completo com preservação total de dados reais e indicações de previsão.
              </p>
            </div>
            <span className="self-start sm:self-auto inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wider">
              Executivo
            </span>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl text-amber-900 text-xs font-medium leading-relaxed shadow-xs flex gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Observação de Integridade:</span> Células textuais originais (ex: <b>"NÃO PAGA"</b> e <b>"NÃO TEVE PRECEPTORIA"</b>) são preservadas exatamente como na planilha. Nos cálculos, textos contam como <b>R$ 0,00</b>.
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-blue-200 transition-colors">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Total Consolidado</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight">{formatShort(totalC)}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1 truncate">Completo: {formatBrl(totalC)}</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-blue-200 transition-colors">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Internato</span>
              <h3 className="text-xl md:text-2xl font-black text-blue-600 mt-2 tracking-tight">{formatShort(totalI)}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">{formatPct(totalI / totalC)} do total</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-blue-200 transition-colors">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Atividades Práticas</span>
              <h3 className="text-xl md:text-2xl font-black text-amber-600 mt-2 tracking-tight">{formatShort(totalP)}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">{formatPct(totalP / totalC)} do total</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-blue-200 transition-colors">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Maior Período Geral</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight">{topPeriod[0]} período</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1 truncate">Consolida {formatShort(topPeriod[1] as number)}</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-blue-200 transition-colors">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Julho Internato</span>
              <h3 className="text-xl md:text-2xl font-black text-amber-700 mt-2 tracking-tight">Previsão</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Destaque gráfico e textual</p>
            </div>
          </div>

          {/* Evolution and Quick Reading Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Evolução Mensal Consolidada</h3>
                <p className="text-slate-400 text-[10px] font-semibold">
                  O mês de <b className="text-amber-700">Julho</b> representa a previsão de gastos do Internato.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {months.map(m => {
                  const intVal = mi[m] || 0;
                  const pracVal = mp[m] || 0;
                  const totalMonth = intVal + pracVal;

                  // Let's compute maximum monthly total across all months to draw accurate stacked proportions
                  const maxMonthlyTotal = Math.max(...months.map(mon => (mi[mon] || 0) + (mp[mon] || 0)), 1);

                  const intPctWidth = (intVal / maxMonthlyTotal) * 100;
                  const pracPctWidth = (pracVal / maxMonthlyTotal) * 100;

                  return (
                    <div key={m} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          {capitalize(m)}
                          {m === 'JULHO' && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] rounded-md font-black uppercase tracking-wider">
                              Previsão
                            </span>
                          )}
                        </span>
                        <span className="text-slate-900">{formatBrl(totalMonth)}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-6 rounded-lg overflow-hidden flex shadow-xs border border-slate-200/30">
                        {intVal > 0 && (
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-blue-500 h-full flex items-center justify-end pr-2 transition-all"
                            style={{ width: `${intPctWidth}%` }}
                            title={`Internato: ${formatBrl(intVal)}`}
                          >
                            {intPctWidth > 12 && <span className="text-[9px] text-white font-extrabold">{formatShort(intVal)}</span>}
                          </div>
                        )}
                        {pracVal > 0 && (
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-orange-400 h-full flex items-center justify-end pr-2 transition-all"
                            style={{ width: `${pracPctWidth}%` }}
                            title={`Atividades: ${formatBrl(pracVal)}`}
                          >
                            {pracPctWidth > 12 && <span className="text-[9px] text-white font-extrabold">{formatShort(pracVal)}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold pt-2 border-t border-slate-100 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-blue-600 rounded-md" />
                  <span>Internato</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-amber-500 rounded-md" />
                  <span>Atividades Práticas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border border-amber-500/50 bg-amber-100 rounded-md" />
                  <span>Julho do Internato = Previsão</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Leitura Rápida e Insights</h3>
                <ul className="space-y-3 text-xs font-semibold text-slate-600">
                  <li className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex gap-2.5">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                    <span>
                      O <b className="text-blue-600">{topPeriod[0]} período</b> concentra o maior custo gerencial das duas abas, acumulando <b className="text-slate-900">{formatBrl(topPeriod[1] as number)}</b>.
                    </span>
                  </li>
                  <li className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex gap-2.5">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-500 mt-1.5" />
                    <span>
                      Textos originais como <b className="text-slate-900">"NÃO PAGA"</b> e <b className="text-slate-900">"NÃO TEVE PRECEPTORIA"</b> são listados em todas as tabelas, refletindo as observações exatas de controle.
                    </span>
                  </li>
                  <li className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex gap-2.5">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-600 mt-1.5" />
                    <span>
                      O mês de <b className="text-amber-700">Julho</b> no Internato está detalhado como <b className="text-slate-900">Previsão de Gastos</b> por determinação da diretoria acadêmica.
                    </span>
                  </li>
                  <li className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex gap-2.5">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-slate-400 mt-1.5" />
                    <span>
                      As células com textos equivalem a <b className="text-slate-900">R$ 0,00</b> nas somas matemáticas, garantindo conformidade com os relatórios financeiros oficiais.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>Relatório Executivo 2026</span>
                <span className="text-blue-600 font-black">Uninassau Medicina</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: POR PERÍODO */}
      {activeSubTab === 'periodos' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Análise Principal: Por Período
              </h2>
              <p className="text-slate-500 text-xs font-medium">
                Consolidação geral integrando Atividades Práticas + Internato no mesmo eixo temporal de período letivo.
              </p>
            </div>
            <span className="self-start sm:self-auto inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg uppercase tracking-wider">
              Principal
            </span>
          </div>

          {/* Period KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Maior Período Geral</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight">{topPeriod[0]} período</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">{formatBrl(topPeriod[1] as number)} • {formatPct((topPeriod[1] as number) / totalC)} do total</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Maior em Atividades</span>
              <h3 className="text-xl md:text-2xl font-black text-amber-600 mt-2 tracking-tight">
                {(Object.entries(periodA) as [string, number][]).sort((a,b)=>b[1]-a[1])[0]?.[0]}º período
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">{formatBrl((Object.entries(periodA) as [string, number][]).sort((a,b)=>b[1]-a[1])[0]?.[1] || 0)} acumulado</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Maior no Internato</span>
              <h3 className="text-xl md:text-2xl font-black text-blue-600 mt-2 tracking-tight">
                {(Object.entries(periodI) as [string, number][]).sort((a,b)=>b[1]-a[1])[0]?.[0]}º período
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">{formatBrl((Object.entries(periodI) as [string, number][]).sort((a,b)=>b[1]-a[1])[0]?.[1] || 0)} acumulado</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Células de Texto</span>
              <h3 className="text-xl md:text-2xl font-black text-emerald-600 mt-2 tracking-tight">{textCells.length}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Exibidas exatamente como na planilha</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Ranking Consolidado por Período</h3>
              <div className="space-y-3.5 pt-2">
                {periodEntries.map(([per, val], idx) => {
                  const maxVal = periodEntries[0]?.[1] || 1;
                  const pctWidth = (val / maxVal) * 100;
                  return (
                    <div key={per} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-700">{per} período</span>
                        <div className="flex items-center gap-2 text-slate-900">
                          <span>{formatBrl(val)}</span>
                          <span className="text-slate-400 text-[10px] font-medium">({formatPct(val / totalC, 1)})</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            idx === 0 
                              ? 'bg-gradient-to-r from-blue-700 to-indigo-500' 
                              : 'bg-gradient-to-r from-blue-500 to-sky-400'
                          }`}
                          style={{ width: `${pctWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Leitura Gerencial</h3>
                <ul className="space-y-3 text-xs font-semibold text-slate-600 pt-2">
                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>O <b>9º período</b> e o <b>10º período</b> concentram custos massivos devido ao Internato de Ginecologia, Pediatria e Obstetrícia.</span>
                  </li>
                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>Os períodos iniciais (1º e 3º) apresentam valores muito baixos porque possuem apenas a disciplina de Saúde Coletiva em regime ambulatorial reduzido.</span>
                  </li>
                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>A aba de Atividades Práticas possui custos distribuídos de forma mais homogênea entre o 5º, 6º e 7º períodos.</span>
                  </li>
                </ul>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-900 text-[11px] leading-relaxed font-medium">
                <b>Nota Fiscal / RPA:</b> Os períodos acima consolidam as horas declaradas de prestação de preceptoria com valores unitários conforme o teto.
              </div>
            </div>
          </div>

          {/* HEATMAP */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Heatmap Consolidado: Período x Mês</h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  A intensidade da cor azul reflete a magnitude financeira. Julho do Internato destacado com borda amarela de previsão.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Período</th>
                    {months.map(m => (
                      <th key={m} className="p-3 text-center">
                        {capitalize(m)}
                        {m === 'JULHO' && <span className="block text-[8px] text-amber-700 font-black">Previsão</span>}
                      </th>
                    ))}
                    <th className="p-3 text-right">Total Consolidado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold">
                  {periodRows.map(p => {
                    return (
                      <tr key={p.periodo} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-900 font-black">{p.periodo} período</td>
                        {months.map(m => {
                          const val = p.mt[m] || 0;
                          
                          // Check if there is text in cells for this period & month
                          const matchingTextCells = p.rows.filter(r => r.cells[m]?.type === 'text');
                          const textInCell = matchingTextCells.map(r => r.cells[m]?.text).filter((v, i, arr) => arr.indexOf(v) === i).join(' / ');

                          if (textInCell && val === 0) {
                            return (
                              <td key={m} className="p-2 text-center">
                                <span className="inline-block px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[9px] font-black uppercase whitespace-nowrap">
                                  {textInCell}
                                </span>
                              </td>
                            );
                          }

                          // Compute opacity based on value
                          const ratio = val ? (0.15 + (val / maxHeatmapVal) * 0.85) : 0;
                          const bgStyle = val ? { backgroundColor: `rgba(37, 99, 235, ${ratio.toFixed(2)})` } : undefined;
                          const textClass = ratio > 0.55 ? 'text-white' : 'text-slate-800';

                          return (
                            <td 
                              key={m} 
                              className={`p-3 text-center text-[11px] ${val ? '' : 'text-slate-300'} ${
                                m === 'JULHO' && val ? 'ring-2 ring-amber-500 ring-inset' : ''
                              }`}
                              style={bgStyle}
                            >
                              {val ? formatShort(val) : '-'}
                              {m === 'JULHO' && val && (
                                <span className={`block text-[8px] font-black uppercase ${ratio > 0.55 ? 'text-amber-200' : 'text-amber-700'}`}>
                                  PREV
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="p-3 text-right text-slate-900 font-black text-[13px]">
                          {formatShort(p.total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CONSOLIDATED TABLE SUMMARY */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Tabela Resumo das duas Abas</h3>
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-xs text-left font-bold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">
                    <th className="p-3">Período</th>
                    <th className="p-3 text-right">Total Geral</th>
                    <th className="p-3 text-right">Internato</th>
                    <th className="p-3 text-right">Atividades</th>
                    <th className="p-3 text-right">% Geral</th>
                    <th className="p-3 text-center">Células Texto</th>
                    <th className="p-3">Principal Disciplina / Rodízio</th>
                    <th className="p-3 text-right">Valor Principal</th>
                    <th className="p-3">Maior Mês de Desembolso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                  {periodRows.map(p => {
                    return (
                      <tr key={p.periodo} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{p.periodo} período</td>
                        <td className="p-3 text-right font-black text-slate-900">{formatBrl(p.total)}</td>
                        <td className="p-3 text-right text-blue-600 font-bold">{formatBrl(p.int)}</td>
                        <td className="p-3 text-right text-amber-600 font-bold">{formatBrl(p.ativ)}</td>
                        <td className="p-3 text-right text-slate-500">{formatPct(p.total / totalC)}</td>
                        <td className="p-3 text-center">
                          {p.txtCount > 0 ? (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[10px] font-bold">
                              {p.txtCount} células
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-900 font-bold truncate max-w-xs">
                          {p.top?.rodizio ? `${p.top.rodizio} • ` : ''}{p.top?.disciplina || 'Nenhum'}
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900">
                          {p.top ? formatBrl(getRecordTotal(p.top)) : '-'}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-800">
                            {capitalize(p.maxMonth)}
                          </span>
                          {p.maxMonth === 'JULHO' && (
                            <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] rounded font-black uppercase">
                              PREV
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* COMPOSITION CARDS GRID */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Composição Detalhada por Período</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {periodRows.map(p => {
                return (
                  <div key={p.periodo} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-black text-slate-900">{p.periodo} Período</h4>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-lg">
                        {formatShort(p.total)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>Internato: <span className="text-blue-600 block text-xs font-black">{formatBrl(p.int)}</span></div>
                      <div>Atividades: <span className="text-amber-600 block text-xs font-black">{formatBrl(p.ativ)}</span></div>
                    </div>

                    <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                      {[...p.rows].sort((a,b)=>getRecordTotal(b)-getRecordTotal(a)).map((r, idx) => {
                        const isInternato = r.tipo === 'Internato';
                        return (
                          <div key={idx} className="flex justify-between items-start gap-2 border-b border-dashed border-slate-100 pb-2 text-[11px]">
                            <div className="space-y-0.5">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black mr-1 uppercase ${
                                isInternato ? 'bg-blue-50 text-blue-700 border border-blue-200/50' : 'bg-amber-50 text-amber-800 border border-amber-200/50'
                              }`}>
                                {isInternato ? 'Int' : 'Ativ'}
                              </span>
                              <span className="font-bold text-slate-800">
                                {r.rodizio ? `${r.rodizio} • ` : ''}{r.disciplina}
                              </span>
                            </div>
                            <span className="font-extrabold text-slate-900 shrink-0">
                              {formatBrl(getRecordTotal(r))}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ATIVIDADES PRÁTICAS */}
      {activeSubTab === 'praticas' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Atividades Práticas
              </h2>
              <p className="text-slate-500 text-xs font-medium">
                Detalhamento analítico das disciplinas de atividades práticas com manutenção total de dados originais.
              </p>
            </div>
            <span className="self-start sm:self-auto inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg uppercase tracking-wider">
              Atividades
            </span>
          </div>

          {/* Praticas KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Total Atividades</span>
              <h3 className="text-xl md:text-2xl font-black text-amber-600 mt-2 tracking-tight">{formatShort(totalP)}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Completo: {formatBrl(totalP)}</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Média Mensal</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight">
                {formatBrl(sum(monthsP.map(m => mp[m] || 0)) / monthsP.length)}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Fevereiro a Junho</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Maior Período letivo</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight">
                {(Object.entries(periodA) as [string, number][]).sort((a,b)=>b[1]-a[1])[0]?.[0]}º período
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">{formatBrl((Object.entries(periodA) as [string, number][]).sort((a,b)=>b[1]-a[1])[0]?.[1] || 0)} acumulado</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Células de Texto</span>
              <h3 className="text-xl md:text-2xl font-black text-amber-700 mt-2 tracking-tight">
                {textCells.filter(c => c.aba === 'Atividades Práticas').length}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Texto exato preservado</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Top 10 Disciplinas (Atividades Práticas)</h3>
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-xs text-left font-bold">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">
                      <th className="p-3 text-center">#</th>
                      <th className="p-3">Período</th>
                      <th className="p-3">Disciplina</th>
                      <th className="p-3 text-right">Total Acumulado</th>
                      <th className="p-3 text-right">Participação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                    {sortedPraticas.slice(0, 10).map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-3">{r.periodo} período</td>
                        <td className="p-3 text-slate-900 font-bold">{r.disciplina}</td>
                        <td className="p-3 text-right font-black text-slate-900">{formatBrl(getRecordTotal(r))}</td>
                        <td className="p-3 text-right text-slate-500">{formatPct(getRecordTotal(r) / totalP, 1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Evolução Mensal (Atividades Práticas)</h3>
              <div className="space-y-4 pt-2">
                {monthsP.map(m => {
                  const val = mp[m] || 0;
                  const maxVal = Math.max(...monthsP.map(mon => mp[mon] || 0), 1);
                  const pctWidth = (val / maxVal) * 100;
                  return (
                    <div key={m} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-700">{capitalize(m)}</span>
                        <div className="flex items-center gap-1.5 text-slate-900">
                          <span>{formatBrl(val)}</span>
                          <span className="text-slate-400 text-[10px] font-medium">({formatPct(val / totalP, 1)})</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all"
                          style={{ width: `${pctWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TABLE WITH SEARCH FILTERS */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Tabela Completa com Textos Originais</h3>
            
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchPraticas}
                  onChange={(e) => setSearchPraticas(e.target.value)}
                  placeholder="Buscar disciplina..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={periodoFilter}
                  onChange={(e) => setPeriodoFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white text-slate-700"
                >
                  <option value="">Todos os períodos</option>
                  {uniquePeriods.map(p => (
                    <option key={p} value={p}>{p} período</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white text-slate-700"
                >
                  <option value="">Todos os status</option>
                  {uniqueStatus.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main Grid Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-xs text-left font-bold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">
                    <th className="p-3">Período</th>
                    <th className="p-3">Disciplina</th>
                    {monthsP.map(m => (
                      <th key={m} className="p-3 text-right">{capitalize(m)}</th>
                    ))}
                    <th className="p-3 text-right">Total Acumulado</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                  {filteredPraticasRows.map((r, idx) => {
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{r.periodo} período</td>
                        <td className="p-3 text-slate-900 font-extrabold">{r.disciplina}</td>
                        {monthsP.map(m => {
                          const c = r.cells[m];
                          if (!c) return <td key={m} className="p-3 text-right text-slate-300">-</td>;
                          if (c.type === 'text') {
                            return (
                              <td key={m} className="p-3 text-right">
                                <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[9px] font-bold uppercase whitespace-nowrap">
                                  {c.text}
                                </span>
                              </td>
                            );
                          }
                          return (
                            <td key={m} className="p-3 text-right text-slate-800">
                              {formatBrl(c.value)}
                            </td>
                          );
                        })}
                        <td className="p-3 text-right font-black text-slate-900 text-[13px]">{formatBrl(getRecordTotal(r))}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            r.status.includes('NÃO') 
                              ? 'bg-red-100 text-red-800 border border-red-200' 
                              : r.status.includes('SEM') 
                                ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: INTERNATO */}
      {activeSubTab === 'internato' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Internato Acadêmico
              </h2>
              <p className="text-slate-500 text-xs font-medium">
                Controle financeiro do Internato Médico com julho marcado como previsão orçamentária de gastos.
              </p>
            </div>
            <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-lg uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Julho = Previsão de Gastos
            </span>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl text-amber-900 text-xs font-medium leading-relaxed shadow-xs flex gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Observação de Previsão:</span> Os valores da coluna de <b>JULHO</b> na aba de <b>GASTOS INTERNATO 2026.1</b> representam uma modelagem estimativa feita pela comissão fiscal.
            </div>
          </div>

          {/* Internato KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Total Internato</span>
              <h3 className="text-xl md:text-2xl font-black text-blue-600 mt-2 tracking-tight">{formatShort(totalI)}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Completo: {formatBrl(totalI)}</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Modelagem Julho</span>
              <h3 className="text-xl md:text-2xl font-black text-amber-700 mt-2 tracking-tight">{formatShort(mi.JULHO || 0)}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Previsão em faturamento</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Maior Período letivo</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight">
                {(Object.entries(periodI) as [string, number][]).sort((a,b)=>b[1]-a[1])[0]?.[0]}º período
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">{formatBrl((Object.entries(periodI) as [string, number][]).sort((a,b)=>b[1]-a[1])[0]?.[1] || 0)} acumulado</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Células de Texto</span>
              <h3 className="text-xl md:text-2xl font-black text-emerald-600 mt-2 tracking-tight">
                {textCells.filter(c => c.aba === 'Internato').length}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Status exato preservado</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Ranking por Período / Rodízio</h3>
              <div className="space-y-4 pt-1">
                {sortedInternato.map((r, idx) => {
                  const val = getRecordTotal(r);
                  const maxVal = getRecordTotal(sortedInternato[0]);
                  const pctWidth = (val / maxVal) * 100;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-start text-[11px] font-bold">
                        <div className="space-y-0.5">
                          <span className="text-slate-900 font-extrabold block">
                            {r.rodizio} • {r.disciplina}
                          </span>
                          <span className="text-slate-400 text-[10px] font-semibold">{r.periodo} período</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-900 font-black block">{formatBrl(val)}</span>
                          <span className="text-slate-400 text-[10px] font-medium">({formatPct(val / totalI, 1)})</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            idx === 0 
                              ? 'bg-gradient-to-r from-blue-700 to-indigo-500' 
                              : 'bg-gradient-to-r from-blue-500 to-sky-400'
                          }`}
                          style={{ width: `${pctWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Evolução Mensal do Internato</h3>
              <div className="space-y-4 pt-2">
                {months.map(m => {
                  const val = mi[m] || 0;
                  const maxVal = Math.max(...months.map(mon => mi[mon] || 0), 1);
                  const pctWidth = (val / maxVal) * 100;
                  return (
                    <div key={m} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          {capitalize(m)}
                          {m === 'JULHO' && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[8px] rounded font-black uppercase">
                              PREV
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-900">
                          <span>{formatBrl(val)}</span>
                          <span className="text-slate-400 text-[10px] font-medium">({formatPct(val / totalI, 1)})</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            m === 'JULHO' ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-blue-600 to-blue-500'
                          }`}
                          style={{ width: `${pctWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* INTERNATO FULL TABLE */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Tabela Completa do Internato</h3>
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-xs text-left font-bold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">
                    <th className="p-3">Período</th>
                    <th className="p-3">Rodízio</th>
                    <th className="p-3">Disciplina</th>
                    {months.map(m => (
                      <th key={m} className="p-3 text-right">
                        {capitalize(m)}
                        {m === 'JULHO' && <span className="block text-[8px] text-amber-700 font-black">Previsão</span>}
                      </th>
                    ))}
                    <th className="p-3 text-right">Total Acumulado</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                  {internato.map((r, idx) => {
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{r.periodo} período</td>
                        <td className="p-3 font-bold text-slate-800">{r.rodizio}</td>
                        <td className="p-3 text-slate-900 font-extrabold">{r.disciplina}</td>
                        {months.map(m => {
                          const c = r.cells[m];
                          if (!c) return <td key={m} className="p-3 text-right text-slate-300">-</td>;
                          if (c.type === 'text') {
                            return (
                              <td key={m} className="p-3 text-right">
                                <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[9px] font-bold uppercase whitespace-nowrap">
                                  {c.text}
                                </span>
                              </td>
                            );
                          }
                          return (
                            <td 
                              key={m} 
                              className={`p-3 text-right font-semibold text-slate-800 ${
                                m === 'JULHO' && c.value > 0 ? 'bg-amber-50/50' : ''
                              }`}
                            >
                              {formatBrl(c.value)}
                              {m === 'JULHO' && c.value > 0 && (
                                <span className="block text-[8px] text-amber-700 font-black uppercase">
                                  Previsão
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="p-3 text-right font-black text-slate-900 text-[13px]">{formatBrl(getRecordTotal(r))}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            r.status.includes('NÃO') 
                              ? 'bg-red-100 text-red-800 border border-red-200' 
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: COMPARATIVO */}
      {activeSubTab === 'comparativo' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Comparativo: Internato vs Atividades
              </h2>
              <p className="text-slate-500 text-xs font-medium">
                Diferença estrutural de volumetria e distribuição de competência orçamentária.
              </p>
            </div>
            <span className="self-start sm:self-auto inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wider">
              Comparativo
            </span>
          </div>

          {/* Comparativo KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Participação Internato</span>
              <h3 className="text-xl md:text-2xl font-black text-blue-600 mt-2 tracking-tight">{formatPct(totalI / totalC)}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Total: {formatBrl(totalI)}</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Participação Atividades</span>
              <h3 className="text-xl md:text-2xl font-black text-amber-600 mt-2 tracking-tight">{formatPct(totalP / totalC)}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Total: {formatBrl(totalP)}</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Julho Consolidado</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight">{formatShort(mi.JULHO || 0)}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Previsão exclusiva do Internato</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Textos Preservados</span>
              <h3 className="text-xl md:text-2xl font-black text-emerald-600 mt-2 tracking-tight">{textCells.length}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Detalhados em Auditoria</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Barras Empilhadas por Mês</h3>
              
              <div className="space-y-4 pt-2">
                {months.map(m => {
                  const intVal = mi[m] || 0;
                  const pracVal = mp[m] || 0;
                  const totalM = intVal + pracVal;
                  const maxM = Math.max(...months.map(mon => (mi[mon]||0) + (mp[mon]||0)), 1);

                  const intPct = (intVal / maxM) * 100;
                  const pracPct = (pracVal / maxM) * 100;

                  return (
                    <div key={m} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-700 flex items-center gap-1">
                          {capitalize(m)}
                          {m === 'JULHO' && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-black uppercase rounded">
                              PREV
                            </span>
                          )}
                        </span>
                        <span className="text-slate-900">{formatBrl(totalM)}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-6 rounded-lg overflow-hidden flex shadow-xs">
                        {intVal > 0 && (
                          <div 
                            className="bg-blue-600 h-full flex items-center justify-end pr-2 transition-all"
                            style={{ width: `${intPct}%` }}
                            title={`Internato: ${formatBrl(intVal)}`}
                          >
                            {intPct > 15 && <span className="text-[9px] text-white font-extrabold">{formatShort(intVal)}</span>}
                          </div>
                        )}
                        {pracVal > 0 && (
                          <div 
                            className="bg-amber-500 h-full flex items-center justify-end pr-2 transition-all"
                            style={{ width: `${pracPct}%` }}
                            title={`Atividades: ${formatBrl(pracVal)}`}
                          >
                            {pracPct > 15 && <span className="text-[9px] text-white font-extrabold">{formatShort(pracVal)}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold pt-2 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-blue-600 rounded-md" />
                  <span>Internato</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-amber-500 rounded-md" />
                  <span>Atividades Práticas</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Top Áreas Consolidadas</h3>
              <div className="space-y-4 pt-1">
                {areaTotals.slice(0, 8).map(([area, val], idx) => {
                  const maxVal = areaTotals[0]?.[1] || 1;
                  const pctWidth = (val / maxVal) * 100;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-700 truncate max-w-[150px] md:max-w-xs">{capitalize(area)}</span>
                        <span className="text-slate-900">{formatShort(val)}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-slate-700 transition-all"
                          style={{ width: `${pctWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 6: QUALIDADE DOS DADOS / AUDITORIA */}
      {activeSubTab === 'qualidade' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Controle e Qualidade dos Dados
              </h2>
              <p className="text-slate-500 text-xs font-medium">
                Auditoria de células textuais, sem prejuízo orçamentário e integridade do modelo.
              </p>
            </div>
            <span className="self-start sm:self-auto inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-lg uppercase tracking-wider">
              Auditoria
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Registros Totais</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight">{allRecords.length}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">8 Internato + 30 Atividades</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Células com Texto</span>
              <h3 className="text-xl md:text-2xl font-black text-amber-700 mt-2 tracking-tight">{textCells.length}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">NÃO PAGA ou NÃO TEVE PRECEPTORIA</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Julho Internato</span>
              <h3 className="text-xl md:text-2xl font-black text-blue-600 mt-2 tracking-tight">Previsão</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Aba modelada em separado</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Alertas de Auditoria</h3>
              <ul className="space-y-3 text-xs font-semibold text-slate-600">
                <li className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span>Células com strings de texto foram tratadas como <b>R$ 0,00</b> para não distorcer as análises e médias numéricas.</span>
                </li>
                <li className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>A coluna de <b>JULHO</b> na aba GASTOS INTERNATO 2026.1 é de caráter preditivo/previsão e necessita homologação final.</span>
                </li>
                <li className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Todos os demais meses representam despesas de competência devidamente liquidadas ou em vias de repasse final.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Células com Texto Original</h3>
              <div className="overflow-x-auto border border-slate-100 rounded-xl max-h-72">
                <table className="w-full text-xs text-left font-bold text-slate-700">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">
                      <th className="p-3">Aba</th>
                      <th className="p-3">Período</th>
                      <th className="p-3">Rodízio</th>
                      <th className="p-3">Disciplina</th>
                      <th className="p-3">Mês</th>
                      <th className="p-3">Texto Exato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                    {textCells.map((c, idx) => {
                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                              c.aba === 'Internato' ? 'bg-blue-50 text-blue-700 border border-blue-200/50' : 'bg-amber-50 text-amber-800 border border-amber-200/50'
                            }`}>
                              {c.aba === 'Internato' ? 'Internato' : 'Atividades'}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-slate-900">{c.periodo}</td>
                          <td className="p-3 text-slate-500">{c.rodizio}</td>
                          <td className="p-3 text-slate-900 font-bold">{c.disciplina}</td>
                          <td className="p-3 text-slate-800">{capitalize(c.mes)}</td>
                          <td className="p-3">
                            <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-black uppercase whitespace-nowrap">
                              {c.texto}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ZERO / EXCLUDED VALUES TABLE */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Registros Sem Desembolso</h3>
            <p className="text-[10px] text-slate-400 font-semibold pt-0.5">
              Disciplinas ou rodízios que resultaram em R$ 0,00 no semestre acumulado (Status NÃO PAGA ou similar).
            </p>
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-xs text-left font-bold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Período</th>
                    <th className="p-3">Rodízio</th>
                    <th className="p-3">Disciplina</th>
                    <th className="p-3 text-right">Total Acumulado</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                  {allRecords.filter(r => getRecordTotal(r) === 0).map((r, idx) => {
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                            r.tipo === 'Internato' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-800'
                          }`}>
                            {r.tipo}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-900">{r.periodo} período</td>
                        <td className="p-3 text-slate-500">{r.rodizio || '-'}</td>
                        <td className="p-3 text-slate-900 font-bold">{r.disciplina}</td>
                        <td className="p-3 text-right font-black text-slate-900">{formatBrl(getRecordTotal(r))}</td>
                        <td className="p-3 text-center">
                          <span className="inline-block px-2.5 py-1 bg-red-100 text-red-800 border border-red-200 rounded-full text-[9px] font-black uppercase">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* RECOMENDADO MODELO FUTURO */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Modelo Futuro de Dados</h3>
              <p className="text-[10px] text-slate-400 font-semibold">
                Estrutura de dados normalizada recomendada para importações diretas no Power BI, Excel ou Datalake.
              </p>
            </div>
            
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-xs text-left font-bold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">
                    <th className="p-3">Campo Sugerido</th>
                    <th className="p-3">Tipo do Dado</th>
                    <th className="p-3">Finalidade / Aplicação Acadêmica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                  {[
                    { campo: 'Tipo', tipo: 'Texto', desc: 'Identifica se o registro pertence ao Internato ou Atividades Práticas' },
                    { campo: 'Período', tipo: 'Texto / Inteiro', desc: 'Eixo principal de análise temporal de fluxos curriculares' },
                    { campo: 'Rodízio', tipo: 'Texto', desc: 'Estágio específico de atuação no Internato (ex: INTERNATO 1)' },
                    { campo: 'Disciplina', tipo: 'Texto', desc: 'Nome padronizado da disciplina vinculada' },
                    { campo: 'Mês', tipo: 'Texto (Competência)', desc: 'Mês de apuração financeira das horas de preceptoria' },
                    { campo: 'Valor', tipo: 'Decimal / Float', desc: 'Valor numérico real da célula (textos convertidos em 0.00)' },
                    { campo: 'Texto Original', tipo: 'Texto', desc: 'Preserva anotações como "NÃO PAGA", "NÃO TEVE PRECEPTORIA" etc.' },
                    { campo: 'Flag Previsão', tipo: 'Booleano (True/False)', desc: 'Marcação especial para os gastos projetados de julho no Internato' }
                  ].map((f, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-900 font-bold">{f.campo}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] rounded font-bold">
                          {f.tipo}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
