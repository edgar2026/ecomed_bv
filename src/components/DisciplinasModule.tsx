import React, { useState } from 'react';
import { Disciplina, Hospital, Preceptor } from '../types';
import {
  BookOpen,
  Search,
  Plus,
  Eye,
  CheckCircle,
  AlertTriangle,
  Download,
  FileText,
  Clock,
  Layers,
  GraduationCap,
  Building2,
  TrendingUp
} from 'lucide-react';

interface DisciplinasModuleProps {
  subPage: string;
  disciplines: Disciplina[];
  setDisciplines: React.Dispatch<React.SetStateAction<Disciplina[]>>;
  hospitals: Hospital[];
  preceptors: Preceptor[];
  searchTerm: string;
}

export function DisciplinasModule({
  subPage,
  disciplines,
  setDisciplines,
  hospitals,
  preceptors,
  searchTerm
}: DisciplinasModuleProps) {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>('DS001');
  const [notif, setNotif] = useState<string | null>(null);

  // Form State for Novo
  const [formData, setFormData] = useState({
    nome: '',
    codigo: 'MED-',
    cargaHoraria: 120,
    periodo: '7º Período',
    internato: false,
    custoHoraPreceptor: 110
  });

  const selectedDiscipline = disciplines.find((d) => d.id === selectedDisciplineId) || disciplines[0];

  const filteredDisciplines = disciplines.filter((d) => {
    return (
      d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSaveDiscipline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.codigo) {
      alert('Preencha o nome e o código da disciplina.');
      return;
    }
    const newDiscipline: Disciplina = {
      id: `DS00${disciplines.length + 1}`,
      nome: formData.nome,
      codigo: formData.codigo,
      cargaHoraria: Number(formData.cargaHoraria),
      periodo: formData.periodo,
      internato: formData.internato,
      hospitaisParceiros: ['Hospital Esperança'],
      preceptoresAtivos: [],
      indicadores: { notaMedia: 8.5, evasao: 0 },
      custoHoraPreceptor: Number(formData.custoHoraPreceptor)
    };

    setDisciplines([...disciplines, newDiscipline]);
    setNotif('Disciplina acadêmica criada com sucesso na grade do curso!');
    setTimeout(() => setNotif(null), 3500);

    setFormData({
      nome: '',
      codigo: 'MED-',
      cargaHoraria: 120,
      periodo: '7º Período',
      internato: false,
      custoHoraPreceptor: 110
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
        <div className="space-y-6 text-xs">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Disciplinas Ativas</span>
              <h3 className="text-3xl font-black text-primary mt-2">{disciplines.length}</h3>
              <p className="text-[10px] text-outline mt-1">Homologadas pelo MEC</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Carga Horária Prática</span>
              <h3 className="text-3xl font-black text-primary mt-2">
                {disciplines.reduce((acc, curr) => acc + curr.cargaHoraria, 0)}h
              </h3>
              <p className="text-[10px] text-outline mt-1">Total acumulado na grade</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Módulos de Internato</span>
              <h3 className="text-3xl font-black text-primary mt-2">
                {disciplines.filter((d) => d.internato).length}
              </h3>
              <p className="text-[10px] text-outline mt-1">Estágio supervisionado prático</p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Nota Média de Estágio</span>
              <h3 className="text-3xl font-black text-primary mt-2">8.6 / 10</h3>
              <p className="text-[10px] text-green-600 font-semibold mt-1">✓ Excelente avaliação discente</p>
            </div>
          </div>

          {/* List Section */}
          <div className="bg-white rounded-lg border border-outline-variant p-5 shadow-sm">
            <h3 className="text-xs font-bold text-primary uppercase border-b border-outline-variant pb-2 mb-4">Grade Curricular Curta</h3>
            <div className="space-y-3">
              {disciplines.map((d) => (
                <div key={d.id} className="p-3 bg-[#F8FAFC] border border-outline-variant rounded flex justify-between items-center">
                  <div>
                    <span className="font-bold text-primary">{d.codigo} - {d.nome}</span>
                    <p className="text-[10px] text-outline mt-0.5">Carga Horária: {d.cargaHoraria}h | {d.periodo} | {d.internato ? 'Internato' : 'Disciplina Teórico-Prática'}</p>
                  </div>
                  <span className="bg-[#e8eeff] text-secondary font-bold px-2 py-1 rounded text-[10px]">
                    R$ {d.custoHoraPreceptor.toFixed(2)} /h
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subpage 2: Lista */}
      {subPage === 'lista' && (
        <div className="bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-[#F8FAFC]">
            <h3 className="text-sm font-bold text-primary uppercase">Grade de Disciplinas & Internatos</h3>
            <span className="text-xs text-outline font-semibold">Exibindo {filteredDisciplines.length} registros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-outline-variant font-semibold text-on-surface-variant uppercase">
                  <th className="p-4">Código / Disciplina</th>
                  <th className="p-4">Carga Horária</th>
                  <th className="p-4">Período Curricular</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Hospitais Vinculados</th>
                  <th className="p-4">Custo Base Hora Docente</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDisciplines.map((d) => (
                  <tr key={d.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-bold text-primary">
                      <p>{d.codigo}</p>
                      <p className="text-[11px] text-on-surface-variant">{d.nome}</p>
                    </td>
                    <td className="p-4 font-semibold">{d.cargaHoraria} horas</td>
                    <td className="p-4 font-medium text-on-surface-variant">{d.periodo}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        d.internato ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {d.internato ? 'Internato' : 'Regular'}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-outline">
                      {d.hospitaisParceiros.join(', ')}
                    </td>
                    <td className="p-4 font-bold text-green-700">R$ {d.custoHoraPreceptor.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedDisciplineId(d.id)}
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
        <div className="bg-white rounded-lg border border-outline-variant shadow-sm max-w-xl mx-auto p-6 text-xs">
          <h3 className="text-sm font-bold text-primary mb-6 uppercase border-b border-outline-variant pb-2">Cadastrar Nova Disciplina na Grade</h3>
          <form onSubmit={handleSaveDiscipline} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-on-surface-variant font-semibold mb-1">Nome da Disciplina</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Neurologia Clínica Prática"
                  className="w-full border border-outline-variant rounded p-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Código Acadêmico</label>
                <input
                  type="text"
                  required
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  className="w-full border border-outline-variant rounded p-2 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Carga Horária (h)</label>
                <input
                  type="number"
                  value={formData.cargaHoraria}
                  onChange={(e) => setFormData({ ...formData, cargaHoraria: Number(e.target.value) })}
                  className="w-full border border-outline-variant rounded p-2"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Período Curricular</label>
                <select
                  value={formData.periodo}
                  onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                  className="w-full border border-outline-variant rounded p-2 bg-white"
                >
                  <option value="6º Período">6º Período</option>
                  <option value="7º Período">7º Período</option>
                  <option value="8º Período">8º Período</option>
                  <option value="9º Período">9º Período</option>
                  <option value="10º Período">10º Período</option>
                  <option value="11º Período">11º Período</option>
                  <option value="12º Período">12º Período</option>
                </select>
              </div>
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Custo Hora Docente (R$)</label>
                <input
                  type="number"
                  value={formData.custoHoraPreceptor}
                  onChange={(e) => setFormData({ ...formData, custoHoraPreceptor: Number(e.target.value) })}
                  className="w-full border border-outline-variant rounded p-2"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="internato-check"
                checked={formData.internato}
                onChange={(e) => setFormData({ ...formData, internato: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="internato-check" className="font-semibold text-primary">Esta disciplina representa um módulo de Internato Médico?</label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" className="px-4 py-2 border border-outline-variant rounded font-semibold text-primary">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-primary-container text-white rounded font-semibold">Salvar Disciplina</button>
            </div>
          </form>
        </div>
      )}

      {/* Subpage 4: Perfil */}
      {subPage === 'perfil' && selectedDiscipline && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-4 bg-white rounded-lg border border-outline-variant p-5 shadow-sm space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mx-auto mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-primary text-sm">{selectedDiscipline.nome}</h3>
              <p className="text-outline">Código: {selectedDiscipline.codigo}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8eeff] text-secondary border border-outline-variant">
                {selectedDiscipline.periodo}
              </span>
            </div>

            <div className="border-t border-outline-variant pt-4 space-y-3">
              <div className="flex justify-between">
                <span>Carga Horária Total:</span>
                <span className="font-bold text-primary">{selectedDiscipline.cargaHoraria} horas</span>
              </div>
              <div className="flex justify-between">
                <span>Internato:</span>
                <span className="font-bold text-primary">{selectedDiscipline.internato ? 'Sim' : 'Não'}</span>
              </div>
              <div className="flex justify-between">
                <span>Custo Hora Preceptor:</span>
                <span className="font-bold text-green-700">R$ {selectedDiscipline.custoHoraPreceptor.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-lg border border-outline-variant shadow-sm p-5">
              <h3 className="font-bold text-primary uppercase border-b border-outline-variant pb-2 mb-4">Hospitais Parceiros de Prática</h3>
              <div className="space-y-2">
                {selectedDiscipline.hospitaisParceiros.map((h, i) => (
                  <div key={i} className="p-3 bg-[#F8FAFC] border border-outline-variant rounded flex justify-between items-center">
                    <span className="font-bold text-primary">{h}</span>
                    <span className="text-[10px] text-outline">Unidade Clinicamente Vinculada</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subpages 5 to 11: Structured systematically */}
      {!['dashboard', 'lista', 'novo', 'perfil'].includes(subPage) && (
        <div className="bg-white rounded-lg border border-outline-variant p-6 shadow-sm text-xs">
          <h3 className="text-sm font-bold text-primary uppercase mb-4 border-b border-outline-variant pb-2">
            Disciplina: {selectedDiscipline?.nome} - Subpágina: {subPage.toUpperCase()}
          </h3>

          {subPage === 'internatos' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Gestão e regência das escalas de internatos vinculadas.</p>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg">
                <span className="font-bold block text-primary">Internato de Medicina - UNINASSAU</span>
                <p className="text-outline text-[11px] mt-1">Este módulo atende às diretrizes curriculares do Ministério da Educação (MEC) para a prática clínica final.</p>
              </div>
            </div>
          )}

          {subPage === 'cargaHoraria' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Detalhamento de carga horária programática vs carga horária cumprida pelos preceptores.</p>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg space-y-2">
                <p><span className="font-bold">Carga Horária Planejada:</span> {selectedDiscipline?.cargaHoraria} horas</p>
                <p><span className="font-bold">Horas de Escala Confirmadas:</span> 92% da meta semestral atingida</p>
              </div>
            </div>
          )}

          {subPage === 'hospitais' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Hospitais conveniados para prática desta disciplina médica.</p>
              <div className="grid grid-cols-2 gap-4">
                {selectedDiscipline?.hospitaisParceiros.map((h, i) => (
                  <div key={i} className="p-3 border border-outline-variant rounded bg-[#F8FAFC] font-bold text-primary">
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          {subPage === 'preceptores' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Preceptores docentes capacitados para lecionar este conteúdo prático.</p>
              <div className="divide-y divide-outline-variant">
                {selectedDiscipline?.preceptoresAtivos.map((p, i) => (
                  <div key={i} className="py-2.5 flex justify-between font-semibold">
                    <span>{p}</span>
                    <span className="text-green-700">Ativo</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {subPage === 'indicadores' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Indicadores de desempenho acadêmico.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded">
                  <span className="font-bold text-primary block">Nota Média de Estágio</span>
                  <span className="text-lg font-black text-secondary block mt-1">{selectedDiscipline?.indicadores.notaMedia} / 10</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-outline-variant rounded">
                  <span className="font-bold text-primary block">Taxa de Evasão</span>
                  <span className="text-lg font-black text-error block mt-1">{selectedDiscipline?.indicadores.evasao}%</span>
                </div>
              </div>
            </div>
          )}

          {subPage === 'financeiro' && (
            <div className="space-y-4">
              <p className="text-on-surface-variant">Valores de faturamento docente projetados por hora aula praticada.</p>
              <div className="p-4 bg-surface-container-low rounded border border-outline-variant">
                <p><span className="font-bold">Custo Base Hora Docente:</span> R$ {selectedDiscipline?.custoHoraPreceptor.toFixed(2)}</p>
                <p className="text-[11px] text-outline mt-1">Este valor é praticado como base para emissão de RPA ou NF-e dos preceptores homologados nesta matéria.</p>
              </div>
            </div>
          )}

          {subPage === 'relatorios' && (
            <div className="space-y-2">
              <p className="text-on-surface-variant">Download de relatórios específicos acadêmicos.</p>
              <button className="px-4 py-2 bg-primary text-white rounded font-semibold">Exportar Ementa & Histórico (PDF)</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
