import React, { useState } from 'react';
import { ChamadoSaldo } from '../types';
import {
  Wallet,
  Search,
  Plus,
  Eye,
  CheckCircle,
  AlertTriangle,
  Download,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRightLeft
} from 'lucide-react';

interface ChamadosSaldoModuleProps {
  subPage: string;
  chamados: ChamadoSaldo[];
  setChamados: React.Dispatch<React.SetStateAction<ChamadoSaldo[]>>;
  searchTerm: string;
}

export function ChamadosSaldoModule({
  subPage,
  chamados,
  setChamados,
  searchTerm
}: ChamadosSaldoModuleProps) {
  const [selectedChamadoId, setSelectedChamadoId] = useState<string>('CH-2026-001');
  const [notif, setNotif] = useState<string | null>(null);

  const filteredChamados = chamados.filter((c) => {
    return (
      c.processo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleApproveChamado = (id: string) => {
    const updated = chamados.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Aprovado' as const,
          etapaAtual: 'Lançado em Caixa',
          historico: [
            ...c.historico,
            { data: '09/07/2026 18:56', etapa: 'Aprovação de verba', responsavel: 'Marta Guimarães' }
          ]
        };
      }
      return c;
    });
    setChamados(updated);
    setNotif(`Chamado de Saldo ${id} aprovado com sucesso!`);
    setTimeout(() => setNotif(null), 3000);
  };

  const selectedChamado = chamados.find((c) => c.id === selectedChamadoId) || chamados[0];

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Chamados em Análise</span>
              <h3 className="text-3xl font-black text-primary mt-2">
                {chamados.filter((c) => c.status === 'Em Análise').length}
              </h3>
              <p className="text-[10px] text-outline mt-1 font-medium">Aguardando parecer da diretoria</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Chamados Aprovados (Mês)</span>
              <h3 className="text-3xl font-black text-green-700 mt-2">
                {chamados.filter((c) => c.status === 'Aprovado').length}
              </h3>
              <p className="text-[10px] text-green-600 mt-1 font-semibold">✓ Verbas creditadas nas escolas</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Aporte Total Solicitado</span>
              <h3 className="text-3xl font-black text-primary mt-2">R$ 57.000</h3>
              <p className="text-[10px] text-outline mt-1 font-medium">Créditos de compensação docente</p>
            </div>
          </div>

          {/* List Table */}
          <div className="bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex justify-between bg-[#F8FAFC]">
              <h3 className="text-xs font-bold text-primary uppercase">Chamados de Alocação de Saldo Ativos</h3>
              <span className="text-outline font-semibold">Exibindo {filteredChamados.length} chamados</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-outline-variant font-bold text-on-surface-variant text-[11px] uppercase">
                    <th className="p-3">ID / Chamado</th>
                    <th className="p-3">Processo Associado</th>
                    <th className="p-3">Solicitante</th>
                    <th className="p-3 font-right text-right">Valor Aporte</th>
                    <th className="p-3">Etapa Atual</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChamados.map((c) => (
                    <tr key={c.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                      <td className="p-3 font-bold text-primary">{c.id}</td>
                      <td className="p-3 font-semibold text-on-surface-variant">{c.processo}</td>
                      <td className="p-3 font-medium">{c.solicitante}</td>
                      <td className="p-3 text-right font-bold text-primary">R$ {c.valorSolicitado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 font-semibold text-secondary">{c.etapaAtual}</td>
                      <td className="p-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border ${
                          c.status === 'Aprovado'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-center space-x-1">
                        <button
                          onClick={() => setSelectedChamadoId(c.id)}
                          className="p-1 hover:text-secondary hover:bg-surface-container-low rounded inline-block"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subpage 4: Aprovações Pendentes */}
      {subPage === 'aprovacoes' && (
        <div className="bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden text-xs">
          <div className="p-4 border-b border-outline-variant bg-[#F8FAFC]">
            <h3 className="font-bold text-primary uppercase">Liberação de Aporte Orçamentário Extra</h3>
          </div>
          <div className="p-4 space-y-4">
            {chamados.filter((c) => c.status === 'Em Análise').map((c) => (
              <div key={c.id} className="p-4 bg-yellow-50/40 border border-yellow-200 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-yellow-800 text-sm">Aumento de Verba em Análise</h4>
                    <p className="font-bold text-primary mt-1">{c.processo} | Solicitado por: {c.solicitante}</p>
                    <p className="text-outline text-[11px] mt-0.5">Abertura: {c.dataAbertura} | Etapa: {c.etapaAtual}</p>
                  </div>
                  <span className="font-bold text-primary text-sm">R$ {c.valorSolicitado.toFixed(2)}</span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30">
                  <button className="px-3 py-1.5 border border-outline-variant rounded font-semibold text-error hover:bg-red-50">
                    Indeferir Chamado
                  </button>
                  <button
                    onClick={() => handleApproveChamado(c.id)}
                    className="px-3 py-1.5 bg-primary text-white font-bold rounded hover:bg-primary-container"
                  >
                    Aprovar Aporte de Saldo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Systematic Fallbacks for other chamados pages */}
      {!['dashboard', 'aprovacoes'].includes(subPage) && (
        <div className="bg-white rounded-lg border border-outline-variant p-6 shadow-sm text-xs">
          <h3 className="text-sm font-bold text-primary uppercase mb-4 border-b border-outline-variant pb-2">
            Chamados - Subpágina: {subPage.toUpperCase()}
          </h3>

          {subPage === 'lista' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Prontuário completo de chamados de saldo abertos.</p>
              <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded font-semibold text-primary">
                Acompanhamento em tempo real de liberação fiscal.
              </div>
            </div>
          )}

          {subPage === 'etapas' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Rastreabilidade das etapas internas de validação fiscal do chamado.</p>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded">
                Etapa atual: <span className="font-bold text-secondary">{selectedChamado?.etapaAtual}</span>
              </div>
            </div>
          )}

          {subPage === 'movimentos' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Lançamento de movimentação contábil para o chamado selecionado.</p>
              <div className="border border-outline-variant rounded overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#F8FAFC]">
                    <tr className="border-b border-outline-variant font-bold">
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Valor</th>
                      <th className="p-3">Data Lançamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedChamado?.movimentacao.map((mov, i) => (
                      <tr key={i} className="border-b border-outline-variant/30">
                        <td className="p-3 font-semibold text-primary">{mov.tipo}</td>
                        <td className="p-3 font-bold text-green-700">R$ {mov.valor.toFixed(2)}</td>
                        <td className="p-3">{mov.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {subPage === 'processos' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Fila de processos corporativos vinculados.</p>
              <div className="p-3 bg-white border border-outline-variant rounded">
                Fila automatizada vinculada à holding Ser Educacional.
              </div>
            </div>
          )}

          {subPage === 'historico' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Logs de tramitação do chamado.</p>
              <div className="relative border-l border-outline-variant pl-4 ml-2 space-y-4">
                {selectedChamado?.historico.map((item, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-primary">{item.etapa}</p>
                    <span className="text-[10px] text-outline block">{item.data} - Operador: {item.responsavel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {subPage === 'timeline' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Histórico visual do chamado.</p>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded text-center">
                Visualização detalhada da tramitação do processo de aumento orçamentário.
              </div>
            </div>
          )}

          {subPage === 'indicadores' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Métricas e performance de abertura de chamados de saldo.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded">
                  <span className="font-bold text-primary block">Tempo Médio de Atendimento</span>
                  <span className="text-lg font-black text-secondary mt-1 block">48 horas</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded">
                  <span className="font-bold text-primary block">Taxa de Resolução</span>
                  <span className="text-lg font-black text-green-700 mt-1 block">96%</span>
                </div>
              </div>
            </div>
          )}

          {subPage === 'relatorios' && (
            <div className="space-y-2">
              <p className="text-on-surface-variant">Download de relatórios específicos.</p>
              <button className="px-4 py-2 bg-primary text-white rounded font-semibold">Baixar Relatório de Saldos Solicitados (PDF)</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
