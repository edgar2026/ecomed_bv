import React, { useState } from 'react';
import { Hospital, Preceptor, Disciplina } from '../types';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Eye,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  Download,
  DollarSign,
  Activity,
  Layers,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Award
} from 'lucide-react';

interface HospitaisModuleProps {
  subPage: string;
  hospitals: Hospital[];
  setHospitals: React.Dispatch<React.SetStateAction<Hospital[]>>;
  preceptors: Preceptor[];
  disciplines: Disciplina[];
  searchTerm: string;
}

export function HospitaisModule({
  subPage,
  hospitals,
  setHospitals,
  preceptors,
  disciplines,
  searchTerm
}: HospitaisModuleProps) {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('HP001');
  const [notif, setNotif] = useState<string | null>(null);

  // Form State for Novo
  const [formData, setFormData] = useState({
    nome: '',
    cidade: 'Recife',
    capacidadeAlunos: 100,
    contratoNumero: '',
    contratoVencimento: '2029-12-31',
    valorMensal: 120000
  });

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  // Filters logic
  const filteredHospitals = hospitals.filter((h) => {
    return (
      h.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.cidade.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSaveHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.contratoNumero) {
      alert('Preencha o nome e o número de contrato do hospital.');
      return;
    }
    const newHospital: Hospital = {
      id: `HP00${hospitals.length + 1}`,
      nome: formData.nome,
      cidade: formData.cidade,
      capacidadeAlunos: Number(formData.capacidadeAlunos),
      ocupacaoAtual: 0,
      status: 'Ativo',
      especialidades: ['Clínica Médica'],
      camposEstagio: ['Ambulatório B'],
      preceptoresAlocados: [],
      disciplinasOferecidas: ['Clínica Médica II'],
      contratoNumero: formData.contratoNumero,
      contratoVencimento: formData.contratoVencimento,
      valorMensal: Number(formData.valorMensal),
      convenioStatus: 'Vigente',
      indicadores: { conformidade: 95, avaliacaoAlunos: 90, instalacoes: 92 }
    };

    setHospitals([...hospitals, newHospital]);
    setNotif('Hospital parceiro credenciado com sucesso!');
    setTimeout(() => setNotif(null), 3500);

    setFormData({
      nome: '',
      cidade: 'Recife',
      capacidadeAlunos: 100,
      contratoNumero: '',
      contratoVencimento: '2029-12-31',
      valorMensal: 120000
    });
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
        <div className="space-y-6">
          {/* KPIs Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs text-on-surface-variant font-bold uppercase">Hospitais Conveniados</span>
                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">+2 Novos</span>
              </div>
              <h3 className="text-3xl font-black text-primary mt-2">{hospitals.length}</h3>
              <p className="text-[10px] text-outline mt-1 font-medium">Unidades Hospitalares Ativas</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs text-on-surface-variant font-bold uppercase">Capacidade Acadêmica</span>
                <span className="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold">Média: 95/Hosp</span>
              </div>
              <h3 className="text-3xl font-black text-primary mt-2">
                {hospitals.reduce((acc, curr) => acc + curr.capacidadeAlunos, 0)}
              </h3>
              <p className="text-[10px] text-outline mt-1 font-medium">Alunos simultâneos possíveis</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs text-on-surface-variant font-bold uppercase">Custo Médio de Repasse</span>
                <span className="text-error font-bold text-xs">▲ +5%</span>
              </div>
              <h3 className="text-3xl font-black text-primary mt-2">R$ 105K</h3>
              <p className="text-[10px] text-outline mt-1 font-medium">Custo mensal de convênios</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs text-on-surface-variant font-bold uppercase">Taxa de Ocupação</span>
                <span className="text-green-700 font-bold text-xs">✓ Estável</span>
              </div>
              <h3 className="text-3xl font-black text-primary mt-2">84%</h3>
              <p className="text-[10px] text-outline mt-1 font-medium">Vagas de internato preenchidas</p>
            </div>
          </div>

          {/* Grid Layout: Occupancy Chart & Conformity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-lg border border-outline-variant shadow-sm p-5">
              <h3 className="text-xs font-bold text-primary uppercase border-b border-outline-variant pb-2 mb-4">Vagas de Alunos por Hospital (Top 5)</h3>
              <div className="space-y-4">
                {hospitals.slice(0, 5).map((h) => {
                  const perc = Math.round((h.ocupacaoAtual / h.capacidadeAlunos) * 100);
                  return (
                    <div key={h.id}>
                      <div className="flex justify-between text-xs text-on-surface-variant mb-1 font-medium">
                        <span>{h.nome}</span>
                        <span className="font-bold text-on-surface">{h.ocupacaoAtual} / {h.capacidadeAlunos} alunos ({perc}%)</span>
                      </div>
                      <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-secondary" style={{ width: `${perc}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-lg border border-outline-variant p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-primary uppercase border-b border-outline-variant pb-2 mb-4">Conformidade e Avaliação</h3>
                <div className="space-y-4 mt-2">
                  <div className="flex justify-between text-xs font-medium border-b border-outline-variant/30 pb-1">
                    <span>Documentação Legal</span>
                    <span className="text-green-600 font-bold">98%</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium border-b border-outline-variant/30 pb-1">
                    <span>Instalações Médicas</span>
                    <span className="text-green-600 font-bold">94%</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium border-b border-outline-variant/30 pb-1">
                    <span>Avaliação de Preceptores</span>
                    <span className="text-green-600 font-bold">92%</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-[#F8FAFC] rounded-lg border border-outline-variant text-center mt-4">
                <span className="text-3xl font-black text-secondary">92%</span>
                <p className="text-[10px] text-outline font-bold mt-1 uppercase">Média de Conformidade Geral</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subpage 2: Lista */}
      {subPage === 'lista' && (
        <div className="bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-[#F8FAFC]">
            <h3 className="text-sm font-bold text-primary uppercase">Unidades Hospitalares Credenciadas</h3>
            <span className="text-xs text-outline font-semibold">Exibindo {filteredHospitals.length} registros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-outline-variant font-semibold text-on-surface-variant uppercase">
                  <th className="p-4">Hospital</th>
                  <th className="p-4">Localização</th>
                  <th className="p-4">Alunos Ativos / Vagas</th>
                  <th className="p-4">Contrato / Vencimento</th>
                  <th className="p-4">Repasse Mensal</th>
                  <th className="p-4">Status Convênio</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredHospitals.map((h) => (
                  <tr key={h.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-bold text-primary">{h.nome}</td>
                    <td className="p-4 font-semibold text-on-surface-variant">{h.cidade}</td>
                    <td className="p-4 font-medium">
                      <p>{h.ocupacaoAtual} de {h.capacidadeAlunos} alunos</p>
                      <div className="w-24 bg-surface-container-high h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-secondary h-1.5" style={{ width: `${(h.ocupacaoAtual / h.capacidadeAlunos) * 100}%` }}></div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">
                      <p>{h.contratoNumero}</p>
                      <p className="text-[10px] text-outline">Vencimento: {h.contratoVencimento}</p>
                    </td>
                    <td className="p-4 font-bold text-green-700">R$ {h.valorMensal.toLocaleString('pt-BR')}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        h.status === 'Ativo' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedHospitalId(h.id)}
                        className="p-1 hover:text-secondary hover:bg-surface-container-low rounded"
                        title="Ver Perfil"
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
      )}

      {/* Subpage 3: Novo */}
      {subPage === 'novo' && (
        <div className="bg-white rounded-lg border border-outline-variant shadow-sm max-w-2xl mx-auto p-6 text-xs">
          <h3 className="text-sm font-bold text-primary mb-6 uppercase border-b border-outline-variant pb-2">Credenciar Hospital Parceiro</h3>
          <form onSubmit={handleSaveHospital} className="space-y-4">
            <div>
              <label className="block text-on-surface-variant font-semibold mb-1">Nome do Hospital</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Hospital Restauração Recife"
                className="w-full border border-outline-variant rounded p-2 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Cidade / Região</label>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  className="w-full border border-outline-variant rounded p-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Capacidade de Alunos Simultâneos</label>
                <input
                  type="number"
                  value={formData.capacidadeAlunos}
                  onChange={(e) => setFormData({ ...formData, capacidadeAlunos: Number(e.target.value) })}
                  className="w-full border border-outline-variant rounded p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Número do Contrato</label>
                <input
                  type="text"
                  required
                  value={formData.contratoNumero}
                  onChange={(e) => setFormData({ ...formData, contratoNumero: e.target.value })}
                  placeholder="CT-2026-XXXX"
                  className="w-full border border-outline-variant rounded p-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Vencimento do Contrato</label>
                <input
                  type="date"
                  value={formData.contratoVencimento}
                  onChange={(e) => setFormData({ ...formData, contratoVencimento: e.target.value })}
                  className="w-full border border-outline-variant rounded p-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Valor de Repasse Mensal (R$)</label>
                <input
                  type="number"
                  value={formData.valorMensal}
                  onChange={(e) => setFormData({ ...formData, valorMensal: Number(e.target.value) })}
                  className="w-full border border-outline-variant rounded p-2"
                />
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded border border-outline-variant">
              <h4 className="font-bold text-primary mb-1">Termo de Parceria Acadêmica Docente</h4>
              <p className="text-[10px] text-outline leading-relaxed">Este convênio rege a cessão de espaço físico hospitalar para preceptores homologados pela UNINASSAU conduzirem estágios curriculares de medicina de acordo com as normas vigentes do MEC.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" className="px-4 py-2 border border-outline-variant rounded font-semibold text-primary">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-primary-container text-white rounded font-semibold">Credenciar Unidade</button>
            </div>
          </form>
        </div>
      )}

      {/* Subpage 4: Perfil */}
      {subPage === 'perfil' && selectedHospital && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white rounded-lg border border-outline-variant p-5 shadow-sm space-y-4 text-xs">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xl mx-auto mb-3">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-primary text-sm">{selectedHospital.nome}</h3>
              <p className="text-xs text-outline">{selectedHospital.cidade} - Contrato: {selectedHospital.contratoNumero}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-300">
                Parceria Vigente
              </span>
            </div>

            <div className="border-t border-outline-variant pt-4 space-y-3">
              <div className="flex justify-between">
                <span>Vagas Acadêmicas:</span>
                <span className="font-bold text-primary">{selectedHospital.capacidadeAlunos} alunos</span>
              </div>
              <div className="flex justify-between">
                <span>Ocupação Atual:</span>
                <span className="font-bold text-primary">{selectedHospital.ocupacaoAtual} alunos</span>
              </div>
              <div className="flex justify-between">
                <span>Repasse Mensal:</span>
                <span className="font-bold text-green-700">R$ {selectedHospital.valorMensal.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Vencimento Contrato:</span>
                <span className="font-semibold text-primary">{selectedHospital.contratoVencimento}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-lg border border-outline-variant shadow-sm p-5 text-xs">
              <h3 className="font-bold text-primary uppercase border-b border-outline-variant pb-2 mb-4">Especialidades e Práticas</h3>
              <div className="flex flex-wrap gap-2">
                {selectedHospital.especialidades.map((esp, i) => (
                  <span key={i} className="px-3 py-1.5 bg-surface-container-low border border-outline-variant text-primary rounded-lg font-semibold">
                    {esp}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-outline-variant shadow-sm p-5 text-xs">
              <h3 className="font-bold text-primary uppercase border-b border-outline-variant pb-2 mb-4">Preceptores Alocados</h3>
              <div className="divide-y divide-outline-variant/30">
                {selectedHospital.preceptoresAlocados.length > 0 ? (
                  selectedHospital.preceptoresAlocados.map((pName, i) => (
                    <div key={i} className="py-2 flex justify-between items-center">
                      <span className="font-bold text-primary">{pName}</span>
                      <span className="text-[10px] text-outline">Supervisor Clínico Ativo</span>
                    </div>
                  ))
                ) : (
                  <p className="text-outline py-2">Sem preceptores vinculados a este hospital no momento.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subpages 5 to 14: Structured systematically */}
      {!['dashboard', 'lista', 'novo', 'perfil'].includes(subPage) && (
        <div className="bg-white rounded-lg border border-outline-variant p-6 shadow-sm text-xs">
          <h3 className="text-sm font-bold text-primary uppercase mb-4 border-b border-outline-variant pb-2">
            Hospital: {selectedHospital?.nome} - Subpágina: {subPage.toUpperCase()}
          </h3>

          {subPage === 'especialidades' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Especialidades médicas autorizadas de prática docente sob esta parceria.</p>
              <div className="grid grid-cols-2 gap-4">
                {selectedHospital?.especialidades.map((esp, i) => (
                  <div key={i} className="p-3 bg-[#F8FAFC] rounded border border-outline-variant font-bold text-primary">
                    {esp}
                  </div>
                ))}
              </div>
            </div>
          )}

          {subPage === 'campos' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Campos de estágio e alas clínicas físicas vinculadas a este hospital.</p>
              <div className="grid grid-cols-2 gap-4">
                {selectedHospital?.camposEstagio.map((camp, i) => (
                  <div key={i} className="p-3 bg-[#F8FAFC] rounded border border-outline-variant font-bold text-primary">
                    {camp}
                  </div>
                ))}
              </div>
            </div>
          )}

          {subPage === 'preceptores' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Preceptores docentes atuando nas clínicas deste hospital parceiro.</p>
              <div className="divide-y divide-outline-variant">
                {selectedHospital?.preceptoresAlocados.map((p, i) => (
                  <div key={i} className="py-2 flex justify-between">
                    <span className="font-bold">{p}</span>
                    <span className="text-green-700">Homologado</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {subPage === 'disciplinas' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Disciplinas práticas acadêmicas oferecidas nesta unidade de saúde.</p>
              <div className="grid grid-cols-2 gap-4">
                {selectedHospital?.disciplinasOferecidas.map((d, i) => (
                  <div key={i} className="p-3 bg-surface-container-low rounded border border-outline-variant font-semibold text-primary">
                    {d}
                  </div>
                ))}
              </div>
            </div>
          )}

          {subPage === 'escalas' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Escalas confirmadas alocadas nesta unidade hospitalar.</p>
              <div className="border border-outline-variant rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC]">
                    <tr className="border-b border-outline-variant font-bold">
                      <th className="p-3">Preceptor</th>
                      <th className="p-3">Data da Escala</th>
                      <th className="p-3">Horário</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-outline-variant/30">
                      <td className="p-3 font-semibold">Dr. Roberto Almeida</td>
                      <td className="p-3">10/07/2026</td>
                      <td className="p-3">07:00 às 13:00</td>
                    </tr>
                    <tr className="border-b border-outline-variant/30">
                      <td className="p-3 font-semibold">Dr. André Albuquerque</td>
                      <td className="p-3">11/07/2026</td>
                      <td className="p-3">13:00 às 19:00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {subPage === 'financeiro' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Relatório de custos por convênio.</p>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg space-y-2">
                <p><span className="font-bold">Custo Mensal Contratado:</span> R$ {selectedHospital?.valorMensal.toLocaleString('pt-BR')}</p>
                <p><span className="font-bold">Impostos Incidentes de Retenção:</span> 12%</p>
                <p><span className="font-bold">Total Acumulado Semestre:</span> R$ {(selectedHospital ? selectedHospital.valorMensal * 6 : 0).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          )}

          {subPage === 'convenios' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Situação reguladora e homologação do convênio jurídico.</p>
              <div className="p-4 bg-green-50 border border-green-300 rounded text-green-800 flex items-center justify-between">
                <div>
                  <p className="font-bold">Convênio Docente Vigente</p>
                  <p className="text-[11px] mt-1">Nenhuma pendência de certidões federais.</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-700" />
              </div>
            </div>
          )}

          {subPage === 'contratos' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Histórico de aditivos e renovação de contratos de cessão de espaço prático.</p>
              <div className="p-3 border border-outline-variant rounded">
                <span className="font-bold block text-primary">Aditivo Contratual Nº 2 - 2025</span>
                <span className="text-outline text-[11px]">Reajuste de repasse em 5.4% por expansão de turmas de internato.</span>
              </div>
            </div>
          )}

          {subPage === 'indicadores' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Metas de qualidade do hospital de acordo com pesquisa discente da UNINASSAU.</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded text-center">
                  <p className="font-bold text-primary">9.4</p>
                  <span className="text-outline text-[10px]">Instalações Clínicas</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded text-center">
                  <p className="font-bold text-primary">8.8</p>
                  <span className="text-outline text-[10px]">Feedback Discente</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded text-center">
                  <p className="font-bold text-primary">9.8</p>
                  <span className="text-outline text-[10px]">Conformidade Legal</span>
                </div>
              </div>
            </div>
          )}

          {subPage === 'relatorios' && (
            <div className="space-y-2">
              <p className="text-on-surface-variant">Painel de download de relatórios hospitalares consolidados.</p>
              <button className="px-4 py-2 bg-primary text-white rounded font-semibold">Baixar Consolido Acadêmico (PDF)</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
