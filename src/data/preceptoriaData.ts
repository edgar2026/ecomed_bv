export interface CellData {
  type: 'text' | 'number';
  value: number;
  text: string;
}

export interface PreceptoriaRecord {
  tipo: 'Internato' | 'Atividades Práticas';
  periodo: string;
  rodizio: string;
  disciplina: string;
  cells: Record<string, CellData>;
  total: number;
  status: string;
}

export interface TextCellRecord {
  aba: string;
  periodo: string;
  rodizio: string;
  disciplina: string;
  mes: string;
  texto: string;
}

export const months = ["FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO"];
export const monthsP = ["FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO"];

export const internato: PreceptoriaRecord[] = [
  {
    tipo: "Internato",
    periodo: "8º",
    rodizio: "INTERNATO 1",
    disciplina: "SAÚDE COLETIVA",
    cells: {
      "FEVEREIRO": { type: "text", value: 0, text: "NÃO PAGA" },
      "MARÇO": { type: "text", value: 0, text: "NÃO PAGA" },
      "ABRIL": { type: "text", value: 0, text: "NÃO PAGA" },
      "MAIO": { type: "text", value: 0, text: "NÃO PAGA" },
      "JUNHO": { type: "text", value: 0, text: "NÃO PAGA" },
      "JULHO": { type: "text", value: 0, text: "NÃO PAGA" }
    },
    total: 0,
    status: "NÃO PAGA"
  },
  {
    tipo: "Internato",
    periodo: "9º",
    rodizio: "INTERNATO 2",
    disciplina: "GINECOLOGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 133916.48, text: "" },
      "MARÇO": { type: "number", value: 146779.08, text: "" },
      "ABRIL": { type: "number", value: 143682.84, text: "" },
      "MAIO": { type: "number", value: 137965.52, text: "" },
      "JUNHO": { type: "number", value: 154893.68, text: "" },
      "JULHO": { type: "number", value: 143682.84, text: "" }
    },
    total: 860920.44,
    status: "PAGO"
  },
  {
    tipo: "Internato",
    periodo: "10º",
    rodizio: "INTERNATO 3",
    disciplina: "PEDIATRIA E NEONATOLOGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 133800.0, text: "" },
      "MARÇO": { type: "number", value: 153446.12, text: "" },
      "ABRIL": { type: "number", value: 138000.0, text: "" },
      "MAIO": { type: "number", value: 146400.0, text: "" },
      "JUNHO": { type: "number", value: 108600.0, text: "" },
      "JULHO": { type: "number", value: 146400.0, text: "" }
    },
    total: 826646.12,
    status: "PAGO"
  },
  {
    tipo: "Internato",
    periodo: "10º",
    rodizio: "INTERNATO 4",
    disciplina: "SAÚDE MENTAL",
    cells: {
      "FEVEREIRO": { type: "number", value: 74200.0, text: "" },
      "MARÇO": { type: "number", value: 70900.0, text: "" },
      "ABRIL": { type: "number", value: 65200.0, text: "" },
      "MAIO": { type: "number", value: 64400.0, text: "" },
      "JUNHO": { type: "number", value: 62000.0, text: "" },
      "JULHO": { type: "number", value: 70900.0, text: "" }
    },
    total: 407600.0,
    status: "PAGO"
  },
  {
    tipo: "Internato",
    periodo: "10º",
    rodizio: "INTERNATO 5",
    disciplina: "OBSTETRÍCIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 55855.1, text: "" },
      "MARÇO": { type: "number", value: 40239.4, text: "" },
      "ABRIL": { type: "number", value: 37839.4, text: "" },
      "MAIO": { type: "number", value: 37839.4, text: "" },
      "JUNHO": { type: "number", value: 44739.0, text: "" },
      "JULHO": { type: "number", value: 40239.4, text: "" }
    },
    total: 256751.7,
    status: "PAGO"
  },
  {
    tipo: "Internato",
    periodo: "11º",
    rodizio: "INTERNATO 6",
    disciplina: "CLÍNICA MÉDICA",
    cells: {
      "FEVEREIRO": { type: "number", value: 72901.0, text: "" },
      "MARÇO": { type: "number", value: 77274.0, text: "" },
      "ABRIL": { type: "number", value: 75472.5, text: "" },
      "MAIO": { type: "number", value: 75492.0, text: "" },
      "JUNHO": { type: "number", value: 78787.5, text: "" },
      "JULHO": { type: "number", value: 72901.0, text: "" }
    },
    total: 452828.0,
    status: "PAGO"
  },
  {
    tipo: "Internato",
    periodo: "11º",
    rodizio: "INTERNATO 7",
    disciplina: "CIRURGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 42400.0, text: "" },
      "MARÇO": { type: "number", value: 44800.0, text: "" },
      "ABRIL": { type: "number", value: 44300.0, text: "" },
      "MAIO": { type: "number", value: 48700.0, text: "" },
      "JUNHO": { type: "number", value: 49300.0, text: "" },
      "JULHO": { type: "number", value: 44800.0, text: "" }
    },
    total: 274300.0,
    status: "PAGO"
  },
  {
    tipo: "Internato",
    periodo: "12º",
    rodizio: "INTERNATO 8",
    disciplina: "URGÊNCIA E EMERGÊNCIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 60368.0, text: "" },
      "MARÇO": { type: "number", value: 71087.0, text: "" },
      "ABRIL": { type: "number", value: 71087.0, text: "" },
      "MAIO": { type: "number", value: 65727.5, text: "" },
      "JUNHO": { type: "number", value: 68705.0, text: "" },
      "JULHO": { type: "number", value: 71087.0, text: "" }
    },
    total: 408061.5,
    status: "PAGO"
  }
];

export const praticas: PreceptoriaRecord[] = [
  {
    tipo: "Atividades Práticas",
    periodo: "1º",
    rodizio: "",
    disciplina: "SAÚDE COLETIVA",
    cells: {
      "FEVEREIRO": { type: "text", value: 0, text: "NÃO TEVE PRECEPTORIA" },
      "MARÇO": { type: "number", value: 1800.0, text: "" },
      "ABRIL": { type: "number", value: 7600.0, text: "" },
      "MAIO": { type: "number", value: 9800.0, text: "" },
      "JUNHO": { type: "number", value: 7400.0, text: "" }
    },
    total: 26600.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "3º",
    rodizio: "",
    disciplina: "SAUDE COLETIVA",
    cells: {
      "FEVEREIRO": { type: "text", value: 0, text: "NÃO TEVE PRECEPTORIA" },
      "MARÇO": { type: "number", value: 3600.0, text: "" },
      "ABRIL": { type: "number", value: 3600.0, text: "" },
      "MAIO": { type: "number", value: 4800.0, text: "" },
      "JUNHO": { type: "number", value: 4200.0, text: "" }
    },
    total: 16200.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "4º",
    rodizio: "",
    disciplina: "SAÚDE MENTAL",
    cells: {
      "FEVEREIRO": { type: "number", value: 9210.0, text: "" },
      "MARÇO": { type: "number", value: 9210.0, text: "" },
      "ABRIL": { type: "number", value: 9210.0, text: "" },
      "MAIO": { type: "number", value: 9210.0, text: "" },
      "JUNHO": { type: "number", value: 9210.0, text: "" }
    },
    total: 46050.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "5º",
    rodizio: "",
    disciplina: "PNEUMO",
    cells: {
      "FEVEREIRO": { type: "number", value: 4200.0, text: "" },
      "MARÇO": { type: "number", value: 21000.0, text: "" },
      "ABRIL": { type: "number", value: 18600.0, text: "" },
      "MAIO": { type: "number", value: 24600.0, text: "" },
      "JUNHO": { type: "number", value: 20400.0, text: "" }
    },
    total: 88800.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "5º",
    rodizio: "",
    disciplina: "REUMATO",
    cells: {
      "FEVEREIRO": { type: "number", value: 21000.0, text: "" },
      "MARÇO": { type: "number", value: 12000.0, text: "" },
      "ABRIL": { type: "number", value: 9600.0, text: "" },
      "MAIO": { type: "number", value: 9600.0, text: "" },
      "JUNHO": { type: "number", value: 8400.0, text: "" }
    },
    total: 60600.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "5º",
    rodizio: "",
    disciplina: "SAÚDE DA CRIANÇA",
    cells: {
      "FEVEREIRO": { type: "number", value: 14490.0, text: "" },
      "MARÇO": { type: "number", value: 14490.0, text: "" },
      "ABRIL": { type: "number", value: 14490.0, text: "" },
      "MAIO": { type: "number", value: 14490.0, text: "" },
      "JUNHO": { type: "number", value: 14490.0, text: "" }
    },
    total: 72450.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "5º",
    rodizio: "",
    disciplina: "SAÚDE DO ADOLESCENTE",
    cells: {
      "FEVEREIRO": { type: "number", value: 14490.0, text: "" },
      "MARÇO": { type: "number", value: 14490.0, text: "" },
      "ABRIL": { type: "number", value: 14490.0, text: "" },
      "MAIO": { type: "number", value: 14490.0, text: "" },
      "JUNHO": { type: "number", value: 14490.0, text: "" }
    },
    total: 72450.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "5º",
    rodizio: "",
    disciplina: "SAÚDE DA MULHER",
    cells: {
      "FEVEREIRO": { type: "number", value: 22440.0, text: "" },
      "MARÇO": { type: "number", value: 22440.0, text: "" },
      "ABRIL": { type: "number", value: 22440.0, text: "" },
      "MAIO": { type: "number", value: 22440.0, text: "" },
      "JUNHO": { type: "number", value: 22440.0, text: "" }
    },
    total: 112200.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "5º",
    rodizio: "",
    disciplina: "SAÚDE DO IDOSO",
    cells: {
      "FEVEREIRO": { type: "number", value: 15900.0, text: "" },
      "MARÇO": { type: "number", value: 15900.0, text: "" },
      "ABRIL": { type: "number", value: 15900.0, text: "" },
      "MAIO": { type: "number", value: 15900.0, text: "" },
      "JUNHO": { type: "number", value: 15900.0, text: "" }
    },
    total: 79500.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "5º",
    rodizio: "",
    disciplina: "PSIQUIATRIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 9210.0, text: "" },
      "MARÇO": { type: "number", value: 9210.0, text: "" },
      "ABRIL": { type: "number", value: 9210.0, text: "" },
      "MAIO": { type: "number", value: 9210.0, text: "" },
      "JUNHO": { type: "number", value: 9210.0, text: "" }
    },
    total: 46050.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "6º",
    rodizio: "",
    disciplina: "CIRURGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 9800.0, text: "" },
      "MARÇO": { type: "number", value: 47600.0, text: "" },
      "ABRIL": { type: "number", value: 37400.0, text: "" },
      "MAIO": { type: "number", value: 39200.0, text: "" },
      "JUNHO": { type: "number", value: 20600.0, text: "" }
    },
    total: 154600.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "6º",
    rodizio: "",
    disciplina: "ENDOCRINO",
    cells: {
      "FEVEREIRO": { type: "number", value: 2400.0, text: "" },
      "MARÇO": { type: "number", value: 22800.0, text: "" },
      "ABRIL": { type: "number", value: 15600.0, text: "" },
      "MAIO": { type: "number", value: 18600.0, text: "" },
      "JUNHO": { type: "number", value: 15000.0, text: "" }
    },
    total: 74400.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "6º",
    rodizio: "",
    disciplina: "NEFROLOGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 3600.0, text: "" },
      "MARÇO": { type: "number", value: 20400.0, text: "" },
      "ABRIL": { type: "number", value: 19200.0, text: "" },
      "MAIO": { type: "number", value: 21000.0, text: "" },
      "JUNHO": { type: "number", value: 10800.0, text: "" }
    },
    total: 75000.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "6º",
    rodizio: "",
    disciplina: "GERIATRIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 15900.0, text: "" },
      "MARÇO": { type: "number", value: 15900.0, text: "" },
      "ABRIL": { type: "number", value: 15900.0, text: "" },
      "MAIO": { type: "number", value: 15900.0, text: "" },
      "JUNHO": { type: "number", value: 15900.0, text: "" }
    },
    total: 79500.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "6º",
    rodizio: "",
    disciplina: "DIP",
    cells: {
      "FEVEREIRO": { type: "text", value: 0, text: "NÃO PAGA" },
      "MARÇO": { type: "text", value: 0, text: "NÃO PAGA" },
      "ABRIL": { type: "text", value: 0, text: "NÃO PAGA" },
      "MAIO": { type: "text", value: 0, text: "NÃO PAGA" },
      "JUNHO": { type: "text", value: 0, text: "NÃO PAGA" }
    },
    total: 0,
    status: "NÃO PAGA"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "6º",
    rodizio: "",
    disciplina: "URGÊNCIA E EMERGÊNCIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 3000.0, text: "" },
      "MARÇO": { type: "number", value: 12000.0, text: "" },
      "ABRIL": { type: "number", value: 3000.0, text: "" },
      "MAIO": { type: "number", value: 16800.0, text: "" },
      "JUNHO": { type: "number", value: 16200.0, text: "" }
    },
    total: 51000.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "6º",
    rodizio: "",
    disciplina: "UROLOGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 1800.0, text: "" },
      "MARÇO": { type: "number", value: 9000.0, text: "" },
      "ABRIL": { type: "number", value: 9000.0, text: "" },
      "MAIO": { type: "number", value: 9600.0, text: "" },
      "JUNHO": { type: "number", value: 7800.0, text: "" }
    },
    total: 37200.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "7º",
    rodizio: "",
    disciplina: "OBSTETRÍCIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 3000.0, text: "" },
      "MARÇO": { type: "number", value: 21000.0, text: "" },
      "ABRIL": { type: "number", value: 23400.0, text: "" },
      "MAIO": { type: "number", value: 17400.0, text: "" },
      "JUNHO": { type: "number", value: 18000.0, text: "" }
    },
    total: 82800.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "7º",
    rodizio: "",
    disciplina: "GINECO",
    cells: {
      "FEVEREIRO": { type: "number", value: 22440.0, text: "" },
      "MARÇO": { type: "number", value: 22440.0, text: "" },
      "ABRIL": { type: "number", value: 22440.0, text: "" },
      "MAIO": { type: "number", value: 22440.0, text: "" },
      "JUNHO": { type: "number", value: 22440.0, text: "" }
    },
    total: 112200.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "7º",
    rodizio: "",
    disciplina: "PEDIATRIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 14490.0, text: "" },
      "MARÇO": { type: "number", value: 14490.0, text: "" },
      "ABRIL": { type: "number", value: 14490.0, text: "" },
      "MAIO": { type: "number", value: 14490.0, text: "" },
      "JUNHO": { type: "number", value: 14490.0, text: "" }
    },
    total: 72450.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "7º",
    rodizio: "",
    disciplina: "DERMATO",
    cells: {
      "FEVEREIRO": { type: "number", value: 2400.0, text: "" },
      "MARÇO": { type: "number", value: 19200.0, text: "" },
      "ABRIL": { type: "number", value: 13800.0, text: "" },
      "MAIO": { type: "number", value: 16800.0, text: "" },
      "JUNHO": { type: "number", value: 15600.0, text: "" }
    },
    total: 67800.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "7º",
    rodizio: "",
    disciplina: "ORTOPEDIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 3200.0, text: "" },
      "MARÇO": { type: "number", value: 15200.0, text: "" },
      "ABRIL": { type: "number", value: 12800.0, text: "" },
      "MAIO": { type: "number", value: 16000.0, text: "" },
      "JUNHO": { type: "number", value: 14400.0, text: "" }
    },
    total: 61600.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "7º",
    rodizio: "",
    disciplina: "NEONATOLOGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 14490.0, text: "" },
      "MARÇO": { type: "number", value: 14490.0, text: "" },
      "ABRIL": { type: "number", value: 14490.0, text: "" },
      "MAIO": { type: "number", value: 14490.0, text: "" },
      "JUNHO": { type: "number", value: 14490.0, text: "" }
    },
    total: 72450.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "8º",
    rodizio: "",
    disciplina: "NEUROLOGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 6600.0, text: "" },
      "MARÇO": { type: "number", value: 14600.0, text: "" },
      "ABRIL": { type: "number", value: 13400.0, text: "" },
      "MAIO": { type: "number", value: 15200.0, text: "" },
      "JUNHO": { type: "number", value: 10800.0, text: "" }
    },
    total: 60600.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "8º",
    rodizio: "",
    disciplina: "OTORRINOLARINGOLOGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 4700.0, text: "" },
      "MARÇO": { type: "number", value: 13800.0, text: "" },
      "ABRIL": { type: "number", value: 16200.0, text: "" },
      "MAIO": { type: "number", value: 19200.0, text: "" },
      "JUNHO": { type: "number", value: 9600.0, text: "" }
    },
    total: 63500.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "8º",
    rodizio: "",
    disciplina: "GASTROENTEROLOGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 3000.0, text: "" },
      "MARÇO": { type: "number", value: 10200.0, text: "" },
      "ABRIL": { type: "number", value: 11400.0, text: "" },
      "MAIO": { type: "number", value: 12000.0, text: "" },
      "JUNHO": { type: "number", value: 9000.0, text: "" }
    },
    total: 45600.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "8º",
    rodizio: "",
    disciplina: "CARDIOLOGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 3000.0, text: "" },
      "MARÇO": { type: "number", value: 15000.0, text: "" },
      "ABRIL": { type: "number", value: 16200.0, text: "" },
      "MAIO": { type: "number", value: 16800.0, text: "" },
      "JUNHO": { type: "number", value: 8400.0, text: "" }
    },
    total: 59400.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "8º",
    rodizio: "",
    disciplina: "HEMATOLOGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 1800.0, text: "" },
      "MARÇO": { type: "number", value: 12600.0, text: "" },
      "ABRIL": { type: "number", value: 10800.0, text: "" },
      "MAIO": { type: "number", value: 12000.0, text: "" },
      "JUNHO": { type: "number", value: 7800.0, text: "" }
    },
    total: 45000.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "8º",
    rodizio: "",
    disciplina: "ONCOLOGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 600.0, text: "" },
      "MARÇO": { type: "number", value: 6600.0, text: "" },
      "ABRIL": { type: "number", value: 6600.0, text: "" },
      "MAIO": { type: "number", value: 7200.0, text: "" },
      "JUNHO": { type: "number", value: 8400.0, text: "" }
    },
    total: 29400.0,
    status: "PAGO"
  },
  {
    tipo: "Atividades Práticas",
    periodo: "8º",
    rodizio: "",
    disciplina: "OFTALMOLOGIA",
    cells: {
      "FEVEREIRO": { type: "number", value: 2400.0, text: "" },
      "MARÇO": { type: "number", value: 20400.0, text: "" },
      "ABRIL": { type: "number", value: 19200.0, text: "" },
      "MAIO": { type: "number", value: 19200.0, text: "" },
      "JUNHO": { type: "number", value: 9000.0, text: "" }
    },
    total: 70200.0,
    status: "PAGO"
  }
];

export const textCells: TextCellRecord[] = [
  { aba: "Internato", periodo: "8º", rodizio: "INTERNATO 1", disciplina: "SAÚDE COLETIVA", mes: "FEVEREIRO", texto: "NÃO PAGA" },
  { aba: "Internato", periodo: "8º", rodizio: "INTERNATO 1", disciplina: "SAÚDE COLETIVA", mes: "MARÇO", texto: "NÃO PAGA" },
  { aba: "Internato", periodo: "8º", rodizio: "INTERNATO 1", disciplina: "SAÚDE COLETIVA", mes: "ABRIL", texto: "NÃO PAGA" },
  { aba: "Internato", periodo: "8º", rodizio: "INTERNATO 1", disciplina: "SAÚDE COLETIVA", mes: "MAIO", texto: "NÃO PAGA" },
  { aba: "Internato", periodo: "8º", rodizio: "INTERNATO 1", disciplina: "SAÚDE COLETIVA", mes: "JUNHO", texto: "NÃO PAGA" },
  { aba: "Internato", periodo: "8º", rodizio: "INTERNATO 1", disciplina: "SAÚDE COLETIVA", mes: "JULHO", texto: "NÃO PAGA" },
  { aba: "Atividades Práticas", periodo: "1º", rodizio: "-", disciplina: "SAÚDE COLETIVA", mes: "FEVEREIRO", texto: "NÃO TEVE PRECEPTORIA" },
  { aba: "Atividades Práticas", periodo: "3º", rodizio: "-", disciplina: "SAUDE COLETIVA", mes: "FEVEREIRO", texto: "NÃO TEVE PRECEPTORIA" },
  { aba: "Atividades Práticas", periodo: "6º", rodizio: "-", disciplina: "DIP", mes: "FEVEREIRO", texto: "NÃO PAGA" },
  { aba: "Atividades Práticas", periodo: "6º", rodizio: "-", disciplina: "DIP", mes: "MARÇO", texto: "NÃO PAGA" },
  { aba: "Atividades Práticas", periodo: "6º", rodizio: "-", disciplina: "DIP", mes: "ABRIL", texto: "NÃO PAGA" },
  { aba: "Atividades Práticas", periodo: "6º", rodizio: "-", disciplina: "DIP", mes: "MAIO", texto: "NÃO PAGA" },
  { aba: "Atividades Práticas", periodo: "6º", rodizio: "-", disciplina: "DIP", mes: "JUNHO", texto: "NÃO PAGA" }
];
