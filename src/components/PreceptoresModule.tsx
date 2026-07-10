import React, { useState } from 'react';
import {
  Preceptor,
  Hospital,
  Disciplina,
  CampoEstagio,
  Escala,
  FinanceiroRecord,
  Solicitacao,
  Pagamento,
  ChamadoSaldo,
  ControleSaldo
} from '../types';
import { EscalasModule } from './EscalasModule';
import { PreceptoresDashboard } from './PreceptoresDashboard';
import { EmDesenvolvimento } from './EmDesenvolvimento';
import {
  TrendingUp,
  GraduationCap,
  Calendar,
  DollarSign,
  FileText,
  Layers,
  Settings,
  CheckCircle,
  AlertTriangle,
  Search,
  Plus,
  Edit,
  Eye,
  X,
  Sparkles,
  Check,
  UserCheck,
  Download,
  AlertCircle,
  XCircle,
  RefreshCw,
  Info,
  Building2,
  Scale,
  FileSpreadsheet,
  History
} from 'lucide-react';

interface PreceptoresModuleProps {
  subPage: string;
  setSubPage: (subPage: string) => void;
  preceptors: Preceptor[];
  setPreceptors: React.Dispatch<React.SetStateAction<Preceptor[]>>;
  hospitals: Hospital[];
  disciplines: Disciplina[];
  campos: CampoEstagio[];
  scales: Escala[];
  setScales: React.Dispatch<React.SetStateAction<Escala[]>>;
  searchTerm: string;

  // Merged state properties from Finance and Process modules
  financialRecords: FinanceiroRecord[];
  setFinancialRecords: React.Dispatch<React.SetStateAction<FinanceiroRecord[]>>;
  solicitacoes: Solicitacao[];
  setSolicitacoes: React.Dispatch<React.SetStateAction<Solicitacao[]>>;
  payments: Pagamento[];
  setPayments: React.Dispatch<React.SetStateAction<Pagamento[]>>;
  chamados: ChamadoSaldo[];
  setChamados: React.Dispatch<React.SetStateAction<ChamadoSaldo[]>>;
  saldos: ControleSaldo[];
  setSaldos: React.Dispatch<React.SetStateAction<ControleSaldo[]>>;
  onNewScaleClick: () => void;
}

export function PreceptoresModule({
  subPage,
  setSubPage,
  preceptors,
  setPreceptors,
  hospitals,
  disciplines,
  campos,
  scales,
  setScales,
  searchTerm,
  financialRecords,
  setFinancialRecords,
  solicitacoes,
  setSolicitacoes,
  payments,
  setPayments,
  chamados,
  setChamados,
  saldos,
  setSaldos,
  onNewScaleClick
}: PreceptoresModuleProps) {
  // Selection States
  const [selectedPreceptorId, setSelectedPreceptorId] = useState<string>('PR001');
  const [selectedSolicitacaoId, setSelectedSolicitacaoId] = useState<string>('SOL-001');
  const [selectedChamadoId, setSelectedChamadoId] = useState<string>('CHM-001');

  // Modals & Drawers States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Filters for preceptor list
  const [filterHospital, setFilterHospital] = useState('Todos');
  const [filterEspecialidade, setFilterEspecialidade] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');

  // Form States for Preceptor
  const [formData, setFormData] = useState({
    nome: '',
    crm: '',
    especialidade: 'Clínica Médica',
    email: '',
    telefone: '',
    hospitalPrincipal: 'Hospital Esperança',
    valorHora: 110,
    dataAdmissao: '2026-07-10'
  });

  const [notif, setNotif] = useState<string | null>(null);

  const selectedPreceptor = preceptors.find((p) => p.id === selectedPreceptorId) || preceptors[0];

  // Filters for NF/RPA Solicitations
  const [filterSolicitacaoTipo, setFilterSolicitacaoTipo] = useState('Todos');
  const [filterSolicitacaoStatus, setFilterSolicitacaoStatus] = useState('Todos');

  // Filter Preceptors list
  const filteredPreceptors = preceptors.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.crm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.especialidade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHospital = filterHospital === 'Todos' || p.hospitalPrincipal === filterHospital;
    const matchesEspecialidade = filterEspecialidade === 'Todos' || p.especialidade === filterEspecialidade;
    const matchesStatus = filterStatus === 'Todos' || p.status === filterStatus;
    return matchesSearch && matchesHospital && matchesEspecialidade && matchesStatus;
  });

  // Create new Preceptor
  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.crm) {
      alert('Por favor, preencha o nome e o CRM.');
      return;
    }
    const newPreceptor: Preceptor = {
      id: `PR00${preceptors.length + 1}`,
      nome: formData.nome,
      crm: formData.crm,
      especialidade: formData.especialidade,
      email: formData.email || `${formData.nome.toLowerCase().replace(/\s+/g, '.')}@uninassau.edu.br`,
      telefone: formData.telefone || '(81) 99999-8888',
      status: 'Pendente',
      hospitalPrincipal: formData.hospitalPrincipal,
      disciplinasVinculadas: ['Semiologia Avançada'],
      camposVinculados: ['Enfermarias Clínicas 4º Andar'],
      valorHora: Number(formData.valorHora),
      dataAdmissao: formData.dataAdmissao,
      documentos: [
        { nome: 'CRM_Atualizado.pdf', status: 'Pendente', dataEnvio: '2026-07-10' },
        { nome: 'Certificado_Especialista.pdf', status: 'Pendente', dataEnvio: '2026-07-10' }
      ],
      escalas: [],
      pagamentos: [],
      solicitacoes: [],
      historico: [{ data: '10/07/2026 12:00', acao: 'Cadastro de preceptor efetuado', usuario: 'Hesdras Viana' }]
    };

    setPreceptors([...preceptors, newPreceptor]);
    setIsCreateModalOpen(false);
    setNotif('Preceptor cadastrado com sucesso! Status inicial: Pendente de validação.');
    setTimeout(() => setNotif(null), 3500);

    // Reset Form
    setFormData({
      nome: '',
      crm: '',
      especialidade: 'Clínica Médica',
      email: '',
      telefone: '',
      hospitalPrincipal: 'Hospital Esperança',
      valorHora: 110,
      dataAdmissao: '2026-07-10'
    });
  };

  // Edit Preceptor Form Submit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = preceptors.map((p) => {
      if (p.id === selectedPreceptorId) {
        return {
          ...p,
          nome: formData.nome || p.nome,
          crm: formData.crm || p.crm,
          especialidade: formData.especialidade,
          hospitalPrincipal: formData.hospitalPrincipal,
          valorHora: Number(formData.valorHora),
          email: formData.email || p.email,
          telefone: formData.telefone || p.telefone
        };
      }
      return p;
    });
    setPreceptors(updated);
    setIsEditDrawerOpen(false);
    setNotif('Dados cadastrais do preceptor atualizados com sucesso.');
    setTimeout(() => setNotif(null), 3000);
  };

  const openEditDrawer = (p: Preceptor) => {
    setSelectedPreceptorId(p.id);
    setFormData({
      nome: p.nome,
      crm: p.crm,
      especialidade: p.especialidade,
      email: p.email,
      telefone: p.telefone,
      hospitalPrincipal: p.hospitalPrincipal,
      valorHora: p.valorHora,
      dataAdmissao: p.dataAdmissao
    });
    setIsEditDrawerOpen(true);
  };

  const openDetailDrawer = (p: Preceptor) => {
    setSelectedPreceptorId(p.id);
    setIsDetailDrawerOpen(true);
  };

  // Toggle single document status
  const handleToggleDocStatus = (preceptorId: string, docIndex: number) => {
    const updated = preceptors.map((p) => {
      if (p.id === preceptorId) {
        const docs = [...p.documentos];
        const nextStatus = docs[docIndex].status === 'Validado' ? 'Pendente' : 'Validado';
        docs[docIndex] = {
          ...docs[docIndex],
          status: nextStatus as any
        };
        const updatedHistory = [
          { data: '10/07/2026 12:15', acao: `Documento '${docs[docIndex].nome}' alterado para ${nextStatus}`, usuario: 'Hesdras Viana' },
          ...p.historico
        ];
        return { ...p, documentos: docs, historico: updatedHistory };
      }
      return p;
    });
    setPreceptors(updated);
    setNotif('Status do documento atualizado.');
    setTimeout(() => setNotif(null), 2500);
  };

  // Finance/Payment Action (Approve single preceptor payment)
  const handleApprovePayment = (preceptorId: string, month: string) => {
    const updated = preceptors.map((p) => {
      if (p.id === preceptorId) {
        const updatedPagamentos = p.pagamentos.map((pag) => {
          if (pag.mes === month) {
            return { ...pag, status: 'Pago' as const };
          }
          return pag;
        });
        return { ...p, pagamentos: updatedPagamentos };
      }
      return p;
    });
    setPreceptors(updated);
    
    // Also update payments global state if matches
    const updatedGlobal = payments.map((p) => {
      if (p.beneficiario === preceptors.find(pr => pr.id === preceptorId)?.nome && p.dataAgendada === month) {
        return { ...p, status: 'Pago' as const };
      }
      return p;
    });
    setPayments(updatedGlobal);

    setNotif('Faturamento aprovado e encaminhado ao banco.');
    setTimeout(() => setNotif(null), 3000);
  };

  // NF/RPA Action (Approve Solicitation)
  const handleApproveSolicitacao = (id: string, action: 'Aprovado' | 'Rejeitado') => {
    const updated = solicitacoes.map((s) => {
      if (s.id === id) {
        return { ...s, status: action as any };
      }
      return s;
    });
    setSolicitacoes(updated);
    setNotif(`Solicitação ${id} alterada para status: ${action}.`);
    setTimeout(() => setNotif(null), 3000);
  };

  // Balance Request (Approve Chamado Saldo)
  const handleApproveChamado = (id: string, action: 'Aprovado' | 'Rejeitado') => {
    const updated = chamados.map((c) => {
      if (c.id === id) {
        return { ...c, status: action === 'Aprovado' ? 'Aprovado' as const : 'Recusado' as const };
      }
      return c;
    });
    setChamados(updated);
    setNotif(`Chamado orçamentário ${id} alterado para status: ${action === 'Aprovado' ? 'Aprovado' : 'Recusado'}.`);
    setTimeout(() => setNotif(null), 3000);
  };

  // Nav sub-pages list
  const subPagesList = [
    { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'lista', label: 'Cadastro & Lista', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'escalas', label: 'Escalas', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'pagamentos', label: 'Pagamentos', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'nf_rpa', label: 'NF / RPA', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'processos', label: 'Processos & Chamados', icon: <History className="w-3.5 h-3.5" /> },
    { id: 'saldos', label: 'Controle de Saldos', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'relatorios', label: 'Relatórios', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> }
  ];

  const activeTab = subPagesList.some(t => t.id === subPage) ? subPage : 'dashboard';

  // Calculations for general Preceptor KPIs
  const totalPreceptors = preceptors.length;
  const activePreceptors = preceptors.filter(p => p.status === 'Ativo').length;
  const pendingPreceptors = preceptors.filter(p => p.status === 'Pendente').length;
  const totalHoursWeekly = scales.length * 6; // Assume average 6 hrs per scale
  const estimatedCost = preceptors.reduce((sum, p) => sum + (p.valorHora * 24), 0); // Estimate

  return (
    <div className="space-y-6 relative animate-in fade-in duration-300">
      {/* Alert Notifications */}
      {notif && (
        <div className="fixed top-20 right-6 bg-slate-900 text-white border-l-4 border-blue-500 p-4 rounded-lg shadow-xl text-xs z-50 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
          <span className="font-semibold">{notif}</span>
          <button onClick={() => setNotif(null)} className="text-slate-400 hover:text-white font-bold">X</button>
        </div>
      )}

      {/* Module Navigation Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-wider uppercase mb-1">GESTÃO DE PRECEPTORES</h2>
            <p className="text-[11px] text-slate-500 font-medium">Controle de profissionais médicos credenciados, faturamentos integrados, retenção de impostos, repasses orçamentários e conciliações fiscais.</p>
          </div>
          {activeTab === 'lista' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors self-start md:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" /> Cadastrar Preceptor
            </button>
          )}
          {activeTab === 'escalas' && (
            <button
              onClick={onNewScaleClick}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors self-start md:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" /> Nova Escala de Preceptoria
            </button>
          )}
        </div>
      </div>

      {/* Embedded Module Content Canvas */}
      <div className="bg-transparent text-xs">
        
        {/* SUBPAGE 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <PreceptoresDashboard />
        )}

        {/* SUBPAGE 2: CADASTRO & LISTA */}
        {activeTab === 'lista' && (
          <EmDesenvolvimento
            titulo="Cadastro & Lista de Preceptores"
            objetivo="Gerenciar o cadastro unificado de médicos preceptores do ecossistema de medicina."
            escopo="Mapeamento de especialidades médicas, validação automática de CRM junto ao Conselho Federal de Medicina (CFM) e controle centralizado de documentação de credenciamento."
            recursosPrevistos={[
              "Integração em tempo real com CFM/Portal de Convênios",
              "Upload seguro de documentos (CRM, Diploma, Especializações)",
              "Assinatura digital de termos de compromisso e contratos de prestação"
            ]}
            statusAtual="Planejado (Fase de Definição)"
            roadmap="Previsto para Q3/2026"
            arquitetura="Servidor de arquivos seguro em nuvem com criptografia de ponta a ponta e banco de dados relacional em conformidade com a LGPD."
            proximasEtapas={[
              "Validação do escopo de conformidade jurídica para credenciamento",
              "Desenvolvimento de wireframes de onboarding para novos médicos"
            ]}
          />
        )}

        {/* SUBPAGE 3: ESCALAS */}
        {activeTab === 'escalas' && (
          <EmDesenvolvimento
            titulo="Gestão Dinâmica de Escalas"
            objetivo="Organização, controle e distribuição inteligente dos rodízios práticos e plantões dos preceptores nos hospitais parceiros."
            escopo="Escalonamento dinâmico de horários integrando a disponibilidade dos médicos docentes às grades curriculares e turmas de alunos."
            recursosPrevistos={[
              "Distribuição automatizada por disciplina e ala hospitalar",
              "Alertas automáticos de conflitos de horário e sobrecarga de escala",
              "Assinatura digital de presença via geolocalização e QR Code"
            ]}
            statusAtual="Em Especificação Técnica"
            roadmap="Previsto para Q3/2026"
            arquitetura="Microsserviço dedicado de agendamento acoplado ao motor de regras acadêmicas do ecossistema."
            proximasEtapas={[
              "Mapeamento detalhado dos fluxos operacionais de cada hospital conveniado",
              "Alinhamento com a equipe de engenharia para regras de folga e plantão"
            ]}
          />
        )}

        {/* SUBPAGE 4: PAGAMENTOS */}
        {activeTab === 'pagamentos' && (
          <EmDesenvolvimento
            titulo="Processamento de Pagamentos e Repasses"
            objetivo="Processamento unificado e transparente de honorários para todos os preceptores atuantes."
            escopo="Consolidação mensal automatizada de horas registradas em escala, cálculo de provisões financeiras e liquidação direta via Sispag."
            recursosPrevistos={[
              "Cálculo automático baseado em valor/hora cadastrado por especialidade",
              "Dedução automática de impostos federais e municipais de acordo com regime",
              "Histórico unificado de lotes pagos e comprovantes de repasse"
            ]}
            statusAtual="Arquitetado (Aguardando Barramento de Integração)"
            roadmap="Previsto para Q4/2026"
            arquitetura="Integração segura via barramento de APIs bancárias diretas com criptografia e tokenização de transações corporativas."
            proximasEtapas={[
              "Homologação das APIs de conciliação financeira com o setor financeiro corporativo",
              "Validação de regras tributárias para diferentes regimes fiscais"
            ]}
          />
        )}

        {/* SUBPAGE 5: NF / RPA */}
        {activeTab === 'nf_rpa' && (
          <EmDesenvolvimento
            titulo="Conciliação Fiscal de NF & RPA"
            objetivo="Recepção, auditoria e conciliação ágil de Notas Fiscais (PJ) e Recibos de Pagamento Autônomo (PF)."
            escopo="Processamento contábil integrado para prestadores de serviço individuais e sociedades médicas corporativas."
            recursosPrevistos={[
              "OCR inteligente para leitura automatizada de Notas Fiscais de Serviço (NFS-e)",
              "Cálculo automático de retenções na fonte (ISS, INSS, IRRF, PIS/COFINS)",
              "Painel de conciliação entre espelho de escala docente e documento fiscal emitido"
            ]}
            statusAtual="Em Desenvolvimento de Protótipo OCR"
            roadmap="Previsto para Q4/2026"
            arquitetura="Engine de processamento de documentos estruturados baseada em IA conectada ao sistema fiscal central."
            proximasEtapas={[
              "Integração das APIs de emissão automática junto às prefeituras conveniadas",
              "Testes de acurácia da ferramenta de leitura de documentos digitalizados"
            ]}
          />
        )}

        {/* SUBPAGE 6: PROCESSOS & CHAMADOS */}
        {activeTab === 'processos' && (
          <EmDesenvolvimento
            titulo="Processos Administrativos & Chamados Orçamentários"
            objetivo="Gestão centralizada de solicitações administrativas e liberação orçamentária emergencial."
            escopo="Fluxo de atendimento de chamados docentes, pedidos de alteração de escala fora do prazo e solicitações adicionais de verbas."
            recursosPrevistos={[
              "Controle automático de SLA para respostas a chamados acadêmicos e financeiros",
              "Fluxo de aprovação multinível de verbas adicionais (Alçadas de aprovação)",
              "Sistema de notificação push e alertas via e-mail corporativo"
            ]}
            statusAtual="Especificado e Aprovado pelo Comitê"
            roadmap="Previsto para Q1/2027"
            arquitetura="Engine de orquestração de processos BPMS integrada nativamente ao ERP central da unidade de ensino."
            proximasEtapas={[
              "Definição da matriz de alçadas de decisão por regional de coordenação",
              "Criação dos templates de resposta padronizada para chamados docentes"
            ]}
          />
        )}

        {/* SUBPAGE 7: CONTROLE DE SALDOS */}
        {activeTab === 'saldos' && (
          <EmDesenvolvimento
            titulo="Controle de Saldos e Limites Orçamentários"
            objetivo="Monitoramento rígido de teto orçamentário por unidade hospitalar e centro de custo."
            escopo="Controle financeiro preventivo, impedindo que as alocações docentes em rodízios práticos extrapolem as verbas semestrais homologadas."
            recursosPrevistos={[
              "Monitoramento gráfico em tempo real de saldo planejado versus realizado",
              "Travas operacionais automáticas ao atingir limites de segurança orçamentária",
              "Ferramenta de remanejamento flexível de saldos residuais entre alas hospitalares"
            ]}
            statusAtual="Mapeamento de Regras de Negócios"
            roadmap="Previsto para Q1/2027"
            arquitetura="Módulo analítico integrado à base de planejamento estratégico e BI financeiro."
            proximasEtapas={[
              "Definição dos limites de tolerância e alertas de estouro orçamentário",
              "Consolidação das diretrizes de remanejamento com a controladoria central"
            ]}
          />
        )}

        {/* SUBPAGE 8: RELATÓRIOS */}
        {activeTab === 'relatorios' && (
          <EmDesenvolvimento
            titulo="Relatórios Consolidados de Preceptoria"
            objetivo="Geração de insumos estratégicos analíticos e consolidados para apoio à tomada de decisões executivas."
            escopo="Exportação de relatórios gerenciais sobre custos de rodízios práticos, tributação recolhida na fonte e auditoria de assiduidade."
            recursosPrevistos={[
              "Gerador de relatórios customizados com filtros multidimensionais",
              "Visualizador gráfico interativo de evolução de custos por regional acadêmica",
              "Exportação em lote para formatos homologados (PDF, XLSX, CSV)"
            ]}
            statusAtual="Especificação de Metas e KPIs"
            roadmap="Previsto para Q2/2027"
            arquitetura="Pipeline de dados analíticos integrado ao repositório unificado de Big Data corporativo."
            proximasEtapas={[
              "Definição dos formatos oficiais de relatórios de auditoria interna",
              "Validação do painel de indicadores estratégicos com os diretores executivos"
            ]}
          />
        )}

      </div>

      {/* FLOATING MODAL: NOVO PRECEPTOR (CADASTRO) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <span className="font-bold text-xs uppercase tracking-wide">Credenciamento de Preceptor Médico</span>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-white hover:opacity-80 font-bold text-sm">X</button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNew} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dr. Marcelo Ramos"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">Registro CRM / UF</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 88775-PE"
                    value={formData.crm}
                    onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">Especialidade Médica</label>
                  <select
                    value={formData.especialidade}
                    onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
                  >
                    <option value="Clínica Médica">Clínica Médica</option>
                    <option value="Cirurgia Geral">Cirurgia Geral</option>
                    <option value="Pediatria">Pediatria</option>
                    <option value="Ginecologia e Obstetrícia">Ginecologia e Obstetrícia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">Valor Contratado por Hora</label>
                  <input
                    type="number"
                    required
                    value={formData.valorHora}
                    onChange={(e) => setFormData({ ...formData, valorHora: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">E-mail de Contato</label>
                  <input
                    type="email"
                    placeholder="Ex: marcelo@meduninassau.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">Telefone</label>
                  <input
                    type="text"
                    placeholder="Ex: (81) 98888-7777"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">Hospital de Atuação Principal</label>
                <select
                  value={formData.hospitalPrincipal}
                  onChange={(e) => setFormData({ ...formData, hospitalPrincipal: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.nome}>{h.nome}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Credenciar Preceptor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLIDE-OUT DRAWER: EDITAR CADASTRO */}
      {isEditDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white max-w-md w-full h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <div>
                <span className="font-bold text-xs uppercase tracking-wide">Editar Cadastro de Preceptor</span>
                <p className="text-[10px] text-blue-100 font-semibold">{selectedPreceptor.nome}</p>
              </div>
              <button onClick={() => setIsEditDrawerOpen(false)} className="text-white hover:opacity-80 font-bold text-sm">X</button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveEdit} className="p-6 flex-1 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">Registro CRM</label>
                <input
                  type="text"
                  required
                  value={formData.crm}
                  onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">Especialidade Médica</label>
                <select
                  value={formData.especialidade}
                  onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
                >
                  <option value="Clínica Médica">Clínica Médica</option>
                  <option value="Cirurgia Geral">Cirurgia Geral</option>
                  <option value="Pediatria">Pediatria</option>
                  <option value="Ginecologia e Obstetrícia">Ginecologia e Obstetrícia</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">Valor Contratual / Hora</label>
                <input
                  type="number"
                  required
                  value={formData.valorHora}
                  onChange={(e) => setFormData({ ...formData, valorHora: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">Telefone</label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px] tracking-wider">Hospital Principal de Escala</label>
                <select
                  value={formData.hospitalPrincipal}
                  onChange={(e) => setFormData({ ...formData, hospitalPrincipal: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.nome}>{h.nome}</option>
                  ))}
                </select>
              </div>
            </form>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditDrawerOpen(false)}
                className="flex-1 py-2 border border-slate-200 rounded font-bold text-slate-600 hover:bg-slate-50 transition-colors text-center"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                type="button"
                className="flex-1 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors text-center"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADVANCED RIGHT-SIDE DRAWER: DETALHES COMPLETOS */}
      {isDetailDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-in fade-in duration-150">
          <div className="bg-white max-w-xl w-full h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <div>
                <span className="bg-blue-500/20 text-blue-400 font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold">Perfil Executivo</span>
                <h3 className="text-sm font-black mt-1 uppercase tracking-wide">{selectedPreceptor.nome}</h3>
              </div>
              <button onClick={() => setIsDetailDrawerOpen(false)} className="text-slate-400 hover:text-white font-black text-sm">X</button>
            </div>

            {/* Scrollable Core Info Panel */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs text-slate-600">
              {/* Profile Overview */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl font-semibold">
                <div>
                  <span className="text-slate-400 text-[9px] uppercase block tracking-wider">CRM de Registro</span>
                  <span className="text-slate-900">{selectedPreceptor.crm}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase block tracking-wider">Especialidade</span>
                  <span className="text-slate-900">{selectedPreceptor.especialidade}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase block tracking-wider">Hospital Principal</span>
                  <span className="text-slate-900">{selectedPreceptor.hospitalPrincipal}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase block tracking-wider">Status Cadastral</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${
                      selectedPreceptor.status === 'Ativo'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}
                  >
                    {selectedPreceptor.status}
                  </span>
                </div>
              </div>

              {/* Connected academic items */}
              <div className="space-y-3 font-semibold">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-500" /> Disciplinas e Alas Mapeadas
                </h4>
                <div className="p-4 border border-slate-200 rounded-xl space-y-2 bg-slate-50">
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">Disciplinas Vinculadas:</span>
                    <span className="text-slate-950">{selectedPreceptor.disciplinasVinculadas.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Alas Hospitalares Físicas:</span>
                    <span className="text-slate-950">{selectedPreceptor.camposVinculados.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Documents verification lists */}
              <div className="space-y-3 font-semibold">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-blue-500" /> Credenciamento de Documentos Obrigatórios
                </h4>
                <div className="space-y-2">
                  {selectedPreceptor.documentos.map((doc, idx) => (
                    <div key={idx} className="p-3.5 border border-slate-200 rounded-xl flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <div>
                        <span className="text-slate-900 block">{doc.nome}</span>
                        <span className="text-[9px] font-mono text-slate-400">Enviado em: {doc.dataEnvio}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                            doc.status === 'Validado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}
                        >
                          {doc.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleDocStatus(selectedPreceptor.id, idx)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-bold rounded text-slate-700 transition-colors"
                        >
                          Alterar Validação
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical audit logs */}
              <div className="space-y-3">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-blue-500" /> Logs de Alterações Fiscais
                </h4>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px] space-y-2">
                  {selectedPreceptor.historico.map((log, i) => (
                    <div key={i} className="flex justify-between items-start gap-3 pb-2 border-b border-slate-200/40 last:border-0 last:pb-0">
                      <span className="text-slate-500 shrink-0">{log.data}</span>
                      <span className="text-slate-800 text-right leading-relaxed font-semibold">{log.acao} <span className="text-slate-400 font-normal">({log.usuario})</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
              <button
                type="button"
                onClick={() => setIsDetailDrawerOpen(false)}
                className="w-full py-2.5 bg-slate-900 text-white font-extrabold rounded-lg hover:bg-slate-800 transition-colors text-center text-xs uppercase tracking-wide"
              >
                Concluir Visualização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
