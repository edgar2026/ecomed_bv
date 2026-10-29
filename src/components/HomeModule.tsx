import { ModuleId } from '../types';

interface HomeModuleProps {
  setActiveModule: (module: ModuleId) => void;
  setActiveSubPage: (subPage: string) => void;
  preceptorsCount: number;
  scalesCount: number;
}

export function HomeModule(_props: HomeModuleProps) {
  return (
    <div className="animate-in fade-in duration-300">
      <img
        src="/banner-ecossistema-medicina.png"
        alt="Ecossistema de Medicina UNINASSAU Boa Viagem"
        className="w-full max-w-full h-auto mx-auto rounded-xl shadow-md"
      />
    </div>
  );
}
