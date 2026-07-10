import React, { useState } from 'react';
import { Pagamento } from '../types';
import {
  Receipt,
  Search,
  Plus,
  Eye,
  CheckCircle,
  AlertTriangle,
  Download,
  DollarSign,
  TrendingUp,
  FileCheck,
  CreditCard,
  Building
} from 'lucide-react';

interface PagamentosModuleProps {
  subPage: string;
  payments: Pagamento[];
  setPayments: React.Dispatch<React.SetStateAction<Pagamento[]>>;
  searchTerm: string;
}

export function PagamentosModule({
  subPage,
  payments,
  setPayments,
  searchTerm
}: PagamentosModuleProps) {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('PAG-001');
  const [notif, setNotif] = useState<string | null>(null);

  const filteredPayments = payments.filter((p) => {
    return (
      p.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.documentoRef.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handlePay = (id: string) => {
    const updated = payments.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Pago' as const,
          comprovanteUrl: '#comprovante-novo',
          historico: [
            ...p.historico,
            { acao: 'Pagamento efetuado via SISPAG Lote.', data: '09/07/2026 18:55', usuario: 'Marta Guimarães' }
          ]
        };
      }
      return p;
    });
    setPayments(updated);
    setNotif(`Pagamento ${id} liquidado com sucesso!`);
    setTimeout(() => setNotif(null), 3000);
  };

  const selectedPayment = payments.find((p) => p.id === selectedPaymentId) || payments[0];

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
              <span className="text-xs text-on-surface-variant font-bold uppercase">Agendados (Fila)</span>
              <h3 className="text-3xl font-black text-primary mt-2">
                {payments.filter((p) => p.status === 'Agendado').length}
              </h3>
              <p className="text-[10px] text-outline mt-1 font-medium">Lançamentos prontos para faturamento</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Pagamentos Liquidados</span>
              <h3 className="text-3xl font-black text-green-700 mt-2">
                {payments.filter((p) => p.status === 'Pago').length}
              </h3>
              <p className="text-[10px] text-green-600 mt-1 font-semibold">✓ Comprovantes gerados</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Estornos / Rejeitados</span>
              <h3 className="text-3xl font-black text-error mt-2">0</h3>
              <p className="text-[10px] text-outline mt-1">Nenhuma ocorrência de desvio bancário</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Volume Liquidado (Mês)</span>
              <h3 className="text-3xl font-black text-primary mt-2">R$ 115K</h3>
              <p className="text-[10px] text-outline mt-1 font-medium">Repasses de docência clínica</p>
            </div>
          </div>

          {/* Table list of payments */}
          <div className="bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex justify-between bg-[#F8FAFC]">
              <h3 className="text-xs font-bold text-primary uppercase">Fila de Desembolso Financeiro</h3>
              <span className="text-outline font-semibold">Exibindo {filteredPayments.length} registros</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-outline-variant font-bold text-on-surface-variant text-[11px] uppercase">
                    <th className="p-3">Beneficiário</th>
                    <th className="p-3">Tipo / Documento Ref</th>
                    <th className="p-3 text-right">Valor Líquido</th>
                    <th className="p-3">Data Agendada</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                      <td className="p-3 font-bold text-primary">{p.beneficiario}</td>
                      <td className="p-3">
                        <p className="font-semibold text-on-surface">{p.tipo}</p>
                        <p className="text-[10px] text-outline">{p.documentoRef}</p>
                      </td>
                      <td className="p-3 text-right font-bold text-green-700">R$ {p.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 font-semibold text-on-surface-variant">{p.dataAgendada}</td>
                      <td className="p-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border ${
                          p.status === 'Pago'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-center space-x-1">
                        {p.status === 'Agendado' && (
                          <button
                            onClick={() => handlePay(p.id)}
                            className="px-2 py-1 bg-primary text-white font-bold rounded hover:bg-primary-container"
                          >
                            Pagar
                          </button>
                        )}
                        {p.status === 'Pago' && (
                          <span className="text-green-700 font-bold text-[11px]">✓ Liquidado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Systematic Fallbacks for other payments pages */}
      {!['dashboard'].includes(subPage) && (
        <div className="bg-white rounded-lg border border-outline-variant p-6 shadow-sm text-xs">
          <h3 className="text-sm font-bold text-primary uppercase mb-4 border-b border-outline-variant pb-2">
            Pagamentos - Subpágina: {subPage.toUpperCase()}
          </h3>

          {subPage === 'lista' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Fila consolidada de repasses para faturamento docente.</p>
              <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded font-semibold text-primary">
                Exibindo faturas de competência de internatos homologadas.
              </div>
            </div>
          )}

          {subPage === 'individual' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Lançamento de ordem de pagamento individual específica para preceptor de medicina.</p>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded">
                Geração manual de PIX ou transferência de emergência para preceptor substituto.
              </div>
            </div>
          )}

          {subPage === 'lote' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Transmissão de remessa bancária CNAB para o banco liquidante (Banco do Brasil / Itaú).</p>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded text-center">
                Clique para gerar arquivo de remessa CNAB-240 para transmissão de lote de faturamento.
              </div>
            </div>
          )}

          {subPage === 'comprovantes' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Histórico de comprovantes bancários liquidados.</p>
              <div className="p-3 bg-white border border-outline-variant rounded flex items-center justify-between">
                <span className="font-semibold text-primary">Comprovante_{selectedPayment?.documentoRef}.pdf</span>
                <Download className="w-4 h-4 text-secondary cursor-pointer" />
              </div>
            </div>
          )}

          {subPage === 'historico' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Log histórico das transações integradas de faturamento.</p>
              <div className="relative border-l border-outline-variant pl-4 ml-2 space-y-4">
                {selectedPayment?.historico.map((item, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-primary">{item.acao}</p>
                    <span className="text-[10px] text-outline block">{item.data} - Operador: {item.usuario}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {subPage === 'conciliacao' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Conciliação automática bancária via arquivo de retorno CNAB.</p>
              <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800">
                Extratos integrados de retorno bancário de faturamento reconciliados com 100% de sucesso.
              </div>
            </div>
          )}

          {subPage === 'cancelamentos' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Estornos e cancelamento de ordens de pagamento em lote bancário.</p>
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
                Nenhum estorno de faturamento docente registrado nos últimos 30 dias.
              </div>
            </div>
          )}

          {subPage === 'indicadores' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Métricas e performance de desembolsos.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded">
                  <span className="font-bold text-primary block">Acurácia de Lote</span>
                  <span className="text-lg font-black text-secondary mt-1 block">100%</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded">
                  <span className="font-bold text-primary block">Prazo de Custódia</span>
                  <span className="text-lg font-black text-green-700 mt-1 block">24 horas</span>
                </div>
              </div>
            </div>
          )}

          {subPage === 'relatorios' && (
            <div className="space-y-2">
              <p className="text-on-surface-variant">Download de relatórios consolidados.</p>
              <button className="px-4 py-2 bg-primary text-white rounded font-semibold">Baixar Relatório Geral (PDF)</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
