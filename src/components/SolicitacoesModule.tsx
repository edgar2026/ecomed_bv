import React, { useState } from 'react';
import { Solicitacao } from '../types';
import {
  ClipboardList,
  Search,
  Plus,
  Eye,
  CheckCircle,
  AlertTriangle,
  Download,
  FileText,
  Clock,
  UserCheck,
  MessageSquare,
  Paperclip
} from 'lucide-react';

interface SolicitacoesModuleProps {
  subPage: string;
  solicitacoes: Solicitacao[];
  setSolicitacoes: React.Dispatch<React.SetStateAction<Solicitacao[]>>;
  searchTerm: string;
}

export function SolicitacoesModule({
  subPage,
  solicitacoes,
  setSolicitacoes,
  searchTerm
}: SolicitacoesModuleProps) {
  const [selectedSolicitacaoId, setSelectedSolicitacaoId] = useState<string>('SOL-001');
  const [notif, setNotif] = useState<string | null>(null);

  const filteredSolicitacoes = solicitacoes.filter((s) => {
    return (
      s.preceptorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.documentoRef.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleApprove = (id: string) => {
    const updated = solicitacoes.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          status: 'Aprovado' as const,
          timeline: [
            ...s.timeline,
            { status: 'Aprovado', data: '09/07/2026 18:53', descricao: 'Aprovado manualmente pela coordenação operacional.' }
          ]
        };
      }
      return s;
    });
    setSolicitacoes(updated);
    setNotif(`Solicitação ${id} aprovada com sucesso!`);
    setTimeout(() => setNotif(null), 3000);
  };

  const selectedSolicitacao = solicitacoes.find((s) => s.id === selectedSolicitacaoId) || solicitacoes[0];

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
              <span className="text-xs text-on-surface-variant font-bold uppercase">Pendentes de Homologação</span>
              <h3 className="text-3xl font-black text-primary mt-2">
                {solicitacoes.filter((s) => s.status === 'Pendente').length}
              </h3>
              <p className="text-[10px] text-outline mt-1">Aguardando auditoria fiscal</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Aprovadas este Mês</span>
              <h3 className="text-3xl font-black text-green-700 mt-2">
                {solicitacoes.filter((s) => s.status === 'Aprovado').length}
              </h3>
              <p className="text-[10px] text-green-600 font-semibold mt-1">✓ Enviado ao financeiro</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Inconformadas / Divergentes</span>
              <h3 className="text-3xl font-black text-error mt-2">
                {solicitacoes.filter((s) => s.status === 'Divergente').length}
              </h3>
              <p className="text-[10px] text-error font-semibold mt-1">⚠ Necessita ajuste do preceptor</p>
            </div>
          </div>

          {/* List Table */}
          <div className="bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex justify-between bg-[#F8FAFC]">
              <h3 className="text-xs font-bold text-primary uppercase">Chamados de Repasse de Preceptores</h3>
              <span className="text-outline font-semibold">Exibindo {filteredSolicitacoes.length} solicitações</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-outline-variant font-bold text-on-surface-variant text-[11px] uppercase">
                    <th className="p-3">ID / Preceptor</th>
                    <th className="p-3">Documento Ref</th>
                    <th className="p-3 font-right text-right">Valor Bruto</th>
                    <th className="p-3 text-center">Tipo</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSolicitacoes.map((s) => (
                    <tr key={s.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                      <td className="p-3">
                        <p className="font-bold text-primary">{s.id}</p>
                        <p className="text-[10px] text-outline">{s.preceptorNome}</p>
                      </td>
                      <td className="p-3 font-semibold text-on-surface-variant">{s.documentoRef}</td>
                      <td className="p-3 text-right font-bold text-primary">R$ {s.valor.toFixed(2)}</td>
                      <td className="p-3 text-center font-bold text-secondary">{s.tipo}</td>
                      <td className="p-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border ${
                          s.status === 'Aprovado'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : s.status === 'Pendente'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 text-center space-x-1">
                        <button
                          onClick={() => setSelectedSolicitacaoId(s.id)}
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

      {/* Subpage 4: Painel de Aprovações */}
      {subPage === 'aprovacoes' && (
        <div className="bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden text-xs">
          <div className="p-4 border-b border-outline-variant bg-[#F8FAFC]">
            <h3 className="font-bold text-primary uppercase">Central Unificada de Aprovações Fiscais</h3>
          </div>
          <div className="p-4 space-y-4">
            {solicitacoes.filter((s) => s.status === 'Pendente').map((s) => (
              <div key={s.id} className="p-4 bg-yellow-50/40 border border-yellow-200 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-yellow-800 text-sm">Aprovação de Repasse Pendente</h4>
                    <p className="font-bold text-primary mt-1">{s.preceptorNome} | Ref: {s.documentoRef}</p>
                    <p className="text-outline text-[11px] mt-0.5">Criado em: {s.dataSolicitacao}</p>
                  </div>
                  <span className="font-bold text-primary text-sm">R$ {s.valor.toFixed(2)}</span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30">
                  <button className="px-3 py-1.5 border border-outline-variant rounded font-semibold text-error hover:bg-red-50">
                    Rejeitar Documento
                  </button>
                  <button
                    onClick={() => handleApprove(s.id)}
                    className="px-3 py-1.5 bg-primary text-white font-bold rounded hover:bg-primary-container"
                  >
                    Homologar & Liberar Pagamento
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other 7 subpages: Structured systematically */}
      {!['dashboard', 'aprovacoes'].includes(subPage) && (
        <div className="bg-white rounded-lg border border-outline-variant p-6 shadow-sm text-xs">
          <h3 className="text-sm font-bold text-primary uppercase mb-4 border-b border-outline-variant pb-2">
            Solicitação: {selectedSolicitacao?.id} - Subpágina: {subPage.toUpperCase()}
          </h3>

          {subPage === 'nf' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Notas fiscais de serviços de preceptoria submetidas pelos parceiros.</p>
              <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded font-semibold text-primary">
                Ref: {selectedSolicitacao?.documentoRef} - NF Processada com sucesso.
              </div>
            </div>
          )}

          {subPage === 'rpa' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Processamento de RPA de preceptores autônomos.</p>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded">
                Geração de guia de repasse com retenções fiscais calculadas automaticamente.
              </div>
            </div>
          )}

          {subPage === 'pendencias' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Inconformidades e documentos faltantes de preceptoria acadêmica.</p>
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 font-semibold">
                Alerta: Dr. Lucas Cavalcanti possui pendência de certidão de regularidade do CRM.
              </div>
            </div>
          )}

          {subPage === 'anexos' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Central de arquivos anexos a esta solicitação fiscal.</p>
              <div className="grid grid-cols-2 gap-4">
                {selectedSolicitacao?.anexos.map((anexo, i) => (
                  <div key={i} className="p-3 bg-white border border-outline-variant rounded flex items-center justify-between">
                    <span className="font-semibold text-primary">{anexo}</span>
                    <Download className="w-4 h-4 text-secondary cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {subPage === 'timeline' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Tramitação do processo fiscal.</p>
              <div className="relative border-l border-outline-variant pl-4 ml-2 space-y-4">
                {selectedSolicitacao?.timeline.map((item, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-primary">{item.status}</p>
                    <span className="text-[10px] text-outline block">{item.data} - {item.descricao}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {subPage === 'comentarios' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Histórico de anotações internas da equipe financeira.</p>
              {selectedSolicitacao?.comentarios.map((com, i) => (
                <div key={i} className="p-3 border border-outline-variant rounded bg-[#F8FAFC]">
                  <p className="font-bold text-primary">{com.usuario}</p>
                  <p className="text-on-surface-variant mt-1">{com.texto}</p>
                  <span className="text-[9px] text-outline block mt-1">{com.data}</span>
                </div>
              ))}
            </div>
          )}

          {subPage === 'relatorios' && (
            <div className="space-y-2">
              <p className="text-on-surface-variant">Geração de relatórios consolidados específicos.</p>
              <button className="px-4 py-2 bg-primary text-white rounded font-semibold">Emitir Relatório de Tramitação (PDF)</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
