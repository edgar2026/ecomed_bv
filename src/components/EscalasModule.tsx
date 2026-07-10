import React, { useState } from 'react';
import { Escala, Preceptor, Hospital, CampoEstagio } from '../types';
import {
  CalendarDays,
  Search,
  Plus,
  Eye,
  CheckCircle,
  AlertTriangle,
  Download,
  Clock,
  UserCheck,
  AlertCircle,
  Calendar,
  XCircle,
  RefreshCw,
  Info
} from 'lucide-react';

interface EscalasModuleProps {
  subPage: string;
  scales: Escala[];
  setScales: React.Dispatch<React.SetStateAction<Escala[]>>;
  preceptors: Preceptor[];
  hospitals: Hospital[];
  campos: CampoEstagio[];
  searchTerm: string;
}

export function EscalasModule({
  subPage,
  scales,
  setScales,
  preceptors,
  hospitals,
  campos,
  searchTerm
}: EscalasModuleProps) {
  const [selectedScaleId, setSelectedScaleId] = useState<string>('ESC001');
  const [notif, setNotif] = useState<string | null>(null);

  // Filters logic
  const filteredScales = scales.filter((s) => {
    return (
      s.preceptorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.hospitalNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.disciplinaNome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleResolveConflict = (id: string) => {
    const updated = scales.map((s) => {
      if (s.id === id) {
        return { ...s, status: 'Confirmada' as const, observacao: 'Conflito resolvido manualmente pela Diretoria.' };
      }
      return s;
    });
    setScales(updated);
    setNotif('Conflito de escala resolvido com sucesso!');
    setTimeout(() => setNotif(null), 3000);
  };

  const handleJustifyFalta = (id: string) => {
    const updated = scales.map((s) => {
      if (s.id === id) {
        return { ...s, status: 'Reposição' as const, observacao: 'Falta justificada. Agendada escala de reposição.' };
      }
      return s;
    });
    setScales(updated);
    setNotif('Falta justificada com sucesso! Nova escala de reposição gerada.');
    setTimeout(() => setNotif(null), 3000);
  };

  return (
    <div className="space-y-6">
      {notif && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-sm text-green-800 text-xs flex items-center justify-between">
          <span className="font-semibold">{notif}</span>
          <button onClick={() => setNotif(null)} className="text-green-800 font-bold">X</button>
        </div>
      )}

      {/* Subpage 1: Dashboard */}
      {subPage === 'dashboard' && (
        <div className="space-y-6 text-xs">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Confirmadas (Mês)</span>
              <h3 className="text-3xl font-black text-primary mt-2">
                {scales.filter((s) => s.status === 'Confirmada').length}
              </h3>
              <p className="text-[10px] text-green-600 mt-1 font-semibold">✓ 100% Cobertura ativa</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Conflitos Detectados</span>
              <h3 className="text-3xl font-black text-error mt-2">
                {scales.filter((s) => s.status === 'Conflito').length}
              </h3>
              <p className="text-[10px] text-error mt-1 font-semibold">⚠ Ação Necessária imediata</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Absenteísmo (Faltas)</span>
              <h3 className="text-3xl font-black text-primary mt-2">
                {scales.filter((s) => s.status === 'Falta').length}
              </h3>
              <p className="text-[10px] text-outline mt-1">Aguardando justificativas</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Reposições Agendadas</span>
              <h3 className="text-3xl font-black text-indigo-700 mt-2">
                {scales.filter((s) => s.status === 'Reposição').length}
              </h3>
              <p className="text-[10px] text-outline mt-1">Pagas em cronograma aditivo</p>
            </div>
          </div>

          {/* Active Schedule list table */}
          <div className="bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex justify-between bg-[#F8FAFC]">
              <h3 className="text-xs font-bold text-primary uppercase">Escalas da Semana (Visão Geral)</h3>
              <span className="text-outline font-semibold">Exibindo {filteredScales.length} escalas</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-outline-variant font-bold text-on-surface-variant text-[11px] uppercase">
                    <th className="p-3">Preceptor</th>
                    <th className="p-3">Hospital / Campo</th>
                    <th className="p-3">Data / Horário</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScales.map((s) => (
                    <tr key={s.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                      <td className="p-3 font-bold text-primary">{s.preceptorNome}</td>
                      <td className="p-3">
                        <p className="font-semibold text-on-surface">{s.hospitalNome}</p>
                        <p className="text-[10px] text-outline">{s.campoNome}</p>
                      </td>
                      <td className="p-3 font-medium">
                        <p>{s.data}</p>
                        <p className="text-[10px] text-secondary font-bold">{s.horaInicio} às {s.horaFim}</p>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border ${
                          s.status === 'Confirmada'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : s.status === 'Conflito'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : s.status === 'Falta'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 text-[10px] text-outline italic">{s.observacao || 'Nenhuma ocorrência registrada.'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subpage 2: Calendário Mensal */}
      {subPage === 'mensal' && (
        <div className="bg-white rounded-lg border border-outline-variant shadow-sm p-6 text-xs">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-primary uppercase text-sm">Escala Mensal - Julho 2026</h3>
            <span className="text-outline font-semibold">Mês de Competência Acadêmica</span>
          </div>

          {/* Simulated Month Calendar Grid (PE: July 2026 starts on Wednesday) */}
          <div className="grid grid-cols-7 gap-2 text-center font-bold text-on-surface-variant border-b border-outline-variant pb-2 mb-2">
            <div>DOM</div>
            <div>SEG</div>
            <div>TER</div>
            <div>QUA</div>
            <div>QUI</div>
            <div>SEX</div>
            <div>SÁB</div>
          </div>

          <div className="grid grid-cols-7 gap-2 h-96">
            {/* Blank slots for previous month */}
            <div className="bg-[#F8FAFC] border border-outline-variant/30 rounded p-1"></div>
            <div className="bg-[#F8FAFC] border border-outline-variant/30 rounded p-1"></div>
            <div className="bg-[#F8FAFC] border border-outline-variant/30 rounded p-1"></div>

            {/* Days of July 2026 */}
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const hasScale = day === 10 || day === 11 || day === 12 || day === 13;
              return (
                <div key={day} className={`border border-outline-variant rounded p-1.5 flex flex-col justify-between ${hasScale ? 'bg-indigo-50/40 border-primary' : 'bg-white'}`}>
                  <span className="font-bold text-on-surface text-[10px]">{day}</span>
                  {hasScale && (
                    <span className="bg-primary text-white text-[8px] font-black py-0.5 rounded text-center block leading-none">
                      Escala Ativa
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subpage 3: Calendário Semanal */}
      {subPage === 'semanal' && (
        <div className="bg-white rounded-lg border border-outline-variant p-6 shadow-sm text-xs space-y-4">
          <h3 className="font-bold text-primary uppercase">Escalas da Semana Atual</h3>
          <div className="divide-y divide-outline-variant/30">
            {['Segunda (06/07)', 'Terça (07/07)', 'Quarta (08/07)', 'Quinta (09/07)', 'Sexta (10/07)'].map((dia, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <span className="font-bold text-primary w-32">{dia}</span>
                <div className="flex-1 text-on-surface-variant font-medium">
                  {idx === 4 ? 'Dr. Roberto Almeida (07h às 13h) - Hospital Esperança' : 'Sem escalas agendadas'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subpage 4: Calendário Diário */}
      {subPage === 'diario' && (
        <div className="bg-white rounded-lg border border-outline-variant p-6 shadow-sm text-xs space-y-4">
          <h3 className="font-bold text-primary uppercase">Escala Diária - Hoje</h3>
          <div className="border border-outline-variant rounded-lg overflow-hidden">
            <div className="bg-[#F8FAFC] p-3 border-b border-outline-variant font-bold flex justify-between">
              <span>Turno</span>
              <span>Preceptor</span>
              <span>Hospital</span>
              <span>Status</span>
            </div>
            <div className="p-3 divide-y divide-outline-variant">
              <div className="py-2 flex justify-between">
                <span className="font-semibold">Manhã (07h - 13h)</span>
                <span>Dr. Roberto Almeida</span>
                <span>Hospital Esperança</span>
                <span className="text-green-700 font-bold">Presente</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subpage 9: Controle de Faltas */}
      {subPage === 'faltas' && (
        <div className="bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden text-xs">
          <div className="p-4 border-b border-outline-variant bg-[#F8FAFC]">
            <h3 className="font-bold text-primary uppercase">Controle de Absenteísmo e Justificativas</h3>
          </div>
          <div className="p-4 divide-y divide-outline-variant">
            {scales.filter((s) => s.status === 'Falta').map((f) => (
              <div key={f.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-primary">{f.preceptorNome}</p>
                  <p className="text-outline text-[11px] mt-0.5">{f.hospitalNome} - Data: {f.data} | {f.observacao}</p>
                </div>
                <button
                  onClick={() => handleJustifyFalta(f.id)}
                  className="px-3 py-1.5 bg-secondary-container text-on-secondary-container font-semibold rounded hover:bg-secondary hover:text-white transition-colors"
                >
                  Justificar Ausência
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subpage 11: Resolução de Conflitos */}
      {subPage === 'conflitos' && (
        <div className="bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden text-xs">
          <div className="p-4 border-b border-outline-variant bg-[#F8FAFC]">
            <h3 className="font-bold text-primary uppercase">Painel de Resolução de Choque de Escalas</h3>
          </div>
          <div className="p-4 space-y-4">
            {scales.filter((s) => s.status === 'Conflito').map((c) => (
              <div key={c.id} className="p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-red-800">Alocação Conflitante Detectada</span>
                  </div>
                  <p className="font-semibold text-primary">{c.preceptorNome}</p>
                  <p className="text-outline text-[11px]">{c.hospitalNome} - {c.campoNome} ({c.horaInicio} às {c.horaFim})</p>
                  <p className="text-red-700 text-[10px] font-bold">Motivo: {c.observacao}</p>
                </div>
                <button
                  onClick={() => handleResolveConflict(c.id)}
                  className="px-3 py-1.5 bg-primary text-white font-bold rounded hover:bg-primary-container hover:text-primary transition-colors"
                >
                  Realocar Preceptor
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Systematic Fallbacks for other generic scales pages */}
      {!['dashboard', 'mensal', 'semanal', 'diario', 'faltas', 'conflitos'].includes(subPage) && (
        <div className="bg-white rounded-lg border border-outline-variant p-6 shadow-sm text-xs">
          <h3 className="text-sm font-bold text-primary uppercase mb-4 border-b border-outline-variant pb-2">
            Módulo Escalas - Subpágina: {subPage.toUpperCase()}
          </h3>

          {subPage === 'preceptor' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Filtro de escalas de atendimento por preceptor homologado.</p>
              <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded font-semibold text-primary">
                Dr. Roberto Almeida - 2 Escalas Ativas na semana.
              </div>
            </div>
          )}

          {subPage === 'hospital' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Filtro de escalas por hospital parceiro.</p>
              <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded font-semibold text-primary">
                Hospital Esperança - 5 Preceptores escalados para Julho/2026.
              </div>
            </div>
          )}

          {subPage === 'disciplina' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Filtro de escalas por disciplina acadêmica curricular.</p>
              <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded font-semibold text-primary">
                Cirurgia Geral I - Escalas concentradas às segundas e quartas.
              </div>
            </div>
          )}

          {subPage === 'campo' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Filtro de escalas por ala física ou campo de estágio.</p>
              <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded font-semibold text-primary">
                Bloco Cirúrgico A - Ocupação normal de preceptores de plantão.
              </div>
            </div>
          )}

          {subPage === 'reposicoes' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Controle e agendamento de reposições de aulas práticas médicas.</p>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg">
                <span className="font-bold text-primary">Fila de Reposições Pendentes</span>
                <p className="text-outline text-[11px] mt-1">Escala de reposição agendada para Dr. Roberto Almeida no dia 15/07.</p>
              </div>
            </div>
          )}

          {subPage === 'indicadores' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Métricas de cobertura e absenteísmo docente.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded">
                  <span className="font-bold text-primary block">Cobertura de Plantão</span>
                  <span className="text-lg font-black text-secondary mt-1 block">99.2%</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded">
                  <span className="font-bold text-primary block">Justificativas Aceitas</span>
                  <span className="text-lg font-black text-green-700 mt-1 block">100%</span>
                </div>
              </div>
            </div>
          )}

          {subPage === 'relatorios' && (
            <div className="space-y-2">
              <p className="text-on-surface-variant">Central de faturamento de relatórios de escalas.</p>
              <button className="px-4 py-2 bg-primary text-white rounded font-semibold">Baixar Cronograma Geral (PDF)</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
