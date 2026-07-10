import React from 'react';
import { 
  Lock, 
  Target, 
  Compass, 
  Sliders, 
  Activity, 
  CalendarDays, 
  Cpu, 
  ArrowRightCircle 
} from 'lucide-react';

interface EmDesenvolvimentoProps {
  titulo: string;
  objetivo: string;
  escopo: string;
  recursosPrevistos: string[];
  statusAtual: string;
  roadmap: string;
  arquitetura: string;
  proximasEtapas: string[];
}

export function EmDesenvolvimento({
  titulo,
  objetivo,
  escopo,
  recursosPrevistos,
  statusAtual,
  roadmap,
  arquitetura,
  proximasEtapas
}: EmDesenvolvimentoProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Banner Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-200/60 rounded-xl p-4 md:p-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fase de Evolução</span>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{titulo}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Módulo em Desenvolvimento
          </span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold text-xs text-slate-600">
        
        {/* Left Column: Vision and Scope */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              Objetivo da Funcionalidade
            </h4>
            <p className="text-slate-700 leading-relaxed font-medium">{objetivo}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              Escopo Planejado
            </h4>
            <p className="text-slate-600 leading-relaxed font-normal">{escopo}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              Principais Recursos Previstos
            </h4>
            <ul className="space-y-1.5 text-slate-600 font-normal">
              {recursosPrevistos.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 text-xs shrink-0">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Execution Metrics */}
        <div className="space-y-6 md:border-l md:border-slate-100 md:pl-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200/40 space-y-1">
              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                Status Atual
              </h4>
              <p className="text-slate-800 font-extrabold text-[11px] uppercase tracking-wide">{statusAtual}</p>
            </div>

            <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200/40 space-y-1">
              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                Roadmap da Entrega
              </h4>
              <p className="text-slate-800 font-extrabold text-[11px] uppercase tracking-wide">{roadmap}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              Arquitetura Prevista
            </h4>
            <p className="text-slate-600 leading-relaxed font-normal">{arquitetura}</p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <ArrowRightCircle className="w-3.5 h-3.5 text-blue-600" />
              Próximas Etapas
            </h4>
            <ul className="space-y-1.5 text-slate-600 font-normal">
              {proximasEtapas.map((etp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 text-xs shrink-0">→</span>
                  <span>{etp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
