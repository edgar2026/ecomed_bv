import { ModuleId } from '../types';
import {
  Home,
  GraduationCap,
  Sparkles,
  Handshake,
  ExternalLink
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

// Full module structure preserved in code — submenus hidden from interface
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
    label: 'Dados de Preceptores',
    icon: GraduationCap,
    subPages: [
      { id: 'dashboard', label: 'Dashboard' },
      // Hidden from UI — preserved for future activation
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
      // Hidden from UI — preserved for future activation
      { id: 'alunos', label: 'Alunos' },
      { id: 'simulados', label: 'Simulados' },
      { id: 'desempenho', label: 'Desempenho' },
      { id: 'orientadores', label: 'Orientadores' },
      { id: 'acompanhamentos', label: 'Acompanhamentos' },
      { id: 'plataformas', label: 'Plataformas de Estudo' },
      { id: 'relatorios', label: 'Relatórios' }
    ]
  },
  {
    id: 'convenios',
    label: 'Convênios',
    icon: Handshake,
    subPages: [
      { id: 'dashboard', label: 'Dashboard' },
      // Hidden from UI — preserved for future activation
      { id: 'todos', label: 'Todos os Convênios' },
      { id: 'contrapartidas', label: 'Contrapartidas' },
      { id: 'cursos', label: 'Cursos & Vagas' },
      { id: 'obrigacoes', label: 'Obrigações' },
      { id: 'harf', label: 'Destaque: HARF' }
    ]
  }
];

// External sidebar item — same visual pattern as internal modules, opens in a new tab
const EXTERNAL_MENU_ITEMS: { id: string; label: string; href: string; icon: any }[] = [
  {
    id: 'gestao-preceptoria-link',
    label: 'Gestão de Preceptoria',
    href: 'https://gestao-preceptores.vercel.app/',
    icon: ExternalLink
  }
];

// Visual order: Home always first, all remaining items alphabetically
const MENU_ORDER: string[] = [
  'home',
  'convenios',
  'preceptores',
  'gestao-preceptoria-link',
  'simulamed'
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
      <div className="px-6 py-4 flex items-center justify-center border-b border-primary-container shrink-0">
        <img 
          src="/uninassau_logo_white.png" 
          alt="UNINASSAU Logo" 
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Main Modules Navigation List — 4 modules only, no sub-items shown */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-2 custom-scrollbar">
        {MENU_ORDER.map((key) => {
          const external = EXTERNAL_MENU_ITEMS.find((item) => item.id === key);

          if (external) {
            const ExternalIcon = external.icon;

            return (
              <div key={external.id} className="space-y-0.5">
                <a
                  href={external.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded transition-all text-left group text-primary-fixed-dim hover:bg-primary-container hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <ExternalIcon className="w-5 h-5 group-hover:scale-105 transition-transform text-primary-fixed-dim" />
                    <span className="text-xs font-medium tracking-wide">{external.label}</span>
                  </div>
                </a>
              </div>
            );
          }

          const mod = MODULES.find((item) => item.id === key);
          if (!mod) return null;

          const Icon = mod.icon;
          const isSelected = activeModule === mod.id;

          return (
            <div key={mod.id} className="space-y-0.5">
              {/* Parent Nav Button — clicks go directly to dashboard */}
              <button
                onClick={() => {
                  setActiveModule(mod.id);
                  setActiveSubPage('dashboard');
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
    </aside>
  );
}
