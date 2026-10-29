import { ModuleId } from '../types';
import { MODULES } from './Sidebar';
import { ChevronRight } from 'lucide-react';

interface HeaderProps {
  activeModule: ModuleId;
  activeSubPage: string;
  onSearch: (term: string) => void;
}

export function Header({ activeModule, activeSubPage }: HeaderProps) {
  // Find label of active module and subpage
  const modInfo = MODULES.find((m) => m.id === activeModule);
  const subPageInfo = modInfo?.subPages.find((s) => s.id === activeSubPage);

  return (
    <header
      id="main-header"
      className="bg-white border-b border-outline-variant fixed top-0 right-0 left-0 h-16 z-40 flex items-center px-6 select-none"
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
    </header>
  );
}
