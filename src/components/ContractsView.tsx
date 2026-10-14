import React, { useState } from 'react';
import { ContractItem } from '../types';
import { LOGO_URL } from './Sidebar';

interface ContractsViewProps {
  contracts: ContractItem[];
  onUpdateContract: (updated: ContractItem) => void;
  onAddNewContract: (newContract: ContractItem) => void;
}

export const ContractsView: React.FC<ContractsViewProps> = ({
  contracts,
  onUpdateContract,
  onAddNewContract
}) => {
  const [selectedContractId, setSelectedContractId] = useState<string>(
    contracts[0]?.id || 'CTR-2025-084'
  );
  const [filterType, setFilterType] = useState<string>('todos');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditingClauses, setIsEditingClauses] = useState<boolean>(false);
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);

  // New Contract State
  const [newClientName, setNewClientName] = useState('');
  const [newClientCpf, setNewClientCpf] = useState('');
  const [newEventType, setNewEventType] = useState('Casamento');
  const [newEventDate, setNewEventDate] = useState('2025-11-28');
  const [newEventLocation, setNewEventLocation] = useState('Campinas / SP');
  const [newModel, setNewModel] = useState('Bike Retrô Vintage Ivory');
  const [newTotalValue, setNewTotalValue] = useState(5400);

  const activeContract =
    contracts.find((c) => c.id === selectedContractId) || contracts[0];

  const openCount = contracts.filter(
    (c) => c.status === 'pendente' || c.status === 'aguardando'
  ).length;
  const awaitingSignatureCount = contracts.filter((c) => !c.clientSigned).length;
  const signedValidCount = contracts.filter(
    (c) => c.status === 'assinado' || c.status === 'registrado'
  ).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleClientSignature = () => {
    if (!activeContract) return;
    const isNowSigned = !activeContract.clientSigned;
    const updated: ContractItem = {
      ...activeContract,
      clientSigned: isNowSigned,
      status: isNowSigned ? 'assinado' : 'pendente',
      badgeClass: isNowSigned
        ? 'bg-[#DCE7E2] text-[#4A6E60]'
        : 'bg-[#FBE6E6] text-[#8F4E4E]',
      badgeText: isNowSigned ? 'Assinado' : 'Pendente',
      clientSignDate: isNowSigned
        ? `${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} BRT`
        : undefined,
      clientIp: isNowSigned ? '177.18.239.10 • São Paulo, SP' : undefined
    };
    onUpdateContract(updated);
    showToast(
      isNowSigned
        ? `Contrato assinado digitalmente por ${activeContract.clientName} via token ICP-Brasil!`
        : `Status de assinatura do cliente revertido para Pendente.`
    );
  };

  const handleSendToClient = () => {
    showToast(
      `Link seguro de assinatura ZapSign disparado para o WhatsApp e E-mail de ${activeContract?.clientName}!`
    );
  };

  const handleCreateContractSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `CTR-2025-0${Math.floor(85 + Math.random() * 10)}`;
    const newContract: ContractItem = {
      id: newId,
      contractCode: newId,
      clientName: newClientName.toUpperCase(),
      clientShort: `${newClientName} • ${newModel.split(' ')[0]}`,
      clientCpf: newClientCpf,
      clientRg: '34.981.201-X SSP/SP',
      clientAddress: 'Rua das Flores, 100, São Paulo/SP',
      eventType: newEventType,
      eventDate: newEventDate,
      eventLocation: newEventLocation,
      model: newModel,
      hours: 4,
      totalValue: Number(newTotalValue),
      signalValue: Math.round(Number(newTotalValue) * 0.3),
      status: 'pendente',
      badgeClass: 'bg-[#FBE6E6] text-[#8F4E4E]',
      badgeText: 'Pendente',
      signedByContractor: true,
      contractorSignDate: `${new Date().toLocaleDateString('pt-BR')} às 11:00:00 BRT`,
      contractorName: 'Helena Duarte (Representante Legal)',
      clientSigned: false,
      securityHash: 'e3b0c44298fc1c149afbf4c8996fb924' + Date.now().toString(16),
      validDays: 5,
      flavorsDesc: 'Morango Silvestre Cremoso, Chocolate Belga, Frutas Vermelhas e Baunilha Bourbon',
      channelDesc: 'Gerado no back-office'
    };

    onAddNewContract(newContract);
    setSelectedContractId(newId);
    setIsNewContractModalOpen(false);
    showToast(`Novo contrato ${newId} gerado e disponibilizado para envio.`);
  };

  const filteredContracts = contracts.filter((c) => {
    if (filterType === 'todos') return true;
    if (filterType === 'pendentes') return c.status === 'pendente' || c.status === 'aguardando';
    if (filterType === 'validos') return c.status === 'assinado' || c.status === 'registrado';
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#1b1c1a] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-[#EBE5DB]/20 animate-fade-in">
          <span className="material-symbols-outlined text-[#87a99c]">
            check_circle
          </span>
          <span className="text-[13px] font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="py-4 mb-6 border-b border-[#EBE5DB]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#4A6E60] text-[11px] font-bold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[16px]">
                verified_user
              </span>
              <span>Gestão Jurídica • Memory Cream</span>
            </div>
            <h1 className="font-headline font-semibold text-3xl md:text-4xl text-[#262220] tracking-tight">
              Contratos & Assinaturas Digitais
            </h1>
            <p className="text-[14px] text-[#6E6762] mt-1 max-w-2xl">
              Supervisão de minutas contratuais, validações jurídicas e trilha de auditoria digital com certificação ICP-Brasil via ZapSign/ClickSign.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() =>
                showToast(
                  'Trilha de auditoria criptográfica validada. Todos os hashes SHA-256 estão em conformidade.'
                )
              }
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#1b1c1a] border border-[#EBE5DB] hover:bg-[#eae8e4] transition-all text-[12px] font-bold shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span>Histórico & Logs</span>
            </button>
            <button
              onClick={() => setIsNewContractModalOpen(true)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#874e4f] text-white hover:bg-[#8F4E4E] transition-all text-[12px] font-bold shadow-md"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Novo Contrato</span>
            </button>
          </div>
        </div>

        {/* Quick Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white border border-[#EBE5DB] p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#6E6762] font-bold">
                Contratos em Aberto
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-4xl text-[#262220] leading-none font-bold">
                  {String(openCount).padStart(2, '0')}
                </span>
                <span className="text-[11px] text-[#4A6E60] font-bold flex items-center">
                  <span className="material-symbols-outlined text-[14px]">
                    pending_actions
                  </span>{' '}
                  Minutas ativas
                </span>
              </div>
              <span className="text-[12px] text-[#6E6762] mt-1">
                2 com revisão de data solicitada
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F5E9D7] text-[#7a5826] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">description</span>
            </div>
          </div>

          <div className="bg-white border border-[#EBE5DB] p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#6E6762] font-bold">
                Aguardando Assinatura
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-4xl text-[#874e4f] leading-none font-bold">
                  {String(awaitingSignatureCount).padStart(2, '0')}
                </span>
                <span className="text-[11px] text-[#8F4E4E] font-bold flex items-center">
                  <span className="material-symbols-outlined text-[14px]">
                    hourglass_top
                  </span>{' '}
                  Clientes notificados
                </span>
              </div>
              <span className="text-[12px] text-[#6E6762] mt-1">
                Disparos recentes via WhatsApp
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FBE6E6] text-[#874e4f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">draw</span>
            </div>
          </div>

          <div className="bg-white border border-[#EBE5DB] p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#6E6762] font-bold">
                Assinados e Válidos
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-4xl text-[#45655a] leading-none font-bold">
                  {String(signedValidCount).padStart(2, '0')}
                </span>
                <span className="text-[11px] text-[#45655a] font-bold flex items-center">
                  <span className="material-symbols-outlined text-[14px]">
                    check_circle
                  </span>{' '}
                  100% integridade
                </span>
              </div>
              <span className="text-[12px] text-[#6E6762] mt-1">
                Temporada 2025/2026 segurada
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#DCE7E2] text-[#45655a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Grid: List (4 cols) & Editor/Viewer (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Contracts Feed */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-[#EBE5DB] p-4 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#45655a] text-[20px]">
                  folder_special
                </span>
                <h2 className="font-headline font-bold text-lg text-[#262220]">
                  Contratos Recentes
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#eae8e4] text-[#6E6762] text-[11px] font-bold">
                Total {contracts.length}
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3">
              <button
                onClick={() => setFilterType('todos')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                  filterType === 'todos'
                    ? 'bg-[#45655a] text-white'
                    : 'bg-[#FDFBF7] text-[#6E6762] hover:bg-[#eae8e4]'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType('pendentes')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                  filterType === 'pendentes'
                    ? 'bg-[#45655a] text-white'
                    : 'bg-[#FDFBF7] text-[#6E6762] hover:bg-[#eae8e4]'
                }`}
              >
                Pendentes (
                {openCount}
                )
              </button>
              <button
                onClick={() => setFilterType('validos')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                  filterType === 'validos'
                    ? 'bg-[#45655a] text-white'
                    : 'bg-[#FDFBF7] text-[#6E6762] hover:bg-[#eae8e4]'
                }`}
              >
                Válidos (
                {signedValidCount}
                )
              </button>
            </div>

            {/* Cards List */}
            <div className="flex flex-col gap-2.5">
              {filteredContracts.map((c) => {
                const isSelected = selectedContractId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedContractId(c.id)}
                    className={`cursor-pointer p-4 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-[#FDFBF7] border-[#45655a] shadow-sm ring-1 ring-[#45655a]/30'
                        : 'bg-[#FDFBF7]/40 border-[#EBE5DB] hover:bg-[#FDFBF7]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] text-[#45655a] font-bold">
                            #{c.contractCode}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#874e4f]" />
                          <span className="text-[11px] text-[#6E6762]">
                            {c.eventType}
                          </span>
                        </div>
                        <h3 className="font-bold text-[14px] text-[#262220] mt-0.5">
                          {c.clientShort}
                        </h3>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 ${c.badgeClass}`}
                      >
                        {c.badgeText}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-3 text-[#6E6762] text-[12px]">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-[#7a5826]">
                          calendar_month
                        </span>
                        <span>{c.eventDate}</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-[#262220]">
                        <span className="material-symbols-outlined text-[15px] text-[#45655a]">
                          payments
                        </span>
                        <span>R$ {c.totalValue.toLocaleString('pt-BR')},00</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#EBE5DB]/50 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 text-[#874e4f]">
                        <span className="material-symbols-outlined text-[14px]">
                          send
                        </span>
                        <span>{c.channelDesc}</span>
                      </div>
                      <span className="text-[#6E6762]">
                        {c.clientSigned ? 'Assinado' : 'Aguardando'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Tip */}
          <div className="bg-[#F5E9D7]/60 border border-[#c49a62]/20 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-[#7a5826] font-bold text-[13px]">
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              <span>Boas Práticas de Assinatura</span>
            </div>
            <p className="text-[12px] text-[#6E6762] mt-1.5 leading-relaxed">
              Lembretes automáticos por WhatsApp são enviados no 2º e no 5º dia útil após a emissão da minuta. Após 7 dias úteis a reserva de data é liberada para renegociação.
            </p>
          </div>
        </div>

        {/* Right Column: Formal Document Paper Container */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Top Action Toolbar */}
          <div className="bg-white border border-[#EBE5DB] p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <button
                onClick={handleSendToClient}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#45655a] text-white hover:bg-[#4A6E60] transition-all text-[12px] font-bold shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  send_and_archive
                </span>
                <span>Enviar ao Cliente (WhatsApp/E-mail)</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#EBE5DB] text-[#1b1c1a] hover:bg-[#eae8e4] transition-all text-[12px] font-bold"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Baixar PDF</span>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setIsEditingClauses(!isEditingClauses);
                  showToast(
                    isEditingClauses
                      ? 'Edição desativada e alterações salvas.'
                      : 'Modo de edição rápida habilitado para as cláusulas operacionais.'
                  );
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all ${
                  isEditingClauses
                    ? 'bg-[#c7eadc] text-[#1e3e34] border-[#45655a]'
                    : 'bg-[#FDFBF7] text-[#414845] border-[#EBE5DB] hover:bg-[#eae8e4]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span>{isEditingClauses ? 'Salvar Edição' : 'Editar Minuta'}</span>
              </button>
              <button
                onClick={() =>
                  showToast(
                    'Minuta recalculada e sincronizada com as cotações mais recentes do CRM.'
                  )
                }
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FDFBF7] text-[#414845] border border-[#EBE5DB] hover:bg-[#eae8e4] transition-all text-[12px] font-bold"
                type="button"
                title="Recalcular com dados do CRM"
              >
                <span className="material-symbols-outlined text-[16px]">autorenew</span>
                <span>Regerar</span>
              </button>
            </div>
          </div>

          {/* Formal Letterhead Document Container */}
          <div className="relative bg-white border border-[#EBE5DB] rounded-2xl shadow-xl overflow-hidden">
            {/* Top Luxury Banner */}
            <div className="h-3 w-full bg-[#87a99c]" />

            <div className="p-6 md:p-8 bg-[#FDFBF7]/40">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#EBE5DB]/70">
                <div className="flex items-center gap-4">
                  <img
                    alt="Memory Cream Emblema"
                    className="h-14 w-auto object-contain"
                    src={LOGO_URL}
                  />
                  <div className="flex flex-col">
                    <span className="font-headline font-bold text-2xl text-[#45655a] leading-tight">
                      Memory Cream
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#6E6762] font-bold">
                      Ateliê de Gelato Soft Gourmet
                    </span>
                    <span className="text-[11px] text-[#6E6762] mt-0.5">
                      CNPJ: 45.192.839/0001-92 • São Paulo - SP
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end">
                  <span className="px-3 py-1 rounded-full bg-[#F5E9D7] text-[#7a5826] text-[11px] font-bold border border-[#c49a62]/20">
                    Instrumento Particular de Prestação de Serviços
                  </span>
                  <span className="text-[12px] text-[#6E6762] mt-1">
                    Número: <strong className="text-[#262220]">{activeContract?.contractCode}</strong>
                  </span>
                  <span className="text-[11px] text-[#6E6762]">
                    Emissão: <strong>14 de Maio de 2025</strong>
                  </span>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center my-6">
                <h2 className="font-headline font-bold text-xl md:text-2xl text-[#262220] tracking-tight uppercase">
                  Contrato de Locação de Estação Gourmet de Sorvete Soft & Serviços
                </h2>
                <div className="w-16 h-0.5 bg-[#87a99c] mx-auto mt-2" />
              </div>

              {/* Das Partes Qualificadas */}
              <div className="bg-white border border-[#EBE5DB] p-4 rounded-xl shadow-sm mb-6">
                <h3 className="font-bold text-[14px] text-[#45655a] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  Das Partes Qualificadas
                </h3>
                <p className="text-[13px] text-[#1b1c1a] leading-relaxed text-justify">
                  <strong>CONTRATADA:</strong> <strong>MEMORY CREAM EVENTOS E GELATOS LTDA.</strong>, com sede na Av. dos Bandeirantes, 1240, São Paulo/SP, inscrita no CNPJ/MF sob o nº 45.192.839/0001-92, doravante denominada simplesmente CONTRATADA.
                </p>
                <p className="text-[13px] text-[#1b1c1a] leading-relaxed text-justify mt-2">
                  <strong>CONTRATANTE:</strong> <strong>{activeContract?.clientName}</strong>, portadora do RG nº {activeContract?.clientRg} e inscrita no CPF/MF sob o nº {activeContract?.clientCpf}, residente e domiciliada à {activeContract?.clientAddress}, doravante denominada CONTRATANTE.
                </p>
              </div>

              {/* Clauses List */}
              <div className="space-y-4 text-[#262220]">
                {/* Cláusula 1 */}
                <div className="p-4 rounded-xl bg-white border border-[#EBE5DB] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-[#45655a] uppercase tracking-wider font-bold">
                      Cláusula Primeira • Do Objeto da Contratação
                    </span>
                    <span className="material-symbols-outlined text-[#87a99c] text-[18px]">
                      icecream
                    </span>
                  </div>
                  <p className="text-[13px] text-[#414845] leading-relaxed text-justify">
                    <strong>1.1.</strong> O presente instrumento tem como objeto a locação temporária de maquinário de sorvete soft americano artesanal, montado sobre a estrutura móvel modelo <strong>{activeContract?.model}</strong>, com atendimento integral para o evento social de {activeContract?.eventType} a realizar-se no dia <strong>{activeContract?.eventDate}</strong> em {activeContract?.eventLocation}.
                  </p>
                  <p className="text-[13px] text-[#414845] leading-relaxed text-justify mt-2">
                    <strong>1.2.</strong> A CONTRATADA fornecerá <strong>04 (quatro) horas de serviço contínuo e ininterrupto</strong>, com início previsto conforme cronograma cerimonial, incluindo consumo ilimitado dos sabores selecionados ({activeContract?.flavorsDesc}), casquinhas crocantes de waffle artesanal, copinhos biodegradáveis personalizados, colheres e 6 opções de caldas & coberturas de linha premium.
                  </p>
                </div>

                {/* Cláusula 2 */}
                <div className="p-4 rounded-xl bg-white border border-[#EBE5DB] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-[#45655a] uppercase tracking-wider font-bold">
                      Cláusula Segunda • Das Obrigações da Contratada
                    </span>
                    <span className="material-symbols-outlined text-[#87a99c] text-[18px]">
                      handshake
                    </span>
                  </div>
                  <p className="text-[13px] text-[#414845] leading-relaxed text-justify">
                    <strong>2.1.</strong> A CONTRATADA compromete-se a chegar ao local do evento com antecedência mínima de <strong>02 (duas) horas</strong> em relação ao horário acordado para início da operação, visando à montagem, ambientação cenográfica e calibração térmica das caldas e compressores.
                  </p>
                  <p className="text-[13px] text-[#414845] leading-relaxed text-justify mt-2">
                    <strong>2.2.</strong> Disponibilizar 02 (dois) atendentes devidamente uniformizados conforme padrão visual elegante da Memory Cream (avental linho cru com bordado botânico, boina clássica e calçado higienizado), detentores de treinamento de manipulação de alimentos e etiqueta de alto padrão.
                  </p>
                </div>

                {/* Cláusula 3 */}
                <div className="p-4 rounded-xl bg-white border border-[#EBE5DB] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-[#45655a] uppercase tracking-wider font-bold">
                      Cláusula Terceira • Das Obrigações do Contratante
                    </span>
                    <span className="material-symbols-outlined text-[#87a99c] text-[18px]">
                      bolt
                    </span>
                  </div>
                  <p className="text-[13px] text-[#414845] leading-relaxed text-justify">
                    <strong>3.1.</strong> O CONTRATANTE responsabiliza-se por fornecer no local exato de operação um <strong>ponto exclusivo de alimentação elétrica 220V estável</strong> (tomada padrão NBR de 20A ou disjuntor dedicado mínimo de 25A), localizado a no máximo 5 metros da estação gourmet.
                  </p>
                  <p className="text-[13px] text-[#414845] leading-relaxed text-justify mt-2">
                    <strong>3.2.</strong> Garantir superfície plana, abrigada de intempéries (chuva e incidência direta do sol) e rota desimpedida de acesso plano para a rolagem da estrutura com vão livre mínimo de 90 cm nas portas e passagens.
                  </p>
                </div>

                {/* Cláusula 4 */}
                <div className="p-4 rounded-xl bg-white border border-[#EBE5DB] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-[#45655a] uppercase tracking-wider font-bold">
                      Cláusula Quarta • Do Preço, Pagamento e Cancelamento
                    </span>
                    <span className="material-symbols-outlined text-[#87a99c] text-[18px]">
                      receipt_long
                    </span>
                  </div>
                  <p className="text-[13px] text-[#414845] leading-relaxed text-justify">
                    <strong>4.1.</strong> Pela prestação dos serviços descritos, o CONTRATANTE pagará à CONTRATADA o valor total de{' '}
                    <strong>R$ {activeContract?.totalValue.toLocaleString('pt-BR')},00</strong>, a ser liquidado da seguinte forma:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-[12px] text-[#414845] pl-2">
                    <li>
                      Sinal confirmatório de reserva (30%): R${' '}
                      {activeContract?.signalValue.toLocaleString('pt-BR')},00 pago via PIX na celebração deste instrumento;
                    </li>
                    <li>
                      Saldo remanescente: R${' '}
                      {(
                        (activeContract?.totalValue || 0) -
                        (activeContract?.signalValue || 0)
                      ).toLocaleString('pt-BR')}
                      ,00 liquidado até 10 dias corridos antes do evento.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Digital Signatures Box */}
              <div className="mt-8 pt-6 border-t border-[#EBE5DB]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4A6E60] text-[22px]">
                      fingerprint
                    </span>
                    <h4 className="font-bold text-[15px] text-[#262220]">
                      Assinaturas Eletrônicas & Certificação
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCE7E2] text-[#4A6E60] text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[16px]">
                      security
                    </span>
                    <span>Conforme MP 2.200-2 / ICP-Brasil</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contratada Box */}
                  <div className="bg-white border border-[#EBE5DB] p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-[#45655a] font-bold">
                        Contratada
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#DCE7E2] text-[#4A6E60] text-[11px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          done_all
                        </span>{' '}
                        Assinado
                      </span>
                    </div>
                    <div className="my-3 flex items-center justify-center py-2">
                      <div className="font-headline text-xl text-[#4A6E60] italic tracking-wider select-none transform -rotate-1">
                        Helena Duarte • Memory Cream
                      </div>
                    </div>
                    <div className="pt-2 bg-[#FDFBF7] p-2 rounded-xl text-[11px] text-[#6E6762] space-y-0.5">
                      <div className="flex justify-between">
                        <span>Signatário:</span>
                        <strong className="text-[#1b1c1a]">
                          {activeContract?.contractorName}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Data/Hora:</span>
                        <span>{activeContract?.contractorSignDate}</span>
                      </div>
                      <div className="flex justify-between truncate">
                        <span>Hash SHA-256:</span>
                        <span className="font-mono text-[10px] text-[#45655a] truncate max-w-[150px]">
                          {activeContract?.securityHash}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contratante Box */}
                  <div className="bg-white border border-[#EBE5DB] p-4 rounded-2xl shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider text-[#874e4f] font-bold">
                          Contratante
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                            activeContract?.clientSigned
                              ? 'bg-[#DCE7E2] text-[#4A6E60]'
                              : 'bg-[#FBE6E6] text-[#8F4E4E]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {activeContract?.clientSigned ? 'done_all' : 'hourglass_top'}
                          </span>
                          {activeContract?.clientSigned ? 'Assinado' : 'Aguardando'}
                        </span>
                      </div>

                      <div className="my-3 py-3 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB] flex flex-col items-center justify-center text-center">
                        {activeContract?.clientSigned ? (
                          <>
                            <div className="font-headline text-xl text-[#4A6E60] italic tracking-wider">
                              {activeContract?.clientName}
                            </div>
                            <span className="text-[11px] text-[#4A6E60] font-bold mt-1">
                              Assinado digitalmente via token seguro
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[#874e4f] text-[28px] opacity-70">
                              edit_note
                            </span>
                            <span className="text-[12px] text-[#6E6762] mt-0.5">
                              Aguardando confirmação via SMS/Token
                            </span>
                            <button
                              onClick={handleToggleClientSignature}
                              className="mt-2 text-[11px] font-bold text-[#45655a] underline hover:opacity-80"
                            >
                              (Simular Assinatura Digital do Cliente)
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 bg-[#FDFBF7] p-2 rounded-xl text-[11px] text-[#6E6762] space-y-0.5">
                      <div className="flex justify-between">
                        <span>Titular:</span>
                        <strong className="text-[#1b1c1a]">
                          {activeContract?.clientName}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-[#874e4f] font-bold">
                          {activeContract?.clientSigned
                            ? `Validado em ${activeContract?.clientSignDate}`
                            : 'Link ativo disparado ao cliente'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Trail Banner */}
                <div className="mt-4 p-3 rounded-xl bg-[#efeeea] border border-[#EBE5DB] flex flex-col sm:flex-row items-center justify-between gap-2 text-[#6E6762] text-[12px]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#45655a] text-[18px]">
                      verified
                    </span>
                    <span>
                      Registro de autenticidade criptográfica emitido sob token{' '}
                      <strong>#MC-SEC-2025-084-BRA</strong>
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      showToast(
                        'Autenticação confirmada no registro público ICP-Brasil.'
                      )
                    }
                    className="text-[#4A6E60] hover:underline font-bold flex items-center gap-1"
                    type="button"
                  >
                    <span>Verificar no Portal Oficial</span>
                    <span className="material-symbols-outlined text-[14px]">
                      open_in_new
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="h-2 w-full bg-[#45655a]" />
          </div>
        </div>
      </div>

      {/* Modal: Novo Contrato */}
      {isNewContractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-[#EBE5DB]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE5DB] mb-4">
              <h3 className="font-headline font-bold text-2xl text-[#262220]">
                Gerar Novo Contrato
              </h3>
              <button
                onClick={() => setIsNewContractModalOpen(false)}
                className="p-1 rounded-full text-[#6E6762] hover:bg-[#eae8e4]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateContractSubmit} className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-[#262220] block mb-1">
                  Nome do Contratante *
                </label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo de Oliveira"
                  className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    CPF / CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientCpf}
                    onChange={(e) => setNewClientCpf(e.target.value)}
                    placeholder="123.456.789-00"
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    Data do Evento
                  </label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    Estrutura / Carrinho
                  </label>
                  <select
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none"
                  >
                    <option value="Bike Retrô Vintage Ivory">
                      Bike Retrô Vintage Ivory
                    </option>
                    <option value="Estação Gourmet Inox Tradicional">
                      Estação Gourmet Inox Tradicional
                    </option>
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    Valor Total (R$)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={newTotalValue}
                    onChange={(e) => setNewTotalValue(Number(e.target.value))}
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EBE5DB]">
                <button
                  type="button"
                  onClick={() => setIsNewContractModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#6E6762] hover:bg-[#eae8e4] font-semibold text-[13px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#45655a] text-white font-bold text-[13px] shadow-md hover:bg-[#4A6E60]"
                >
                  Emitir Minuta Contratual
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
