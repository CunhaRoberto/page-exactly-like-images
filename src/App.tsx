import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { HeaderNav } from './components/HeaderNav';
import { CrmLeadsView } from './components/CrmLeadsView';
import { ProposalBuilderView } from './components/ProposalBuilderView';
import { FinanceView } from './components/FinanceView';
import { ContractsView } from './components/ContractsView';
import { SettingsView } from './components/SettingsView';
import { LandingPage } from './components/LandingPage';
import { Lead, PaymentItem, ContractItem } from './types';
import { addLead, loadBackofficeData, loadLeads, saveContracts, saveLeads, savePayments } from './lib/db';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [contracts, setContracts] = useState<ContractItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  // Active view tab: 'landing' or 'leads-crm' | 'gerador-proposta' | 'financeiro-pagamentos' | 'contratos-assinaturas' | 'configuracoes'
  const [currentTab, setCurrentTab] = useState<string>('leads-crm');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('mariana');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carrega os dados guardados no banco (Lovable Cloud)
  const loadAll = React.useCallback(() => {
    setLoading(true);
    setLoadError(null);
    loadBackofficeData()
      .then((data) => {
        setLeads(data.leads);
        setPayments(data.payments);
        setContracts(data.contracts);
        setSelectedLeadId(data.leads[0]?.id || 'mariana');
        loadedRef.current = true;
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoadError('Não foi possível abrir seus dados agora. Verifique sua conexão com a internet e tente de novo.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Salva no banco sempre que a lista mudar
  useEffect(() => {
    if (!loadedRef.current) return;
    saveLeads(leads).catch((e) => {
      console.error(e);
      showToast('Não foi possível salvar os leads no servidor.');
    });
  }, [leads]);

  useEffect(() => {
    if (!loadedRef.current) return;
    savePayments(payments).catch((e) => {
      console.error(e);
      showToast('Não foi possível salvar os pagamentos no servidor.');
    });
  }, [payments]);

  useEffect(() => {
    if (!loadedRef.current) return;
    saveContracts(contracts).catch((e) => {
      console.error(e);
      showToast('Não foi possível salvar os contratos no servidor.');
    });
  }, [contracts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handlers for Leads
  const handleUpdateLead = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    showToast(`Lead "${updated.name}" atualizado com sucesso.`);
  };

  const handleAddLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
    setSelectedLeadId(newLead.id);
    showToast(`Novo lead "${newLead.name}" cadastrado!`);
  };

  const handleAddLeadFromWebsite = async (newLead: Lead) => {
    await addLead(newLead);
    setLeads((prev) => prev.some((lead) => lead.id === newLead.id) ? prev : [newLead, ...prev]);
    setSelectedLeadId(newLead.id);
    showToast(`Novo pedido de orçamento recebido do site: ${newLead.name}!`);
  };

  // Navigate from CRM to Proposal Builder
  const handleNavigateToProposal = (leadId: string) => {
    setSelectedLeadId(leadId);
    setCurrentTab('gerador-proposta');
  };

  // Handlers for Proposal conversion to Contract
  const handleConvertToContract = (proposalData: {
    clientName: string;
    clientCpf?: string;
    eventType: string;
    eventDate: string;
    location: string;
    structure: 'bike' | 'tradicional';
    hours: number;
    totalValue: number;
    signalValue: number;
  }) => {
    const nextCodeNum = contracts.length + 85;
    const contractCode = `CTR-2025-0${nextCodeNum}`;
    const newContract: ContractItem = {
      id: contractCode,
      contractCode,
      clientName: proposalData.clientName.toUpperCase(),
      clientShort: `${proposalData.clientName} • ${
        proposalData.structure === 'bike' ? 'Bike Retrô' : 'Estação Tradicional'
      }`,
      clientCpf: proposalData.clientCpf || '123.456.789-00',
      clientRg: '22.333.444-5 SSP/SP',
      clientAddress: `${proposalData.location}, São Paulo / SP`,
      eventType: proposalData.eventType,
      eventDate: proposalData.eventDate,
      eventLocation: proposalData.location,
      model:
        proposalData.structure === 'bike'
          ? 'Bike Retrô Artesanal Memory Cream'
          : 'Estação de Gelatos Tradicional',
      hours: proposalData.hours,
      totalValue: proposalData.totalValue,
      signalValue: proposalData.signalValue,
      status: 'aguardando',
      badgeClass: 'bg-[#FBE6E6] text-[#8F4E4E]',
      badgeText: 'Aguardando Assinatura',
      signedByContractor: true,
      contractorSignDate: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR'),
      contractorName: 'Helena Duarte (Representante Legal)',
      clientSigned: false,
      securityHash: Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join(''),
      validDays: 5,
      flavorsDesc: 'Morango Silvestre Cremoso, Uva Niágara da Serra, Jabuticaba Nativa e Chiclete Nostalgia',
      channelDesc: 'Gerado a partir da Proposta Comercial'
    };

    setContracts((prev) => [newContract, ...prev]);

    // Add corresponding payment schedule item
    const initials = proposalData.clientName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');

    const newPayment: PaymentItem = {
      id: `pay-${Date.now()}`,
      clientName: proposalData.clientName,
      clientInitials: initials || 'MC',
      clientColor: 'bg-[#87a99c] text-[#1e3e34]',
      eventName: proposalData.eventType,
      eventDate: proposalData.eventDate,
      packageType:
        proposalData.structure === 'bike'
          ? 'Pacote Vintage Bell (Bike Retrô)'
          : 'Estação Gelato Bar Tradicional',
      totalValue: proposalData.totalValue,
      signalDesc: `Sinal (50%): R$ ${proposalData.signalValue.toLocaleString('pt-BR')},00`,
      signalStatusDesc: 'Aguardando liquidação',
      balanceValue: proposalData.totalValue - proposalData.signalValue,
      balanceDueDate: `${proposalData.eventDate} (D-7)`,
      liquidationStatus: 'aguardando',
      method: 'pix',
      category: 'social',
      authCode: `PIX-RES-${Date.now().toString().slice(-5)}`
    };
    setPayments((prev) => [newPayment, ...prev]);

    // Update lead status to "proposta_enviada" or "contrato"
    setLeads((prev) =>
      prev.map((l) =>
        l.name.toLowerCase().includes(proposalData.clientName.toLowerCase()) ||
        proposalData.clientName.toLowerCase().includes(l.name.toLowerCase())
          ? {
              ...l,
              status: 'contrato' as const,
              checklist: { ...l.checklist, propostaEnviada: true }
            }
          : l
      )
    );

    setCurrentTab('contratos-assinaturas');
    showToast(`Contrato ${contractCode} gerado e pronto para assinatura do cliente!`);
  };

  // Handlers for Payments
  const handleUpdatePayment = (updated: PaymentItem) => {
    setPayments((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Lançamento financeiro de "${updated.clientName}" atualizado.`);
  };

  const handleAddPayment = (newItem: PaymentItem) => {
    setPayments((prev) => [newItem, ...prev]);
    showToast(`Novo recebimento de "${newItem.clientName}" registrado no fluxo de caixa!`);
  };

  // Handlers for Contracts
  const handleUpdateContract = (updated: ContractItem) => {
    setContracts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast(`Contrato "${updated.contractCode}" atualizado com sucesso.`);
  };

  const handleAddNewContract = (newContract: ContractItem) => {
    setContracts((prev) => [newContract, ...prev]);
    showToast(`Novo contrato "${newContract.contractCode}" cadastrado!`);
  };

  const newLeadsCount = leads.filter((l) => l.status === 'novo').length;

  const tabTitles: Record<string, string> = {
    'leads-crm': 'Leads & Orçamentos (CRM)',
    'gerador-proposta': 'Gerador de Propostas Comerciais',
    'financeiro-pagamentos': 'Financeiro & Pagamentos',
    'contratos-assinaturas': 'Contratos & Assinaturas Digitais',
    configuracoes: 'Configurações do Sistema'
  };

  // If in public site mode
  if (currentTab === 'landing') {
    return (
      <div className="relative min-h-screen bg-[#FDFBF7]">
        {/* Floating return to Back-Office button */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setCurrentTab('leads-crm')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1e3e34] text-white shadow-xl hover:bg-[#2b5447] transition-all font-bold text-xs tracking-wide border border-white/20 hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span>Acessar Back-Office</span>
            {newLeadsCount > 0 && (
              <span className="bg-[#ba1a1a] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {newLeadsCount}
              </span>
            )}
          </button>
        </div>

        <LandingPage
          onOpenAdmin={() => {
            loadLeads().then(setLeads).catch(() => showToast('Não foi possível atualizar a lista. Tente novamente.'));
            setCurrentTab('leads-crm');
          }}
          onAddLeadFromWebsite={handleAddLeadFromWebsite}
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1e3e34] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#87a99c]/40 animate-bounce">
            <span className="material-symbols-outlined text-[#87a99c]">check_circle</span>
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // Back-office mode
  return (
    <div className="min-h-screen bg-[#F9F6F0] font-body text-[#1A1A1A] antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e3e34] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#87a99c]/40 animate-fade-in transition-all">
          <span className="material-symbols-outlined text-[#87a99c]">check_circle</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Floating switcher to test public site */}
      <div className="fixed bottom-6 left-80 z-40">
        <button
          onClick={() => setCurrentTab('landing')}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-[#45655a] border border-[#EBE5DB] shadow-lg hover:shadow-xl hover:bg-[#FDFBF7] transition-all text-xs font-bold group"
          title="Ver o site institucional com formulário de solicitação de orçamento dos clientes"
        >
          <span className="material-symbols-outlined text-[16px] text-[#c49a62] group-hover:rotate-12 transition-transform">
            open_in_new
          </span>
          <span>Ver Site de Clientes</span>
        </button>
      </div>

      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenPublicSite={() => setCurrentTab('landing')}
        newLeadsCount={newLeadsCount}
      />

      {/* Top Header */}
      <HeaderNav
        currentTabTitle={tabTitles[currentTab] || 'Back-Office'}
        onOpenPublicSite={() => setCurrentTab('landing')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="ml-72 pt-20 min-h-screen">
        {currentTab === 'leads-crm' && (
          <CrmLeadsView
            leads={leads}
            selectedLeadId={selectedLeadId}
            onSelectLead={setSelectedLeadId}
            onUpdateLead={handleUpdateLead}
            onAddLead={handleAddLead}
            onNavigateToProposal={handleNavigateToProposal}
            onOpenPublicSite={() => setCurrentTab('landing')}
          />
        )}

        {currentTab === 'gerador-proposta' && (
          <ProposalBuilderView
            leads={leads}
            currentLeadId={selectedLeadId}
            onConvertToContract={handleConvertToContract}
          />
        )}

        {currentTab === 'financeiro-pagamentos' && (
          <FinanceView
            payments={payments}
            onUpdatePayment={handleUpdatePayment}
            onAddPayment={handleAddPayment}
          />
        )}

        {currentTab === 'contratos-assinaturas' && (
          <ContractsView
            contracts={contracts}
            onUpdateContract={handleUpdateContract}
            onAddNewContract={handleAddNewContract}
          />
        )}

        {currentTab === 'configuracoes' && <SettingsView />}
      </main>
    </div>
  );
}
