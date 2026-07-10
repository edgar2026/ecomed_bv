import { ModuleId } from '../types';
import {
  Home,
  GraduationCap,
  Sparkles,
  Plus,
  LogOut,
  LifeBuoy
} from 'lucide-react';

interface SidebarProps {
  activeModule: ModuleId;
  setActiveModule: (module: ModuleId) => void;
  activeSubPage: string;
  setActiveSubPage: (page: string) => void;
}

interface ModuleInfo {
  id: ModuleId;
  label: string;
  icon: any;
  subPages: { id: string; label: string }[];
}

export const MODULES: ModuleInfo[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    subPages: [
      { id: 'dashboard', label: 'Início' }
    ]
  },
  {
    id: 'preceptores',
    label: 'Gestão de Preceptoria',
    icon: GraduationCap,
    subPages: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'lista', label: 'Cadastro & Lista' },
      { id: 'escalas', label: 'Escalas' },
      { id: 'pagamentos', label: 'Pagamentos' },
      { id: 'nf_rpa', label: 'NF / RPA' },
      { id: 'processos', label: 'Processos & Chamados' },
      { id: 'saldos', label: 'Controle de Saldos' },
      { id: 'relatorios', label: 'Relatórios' }
    ]
  },
  {
    id: 'simulamed',
    label: 'SimulaMed',
    icon: Sparkles,
    subPages: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'alunos', label: 'Alunos' },
      { id: 'simulados', label: 'Simulados' },
      { id: 'desempenho', label: 'Desempenho' },
      { id: 'orientadores', label: 'Orientadores' },
      { id: 'acompanhamentos', label: 'Acompanhamentos' },
      { id: 'plataformas', label: 'Plataformas de Estudo' },
      { id: 'relatorios', label: 'Relatórios' }
    ]
  }
];

export function Sidebar({
  activeModule,
  setActiveModule,
  activeSubPage,
  setActiveSubPage
}: SidebarProps) {
  return (
    <aside
      id="main-sidebar"
      className="bg-primary text-white w-sidebar-width fixed left-0 top-0 bottom-0 flex flex-col z-50 h-screen select-none overflow-hidden"
    >
      {/* Sidebar Header */}
      <div className="px-6 py-5 flex items-center gap-3 border-b border-primary-container shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shrink-0 text-sm">
          E
        </div>
        <div>
          <h1 className="text-xs font-bold text-white tracking-tight leading-tight uppercase">
            Ecossistema
          </h1>
          <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
            de Medicina
          </p>
        </div>
      </div>

      {/* Main Modules Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-2 custom-scrollbar">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          const isSelected = activeModule === mod.id;

          return (
            <div key={mod.id} className="space-y-0.5">
              {/* Parent Nav Button */}
              <button
                onClick={() => {
                  setActiveModule(mod.id);
                  // Default to first subpage of selected module
                  setActiveSubPage(mod.subPages[0].id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-all text-left group ${
                  isSelected
                    ? 'bg-on-secondary-fixed-variant text-white border-l-4 border-secondary-fixed-dim font-semibold'
                    : 'text-primary-fixed-dim hover:bg-primary-container hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 group-hover:scale-105 transition-transform ${
                      isSelected ? 'text-secondary-fixed-dim' : 'text-primary-fixed-dim'
                    }`}
                  />
                  <span className="text-xs font-medium tracking-wide">{mod.label}</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="mt-auto p-3 border-t border-primary-container bg-primary shrink-0 space-y-1">
        <button
          onClick={() => {
            alert('Suporte técnico: contato@sereducacional.com');
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-primary-fixed-dim hover:bg-primary-container hover:text-white text-xs transition-colors"
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Suporte & Ajuda</span>
        </button>
        <div className="px-3 py-1 text-[9px] text-primary-fixed-dim/70 font-semibold tracking-wide uppercase">
          Versão Executiva 2026
        </div>
      </div>
    </aside>
  );
}
