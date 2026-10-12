import React, { useState, useMemo } from 'react';
import { Lead } from '../types';

interface CrmLeadsViewProps {
  leads: Lead[];
  selectedLeadId: string;
  onSelectLead: (id: string) => void;
  onUpdateLead: (updated: Lead) => void;
  onAddLead: (newLead: Lead) => void;
  onNavigateToProposal: (leadId: string) => void;
  onOpenPublicSite: () => void;
}

export const CrmLeadsView: React.FC<CrmLeadsViewProps> = ({
  leads,
  selectedLeadId,
  onSelectLead,
  onUpdateLead,
  onAddLead,
  onNavigateToProposal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [modelFilter, setModelFilter] = useState('todos');
  const [monthFilter, setMonthFilter] = useState('todos');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);

  // New Lead form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'Casamento',
    eventDate: '2025-11-20',
    guestCount: 150,
    city: 'Campinas / SP',
    location: 'Espaço Contemporâneo',
    structure: 'bike' as 'bike' | 'tradicional',
    notes: '',
    preferredFlavors: 'Morango Silvestre Cremoso, Frutas Vermelhas'
  });

  const selectedLead = useMemo(() => {
    return leads.find((l) => l.id === selectedLeadId) || leads[0];
  }, [leads, selectedLeadId]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search
      const searchMatch =
        searchTerm === '' ||
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.eventType.toLowerCase().includes(searchTerm.toLowerCase());

      // Status
      const statusMatch =
        statusFilter === 'todos' || lead.status === statusFilter;

      // Model
      const modelMatch =
        modelFilter === 'todos' || lead.structure === modelFilter;

      // Month
      const monthMatch =
        monthFilter === 'todos' || lead.eventDate.includes(`-${monthFilter}-`);

      return searchMatch && statusMatch && modelMatch && monthMatch;
    });
  }, [leads, searchTerm, statusFilter, modelFilter, monthFilter]);

  const handleChecklistToggle = (
    key: keyof Lead['checklist'],
    val: boolean
  ) => {
    if (!selectedLead) return;
    const updated: Lead = {
      ...selectedLead,
      checklist: {
        ...selectedLead.checklist,
        [key]: val
      }
    };
    onUpdateLead(updated);
  };

  const handleExportCsv = () => {
    const headers = 'ID,Nome,Evento,Data,Convidados,Estrutura,Status,Telefone,Email\n';
    const rows = leads
      .map(
        (l) =>
          `"${l.leadCode}","${l.name}","${l.eventType}","${l.eventDate}","${l.guestCount}","${l.structure}","${l.status}","${l.phone}","${l.email}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_memory_cream_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = 'lead-' + Date.now();
    const newLead: Lead = {
      id: newId,
      leadCode: `#MC-${Math.floor(800 + Math.random() * 90)}`,
      name: formData.name,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      guestCount: Number(formData.guestCount),
      location: formData.location,
      city: formData.city,
      structure: formData.structure,
      status: 'novo',
      phone: formData.phone,
      email: formData.email,
      notes: formData.notes,
      preferredFlavors: formData.preferredFlavors
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      veganRequested: true,
      receivedAt: 'Agora há pouco',
      avatarText: formData.name.substring(0, 2).toUpperCase(),
      avatarColor: 'bg-[#87a99c] text-[#1e3e34]',
      checklist: {
        dataAgenda: false,
        logistica: false,
        propostaEnviada: false,
        degustacao: false
      },
      proposalAmount: formData.structure === 'bike' ? 3200 : 2400
    };

    onAddLead(newLead);
    onSelectLead(newId);
    setIsNewLeadModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-4 mb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#45655a]" />
            <span className="text-[12px] uppercase tracking-wider text-[#45655a] font-bold">
              Pipeline Comercial · Eventos 2025
            </span>
          </div>
          <h1 className="font-headline font-semibold text-3xl md:text-4xl text-[#262220] tracking-tight">
            Leads & CRM Operacional
          </h1>
          <p className="text-[15px] text-[#6E6762] mt-1 max-w-xl">
            Gerencie solicitações originadas no site, sincronize orçamentos em tempo real e acelere fechamentos para estações gourmet e bikes retrô.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#eae8e4] text-[#1b1c1a] border border-[#EBE5DB] text-[13px] font-bold shadow-sm transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#7a5826]">
              download
            </span>
            Exportar CSV
          </button>
          <button
            onClick={() => setIsNewLeadModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#45655a] text-white text-[13px] font-bold shadow-md hover:bg-[#4A6E60] transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Novo Lead Manual
          </button>
        </div>
      </div>

      {/* Key Metrics Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {/* Metric 1 */}
        <div className="relative overflow-hidden bg-white border border-[#EBE5DB] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#6E6762] font-bold">
              Novos Leads Hoje
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#DCE7E2] text-[#45655a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="font-display text-4xl font-bold text-[#262220] leading-none">
              12
            </span>
            <span className="flex items-center text-[#45655a] text-[11px] font-bold bg-[#c7eadc]/60 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +33%
            </span>
          </div>
          <div className="mt-3 text-[#6E6762] text-[13px] flex items-center gap-1.5 border-t border-[#EBE5DB]/50 pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#45655a]" />
            <span>
              Tempo médio de 1º contato: <strong>14 min</strong>
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="relative overflow-hidden bg-white border border-[#EBE5DB] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#6E6762] font-bold">
              Em Negociação
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F5E9D7] text-[#7a5826] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">forum</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="font-display text-4xl font-bold text-[#262220] leading-none">
              28
            </span>
            <span className="text-[13px] text-[#6E6762]">orçamentos ativos</span>
          </div>
          <div className="mt-3 text-[#6E6762] text-[13px] flex items-center gap-1.5 border-t border-[#EBE5DB]/50 pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7a5826]" />
            <span>
              Volume estimado: <strong>R$ 142.800</strong>
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="relative overflow-hidden bg-white border border-[#EBE5DB] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#6E6762] font-bold">
              Propostas Enviadas
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FBE6E6] text-[#8F4E4E] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="font-display text-4xl font-bold text-[#262220] leading-none">
              15
            </span>
            <span className="text-[11px] text-[#874e4f] bg-[#ffdad9]/80 px-2 py-0.5 rounded-full font-bold">
              4 expirando hoje
            </span>
          </div>
          <div className="mt-3 text-[#6E6762] text-[13px] flex items-center gap-1.5 border-t border-[#EBE5DB]/50 pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#874e4f]" />
            <span>
              Aberturas via link: <strong>92%</strong>
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="relative overflow-hidden bg-white border border-[#EBE5DB] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#6E6762] font-bold">
              Taxa de Conversão
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#87a99c] text-[#1e3e34] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">pie_chart</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-[#262220] leading-none">
                68
              </span>
              <span className="font-headline text-2xl text-[#45655a] font-bold">%</span>
            </div>
            {/* SVG circle meter */}
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#efeeea]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-[#45655a]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="68, 100"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
          </div>
          <div className="mt-3 text-[#6E6762] text-[13px] flex items-center justify-between border-t border-[#EBE5DB]/50 pt-2">
            <span>Meta do trimestre: 65%</span>
            <span className="text-[#45655a] font-bold">+3.2 p.p.</span>
          </div>
        </div>
      </section>

      {/* Filter & Command Center */}
      <section className="bg-white border border-[#EBE5DB] rounded-2xl p-4 shadow-sm mb-6 flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E6762] text-[20px]">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl text-[#1b1c1a] text-[14px] placeholder:text-[#6E6762] outline-none focus:ring-2 focus:ring-[#45655a]/30 transition-all"
              placeholder="Buscar noivo(a), contato, telefone ou cidade..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3 relative">
            <select
              className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl text-[#1b1c1a] text-[14px] outline-none focus:ring-2 focus:ring-[#45655a]/30 transition-all cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="todos">Status: Todos os Estágios</option>
              <option value="novo">Novo Lead (Aguardando Retorno)</option>
              <option value="atendimento">Em Atendimento</option>
              <option value="proposta">Proposta Enviada</option>
              <option value="ganho">Fechado / Contrato</option>
              <option value="perdido">Perdido / Declinado</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6762] pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>

          {/* Model Filter */}
          <div className="md:col-span-3 relative">
            <select
              className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl text-[#1b1c1a] text-[14px] outline-none focus:ring-2 focus:ring-[#45655a]/30 transition-all cursor-pointer"
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
            >
              <option value="todos">Modelo: Todos os Carrinhos</option>
              <option value="bike">Bike Retrô Memory</option>
              <option value="tradicional">Estação Tradicional de Balcão</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6762] pointer-events-none text-[18px]">
              icecream
            </span>
          </div>

          {/* Month Filter */}
          <div className="md:col-span-2 relative">
            <select
              className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl text-[#1b1c1a] text-[14px] outline-none focus:ring-2 focus:ring-[#45655a]/30 transition-all cursor-pointer"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <option value="todos">Mês: Todos</option>
              <option value="09">Setembro/25</option>
              <option value="10">Outubro/25</option>
              <option value="11">Novembro/25</option>
              <option value="12">Dezembro/25</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6762] pointer-events-none text-[18px]">
              calendar_today
            </span>
          </div>
        </div>

        {/* Filter tags & Counter */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2 text-[12px]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#6E6762]">Filtros ativos:</span>
            {statusFilter !== 'todos' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCE7E2] text-[#45655a] font-semibold">
                Status: {statusFilter}
                <span
                  className="material-symbols-outlined text-[14px] cursor-pointer"
                  onClick={() => setStatusFilter('todos')}
                >
                  close
                </span>
              </span>
            )}
            {modelFilter !== 'todos' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#efeeea] text-[#414845]">
                Modelo: {modelFilter === 'bike' ? 'Bike Retrô' : 'Estação Trad.'}
                <span
                  className="material-symbols-outlined text-[14px] cursor-pointer"
                  onClick={() => setModelFilter('todos')}
                >
                  close
                </span>
              </span>
            )}
            {(statusFilter !== 'todos' || modelFilter !== 'todos' || monthFilter !== 'todos' || searchTerm !== '') && (
              <button
                onClick={() => {
                  setStatusFilter('todos');
                  setModelFilter('todos');
                  setMonthFilter('todos');
                  setSearchTerm('');
                }}
                className="text-[#6E6762] underline hover:text-[#45655a] ml-1"
                type="button"
              >
                Limpar filtros
              </button>
            )}
          </div>
          <div className="text-[#6E6762]">
            Exibindo <span className="font-bold text-[#262220]">{filteredLeads.length}</span> de{' '}
            <span className="font-bold text-[#262220]">{leads.length}</span> leads cadastrados
          </div>
        </div>
      </section>

      {/* Split View: Leads Table + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table Container */}
        <div
          className={`${
            drawerOpen ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'
          } bg-white border border-[#EBE5DB] rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all`}
        >
          <div className="p-4 bg-[#FDFBF7]/80 flex items-center justify-between border-b border-[#EBE5DB]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#45655a] text-[20px]">
                table_rows
              </span>
              <span className="font-bold text-[16px] text-[#262220]">
                Fila Operacional de Orçamentos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#6E6762]">
                Ordenação:
              </span>
              <span className="text-[12px] font-bold text-[#45655a] flex items-center cursor-pointer">
                Data de Cadastro
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </span>
            </div>
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f5f3ef] text-[#6E6762] text-[12px] font-bold uppercase tracking-wider border-b border-[#EBE5DB]">
                <tr>
                  <th className="py-3 px-4">Lead & Evento</th>
                  <th className="py-3 px-4">Data & Local</th>
                  <th className="py-3 px-4">Estrutura</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="text-[14px] divide-y divide-[#EBE5DB]/50">
                {filteredLeads.map((lead) => {
                  const isSelected = selectedLead?.id === lead.id;
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => {
                        onSelectLead(lead.id);
                        setDrawerOpen(true);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#DCE7E2]/30 hover:bg-[#DCE7E2]/50'
                          : 'hover:bg-[#FDFBF7]'
                      }`}
                    >
                      {/* Lead & Evento */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0 ${lead.avatarColor}`}
                          >
                            {lead.avatarText}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#262220] truncate">
                                {lead.name}
                              </span>
                              {isSelected && (
                                <span
                                  className="w-2 h-2 rounded-full bg-[#45655a]"
                                  title="Selecionado"
                                />
                              )}
                            </div>
                            <span className="text-[#6E6762] text-[13px] truncate flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px] text-[#7a5826]">
                                celebration
                              </span>
                              {lead.eventType} ·{' '}
                              <strong>{lead.guestCount} conv.</strong>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Data & Local */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#262220] flex items-center gap-1 text-[13px]">
                            <span className="material-symbols-outlined text-[15px] text-[#45655a]">
                              event
                            </span>
                            {lead.eventDate.split('-').reverse().join('/')}
                          </span>
                          <span className="text-[#6E6762] text-[12px] truncate">
                            {lead.location}
                          </span>
                        </div>
                      </td>

                      {/* Estrutura */}
                      <td className="py-3.5 px-4">
                        {lead.structure === 'bike' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5E9D7] text-[#7a5826] text-[12px] font-bold">
                            <span className="material-symbols-outlined text-[14px]">
                              pedal_bike
                            </span>
                            Bike Retrô
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eae8e4] text-[#414845] text-[12px] font-bold">
                            <span className="material-symbols-outlined text-[14px]">
                              table_bar
                            </span>
                            Estação Trad.
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {lead.status === 'novo' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#45655a] text-white text-[11px] font-bold shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            Novo Lead
                          </span>
                        )}
                        {lead.status === 'atendimento' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F5E9D7] text-[#7a5826] text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7a5826]" />
                            Em Atendimento
                          </span>
                        )}
                        {lead.status === 'proposta' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FBE6E6] text-[#8F4E4E] text-[11px] font-bold">
                            <span className="material-symbols-outlined text-[13px]">
                              send
                            </span>
                            Proposta Enviada
                          </span>
                        )}
                        {lead.status === 'ganho' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCE7E2] text-[#4A6E60] text-[11px] font-bold">
                            <span className="material-symbols-outlined text-[13px]">
                              verified
                            </span>
                            Fechado/Contrato
                          </span>
                        )}
                        {lead.status === 'perdido' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eae8e4] text-[#6E6762] text-[11px] font-bold">
                            Declinado
                          </span>
                        )}
                      </td>

                      {/* Ações Rápidas */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            className="w-8 h-8 rounded-lg bg-white border border-[#EBE5DB] hover:bg-[#87a99c] text-[#1b1c1a] hover:text-[#1e3e34] flex items-center justify-center transition-all shadow-sm"
                            href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(
                              lead.name
                            )}!%20Aqui%20%C3%A9%20da%20Memory%20Cream.`}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Abrir WhatsApp"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              chat
                            </span>
                          </a>
                          <button
                            className="w-8 h-8 rounded-lg bg-white border border-[#EBE5DB] hover:bg-[#F5E9D7] text-[#7a5826] flex items-center justify-center transition-all shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToProposal(lead.id);
                            }}
                            title="Gerar Proposta"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              receipt_long
                            </span>
                          </button>
                          <button
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-sm ${
                              isSelected
                                ? 'bg-[#45655a] text-white'
                                : 'bg-[#eae8e4] text-[#1b1c1a] hover:bg-[#d8d5ce]'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectLead(lead.id);
                              setDrawerOpen(true);
                            }}
                            title="Ver Detalhes"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              visibility
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination & Legend */}
          <div className="p-4 bg-[#FDFBF7]/50 border-t border-[#EBE5DB] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#6E6762] text-[13px]">
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-wider font-bold">
                Legenda:
              </span>
              <span className="flex items-center gap-1 text-[12px]">
                <span className="w-2 h-2 rounded-full bg-[#45655a]" /> Urgente / Hoje
              </span>
              <span className="flex items-center gap-1 text-[12px]">
                <span className="w-2 h-2 rounded-full bg-[#7a5826]" /> Em Negociação
              </span>
              <span className="flex items-center gap-1 text-[12px]">
                <span className="w-2 h-2 rounded-full bg-[#874e4f]" /> Proposta Aberta
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="w-8 h-8 rounded-lg bg-white border border-[#EBE5DB] flex items-center justify-center shadow-sm disabled:opacity-40"
                disabled
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                className="w-8 h-8 rounded-lg bg-[#45655a] text-white font-bold flex items-center justify-center shadow-sm text-[13px]"
                type="button"
              >
                1
              </button>
              <button
                className="w-8 h-8 rounded-lg bg-white border border-[#EBE5DB] hover:bg-[#eae8e4] flex items-center justify-center shadow-sm text-[13px]"
                type="button"
              >
                2
              </button>
              <button
                className="w-8 h-8 rounded-lg bg-white border border-[#EBE5DB] hover:bg-[#eae8e4] flex items-center justify-center shadow-sm text-[13px]"
                type="button"
              >
                3
              </button>
              <button
                className="w-8 h-8 rounded-lg bg-white border border-[#EBE5DB] hover:bg-[#eae8e4] flex items-center justify-center shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Retractable Right Drawer: Lead Detail Preview */}
        {drawerOpen && selectedLead && (
          <aside className="lg:col-span-5 xl:col-span-4 bg-white border border-[#EBE5DB] rounded-2xl shadow-md overflow-hidden flex flex-col sticky top-24 transition-all">
            {/* Drawer Header */}
            <div className="relative bg-[#DCE7E2]/50 p-4 border-b border-[#EBE5DB]">
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#45655a] text-white text-[11px] font-bold shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">star</span>
                  Lead Quente {selectedLead.leadCode}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => window.print()}
                    className="w-8 h-8 rounded-full bg-white text-[#1b1c1a] border border-[#EBE5DB] flex items-center justify-center shadow-sm hover:bg-[#eae8e4] transition-all"
                    title="Imprimir Ficha"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                  </button>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="w-8 h-8 rounded-full bg-white text-[#1b1c1a] border border-[#EBE5DB] flex items-center justify-center shadow-sm hover:bg-[#eae8e4] transition-all"
                    title="Ocultar Detalhes"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-2">
                <img
                  className="w-16 h-16 rounded-xl object-cover shadow-sm shrink-0 border border-[#EBE5DB]"
                  alt="Gelato Cart Memory Cream"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjfA35_KFfL3jf-poQa78iutRkfO0kPBdECL1S8VnzmGgAjyiBC0fwY4wBXb6-gzLg9-6YJio54yxtRvvdek8sUldQsZUW74zR1TMzxfNE3WtEJUh5HdrHTVdkSpsiZWMOWHVpg1MxI6GgthwaQ1YOxxdF3ZAaDxCUCrZMzDhOwowIhg5rDfaawoB-1oTtJgdQnu-0t37T98nmWDcPsQ3dOt4KcVHhv547OvYSnqaf5F2CrLS_2ow79g"
                />
                <div className="flex flex-col min-w-0">
                  <h2 className="font-headline font-bold text-xl text-[#262220] leading-tight">
                    {selectedLead.name}
                  </h2>
                  <span className="text-[13px] text-[#4A6E60] font-semibold">
                    {selectedLead.eventType}
                  </span>
                  <span className="text-[11px] text-[#6E6762] mt-0.5">
                    Recebido pelo formulário: {selectedLead.receivedAt}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Callouts & Specs */}
            <div className="p-4 flex flex-col gap-4 max-h-[calc(100vh-220px)] overflow-y-auto">
              {/* Direct WhatsApp Web Bar */}
              <a
                className="flex items-center justify-between p-3 rounded-xl bg-[#87a99c] text-[#1e3e34] hover:bg-[#45655a] hover:text-white shadow-sm transition-all group"
                href={`https://wa.me/55${selectedLead.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(
                  selectedLead.name
                )}!%20Aqui%20%C3%A9%20a%20Helena%20da%20Memory%20Cream.%20Recebi%20seu%20or%C3%A7amento%20para%20o%20evento%20de%20${encodeURIComponent(
                  selectedLead.eventDate
                )}.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white text-[#45655a] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold leading-none">
                      {selectedLead.phone}
                    </span>
                    <span className="text-[11px] opacity-80">
                      Iniciar WhatsApp com template pré-formatado
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </a>

              {/* Event Specs Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#FDFBF7] border border-[#EBE5DB] p-2.5 rounded-xl flex flex-col">
                  <span className="text-[10px] text-[#6E6762] uppercase tracking-wider font-bold">
                    Data do Evento
                  </span>
                  <span className="text-[14px] font-bold text-[#262220] flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-[#45655a]">
                      event_upcoming
                    </span>
                    {selectedLead.eventDate.split('-').reverse().join('/')}
                  </span>
                  <span className="text-[11px] text-[#6E6762]">Data confirmada</span>
                </div>

                <div className="bg-[#FDFBF7] border border-[#EBE5DB] p-2.5 rounded-xl flex flex-col">
                  <span className="text-[10px] text-[#6E6762] uppercase tracking-wider font-bold">
                    Nº de Convidados
                  </span>
                  <span className="text-[14px] font-bold text-[#262220] flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-[#7a5826]">
                      group
                    </span>
                    {selectedLead.guestCount} pax
                  </span>
                  <span className="text-[11px] text-[#6E6762]">
                    Previsão 2 bolas/pessoa
                  </span>
                </div>

                <div className="bg-[#FDFBF7] border border-[#EBE5DB] p-2.5 rounded-xl flex flex-col">
                  <span className="text-[10px] text-[#6E6762] uppercase tracking-wider font-bold">
                    Estrutura Escolhida
                  </span>
                  <span className="text-[14px] font-bold text-[#7a5826] flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">
                      {selectedLead.structure === 'bike' ? 'pedal_bike' : 'table_bar'}
                    </span>
                    {selectedLead.structure === 'bike' ? 'Bike Retrô' : 'Estação Trad.'}
                  </span>
                  <span className="text-[11px] text-[#6E6762]">
                    {selectedLead.structure === 'bike'
                      ? 'Cestinha vintage de palha'
                      : 'Bancada carvalho'}
                  </span>
                </div>

                <div className="bg-[#FDFBF7] border border-[#EBE5DB] p-2.5 rounded-xl flex flex-col">
                  <span className="text-[10px] text-[#6E6762] uppercase tracking-wider font-bold">
                    Local do Espaço
                  </span>
                  <span className="text-[14px] font-bold text-[#262220] truncate mt-0.5">
                    {selectedLead.city}
                  </span>
                  <span className="text-[11px] text-[#6E6762] truncate">
                    {selectedLead.location}
                  </span>
                </div>
              </div>

              {/* Flavors */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[14px] text-[#262220] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#45655a] text-[18px]">
                      icecream
                    </span>
                    Sabores Pretendidos
                  </span>
                  <span className="text-[11px] text-[#45655a] font-bold">
                    {selectedLead.preferredFlavors.length} selecionados
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLead.preferredFlavors.map((flavor, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-[#f5f3ef] border border-[#EBE5DB] text-[#262220] text-[12px] font-semibold flex items-center gap-1"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#874e4f]" />
                      {flavor}
                    </span>
                  ))}
                </div>
                {selectedLead.veganRequested && (
                  <div className="bg-[#FDFBF7] border border-[#EBE5DB] p-2.5 rounded-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#45655a] text-[18px]">
                      eco
                    </span>
                    <span className="text-[12px] text-[#6E6762]">
                      Opção vegana (base água / 0% lactose) solicitada no pedido.
                    </span>
                  </div>
                )}
              </div>

              {/* Client Notes */}
              {selectedLead.notes && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#6E6762] uppercase font-bold">
                    Mensagem & Observações da Noiva / Contratante
                  </span>
                  <div className="p-3 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl text-[#1b1c1a] text-[13px] leading-relaxed italic">
                    {selectedLead.notes}
                  </div>
                </div>
              )}

              {/* Checklist */}
              <div className="flex flex-col gap-2">
                <span className="font-bold text-[14px] text-[#262220] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#45655a] text-[18px]">
                    checklist
                  </span>
                  Checklist de Atendimento
                </span>
                <div className="flex flex-col gap-2 bg-[#FDFBF7] border border-[#EBE5DB] p-3 rounded-xl">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedLead.checklist.dataAgenda}
                      onChange={(e) =>
                        handleChecklistToggle('dataAgenda', e.target.checked)
                      }
                      className="w-4 h-4 rounded text-[#45655a] accent-[#45655a]"
                    />
                    <span
                      className={`text-[13px] ${
                        selectedLead.checklist.dataAgenda
                          ? 'text-[#6E6762] line-through'
                          : 'text-[#1b1c1a]'
                      }`}
                    >
                      Qualificação de data e agenda do carrinho
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedLead.checklist.logistica}
                      onChange={(e) =>
                        handleChecklistToggle('logistica', e.target.checked)
                      }
                      className="w-4 h-4 rounded text-[#45655a] accent-[#45655a]"
                    />
                    <span
                      className={`text-[13px] ${
                        selectedLead.checklist.logistica
                          ? 'text-[#6E6762] line-through'
                          : 'text-[#1b1c1a]'
                      }`}
                    >
                      Checagem de logística para {selectedLead.city}
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedLead.checklist.propostaEnviada}
                      onChange={(e) =>
                        handleChecklistToggle('propostaEnviada', e.target.checked)
                      }
                      className="w-4 h-4 rounded text-[#45655a] accent-[#45655a]"
                    />
                    <span
                      className={`text-[13px] ${
                        selectedLead.checklist.propostaEnviada
                          ? 'text-[#6E6762] line-through'
                          : 'text-[#1b1c1a] font-semibold'
                      }`}
                    >
                      Envio da Proposta Personalizada (PDF / Link)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedLead.checklist.degustacao}
                      onChange={(e) =>
                        handleChecklistToggle('degustacao', e.target.checked)
                      }
                      className="w-4 h-4 rounded text-[#45655a] accent-[#45655a]"
                    />
                    <span
                      className={`text-[13px] ${
                        selectedLead.checklist.degustacao
                          ? 'text-[#6E6762] line-through'
                          : 'text-[#1b1c1a]'
                      }`}
                    >
                      Degustação presencial ou envio do kit em casa
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => onNavigateToProposal(selectedLead.id)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#45655a] text-white text-[13px] font-bold shadow-md hover:bg-[#4A6E60] transition-all flex items-center justify-center gap-2"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    receipt_long
                  </span>
                  Gerar Proposta Oficial
                </button>
                <button
                  onClick={() =>
                    alert(
                      `Follow-up agendado para ${selectedLead.name} via WhatsApp em 24h.`
                    )
                  }
                  className="py-3 px-4 rounded-xl bg-[#eae8e4] hover:bg-[#dcd9d2] text-[#1b1c1a] text-[13px] font-bold transition-all flex items-center justify-center gap-1.5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  Agendar Follow-up
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Modal: Novo Lead Manual */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 border border-[#EBE5DB] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE5DB] mb-4">
              <div>
                <span className="text-[11px] font-bold text-[#45655a] uppercase tracking-wider">
                  Cadastro Rápido
                </span>
                <h3 className="font-headline font-bold text-2xl text-[#262220]">
                  Novo Lead Manual
                </h3>
              </div>
              <button
                onClick={() => setIsNewLeadModalOpen(false)}
                className="p-1 rounded-full text-[#6E6762] hover:bg-[#eae8e4]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateLeadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Gabriela Duarte"
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#45655a]/30"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="(11) 98888-7777"
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#45655a]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="noiva@email.com"
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#45655a]/30"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    Tipo de Evento
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) =>
                      setFormData({ ...formData, eventType: e.target.value })
                    }
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#45655a]/30"
                  >
                    <option value="Casamento">Casamento</option>
                    <option value="Debutante (15 Anos)">Debutante (15 Anos)</option>
                    <option value="Formatura">Formatura</option>
                    <option value="Festa Infantil">Festa Infantil</option>
                    <option value="Evento Corporativo">Evento Corporativo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    Data do Evento
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) =>
                      setFormData({ ...formData, eventDate: e.target.value })
                    }
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#45655a]/30"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    Nº Convidados
                  </label>
                  <input
                    type="number"
                    min="20"
                    value={formData.guestCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guestCount: Number(e.target.value)
                      })
                    }
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#45655a]/30"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    Estrutura
                  </label>
                  <select
                    value={formData.structure}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        structure: e.target.value as 'bike' | 'tradicional'
                      })
                    }
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#45655a]/30"
                  >
                    <option value="bike">Bike Retrô</option>
                    <option value="tradicional">Estação Tradicional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Campinas / SP"
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#45655a]/30"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    Local / Espaço
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Fazenda / Buffet"
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#45655a]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#262220] block mb-1">
                  Observações & Detalhes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Informações adicionais da noiva..."
                  className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl p-3 text-[14px] outline-none focus:ring-2 focus:ring-[#45655a]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EBE5DB]">
                <button
                  type="button"
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#6E6762] hover:bg-[#eae8e4] font-semibold text-[13px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#45655a] text-white font-bold text-[13px] shadow-md hover:bg-[#4A6E60]"
                >
                  Cadastrar Lead & Abrir Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
