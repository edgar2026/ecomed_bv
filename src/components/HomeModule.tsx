import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Building2,
  CalendarDays,
  ShieldAlert,
  Users,
  Award,
  Handshake
} from 'lucide-react';
import { ModuleId } from '../types';

interface HomeModuleProps {
  setActiveModule: (module: ModuleId) => void;
  setActiveSubPage: (subPage: string) => void;
  preceptorsCount: number;
  scalesCount: number;
}

export function HomeModule({
  setActiveModule,
  setActiveSubPage,
  preceptorsCount,
  scalesCount
}: HomeModuleProps) {
  
  const ecosystemKPIs = [
    { label: 'Preceptores Homologados', value: preceptorsCount, change: '+12% este semestre', icon: <GraduationCap className="w-5 h-5 text-blue-600" /> },
    { label: 'Alunos SimulaMed', value: 1840, change: '100% integrados no ENAMED', icon: <Users className="w-5 h-5 text-indigo-600" /> },
    { label: 'Simulados Aplicados', value: 32, change: 'Alta performance acadêmica', icon: <Award className="w-5 h-5 text-emerald-600" /> },
    { label: 'Escalas Realizadas', value: scalesCount, change: '99.2% de assiduidade', icon: <CalendarDays className="w-5 h-5 text-amber-600" /> }
  ];

  const modulesList = [
    {
      id: 'preceptores' as ModuleId,
      title: 'Gestão de Preceptoria',
      desc: 'Módulo integrado para acompanhamento de preceptores de medicina: controle de escalas, faturamento de notas fiscais e RPA, processos de chamados, auditoria de saldos orçamentários e relatórios.',
      status: 'Ativo / Completo',
      statusType: 'success',
      icon: <GraduationCap className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'simulamed' as ModuleId,
      title: 'SimulaMed',
      desc: 'Módulo completo de acompanhamento e preparação para o ENAMED. Controle de simulados, indicadores de desempenho individual e por turma, rankings, orientadores e plataformas de estudo.',
      status: 'Ativo / Completo',
      statusType: 'success',
      icon: <Sparkles className="w-6 h-6 text-amber-500" />
    },
    {
      id: 'convenios' as ModuleId,
      title: 'Convênios',
      desc: 'Painel institucional de acompanhamento dos convênios de estágio da unidade. Controle de vigências, contrapartidas financeiras, distribuição por curso, Gantt de vencimentos e alertas de renovação.',
      status: 'Ativo / Completo',
      statusType: 'success',
      icon: <Handshake className="w-6 h-6 text-rose-600" />
    }
  ];

  const handleModuleClick = (modId: ModuleId) => {
    setActiveModule(modId);
    setActiveSubPage('dashboard');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-md overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="bg-blue-500/30 text-blue-100 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-blue-400/20">
            Holding Ser Educacional
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Ecossistema Integrado de Medicina
          </h1>
          <p className="text-xs text-blue-100 leading-relaxed max-w-2xl">
            Bem-vindo ao centro unificado de operações da UNINASSAU. Esta plataforma consolidada gerencia de forma ágil a Gestão de Preceptoria, preparação de alunos pelo SimulaMed e acompanhamento institucional de Convênios.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => handleModuleClick('preceptores')}
              className="bg-white text-blue-700 font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              Acessar Gestão de Preceptores
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleModuleClick('simulamed')}
              className="bg-blue-600/30 hover:bg-blue-600/50 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm border border-white/20 transition-all flex items-center gap-2"
            >
              Acessar SimulaMed ENAMED
              <ArrowRight className="w-4 h-4 text-blue-200" />
            </button>
            <button
              onClick={() => handleModuleClick('convenios')}
              className="bg-rose-600/30 hover:bg-rose-600/50 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm border border-white/20 transition-all flex items-center gap-2"
            >
              Acessar Convênios
              <ArrowRight className="w-4 h-4 text-rose-200" />
            </button>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden md:block opacity-10">
          <GraduationCap className="w-72 h-72 absolute -right-12 -bottom-12" />
        </div>
      </div>

      {/* Ecosystem-wide Stats */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">KPIs de Desempenho Institucional</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ecosystemKPIs.map((kpi, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-lg shrink-0">
                {kpi.icon}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{kpi.label}</p>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{kpi.value}</h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{kpi.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of Modules */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Painel Unificado de Módulos</h3>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">3 Módulos Completos | Operação Médica</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modulesList.map((mod) => {
            return (
              <div
                key={mod.id}
                onClick={() => handleModuleClick(mod.id)}
                className="group flex flex-col justify-between p-6 bg-white rounded-xl border transition-all cursor-pointer shadow-xs border-slate-200 hover:border-blue-500 hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                      {mod.icon}
                    </div>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-green-50 text-green-700 border border-green-200"
                    >
                      {mod.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors uppercase tracking-wide">
                      {mod.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Acessar Módulo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integration Notice & Expansion Info */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-start gap-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-900 uppercase">Arquitetura de Expansão Homologada</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            O ecossistema está focado na entrega da alta performance operacional. Atualmente, os módulos de <strong>Gestão de Preceptoria</strong>, <strong>SimulaMed</strong> e <strong>Convênios</strong> operam em produção total. Os demais módulos de expansão (Internato, Docentes, Relatórios Corporativos) estão desativados temporariamente e serão integrados no roadmap futuro de expansão.
          </p>
        </div>
      </div>
    </div>
  );
}
