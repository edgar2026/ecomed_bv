import React, { useState } from 'react';
import { ModuleId, Preceptor, Hospital, CampoEstagio, Disciplina, Escala, FinanceiroRecord, Solicitacao, Pagamento, ChamadoSaldo, ControleSaldo } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Import newly created modular layouts
import { HomeModule } from './components/HomeModule';
import { PreceptoresModule } from './components/PreceptoresModule';
import { SimulaMedModule } from './components/SimulaMedModule';
import { ConveniosModule } from './components/ConveniosModule';

// Mock datasets
import {
  preceptoresInicial,
  hospitaisInicial,
  camposInicial,
  disciplinasInicial,
  escalasInicial,
  financeiroInicial,
  solicitacoesInicial,
  pagamentosInicial,
  chamadosInicial,
  saldosInicial
} from './data';

import { X, Calendar, Plus } from 'lucide-react';

export default function App() {
  // Global Navigation State
  const [activeModule, setActiveModule] = useState<ModuleId>('home');
  const [activeSubPage, setActiveSubPage] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Primary State Datasets
  const [preceptors, setPreceptors] = useState<Preceptor[]>(preceptoresInicial);
  const [hospitals, setHospitals] = useState<Hospital[]>(hospitaisInicial);
  const [campos, setCampos] = useState<CampoEstagio[]>(camposInicial);
  const [disciplines, setDisciplines] = useState<Disciplina[]>(disciplinasInicial);
  const [scales, setScales] = useState<Escala[]>(escalasInicial);
  const [financialRecords, setFinancialRecords] = useState<FinanceiroRecord[]>(financeiroInicial);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>(solicitacoesInicial);
  const [payments, setPayments] = useState<Pagamento[]>(pagamentosInicial);
  const [chamados, setChamados] = useState<ChamadoSaldo[]>(chamadosInicial);
  const [saldos, setSaldos] = useState<ControleSaldo[]>(saldosInicial);

  // New Scale Modal state
  const [isNewScaleOpen, setIsNewScaleOpen] = useState(false);
  const [modalScaleForm, setModalScaleForm] = useState({
    preceptorId: 'PR001',
    hospitalId: 'HP002',
    campoId: 'CP001',
    disciplinaId: 'DS001',
    data: '2026-07-10',
    horaInicio: '07:00',
    horaFim: '13:00'
  });

  const handleGlobalSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSaveModalScale = (e: React.FormEvent) => {
    e.preventDefault();
    const preceptor = preceptors.find((p) => p.id === modalScaleForm.preceptorId);
    const hospital = hospitals.find((h) => h.id === modalScaleForm.hospitalId);
    const campo = campos.find((c) => c.id === modalScaleForm.campoId);
    const discipline = disciplines.find((d) => d.id === modalScaleForm.disciplinaId);

    if (!preceptor || !hospital || !campo || !discipline) {
      alert('Erro ao validar entidades selecionadas.');
      return;
    }

    const newEscala: Escala = {
      id: `ESC00${scales.length + 1}`,
      preceptorId: preceptor.id,
      preceptorNome: preceptor.nome,
      hospitalId: hospital.id,
      hospitalNome: hospital.nome,
      disciplinaId: discipline.id,
      disciplinaNome: discipline.nome,
      campoId: campo.id,
      campoNome: campo.nome,
      data: modalScaleForm.data,
      horaInicio: modalScaleForm.horaInicio,
      horaFim: modalScaleForm.horaFim,
      status: 'Confirmada'
    };

    setScales([newEscala, ...scales]);
    setIsNewScaleOpen(false);

    // Alert or Navigate to Escalas dashboard
    setActiveModule('preceptores');
    setActiveSubPage('escalas');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex antialiased">
      {/* Sidebar navigation panel */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        activeSubPage={activeSubPage}
        setActiveSubPage={setActiveSubPage}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0" style={{ marginLeft: 'var(--spacing-sidebar-width, 256px)' }}>
        {/* Top header bar */}
        <Header activeModule={activeModule} activeSubPage={activeSubPage} onSearch={handleGlobalSearch} />

        {/* Primary Content Scroll View */}
        <main className="flex-1 overflow-y-auto p-6 mt-16 pb-20">
          <div className="w-full max-w-7xl mx-auto">
            {activeModule === 'home' && (
              <HomeModule
                setActiveModule={setActiveModule}
                setActiveSubPage={setActiveSubPage}
                preceptorsCount={preceptors.length}
                scalesCount={scales.length}
              />
            )}

            {activeModule === 'preceptores' && (
              <PreceptoresModule
                subPage={activeSubPage}
                setSubPage={setActiveSubPage}
                preceptors={preceptors}
                setPreceptors={setPreceptors}
                hospitals={hospitals}
                disciplines={disciplines}
                campos={campos}
                scales={scales}
                setScales={setScales}
                searchTerm={searchTerm}
                financialRecords={financialRecords}
                setFinancialRecords={setFinancialRecords}
                solicitacoes={solicitacoes}
                setSolicitacoes={setSolicitacoes}
                payments={payments}
                setPayments={setPayments}
                chamados={chamados}
                setChamados={setChamados}
                saldos={saldos}
                setSaldos={setSaldos}
                onNewScaleClick={() => setIsNewScaleOpen(true)}
              />
            )}

            {activeModule === 'simulamed' && (
              <SimulaMedModule
                subPage={activeSubPage}
                setSubPage={setActiveSubPage}
              />
            )}

            {activeModule === 'convenios' && (
              <ConveniosModule />
            )}
          </div>
        </main>
      </div>

      {/* Floating Modal for New Scale Generation */}
      {isNewScaleOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-outline-variant shadow-level-4 max-w-lg w-full overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary-fixed-dim" />
                <span className="font-bold text-sm uppercase">Nova Escala de Preceptoria</span>
              </div>
              <button onClick={() => setIsNewScaleOpen(false)} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveModalScale} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Preceptor de Medicina</label>
                <select
                  value={modalScaleForm.preceptorId}
                  onChange={(e) => setModalScaleForm({ ...modalScaleForm, preceptorId: e.target.value })}
                  className="w-full border border-outline-variant rounded p-2 bg-white"
                >
                  {preceptors.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome} ({p.especialidade})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Unidade Hospitalar</label>
                <select
                  value={modalScaleForm.hospitalId}
                  onChange={(e) => setModalScaleForm({ ...modalScaleForm, hospitalId: e.target.value })}
                  className="w-full border border-outline-variant rounded p-2 bg-white"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>{h.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-on-surface-variant font-semibold mb-1">Campo de Estágio (Ala)</label>
                  <select
                    value={modalScaleForm.campoId}
                    onChange={(e) => setModalScaleForm({ ...modalScaleForm, campoId: e.target.value })}
                    className="w-full border border-outline-variant rounded p-2 bg-white"
                  >
                    {campos.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-on-surface-variant font-semibold mb-1">Disciplina Prática</label>
                  <select
                    value={modalScaleForm.disciplinaId}
                    onChange={(e) => setModalScaleForm({ ...modalScaleForm, disciplinaId: e.target.value })}
                    className="w-full border border-outline-variant rounded p-2 bg-white"
                  >
                    {disciplines.map((d) => (
                      <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-on-surface-variant font-semibold mb-1">Data Escala</label>
                  <input
                    type="date"
                    value={modalScaleForm.data}
                    onChange={(e) => setModalScaleForm({ ...modalScaleForm, data: e.target.value })}
                    className="w-full border border-outline-variant rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-semibold mb-1">Horário Início</label>
                  <input
                    type="time"
                    value={modalScaleForm.horaInicio}
                    onChange={(e) => setModalScaleForm({ ...modalScaleForm, horaInicio: e.target.value })}
                    className="w-full border border-outline-variant rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-semibold mb-1">Horário Fim</label>
                  <input
                    type="time"
                    value={modalScaleForm.horaFim}
                    onChange={(e) => setModalScaleForm({ ...modalScaleForm, horaFim: e.target.value })}
                    className="w-full border border-outline-variant rounded p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setIsNewScaleOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded font-semibold text-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-white rounded font-bold hover:bg-secondary-container hover:text-on-secondary-container"
                >
                  Confirmar Escala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
