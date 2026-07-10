import React, { useState } from 'react';
import { ControleSaldo } from '../types';
import {
  Scale,
  Search,
  Plus,
  Eye,
  CheckCircle,
  AlertTriangle,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';

interface ControleSaldosModuleProps {
  subPage: string;
  saldos: ControleSaldo[];
  setSaldos: React.Dispatch<React.SetStateAction<ControleSaldo[]>>;
  searchTerm: string;
}

export function ControleSaldosModule({
  subPage,
  saldos,
  setSaldos,
  searchTerm
}: ControleSaldosModuleProps) {
  const [selectedSaldoId, setSelectedSaldoId] = useState<string>('SL-001');
  const [notif, setNotif] = useState<string | null>(null);

  const filteredSaldos = saldos.filter((s) => {
    return (
      s.processoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const selectedSaldo = saldos.find((s) => s.id === selectedSaldoId) || saldos[0];

  return (
    <div className="space-y-6">
      {/* Subpage 1: Dashboard */}
      {subPage === 'dashboard' && (
        <div className="space-y-6 text-xs">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Saldo Inicial Total</span>
              <h3 className="text-3xl font-black text-primary mt-2">R$ 1.05M</h3>
              <p className="text-[10px] text-outline mt-1 font-medium">Provisionado para o semestre</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Saldo Consumido</span>
              <h3 className="text-3xl font-black text-secondary mt-2">R$ 893K</h3>
              <p className="text-[10px] text-outline mt-1 font-medium">Faturado em preceptoria</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Saldo Disponível</span>
              <h3 className="text-3xl font-black text-green-700 mt-2">R$ 157K</h3>
              <p className="text-[10px] text-green-600 font-semibold mt-1">✓ Margem de segurança OK</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Saldos Negativos</span>
              <h3 className="text-3xl font-black text-error mt-2">
                {saldos.filter((s) => s.status === 'Negativo').length}
              </h3>
              <p className="text-[10px] text-error font-semibold mt-1">⚠ Necessita de aporte imediato</p>
            </div>
          </div>

          {/* Progress list of deplete budgets */}
          <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
            <h3 className="text-xs font-bold text-primary uppercase border-b border-outline-variant pb-2 mb-4">Evolução do Consumo de Contratos de Preceptoria</h3>
            <div className="space-y-4">
              {saldos.map((s) => {
                const depletion = Math.round((s.saldoConsumido / s.saldoInicial) * 100);
                return (
                  <div key={s.id}>
                    <div className="flex justify-between text-xs text-on-surface-variant mb-1 font-medium">
                      <span>{s.processoNome} ({s.fornecedor})</span>
                      <span className="font-bold text-on-surface">R$ {s.saldoConsumido.toLocaleString()} / R$ {s.saldoInicial.toLocaleString()} ({depletion}%)</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${depletion > 90 ? 'bg-error' : 'bg-primary'}`}
                        style={{ width: `${Math.min(depletion, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Systematic Fallbacks for other controle de saldos pages */}
      {!['dashboard'].includes(subPage) && (
        <div className="bg-white rounded-lg border border-outline-variant p-6 shadow-sm text-xs">
          <h3 className="text-sm font-bold text-primary uppercase mb-4 border-b border-outline-variant pb-2">
            Controle de Saldos - Subpágina: {subPage.toUpperCase()}
          </h3>

          {subPage === 'processos' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Prontuário completo de saldos faturados por processo homologado.</p>
              <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded font-semibold text-primary">
                {selectedSaldo?.processoNome} - Saldo Disponível: R$ {selectedSaldo?.saldoDisponivel.toLocaleString('pt-BR')}
              </div>
            </div>
          )}

          {subPage === 'periodos' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Planejamento e faturamento de saldos por semestre letivo.</p>
              <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded font-semibold text-primary">
                Período vigente: {selectedSaldo?.periodo}
              </div>
            </div>
          )}

          {subPage === 'fornecedores' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Visualização de faturamento consolidado de saldos por fornecedor.</p>
              <div className="p-3 bg-white border border-outline-variant rounded">
                Unidade credenciada vinculada: <span className="font-bold text-primary">{selectedSaldo?.fornecedor}</span>
              </div>
            </div>
          )}

          {subPage === 'movimentacoes' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Histórico de transações de caixa efetuadas na conta do contrato.</p>
              <div className="border border-outline-variant rounded overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#F8FAFC]">
                    <tr className="border-b border-outline-variant font-bold">
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Valor</th>
                      <th className="p-3">Descrição</th>
                      <th className="p-3">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSaldo?.movimentacoes.map((item, i) => (
                      <tr key={i} className="border-b border-outline-variant/30">
                        <td className="p-3 font-semibold text-primary">{item.tipo}</td>
                        <td className={`p-3 font-bold ${item.tipo === 'Crédito' ? 'text-green-700' : 'text-error'}`}>R$ {item.valor.toFixed(2)}</td>
                        <td className="p-3">{item.desc}</td>
                        <td className="p-3">{item.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {subPage === 'consumo' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Velocidade média de queima do orçamento (Burn Rate).</p>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg">
                Consumo diário médio: <span className="font-bold text-primary">R$ 5.400,00</span>
              </div>
            </div>
          )}

          {subPage === 'disponibilidade' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Cálculo de projeção de esgotamento de saldo do contrato.</p>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                Previsão de término: Os fundos de Clínica Médica RHP devem se esgotar em <span className="font-bold">45 dias</span> se o ritmo atual de horas for mantido.
              </div>
            </div>
          )}

          {subPage === 'auditoria' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Painel de conformidade e auditoria de saldos.</p>
              <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800 flex items-center justify-between">
                <div>
                  <p className="font-bold">Conformidade de Saldo: 100%</p>
                  <p className="text-[11px] mt-1">Nenhum desvio fiscal detectado na auditoria integrada.</p>
                </div>
              </div>
            </div>
          )}

          {subPage === 'indicadores' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Métricas de performance e reserva fiscal.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded">
                  <span className="font-bold text-primary block">Reserva de Segurança</span>
                  <span className="text-lg font-black text-secondary mt-1 block">R$ 150.000,00</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded">
                  <span className="font-bold text-primary block">Acurácia de Provisão</span>
                  <span className="text-lg font-black text-green-700 mt-1 block">99.4%</span>
                </div>
              </div>
            </div>
          )}

          {subPage === 'relatorios' && (
            <div className="space-y-2">
              <p className="text-on-surface-variant">Central de download de relatórios orçamentários.</p>
              <button className="px-4 py-2 bg-primary text-white rounded font-semibold">Baixar Provisão Orçamentária (PDF)</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
