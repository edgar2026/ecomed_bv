import React, { useState, useMemo } from 'react';
import { getAlunosSimulaMed, AlunoSimulaMed } from '../data/simulamedData';
import {
  Sparkles,
  Users,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  UserCheck,
  Layers,
  FileSpreadsheet,
  FileText,
  BookMarked,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  MessageCircle,
  Award
} from 'lucide-react';

interface SimulaMedModuleProps {
  subPage: string;
  setSubPage: (page: string) => void;
}

export function SimulaMedModule({ subPage, setSubPage }: SimulaMedModuleProps) {
  // Always lock navigation to 'dashboard' in this version
  const activeSubPage = 'dashboard';

  // 1. Data load
  const allAlunos = useMemo(() => getAlunosSimulaMed(), []);

  // 2. States for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriodo, setSelectedPeriodo] = useState('Todos');
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');
  const [selectedOrientador, setSelectedOrientador] = useState('Todos');

  // Sorting state
  const [sortField, setSortField] = useState<'nome' | 'media' | 'periodo'>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Selected student for detail modal
  const [selectedAluno, setSelectedAluno] = useState<AlunoSimulaMed | null>(null);

  // Hovered state for tooltip locking
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);

  // Dynamic lists for filter dropdowns
  const orientadoresList = useMemo(() => {
    const list = new Set<string>();
    allAlunos.forEach(a => {
      if (a.orientador && a.orientador.trim() !== '') {
        list.add(a.orientador.trim());
      }
    });
    return Array.from(list).sort();
  }, [allAlunos]);

  const categoriasList = useMemo(() => {
    const list = new Set<string>();
    allAlunos.forEach(a => {
      if (a.categoria && a.categoria.trim() !== '') {
        list.add(a.categoria.trim());
      }
    });
    return Array.from(list).sort();
  }, [allAlunos]);

  // Handle sorting helper
  const handleSort = (field: 'nome' | 'media' | 'periodo') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 3. Filter and Sort logic
  const filteredAndSortedAlunos = useMemo(() => {
    let result = allAlunos.filter(al => {
      // Search matches name or phone
      const matchesSearch =
        al.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        al.telefone.includes(searchTerm);

      // Period filter
      const matchesPeriodo =
        selectedPeriodo === 'Todos' || al.periodo === selectedPeriodo;

      // Category filter
      const matchesCategoria =
        selectedCategoria === 'Todos' || al.categoria === selectedCategoria;

      // Advisor filter
      const matchesOrientador =
        selectedOrientador === 'Todos' || al.orientador === selectedOrientador;

      return matchesSearch && matchesPeriodo && matchesCategoria && matchesOrientador;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'nome') {
        comparison = a.nome.localeCompare(b.nome);
      } else if (sortField === 'media') {
        const valA = a.media !== null ? a.media : -1;
        const valB = b.media !== null ? b.media : -1;
        comparison = valA - valB;
      } else if (sortField === 'periodo') {
        comparison = a.periodo.localeCompare(b.periodo);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [allAlunos, searchTerm, selectedPeriodo, selectedCategoria, selectedOrientador, sortField, sortOrder]);

  // Pagination calculation
  const paginatedAlunos = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedAlunos.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedAlunos, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedAlunos.length / rowsPerPage));

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedPeriodo, selectedCategoria, selectedOrientador]);

  // 4. Analytics and Statistics calculations
  const stats = useMemo(() => {
    const total = filteredAndSortedAlunos.length;
    if (total === 0) {
      return {
        total: 0,
        average: 0,
        highPerformanceCount: 0,
        highPerformancePct: 0,
        criticalCount: 0,
        criticalPct: 0
      };
    }

    let mediaSum = 0;
    let mediaCount = 0;
    let highPerformance = 0;
    let critical = 0;

    filteredAndSortedAlunos.forEach(a => {
      if (a.media !== null) {
        mediaSum += a.media;
        mediaCount++;
        if (a.media >= 60) {
          highPerformance++;
        }
      }
      if (a.categoria === 'Alerta Máximo' || a.categoria === 'Sem possibilidade de acompanhamento') {
        critical++;
      }
    });

    const average = mediaCount > 0 ? mediaSum / mediaCount : 0;

    return {
      total,
      average: parseFloat(average.toFixed(2)),
      highPerformanceCount: highPerformance,
      highPerformancePct: Math.round((highPerformance / total) * 100),
      criticalCount: critical,
      criticalPct: Math.round((critical / total) * 100)
    };
  }, [filteredAndSortedAlunos]);

  // Calculate averages per exam dynamically for charts
  const examAverages = useMemo(() => {
    let s1Sum = 0, s1Count = 0;
    let s2Sum = 0, s2Count = 0;
    let s3Sum = 0, s3Count = 0;
    let s4Sum = 0, s4Count = 0;

    filteredAndSortedAlunos.forEach(a => {
      const v1 = parseFloat(a.s1);
      if (!isNaN(v1)) { s1Sum += v1; s1Count++; }
      const v2 = parseFloat(a.s2);
      if (!isNaN(v2)) { s2Sum += v2; s2Count++; }
      const v3 = parseFloat(a.s3);
      if (!isNaN(v3)) { s3Sum += v3; s3Count++; }
      const v4 = parseFloat(a.s4);
      if (!isNaN(v4)) { s4Sum += v4; s4Count++; }
    });

    return [
      { label: 'S1', value: s1Count > 0 ? parseFloat((s1Sum / s1Count).toFixed(1)) : 0 },
      { label: 'S2', value: s2Count > 0 ? parseFloat((s2Sum / s2Count).toFixed(1)) : 0 },
      { label: 'S3', value: s3Count > 0 ? parseFloat((s3Sum / s3Count).toFixed(1)) : 0 },
      { label: 'S4', value: s4Count > 0 ? parseFloat((s4Sum / s4Count).toFixed(1)) : 0 }
    ];
  }, [filteredAndSortedAlunos]);

  // Category distribution calculation
  const categoryDistribution = useMemo(() => {
    const distribution: Record<string, number> = {
      'Proficiente': 0,
      'Semi Proficiente': 0,
      'Não Proficiente +': 0,
      'Não Proficiente -': 0,
      'Alerta Máximo': 0,
      'Sem possibilidade de acompanhamento': 0
    };

    filteredAndSortedAlunos.forEach(a => {
      if (distribution[a.categoria] !== undefined) {
        distribution[a.categoria]++;
      }
    });

    const total = filteredAndSortedAlunos.length || 1;
    return Object.entries(distribution).map(([name, count]) => ({
      name,
      count,
      pct: parseFloat(((count / total) * 100).toFixed(1))
    }));
  }, [filteredAndSortedAlunos]);

  // Action: Export filtered dataset to CSV
  const handleExportCSV = () => {
    const headers = ['Nome', 'Periodo', 'Simulado 1', 'Simulado 2', 'Simulado 3', 'Simulado de Reposicao', 'Simulado 4', 'Media ENAMED', 'Classificacao', 'Telefone', 'Orientador', 'Plataforma', 'Contato Realizado', 'Feedback'];
    
    const rows = filteredAndSortedAlunos.map(a => [
      `"${a.nome}"`,
      `"${a.periodo}"`,
      `"${a.s1}"`,
      `"${a.s2}"`,
      `"${a.s3}"`,
      `"${a.rep}"`,
      `"${a.s4}"`,
      a.media !== null ? a.media.toFixed(2) : '"N/A"',
      `"${a.categoria}"`,
      `"${a.telefone}"`,
      `"${a.orientador}"`,
      `"${a.plataforma}"`,
      `"${a.contato}"`,
      `"${a.feedback.replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `simulamed_alunos_filtrados_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Action: Print dashboard
  const handlePrint = () => {
    window.print();
  };

  // Helper: Format WhatsApp API link
  const getWhatsAppLink = (nome: string, telefone: string) => {
    const cleanNumber = telefone.replace(/\D/g, '');
    const fullNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
    const textMessage = `Olá ${nome}, sou o Diretor Hesdras Viana da UNINASSAU. Gostaria de conversar sobre seu rendimento e cronograma de estudos no programa SimulaMed.`;
    return `https://wa.me/${fullNumber}?text=${encodeURIComponent(textMessage)}`;
  };

  // Subpages for rendering menu
  const subPagesList = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'alunos', label: 'Alunos ENAMED', icon: Users },
    { id: 'simulados', label: 'Simulados', icon: FileSpreadsheet },
    { id: 'desempenho', label: 'Desempenho', icon: TrendingUp },
    { id: 'orientadores', label: 'Orientadores', icon: UserCheck },
    { id: 'acompanhamentos', label: 'Acompanhamentos', icon: Clock },
    { id: 'plataformas', label: 'Plataformas', icon: BookMarked }
  ];

  // Colors mapping for badges
  const categoryStyles: Record<string, string> = {
    'Proficiente': 'text-emerald-700 bg-emerald-50 border-emerald-200',
    'Semi Proficiente': 'text-blue-700 bg-blue-50 border-blue-200',
    'Não Proficiente +': 'text-amber-700 bg-amber-50 border-amber-200',
    'Não Proficiente -': 'text-orange-700 bg-orange-50 border-orange-200',
    'Alerta Máximo': 'text-rose-700 bg-rose-50 border-rose-200',
    'Sem possibilidade de acompanhamento': 'text-slate-700 bg-slate-50 border-slate-200'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 print:bg-white print:p-0">
      {/* 1. Top Bar Module Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-950 uppercase tracking-wide">Plataforma SimulaMed</h2>
            <p className="text-xs text-slate-500 font-semibold">Monitoramento de Desempenho e Preparação para o ENAMED</p>
          </div>
        </div>
      </div>

      {/* 2. Actions and Search Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" /> Filtros de Monitoramento Acadêmico
            </h3>
            <p className="text-[11px] text-slate-400">Refine a lista de alunos por período, classificação, tutor e texto de pesquisa.</p>
          </div>
          <div className="flex items-center gap-2 self-end">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors bg-white shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors bg-white shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Text Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold"
            />
          </div>

          {/* Period dropdown */}
          <div>
            <select
              value={selectedPeriodo}
              onChange={(e) => setSelectedPeriodo(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
            >
              <option value="Todos">Todos os Períodos</option>
              <option value="10º">10º Período</option>
              <option value="11º">11º Período</option>
            </select>
          </div>

          {/* Category dropdown */}
          <div>
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
            >
              <option value="Todos">Todas as Classificações</option>
              {categoriasList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Advisor dropdown */}
          <div>
            <select
              value={selectedOrientador}
              onChange={(e) => setSelectedOrientador(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
            >
              <option value="Todos">Todos os Orientadores</option>
              {orientadoresList.map(or => (
                <option key={or} value={or}>{or}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. KPI Indicators Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
        {/* KPI 1: Active students count */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Alunos Ativos</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.total}</h3>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold mt-2">Registrados sob filtros atuais</p>
        </div>

        {/* KPI 2: Class proficiency average */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Média Geral SimulaMed</span>
            <h3 className="text-2xl font-black text-blue-700 mt-1">
              {stats.average > 0 ? `${stats.average}%` : 'N/A'}
            </h3>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-2">▲ Nota de corte ENAMED (~60%)</p>
        </div>

        {/* KPI 3: High performance rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Alta Performance (≥ 60%)</span>
            <h3 className="text-2xl font-black text-emerald-700 mt-1">{stats.highPerformanceCount}</h3>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-2">{stats.highPerformancePct}% do corpo discente filtrado</p>
        </div>

        {/* KPI 4: Critical students alert */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Alunos Críticos / Alerta</span>
            <h3 className="text-2xl font-black text-rose-600 mt-1">{stats.criticalCount}</h3>
          </div>
          <p className="text-[10px] text-rose-500 font-semibold mt-2">{stats.criticalPct}% necessitando tutoria imediata</p>
        </div>
      </div>

      {/* 4. Interactive Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-1">
        {/* Dynamic line chart of Exam Progress */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Rendimento Histórico dos Simulados
            </h3>
            <p className="text-[11px] text-slate-400">Evolução do rendimento médio consolidado para as avaliações aplicadas S1, S2, S3 e S4.</p>
          </div>

          <div className="h-64 bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
            {/* Grid Line Labels */}
            <div className="absolute inset-y-0 left-0 bottom-12 top-4 w-full flex flex-col justify-between pointer-events-none z-0 px-2">
              <div className="border-t border-slate-200/40 w-full text-[9px] text-slate-400 pt-0.5">Média Ideal: 80%</div>
              <div className="border-t border-slate-200/40 w-full text-[9px] text-slate-400 pt-0.5">Corte ENAMED: 60%</div>
              <div className="border-t border-slate-200/40 w-full text-[9px] text-slate-400 pt-0.5">Alerta Crítico: 50%</div>
            </div>

            {/* Custom SVG Line Chart */}
            <svg className="w-full h-full absolute inset-0 z-10 p-6" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Dynamic Coordinate points calculations */}
              {(() => {
                const points = examAverages.map((exam, idx) => {
                  const x = 50 + (idx * 133); // Spans evenly across 500 max width
                  // Convert 0-100% value to 0-150px height inside SVG coordinate plane
                  const y = 140 - ((exam.value / 100) * 120);
                  return { x, y, value: exam.value, label: exam.label };
                });

                if (points.length === 0 || points.every(p => p.value === 0)) {
                  return (
                    <text x="250" y="90" textAnchor="middle" fill="#94a3b8" className="text-xs font-semibold">
                      Sem dados suficientes para gerar gráfico
                    </text>
                  );
                }

                // Construct line path string
                const lineD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                const areaD = `${lineD} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z`;

                return (
                  <g>
                    {/* Filled gradient area under line */}
                    <path d={areaD} fill="url(#chartLineGrad)" />
                    {/* Primary trend line */}
                    <path d={lineD} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />

                    {/* Nodes and tooltip helpers */}
                    {points.map((p, idx) => (
                      <g key={idx} className="group/node">
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="6"
                          fill="#2563eb"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="transition-all hover:scale-125 cursor-pointer"
                        />
                        {/* Display values permanently atop the node circles */}
                        <text
                          x={p.x}
                          y={p.y - 10}
                          textAnchor="middle"
                          fill="#1e293b"
                          className="text-[10px] font-extrabold"
                        >
                          {p.value}%
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })()}
            </svg>

            {/* X-Axis bottom labels */}
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase z-20 pt-48 px-12 print:px-6">
              <div className="text-center">
                <span className="block text-slate-400 font-extrabold text-[8px]">Março</span>
                <span>Simulado 1</span>
              </div>
              <div className="text-center">
                <span className="block text-slate-400 font-extrabold text-[8px]">Abril</span>
                <span>Simulado 2</span>
              </div>
              <div className="text-center">
                <span className="block text-slate-400 font-extrabold text-[8px]">Maio</span>
                <span>Simulado 3</span>
              </div>
              <div className="text-center">
                <span className="block text-slate-400 font-extrabold text-[8px]">Junho</span>
                <span>Simulado 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Classification Categories Distribution Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" /> Distribuição de Alunos
            </h3>
            <p className="text-[11px] text-slate-400">Classificação atualizada com base na performance geral das médias ponderadas.</p>
          </div>

          <div className="space-y-3 pt-1">
            {categoryDistribution.map((cat, i) => {
              // Custom text and progress colors based on class
              const isHigh = cat.name.includes('Proficiente') && !cat.name.includes('Não');
              const isAlert = cat.name.includes('Alerta') || cat.name.includes('Sem possibilidade');
              
              const barColor = isHigh ? 'bg-emerald-500' : isAlert ? 'bg-rose-500' : 'bg-amber-500';

              return (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between items-baseline font-bold text-slate-700">
                    <span className="text-[11px] truncate pr-2">{cat.name}</span>
                    <span className="font-extrabold text-slate-900 text-right shrink-0">{cat.count} ({cat.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
                    <div className={`h-full ${barColor} rounded-full`} style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Students Database Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Registros Detalhados dos Alunos
            </h3>
            <p className="text-[11px] text-slate-400">Acesse notas individuais de simulados, média unificada, e histórico de interações acadêmicas.</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full self-start">
            Exibindo {filteredAndSortedAlunos.length} aluno(s)
          </span>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('nome')}>
                  Aluno {sortField === 'nome' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('periodo')}>
                  Período {sortField === 'periodo' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="py-3 px-2 text-center">S1</th>
                <th className="py-3 px-2 text-center">S2</th>
                <th className="py-3 px-2 text-center">S3</th>
                <th className="py-3 px-2 text-center">S4</th>
                <th className="py-3 px-4 text-center cursor-pointer hover:text-slate-900" onClick={() => handleSort('media')}>
                  Média unificada {sortField === 'media' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="py-3 px-4">Classificação Acadêmica</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {paginatedAlunos.length > 0 ? (
                paginatedAlunos.map((al, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900 leading-tight">{al.nome}</div>
                      <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{al.telefone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-bold">{al.periodo}</td>
                    <td className="py-3 px-2 text-center font-bold text-slate-600">{al.s1}</td>
                    <td className="py-3 px-2 text-center font-bold text-slate-600">{al.s2}</td>
                    <td className="py-3 px-2 text-center font-bold text-slate-600">{al.s3}</td>
                    <td className="py-3 px-2 text-center font-bold text-slate-600">{al.s4}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs font-black text-blue-700">
                        {al.media !== null ? `${al.media.toFixed(1)}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border ${categoryStyles[al.categoria] || 'text-slate-600 bg-slate-50 border-slate-200'}`}>
                        {al.categoria}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedAluno(al)}
                        className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-extrabold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-3xs"
                      >
                        Ver Ficha
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-semibold">
                    Nenhum aluno corresponde aos filtros estabelecidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Classic Pagination Component */}
        {filteredAndSortedAlunos.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between print:hidden">
            <span className="text-xs text-slate-500 font-semibold">
              Página <strong className="text-slate-900 font-extrabold">{currentPage}</strong> de <strong className="text-slate-900 font-extrabold">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-3xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-3xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Complete Student Details Modal (Ficha de Acompanhamento) */}
      {selectedAluno && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 print:hidden">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col font-medium max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <Award className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">{selectedAluno.nome}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{selectedAluno.periodo} Período • Medicina UNINASSAU</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAluno(null)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Classification Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Classificação de Status</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${categoryStyles[selectedAluno.categoria]}`}>
                      {selectedAluno.categoria}
                    </span>
                  </div>
                </div>
                <div className="text-right sm:text-right text-xs">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">Média de Simulados</span>
                  <strong className="text-lg font-black text-blue-700">
                    {selectedAluno.media !== null ? `${selectedAluno.media.toFixed(1)}%` : 'N/A'}
                  </strong>
                </div>
              </div>

              {/* Individual exam progress */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Notas Obtidas nos Simulados</span>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-extrabold block">Simulado 1</span>
                    <strong className="text-base font-extrabold text-slate-800 mt-1 block">{selectedAluno.s1 || 'Não Fez'}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-extrabold block">Simulado 2</span>
                    <strong className="text-base font-extrabold text-slate-800 mt-1 block">{selectedAluno.s2 || 'Não Fez'}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-extrabold block">Simulado 3</span>
                    <strong className="text-base font-extrabold text-slate-800 mt-1 block">{selectedAluno.s3 || 'Não Fez'}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-extrabold block">Simulado 4</span>
                    <strong className="text-base font-extrabold text-slate-800 mt-1 block">{selectedAluno.s4 || 'Não Fez'}</strong>
                  </div>
                </div>
              </div>

              {/* Informações de tutoria e feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase">Orientador Responsável</span>
                    <p className="font-extrabold text-slate-800">{selectedAluno.orientador || 'Nenhum orientador designado'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase">Plataforma de Estudo Primária</span>
                    <p className="font-extrabold text-slate-800">{selectedAluno.plataforma || 'Nenhuma plataforma vinculada'}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase">Contato Efetuado</span>
                    <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md ${selectedAluno.contato === 'SIM' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-200'}`}>
                      {selectedAluno.contato || 'NÃO'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase">Telefone de Contato</span>
                    <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-600" /> {selectedAluno.telefone || 'Sem contato cadastrado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tutors observations / feedback block */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Parecer do Orientador / Observações</span>
                <p className="text-slate-800 font-medium leading-relaxed italic bg-white p-3 rounded border border-slate-100">
                  {selectedAluno.feedback && selectedAluno.feedback.trim() !== ''
                    ? `"${selectedAluno.feedback}"`
                    : 'Sem observações registradas para este estudante.'}
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setSelectedAluno(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors bg-white shadow-3xs"
              >
                Fechar Ficha
              </button>

              {selectedAluno.telefone && (
                <a
                  href={getWhatsAppLink(selectedAluno.nome, selectedAluno.telefone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-extrabold hover:bg-emerald-700 transition-all shadow-3xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
