export type ModuleId =
  | 'home'
  | 'preceptores'
  | 'simulamed'
  | 'convenios';

export interface Preceptor {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  email: string;
  telefone: string;
  status: 'Ativo' | 'Pendente' | 'Inativo';
  hospitalPrincipal: string;
  disciplinasVinculadas: string[];
  camposVinculados: string[];
  valorHora: number;
  dataAdmissao: string;
  documentos: { nome: string; status: 'Validado' | 'Pendente' | 'Vencido'; dataEnvio: string }[];
  escalas: { data: string; horaInicio: string; horaFim: string; local: string }[];
  pagamentos: { mes: string; valor: number; status: 'Pago' | 'Pendente' | 'Processando' }[];
  solicitacoes: { id: string; tipo: string; valor: number; data: string; status: string }[];
  historico: { data: string; acao: string; usuario: string }[];
}

export interface Hospital {
  id: string;
  nome: string;
  cidade: string;
  capacidadeAlunos: number;
  ocupacaoAtual: number;
  status: 'Ativo' | 'Revisão' | 'Inativo';
  especialidades: string[];
  camposEstagio: string[];
  preceptoresAlocados: string[];
  disciplinasOferecidas: string[];
  contratoNumero: string;
  contratoVencimento: string;
  valorMensal: number;
  convenioStatus: 'Vigente' | 'Expirado' | 'Em Renovação';
  indicadores: { conformidade: number; avaliacaoAlunos: number; instalacoes: number };
}

export interface CampoEstagio {
  id: string;
  nome: string;
  hospital: string;
  disciplina: string;
  capacidadeMaxima: number;
  alunosAtivos: number;
  preceptores: string[];
  escalasAtivas: number;
  custoMensal: number;
  status: 'Ativo' | 'Suspenso';
  grupos: { nome: string; alunosCount: number; preceptor: string }[];
  indicadores: { aproveitamento: number; absenteismo: number };
}

export interface Disciplina {
  id: string;
  nome: string;
  cargaHoraria: number; // in hours
  codigo: string;
  periodo: string;
  internato: boolean;
  hospitaisParceiros: string[];
  preceptoresAtivos: string[];
  indicadores: { notaMedia: number; evasao: number };
  custoHoraPreceptor: number;
}

export interface Escala {
  id: string;
  preceptorId: string;
  preceptorNome: string;
  hospitalId: string;
  hospitalNome: string;
  disciplinaId: string;
  disciplinaNome: string;
  campoId: string;
  campoNome: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  status: 'Confirmada' | 'Conflito' | 'Falta' | 'Reposição';
  observacao?: string;
}

export interface FinanceiroRecord {
  id: string;
  centroCusto: string;
  fornecedorPreceptor: string;
  documentoTipo: 'NF' | 'RPA' | 'CLT';
  documentoNumero: string;
  valorPrevisto: number;
  valorPago: number;
  valorPendente: number;
  status: 'Liquidado' | 'Pendente' | 'Divergente' | 'Erro de Carga';
  vencimento: string;
  dataPagamento?: string;
  detalhesAuditoria?: string[];
}

export interface Solicitacao {
  id: string;
  preceptorNome: string;
  tipo: 'NF' | 'RPA' | 'Reembolso' | 'Adicional';
  documentoRef: string;
  valor: number;
  dataSolicitacao: string;
  status: 'Aprovado' | 'Pendente' | 'Divergente' | 'Rejeitado';
  anexos: string[];
  comentarios: { usuario: string; texto: string; data: string }[];
  timeline: { status: string; data: string; descricao: string }[];
}

export interface Pagamento {
  id: string;
  beneficiario: string;
  tipo: 'Individual' | 'Lote';
  documentoRef: string;
  valor: number;
  dataAgendada: string;
  comprovanteUrl?: string;
  status: 'Pago' | 'Agendado' | 'Cancelado' | 'Conciliado';
  historico: { acao: string; data: string; usuario: string }[];
}

export interface ChamadoSaldo {
  id: string;
  processo: string;
  solicitante: string;
  valorSolicitado: number;
  dataAbertura: string;
  status: 'Aberto' | 'Em Análise' | 'Aprovado' | 'Recusado';
  etapaAtual: string;
  movimentacao: { tipo: 'Credito' | 'Debito'; valor: number; data: string }[];
  historico: { data: string; etapa: string; responsavel: string }[];
}

export interface ControleSaldo {
  id: string;
  processoNome: string;
  periodo: string;
  fornecedor: string;
  saldoInicial: number;
  saldoConsumido: number;
  saldoDisponivel: number;
  status: 'Disponível' | 'Alerta' | 'Negativo';
  movimentacoes: { tipo: string; valor: number; data: string; desc: string }[];
}
