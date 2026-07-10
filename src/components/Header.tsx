import React, { useState } from 'react';
import { ModuleId } from '../types';
import { MODULES } from './Sidebar';
import {
  Bell,
  Settings,
  HelpCircle,
  Search,
  User,
  ChevronRight,
  Sparkles,
  UserCheck,
  AlertTriangle,
  Receipt
} from 'lucide-react';

interface HeaderProps {
  activeModule: ModuleId;
  activeSubPage: string;
  onSearch: (term: string) => void;
}

export function Header({ activeModule, activeSubPage, onSearch }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Find label of active module and subpage
  const modInfo = MODULES.find((m) => m.id === activeModule);
  const subPageInfo = modInfo?.subPages.find((s) => s.id === activeSubPage);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const mockNotifications = [
    {
      id: 1,
      icon: AlertTriangle,
      color: 'text-error bg-error-container',
      title: 'Divergência de Saldo',
      desc: 'NF-4592 (Hospital Esperança) apresenta divergência de -R$ 450,00.',
      time: 'Há 5 min'
    },
    {
      id: 2,
      icon: UserCheck,
      color: 'text-green-700 bg-green-50',
      title: 'Preceptor Credenciado',
      desc: 'Dr. Roberto Almeida completou o envio de documentos.',
      time: 'Há 1 hora'
    },
    {
      id: 3,
      icon: Receipt,
      color: 'text-secondary-container bg-primary-fixed',
      title: 'RPA Emitido',
      desc: 'Dra. Camila Moraes solicitou RPA de Junho/2026.',
      time: 'Há 3 horas'
    }
  ];

  return (
    <header
      id="main-header"
      className="bg-white border-b border-outline-variant fixed top-0 right-0 left-0 h-16 z-40 flex items-center justify-between px-6 select-none"
      style={{ marginLeft: 'var(--spacing-sidebar-width, 256px)' }}
    >
      {/* Left side: Breadcrumbs */}
      <div className="flex items-center gap-4">
        <span className="font-bold text-primary text-base tracking-wide whitespace-nowrap">
          Ecossistema de Medicina
        </span>
        <div className="hidden md:flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
          <ChevronRight className="w-3.5 h-3.5 text-outline" />
          <span className="text-secondary font-semibold capitalize">
            {modInfo?.label}
          </span>
          {subPageInfo && activeSubPage !== 'dashboard' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-outline" />
              <span className="text-on-surface font-semibold">
                {subPageInfo.label}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right side: Search, notifications, help & profile */}
      <div className="flex items-center gap-4">
        {/* Search Input bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden lg:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="Buscar preceptores, notas, escalas..."
            className="w-full pl-9 pr-4 py-1.5 rounded-full border border-outline-variant bg-surface-container-low text-on-surface text-xs focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
          />
        </form>



        {/* User Profile display */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex flex-col text-right leading-tight">
            <span className="text-xs font-bold text-primary">Hesdras Viana</span>
            <span className="text-[10px] text-slate-500 font-medium">Diretor de Unidade</span>
            <span className="text-[9px] text-slate-400 font-semibold uppercase">UNINASSAU Boa Viagem</span>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-[#e8eeff] flex items-center justify-center shrink-0">
            <User className="text-secondary w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
