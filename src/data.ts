import {
  Preceptor,
  Hospital,
  CampoEstagio,
  Disciplina,
  Escala,
  FinanceiroRecord,
  Solicitacao,
  Pagamento,
  ChamadoSaldo,
  ControleSaldo
} from './types';

export const preceptoresInicial: Preceptor[] = [
  {
    id: 'PR001',
    nome: 'Dr. Roberto Almeida',
    crm: '12345-PE',
    especialidade: 'Cirurgia Geral',
    email: 'roberto.almeida@meduninassau.com',
    telefone: '(81) 98877-6655',
    status: 'Ativo',
    hospitalPrincipal: 'Hospital Esperança',
    disciplinasVinculadas: ['Cirurgia Geral I', 'Internato de Urgência'],
    camposVinculados: ['Bloco Cirúrgico A', 'Urgência Policlínica'],
    valorHora: 120.0,
    dataAdmissao: '12/03/2021',
    documentos: [
      { nome: 'CRM_Atualizado.pdf', status: 'Validado', dataEnvio: '10/01/2026' },
      { nome: 'Certificado_Especialista.pdf', status: 'Validado', dataEnvio: '12/01/2021' },
      { nome: 'Contrato_Assinado_2026.pdf', status: 'Validado', dataEnvio: '15/01/2026' }
    ],
    escalas: [
      { data: '2026-07-10', horaInicio: '07:00', horaFim: '13:00', local: 'Hospital Esperança - Bloco A' },
      { data: '2026-07-12', horaInicio: '13:00', horaFim: '19:00', local: 'Hospital Esperança - Bloco A' }
    ],
    pagamentos: [
      { mes: 'Junho/2026', valor: 5760.0, status: 'Pago' },
      { mes: 'Maio/2026', valor: 6240.0, status: 'Pago' }
    ],
    solicitacoes: [
      { id: 'SOL-001', tipo: 'NF', valor: 5760.0, data: '30/06/2026', status: 'Aprovado' }
    ],
    historico: [
      { data: '05/01/2026 10:14', acao: 'Atualização cadastral de e-mail', usuario: 'Mariana Costa (RH)' },
      { data: '15/01/2026 14:30', acao: 'Contrato de renovação anexado', usuario: 'Eduardo Santos (Financeiro)' }
    ]
  },
  {
    id: 'PR002',
    nome: 'Dra. Camila Moraes',
    crm: '54321-PE',
    especialidade: 'Clínica Médica',
    email: 'camila.moraes@meduninassau.com',
    telefone: '(81) 99112-2334',
    status: 'Pendente',
    hospitalPrincipal: 'Real Hospital Português',
    disciplinasVinculadas: ['Clínica Médica II', 'Semiologia Avançada'],
    camposVinculados: ['Enfermarias Clínicas 4º Andar'],
    valorHora: 110.0,
    dataAdmissao: '05/02/2023',
    documentos: [
      { nome: 'CRM_Atualizado.pdf', status: 'Validado', dataEnvio: '20/02/2023' },
      { nome: 'Certificado_Residencia.pdf', status: 'Validado', dataEnvio: '22/02/2023' },
      { nome: 'Declaracao_De_Vinculo_Anual.pdf', status: 'Pendente', dataEnvio: '01/07/2026' }
    ],
    escalas: [
      { data: '2026-07-11', horaInicio: '08:00', horaFim: '14:00', local: 'Real Hospital Português - Ala C' }
    ],
    pagamentos: [
      { mes: 'Junho/2026', valor: 4400.0, status: 'Pendente' }
    ],
    solicitacoes: [
      { id: 'SOL-002', tipo: 'RPA', valor: 4400.0, data: '02/07/2026', status: 'Pendente' }
    ],
    historico: [
      { data: '01/07/2026 09:00', acao: 'Envio de declaração anual pendente', usuario: 'Dra. Camila Moraes' }
    ]
  },
  {
    id: 'PR003',
    nome: 'Dr. Lucas Cavalcanti',
    crm: '98765-PE',
    especialidade: 'Pediatria',
    email: 'lucas.cavalcanti@meduninassau.com',
    telefone: '(81) 98765-4321',
    status: 'Ativo',
    hospitalPrincipal: 'Hospital Memorial São José',
    disciplinasVinculadas: ['Pediatria Clínica I', 'Neonatologia Prática'],
    camposVinculados: ['Emergência Pediátrica', 'UTI Neonatal'],
    valorHora: 115.0,
    dataAdmissao: '14/08/2022',
    documentos: [
      { nome: 'CRM_Lucas.pdf', status: 'Validado', dataEnvio: '14/08/2022' },
      { nome: 'Titulo_Pediatria.pdf', status: 'Validado', dataEnvio: '14/08/2022' }
    ],
    escalas: [
      { data: '2026-07-10', horaInicio: '19:00', horaFim: '01:00', local: 'Hospital Memorial - Emergência Ped' }
    ],
    pagamentos: [
      { mes: 'Junho/2026', valor: 5520.0, status: 'Pago' }
    ],
    solicitacoes: [],
    historico: []
  },
  {
    id: 'PR004',
    nome: 'Dra. Fernanda Silva',
    crm: '45678-PE',
    especialidade: 'Ginecologia e Obstetrícia',
    email: 'fernanda.silva@meduninassau.com',
    telefone: '(81) 99881-2233',
    status: 'Inativo',
    hospitalPrincipal: 'Hospital Esperança',
    disciplinasVinculadas: ['Ginecologia Clínica', 'Internato de Obstetrícia'],
    camposVinculados: ['Centro de Parto e Bloco Obstétrico'],
    valorHora: 130.0,
    dataAdmissao: '18/11/2020',
    documentos: [
      { nome: 'CRM_Fernanda.pdf', status: 'Validado', dataEnvio: '10/11/2020' },
      { nome: 'Comprovante_Apto.pdf', status: 'Vencido', dataEnvio: '10/11/2023' }
    ],
    escalas: [],
    pagamentos: [],
    solicitacoes: [],
    historico: [
      { data: '12/05/2026 15:30', acao: 'Desativação temporária por licença médica', usuario: 'Mariana Costa (RH)' }
    ]
  },
  {
    id: 'PR005',
    nome: 'Dr. Marcelo Barros',
    crm: '11223-PE',
    especialidade: 'Ortopedia',
    email: 'marcelo.barros@meduninassau.com',
    telefone: '(81) 99344-5566',
    status: 'Ativo',
    hospitalPrincipal: 'Real Hospital Português',
    disciplinasVinculadas: ['Ortopedia e Traumatologia'],
    camposVinculados: ['Emergência Traumato-Ortopédica'],
    valorHora: 125.0,
    dataAdmissao: '01/06/2024',
    documentos: [
      { nome: 'CRM_Atualizado.pdf', status: 'Validado', dataEnvio: '30/05/2024' }
    ],
    escalas: [
      { data: '2026-07-13', horaInicio: '07:00', horaFim: '13:00', local: 'Real Hospital Português - Traumato' }
    ],
    pagamentos: [],
    solicitacoes: [],
    historico: []
  },
  {
    id: 'PR006',
    nome: 'Dra. Beatriz Santos',
    crm: '33445-PE',
    especialidade: 'Medicina de Família e Comunidade',
    email: 'beatriz.santos@meduninassau.com',
    telefone: '(81) 98711-2233',
    status: 'Ativo',
    hospitalPrincipal: 'Hospital Agamenon Magalhães',
    disciplinasVinculadas: ['Saúde da Família I', 'Saúde Coletiva Prática'],
    camposVinculados: ['USF Macaxeira', 'USF Casa Amarela'],
    valorHora: 100.0,
    dataAdmissao: '01/02/2025',
    documentos: [
      { nome: 'CRM_Beatriz.pdf', status: 'Validado', dataEnvio: '20/01/2025' }
    ],
    escalas: [
      { data: '2026-07-10', horaInicio: '08:00', horaFim: '14:00', local: 'USF Macaxeira - Consultório 03' }
    ],
    pagamentos: [],
    solicitacoes: [],
    historico: []
  },
  {
    id: 'PR007',
    nome: 'Dr. André Albuquerque',
    crm: '88442-PE',
    especialidade: 'Cardiologia',
    email: 'andre.albuquerque@meduninassau.com',
    telefone: '(81) 99554-1122',
    status: 'Ativo',
    hospitalPrincipal: 'Hospital Santa Joana',
    disciplinasVinculadas: ['Cardiologia Prática', 'Internato em Terapia Intensiva'],
    camposVinculados: ['UTI Cardiológica', 'Unidade Coronariana'],
    valorHora: 135.0,
    dataAdmissao: '15/09/2021',
    documentos: [
      { nome: 'CRM_Cardio.pdf', status: 'Validado', dataEnvio: '15/09/2021' }
    ],
    escalas: [
      { data: '2026-07-11', horaInicio: '13:00', horaFim: '19:00', local: 'Hospital Santa Joana - UTI Cardio' }
    ],
    pagamentos: [],
    solicitacoes: [],
    historico: []
  },
  {
    id: 'PR008',
    nome: 'Dra. Patricia Montenegro',
    crm: '55612-PE',
    especialidade: 'Infectologia',
    email: 'patricia.montenegro@meduninassau.com',
    telefone: '(81) 99122-3344',
    status: 'Pendente',
    hospitalPrincipal: 'Hospital Agamenon Magalhães',
    disciplinasVinculadas: ['Infectologia e Parasitologia'],
    camposVinculados: ['Ala de Isolamento / CCIH'],
    valorHora: 115.0,
    dataAdmissao: '10/01/2026',
    documentos: [
      { nome: 'Ficha_Admissional.pdf', status: 'Pendente', dataEnvio: '15/06/2026' }
    ],
    escalas: [],
    pagamentos: [],
    solicitacoes: [],
    historico: []
  }
];

export const hospitaisInicial: Hospital[] = [
  {
    id: 'HP001',
    nome: 'Real Hospital Português',
    cidade: 'Recife',
    capacidadeAlunos: 120,
    ocupacaoAtual: 110,
    status: 'Ativo',
    especialidades: ['Clínica Médica', 'Ortopedia', 'Nefrologia', 'Cardiologia'],
    camposEstagio: ['Enfermarias Clínicas 4º Andar', 'Emergência Traumato-Ortopédica', 'UTI Geral'],
    preceptoresAlocados: ['Dra. Camila Moraes', 'Dr. Marcelo Barros'],
    disciplinasOferecidas: ['Clínica Médica II', 'Ortopedia e Traumatologia'],
    contratoNumero: 'CT-2024-089A',
    contratoVencimento: '15/12/2028',
    valorMensal: 145000.0,
    convenioStatus: 'Vigente',
    indicadores: { conformidade: 98, avaliacaoAlunos: 92, instalacoes: 96 }
  },
  {
    id: 'HP002',
    nome: 'Hospital Esperança',
    cidade: 'Recife',
    capacidadeAlunos: 95,
    ocupacaoAtual: 81,
    status: 'Ativo',
    especialidades: ['Cirurgia Geral', 'Ginecologia e Obstetrícia', 'Pediatria'],
    camposEstagio: ['Bloco Cirúrgico A', 'Centro de Parto e Bloco Obstétrico'],
    preceptoresAlocados: ['Dr. Roberto Almeida', 'Dra. Fernanda Silva'],
    disciplinasOferecidas: ['Cirurgia Geral I', 'Internato de Urgência', 'Ginecologia Clínica'],
    contratoNumero: 'CT-2025-011B',
    contratoVencimento: '22/07/2029',
    valorMensal: 110000.0,
    convenioStatus: 'Vigente',
    indicadores: { conformidade: 95, avaliacaoAlunos: 88, instalacoes: 92 }
  },
  {
    id: 'HP003',
    nome: 'Hospital Santa Joana',
    cidade: 'Recife',
    capacidadeAlunos: 80,
    ocupacaoAtual: 48,
    status: 'Ativo',
    especialidades: ['Cardiologia', 'Clínica Médica', 'Cirurgia Geral'],
    camposEstagio: ['UTI Cardiológica', 'Enfermaria Geral'],
    preceptoresAlocados: ['Dr. André Albuquerque'],
    disciplinasOferecidas: ['Cardiologia Prática', 'Internato em Terapia Intensiva'],
    contratoNumero: 'CT-2023-145D',
    contratoVencimento: '30/11/2027',
    valorMensal: 85000.0,
    convenioStatus: 'Vigente',
    indicadores: { conformidade: 92, avaliacaoAlunos: 85, instalacoes: 90 }
  },
  {
    id: 'HP004',
    nome: 'Hospital Agamenon Magalhães',
    cidade: 'Recife',
    capacidadeAlunos: 150,
    ocupacaoAtual: 60,
    status: 'Revisão',
    especialidades: ['Saúde da Família', 'Infectologia', 'Pediatria'],
    camposEstagio: ['USF Macaxeira', 'USF Casa Amarela', 'Ala de Isolamento / CCIH'],
    preceptoresAlocados: ['Dra. Beatriz Santos', 'Dra. Patricia Montenegro'],
    disciplinasOferecidas: ['Saúde da Família I', 'Infectologia e Parasitologia'],
    contratoNumero: 'CT-2021-002E',
    contratoVencimento: '10/05/2026',
    valorMensal: 125000.0,
    convenioStatus: 'Em Renovação',
    indicadores: { conformidade: 84, avaliacaoAlunos: 79, instalacoes: 81 }
  },
  {
    id: 'HP005',
    nome: 'Hospital Memorial São José',
    cidade: 'Recife',
    capacidadeAlunos: 70,
    ocupacaoAtual: 52,
    status: 'Ativo',
    especialidades: ['Pediatria', 'Neonatologia', 'Cirurgia Pediátrica'],
    camposEstagio: ['Emergência Pediátrica', 'UTI Neonatal'],
    preceptoresAlocados: ['Dr. Lucas Cavalcanti'],
    disciplinasOferecidas: ['Pediatria Clínica I', 'Neonatologia Prática'],
    contratoNumero: 'CT-2024-055F',
    contratoVencimento: '01/09/2028',
    valorMensal: 95000.0,
    convenioStatus: 'Vigente',
    indicadores: { conformidade: 96, avaliacaoAlunos: 90, instalacoes: 94 }
  },
  {
    id: 'HP006',
    nome: 'Policlínica Unimed Recife',
    cidade: 'Recife',
    capacidadeAlunos: 60,
    ocupacaoAtual: 45,
    status: 'Ativo',
    especialidades: ['Clínica Médica', 'Cardiologia', 'Dermatologia'],
    camposEstagio: ['Ambulatório Integrado'],
    preceptoresAlocados: [],
    disciplinasOferecidas: [],
    contratoNumero: 'CT-2025-077H',
    contratoVencimento: '20/02/2030',
    valorMensal: 70000.0,
    convenioStatus: 'Vigente',
    indicadores: { conformidade: 94, avaliacaoAlunos: 86, instalacoes: 89 }
  }
];

export const camposInicial: CampoEstagio[] = [
  {
    id: 'CP001',
    nome: 'Bloco Cirúrgico A',
    hospital: 'Hospital Esperança',
    disciplina: 'Cirurgia Geral I',
    capacidadeMaxima: 20,
    alunosAtivos: 18,
    preceptores: ['Dr. Roberto Almeida'],
    escalasAtivas: 12,
    custoMensal: 12000.0,
    status: 'Ativo',
    grupos: [
      { nome: 'Grupo Alfa - Cirurgia', alunosCount: 6, preceptor: 'Dr. Roberto Almeida' },
      { nome: 'Grupo Beta - Cirurgia', alunosCount: 6, preceptor: 'Dr. Roberto Almeida' },
      { nome: 'Grupo Gama - Cirurgia', alunosCount: 6, preceptor: 'Dr. Roberto Almeida' }
    ],
    indicadores: { aproveitamento: 92, absenteismo: 2 }
  },
  {
    id: 'CP002',
    nome: 'Enfermarias Clínicas 4º Andar',
    hospital: 'Real Hospital Português',
    disciplina: 'Clínica Médica II',
    capacidadeMaxima: 30,
    alunosAtivos: 28,
    preceptores: ['Dra. Camila Moraes'],
    escalasAtivas: 15,
    custoMensal: 15000.0,
    status: 'Ativo',
    grupos: [
      { nome: 'Grupo A - Clínica Médica', alunosCount: 10, preceptor: 'Dra. Camila Moraes' },
      { nome: 'Grupo B - Clínica Médica', alunosCount: 9, preceptor: 'Dra. Camila Moraes' },
      { nome: 'Grupo C - Clínica Médica', alunosCount: 9, preceptor: 'Dra. Camila Moraes' }
    ],
    indicadores: { aproveitamento: 89, absenteismo: 4 }
  },
  {
    id: 'CP003',
    nome: 'Emergência Pediátrica',
    hospital: 'Hospital Memorial São José',
    disciplina: 'Pediatria Clínica I',
    capacidadeMaxima: 15,
    alunosAtivos: 14,
    preceptores: ['Dr. Lucas Cavalcanti'],
    escalasAtivas: 8,
    custoMensal: 9500.0,
    status: 'Ativo',
    grupos: [
      { nome: 'Grupo P1', alunosCount: 7, preceptor: 'Dr. Lucas Cavalcanti' },
      { nome: 'Grupo P2', alunosCount: 7, preceptor: 'Dr. Lucas Cavalcanti' }
    ],
    indicadores: { aproveitamento: 94, absenteismo: 1 }
  },
  {
    id: 'CP004',
    nome: 'USF Macaxeira',
    hospital: 'Hospital Agamenon Magalhães',
    disciplina: 'Saúde da Família I',
    capacidadeMaxima: 12,
    alunosAtivos: 10,
    preceptores: ['Dra. Beatriz Santos'],
    escalasAtivas: 6,
    custoMensal: 5000.0,
    status: 'Ativo',
    grupos: [
      { nome: 'Grupo Família A', alunosCount: 5, preceptor: 'Dra. Beatriz Santos' },
      { nome: 'Grupo Família B', alunosCount: 5, preceptor: 'Dra. Beatriz Santos' }
    ],
    indicadores: { aproveitamento: 85, absenteismo: 5 }
  },
  {
    id: 'CP005',
    nome: 'Centro de Parto Obstétrico',
    hospital: 'Hospital Esperança',
    disciplina: 'Internato de Obstetrícia',
    capacidadeMaxima: 10,
    alunosAtivos: 0,
    preceptores: ['Dra. Fernanda Silva'],
    escalasAtivas: 0,
    custoMensal: 8000.0,
    status: 'Suspenso',
    grupos: [],
    indicadores: { aproveitamento: 0, absenteismo: 0 }
  }
];

export const disciplinasInicial: Disciplina[] = [
  {
    id: 'DS001',
    nome: 'Cirurgia Geral I',
    cargaHoraria: 180,
    codigo: 'MED-701',
    periodo: '7º Período',
    internato: false,
    hospitaisParceiros: ['Hospital Esperança', 'Hospital Santa Joana'],
    preceptoresAtivos: ['Dr. Roberto Almeida'],
    indicadores: { notaMedia: 8.4, evasao: 0 },
    custoHoraPreceptor: 120.0
  },
  {
    id: 'DS002',
    nome: 'Clínica Médica II',
    cargaHoraria: 240,
    codigo: 'MED-802',
    periodo: '8º Período',
    internato: false,
    hospitaisParceiros: ['Real Hospital Português', 'Policlínica Unimed Recife'],
    preceptoresAtivos: ['Dra. Camila Moraes'],
    indicadores: { notaMedia: 7.9, evasao: 1.2 },
    custoHoraPreceptor: 110.0
  },
  {
    id: 'DS003',
    nome: 'Pediatria Clínica I',
    cargaHoraria: 120,
    codigo: 'MED-703',
    periodo: '7º Período',
    internato: false,
    hospitaisParceiros: ['Hospital Memorial São José', 'Hospital Agamenon Magalhães'],
    preceptoresAtivos: ['Dr. Lucas Cavalcanti'],
    indicadores: { notaMedia: 9.1, evasao: 0 },
    custoHoraPreceptor: 115.0
  },
  {
    id: 'DS004',
    nome: 'Saúde da Família I',
    cargaHoraria: 160,
    codigo: 'MED-604',
    periodo: '6º Período',
    internato: false,
    hospitaisParceiros: ['Hospital Agamenon Magalhães'],
    preceptoresAtivos: ['Dra. Beatriz Santos'],
    indicadores: { notaMedia: 8.7, evasao: 2.5 },
    custoHoraPreceptor: 100.0
  },
  {
    id: 'DS005',
    nome: 'Internato de Obstetrícia',
    cargaHoraria: 360,
    codigo: 'MED-1105',
    periodo: '11º Período',
    internato: true,
    hospitaisParceiros: ['Hospital Esperança'],
    preceptoresAtivos: ['Dra. Fernanda Silva'],
    indicadores: { notaMedia: 8.8, evasao: 0 },
    custoHoraPreceptor: 130.0
  }
];

export const escalasInicial: Escala[] = [
  {
    id: 'ESC001',
    preceptorId: 'PR001',
    preceptorNome: 'Dr. Roberto Almeida',
    hospitalId: 'HP002',
    hospitalNome: 'Hospital Esperança',
    disciplinaId: 'DS001',
    disciplinaNome: 'Cirurgia Geral I',
    campoId: 'CP001',
    campoNome: 'Bloco Cirúrgico A',
    data: '2026-07-10',
    horaInicio: '07:00',
    horaFim: '13:00',
    status: 'Confirmada'
  },
  {
    id: 'ESC002',
    preceptorId: 'PR001',
    preceptorNome: 'Dr. Roberto Almeida',
    hospitalId: 'HP002',
    hospitalNome: 'Hospital Esperança',
    disciplinaId: 'DS001',
    disciplinaNome: 'Cirurgia Geral I',
    campoId: 'CP001',
    campoNome: 'Bloco Cirúrgico A',
    data: '2026-07-12',
    horaInicio: '13:00',
    horaFim: '19:00',
    status: 'Confirmada'
  },
  {
    id: 'ESC003',
    preceptorId: 'PR002',
    preceptorNome: 'Dra. Camila Moraes',
    hospitalId: 'HP001',
    hospitalNome: 'Real Hospital Português',
    disciplinaId: 'DS002',
    disciplinaNome: 'Clínica Médica II',
    campoId: 'CP002',
    campoNome: 'Enfermarias Clínicas 4º Andar',
    data: '2026-07-11',
    horaInicio: '08:00',
    horaFim: '14:00',
    status: 'Confirmada'
  },
  {
    id: 'ESC004',
    preceptorId: 'PR003',
    preceptorNome: 'Dr. Lucas Cavalcanti',
    hospitalId: 'HP005',
    hospitalNome: 'Hospital Memorial São José',
    disciplinaId: 'DS003',
    disciplinaNome: 'Pediatria Clínica I',
    campoId: 'CP003',
    campoNome: 'Emergência Pediátrica',
    data: '2026-07-10',
    horaInicio: '19:00',
    horaFim: '01:00',
    status: 'Conflito',
    observacao: 'Conflito de escala de plantão com plantão de UTI no Memorial.'
  },
  {
    id: 'ESC005',
    preceptorId: 'PR005',
    preceptorNome: 'Dr. Marcelo Barros',
    hospitalId: 'HP001',
    hospitalNome: 'Real Hospital Português',
    disciplinaId: 'DS002',
    disciplinaNome: 'Ortopedia e Traumatologia',
    campoId: 'CP002',
    campoNome: 'Emergência Traumato-Ortopédica',
    data: '2026-07-13',
    horaInicio: '07:00',
    horaFim: '13:00',
    status: 'Confirmada'
  },
  {
    id: 'ESC006',
    preceptorId: 'PR006',
    preceptorNome: 'Dra. Beatriz Santos',
    hospitalId: 'HP004',
    hospitalNome: 'Hospital Agamenon Magalhães',
    disciplinaId: 'DS004',
    disciplinaNome: 'Saúde da Família I',
    campoId: 'CP004',
    campoNome: 'USF Macaxeira',
    data: '2026-07-10',
    horaInicio: '08:00',
    horaFim: '14:00',
    status: 'Confirmada'
  },
  {
    id: 'ESC007',
    preceptorId: 'PR001',
    preceptorNome: 'Dr. Roberto Almeida',
    hospitalId: 'HP002',
    hospitalNome: 'Hospital Esperança',
    disciplinaId: 'DS001',
    disciplinaNome: 'Cirurgia Geral I',
    campoId: 'CP001',
    campoNome: 'Bloco Cirúrgico A',
    data: '2026-07-06',
    horaInicio: '07:00',
    horaFim: '13:00',
    status: 'Falta',
    observacao: 'Preceptor justificou ausência por congresso.'
  },
  {
    id: 'ESC008',
    preceptorId: 'PR001',
    preceptorNome: 'Dr. Roberto Almeida',
    hospitalId: 'HP002',
    hospitalNome: 'Hospital Esperança',
    disciplinaId: 'DS001',
    disciplinaNome: 'Cirurgia Geral I',
    campoId: 'CP001',
    campoNome: 'Bloco Cirúrgico A',
    data: '2026-07-15',
    horaInicio: '07:00',
    horaFim: '13:00',
    status: 'Reposição',
    observacao: 'Reposição referente ao dia 06/07.'
  }
];

export const financeiroInicial: FinanceiroRecord[] = [
  {
    id: 'FIN001',
    centroCusto: 'Centro de Custo 04B - Internato RHP',
    fornecedorPreceptor: 'Hospital Esperança S.A.',
    documentoTipo: 'NF',
    documentoNumero: 'NF-4592',
    valorPrevisto: 45200.0,
    valorPago: 0.0,
    valorPendente: 45200.0,
    status: 'Divergente',
    vencimento: '2026-07-15',
    detalhesAuditoria: [
      'Valor divergente da planilha acordada no contrato (-R$ 450,00)',
      'Falta de assinatura eletrônica do Diretor Clínico.'
    ]
  },
  {
    id: 'FIN002',
    centroCusto: 'Centro de Custo 02A - Preceptoria Clínica',
    fornecedorPreceptor: 'Dr. Carlos Mendes da Silva',
    documentoTipo: 'RPA',
    documentoNumero: 'RPA-8812',
    valorPrevisto: 3450.0,
    valorPago: 0.0,
    valorPendente: 3450.0,
    status: 'Pendente',
    vencimento: '2026-07-20',
    detalhesAuditoria: [
      'Aguardando aprovação da coordenação de internato.',
      'Ficha de frequência de alunos validada pelo hospital.'
    ]
  },
  {
    id: 'FIN003',
    centroCusto: 'Centro de Custo 03C - Materiais Médicos',
    fornecedorPreceptor: 'MedSupply Distribuidora',
    documentoTipo: 'NF',
    documentoNumero: 'NF-2104',
    valorPrevisto: 12800.0,
    valorPago: 12800.0,
    valorPendente: 0.0,
    status: 'Liquidado',
    vencimento: '2026-07-10',
    dataPagamento: '2026-07-09'
  },
  {
    id: 'FIN004',
    centroCusto: 'Centro de Custo 01A - Preceptoria Geral',
    fornecedorPreceptor: 'Dra. Ana Luiza Freitas',
    documentoTipo: 'RPA',
    documentoNumero: 'RPA-8815',
    valorPrevisto: 4100.0,
    valorPago: 0.0,
    valorPendente: 4100.0,
    status: 'Erro de Carga',
    vencimento: '2026-07-22',
    detalhesAuditoria: [
      'Divergência de PIS cadastrado.',
      'Valor diverge das horas comprovadas no sistema acadêmico.'
    ]
  },
  {
    id: 'FIN005',
    centroCusto: 'Centro de Custo Geral - Repasse Central',
    fornecedorPreceptor: 'UNINASSAU Central',
    documentoTipo: 'CLT',
    documentoNumero: 'TRF-901',
    valorPrevisto: 150000.0,
    valorPago: 150000.0,
    valorPendente: 0.0,
    status: 'Liquidado',
    vencimento: '2026-07-05',
    dataPagamento: '2026-07-05'
  }
];

export const solicitacoesInicial: Solicitacao[] = [
  {
    id: 'SOL-001',
    preceptorNome: 'Dr. Roberto Almeida',
    tipo: 'NF',
    documentoRef: 'NF-3490_Almeida',
    valor: 5760.0,
    dataSolicitacao: '30/06/2026',
    status: 'Aprovado',
    anexos: ['NF-3490_Assinada.pdf', 'Relatorio_Atividades_Almeida.pdf'],
    comentarios: [
      { usuario: 'Eduardo Santos (Fin)', texto: 'NF bate perfeitamente com a planilha de horas. Aprovado.', data: '30/06/2026 16:30' }
    ],
    timeline: [
      { status: 'Solicitado', data: '30/06/2026 10:15', descricao: 'Solicitação criada pelo preceptor.' },
      { status: 'Sob Análise', data: '30/06/2026 14:00', descricao: 'Análise fiscal iniciada.' },
      { status: 'Aprovado', data: '30/06/2026 16:30', descricao: 'Documento aprovado para pagamento.' }
    ]
  },
  {
    id: 'SOL-002',
    preceptorNome: 'Dra. Camila Moraes',
    tipo: 'RPA',
    documentoRef: 'RPA-449_Moraes',
    valor: 4400.0,
    dataSolicitacao: '02/07/2026',
    status: 'Pendente',
    anexos: ['Planilha_Horas_Moraes.pdf'],
    comentarios: [
      { usuario: 'Dra. Camila Moraes', texto: 'Envio anexo o relatório validado pela supervisão clínica do Português.', data: '02/07/2026 09:12' }
    ],
    timeline: [
      { status: 'Solicitado', data: '02/07/2026 09:12', descricao: 'Solicitação criada pela preceptora.' },
      { status: 'Sob Análise', data: '02/07/2026 11:30', descricao: 'Aguardando validação da coordenação de internato.' }
    ]
  },
  {
    id: 'SOL-003',
    preceptorNome: 'Dr. Lucas Cavalcanti',
    tipo: 'Reembolso',
    documentoRef: 'REM-882_TaxaPediatria',
    valor: 350.0,
    dataSolicitacao: '05/07/2026',
    status: 'Divergente',
    anexos: ['Cupom_Fiscal_Congresso.pdf'],
    comentarios: [
      { usuario: 'Juliana Melo (Auditoria)', texto: 'Taxa de inscrição em congresso necessita de autorização prévia da diretoria.', data: '06/07/2026 14:22' }
    ],
    timeline: [
      { status: 'Solicitado', data: '05/07/2026 15:40', descricao: 'Reembolso de despesa de congresso enviado.' },
      { status: 'Divergente', data: '06/07/2026 14:22', descricao: 'Apontada necessidade de autorização prévia da coordenação geral.' }
    ]
  }
];

export const pagamentosInicial: Pagamento[] = [
  {
    id: 'PAG-001',
    beneficiario: 'Hospital Esperança S.A.',
    tipo: 'Lote',
    documentoRef: 'Fatura_Hosp_062026',
    valor: 110000.0,
    dataAgendada: '2026-07-15',
    status: 'Agendado',
    historico: [
      { acao: 'Agendamento de pagamento no lote fiscal', data: '01/07/2026 12:00', usuario: 'Eduardo Santos (Fin)' }
    ]
  },
  {
    id: 'PAG-002',
    beneficiario: 'Dr. Roberto Almeida',
    tipo: 'Individual',
    documentoRef: 'RPA_Roberto_062026',
    valor: 5760.0,
    dataAgendada: '2026-07-10',
    comprovanteUrl: '#comprovante-01',
    status: 'Pago',
    historico: [
      { acao: 'Processado lote bancário de RPA', data: '09/07/2026 18:00', usuario: 'SISPAG Banco' }
    ]
  },
  {
    id: 'PAG-003',
    beneficiario: 'Dra. Camila Moraes',
    tipo: 'Individual',
    documentoRef: 'RPA_Camila_062026',
    valor: 4400.0,
    dataAgendada: '2026-07-10',
    status: 'Agendado',
    historico: [
      { acao: 'Gerada ordem de pagamento no sistema financeiro', data: '03/07/2026 10:14', usuario: 'Eduardo Santos (Fin)' }
    ]
  }
];

export const chamadosInicial: ChamadoSaldo[] = [
  {
    id: 'CH-2026-001',
    processo: 'Ajuste de Saldo Orçamentário RHP',
    solicitante: 'Coordenação Geral de Medicina',
    valorSolicitado: 45000.0,
    dataAbertura: '01/07/2026',
    status: 'Em Análise',
    etapaAtual: 'Análise de Viabilidade Financeira',
    movimentacao: [
      { tipo: 'Credito', valor: 45000.0, data: '01/07/2026' }
    ],
    historico: [
      { data: '01/07/2026 09:30', etapa: 'Abertura de Chamado', responsavel: 'Coordenação Medicina' },
      { data: '02/07/2026 14:00', etapa: 'Validação de Saldo Escolas', responsavel: 'Felipe Neves (Saldos)' }
    ]
  },
  {
    id: 'CH-2026-002',
    processo: 'Acréscimo de Saldo de Urgência IMIP',
    solicitante: 'Supervisão de Internato',
    valorSolicitado: 12000.0,
    dataAbertura: '28/06/2026',
    status: 'Aprovado',
    etapaAtual: 'Lançado em Caixa',
    movimentacao: [
      { tipo: 'Credito', valor: 12000.0, data: '28/06/2026' },
      { tipo: 'Debito', valor: 12000.0, data: '30/06/2026' }
    ],
    historico: [
      { data: '28/06/2026 08:15', etapa: 'Abertura de Chamado', responsavel: 'Supervisão Internato' },
      { data: '29/06/2026 11:30', etapa: 'Aprovação de verba', responsavel: 'Gerente Financeiro' },
      { data: '30/06/2026 16:45', etapa: 'Lançamento em Caixa', responsavel: 'Juliana Melo (CC)' }
    ]
  }
];

export const saldosInicial: ControleSaldo[] = [
  {
    id: 'SL-001',
    processoNome: 'Internato de Urgência 2026.1',
    periodo: 'Semestre 2026.1',
    fornecedor: 'Hospital Esperança S.A.',
    saldoInicial: 500000.0,
    saldoConsumido: 340000.0,
    saldoDisponivel: 160000.0,
    status: 'Disponível',
    movimentacoes: [
      { tipo: 'Débito', valor: 45200.0, data: '15/06/2026', desc: 'Repasse mensal preceptoria' },
      { tipo: 'Crédito', valor: 12000.0, data: '28/06/2026', desc: 'Chamado de saldo aprovado' }
    ]
  },
  {
    id: 'SL-002',
    processoNome: 'Clínica Médica RHP 2026.1',
    periodo: 'Semestre 2026.1',
    fornecedor: 'Real Hospital Português',
    saldoInicial: 400000.0,
    saldoConsumido: 395000.0,
    saldoDisponivel: 5000.0,
    status: 'Alerta',
    movimentacoes: [
      { tipo: 'Débito', valor: 65000.0, data: '20/06/2026', desc: 'Faturamento de blocos cirúrgicos' }
    ]
  },
  {
    id: 'SL-003',
    processoNome: 'Saúde da Família Macaxeira 2026.1',
    periodo: 'Semestre 2026.1',
    fornecedor: 'Hospital Agamenon Magalhães',
    saldoInicial: 150000.0,
    saldoConsumido: 158000.0,
    saldoDisponivel: -8000.0,
    status: 'Negativo',
    movimentacoes: [
      { tipo: 'Débito', valor: 25000.0, data: '10/06/2026', desc: 'Excedente de preceptoria ambulatorial' }
    ]
  }
];
