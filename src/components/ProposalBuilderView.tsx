import React, { useState, useEffect, useMemo } from 'react';
import { Lead } from '../types';

interface ProposalBuilderViewProps {
  leads: Lead[];
  currentLeadId?: string;
  onConvertToContract: (proposalData: {
    clientName: string;
    clientCpf?: string;
    eventType: string;
    eventDate: string;
    location: string;
    structure: 'bike' | 'tradicional';
    hours: number;
    totalValue: number;
    signalValue: number;
  }) => void;
}

const getPricing = () => {
  try {
    const saved = localStorage.getItem('mc_settings');
    if (saved) {
      const s = JSON.parse(saved);
      return {
        bike: Number(s.bikePrice) || 3200,
        station: Number(s.stationPrice) || 2400,
        extraHour: Number(s.extraHourPrice) || 380
      };
    }
  } catch (e) {
    console.error(e);
  }
  return { bike: 3200, station: 2400, extraHour: 380 };
};

export const ProposalBuilderView: React.FC<ProposalBuilderViewProps> = ({
  leads,
  currentLeadId,
  onConvertToContract
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    currentLeadId || leads[0]?.id || 'mariana'
  );

  const activeLead = useMemo(() => {
    return leads.find((l) => l.id === selectedLeadId) || leads[0];
  }, [leads, selectedLeadId]);

  // Form State
  const [structure, setStructure] = useState<'bike' | 'tradicional'>(
    activeLead?.structure || 'bike'
  );
  const [guests, setGuests] = useState<number>(activeLead?.guestCount || 180);
  const [hours, setHours] = useState<number>(4);
  const [freight, setFreight] = useState<number>(250);
  const [discountPercent, setDiscountPercent] = useState<number>(5);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingContract, setIsGeneratingContract] = useState(false);

  // Sync state when active lead changes
  useEffect(() => {
    if (activeLead) {
      setStructure(activeLead.structure);
      setGuests(activeLead.guestCount);
    }
  }, [activeLead?.id]);

  // Calculations (base prices come from Configurações, saved locally)
  const pricing = getPricing();
  const baseStructurePrice = structure === 'bike' ? pricing.bike : pricing.station;
  // Extra guest surcharge if > 150 pax
  const extraGuestsFee = guests > 150 ? (guests - 150) * 12 : 0;
  // Extra hours beyond the 4h base
  const extraHoursFee = hours > 4 ? (hours - 4) * pricing.extraHour : 0;
  const subtotal = baseStructurePrice + extraGuestsFee + extraHoursFee;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalValue = subtotal + freight - discountAmount;
  const signalValue = Math.round(totalValue * 0.3);
  const balanceValue = totalValue - signalValue;
  const staffCount = guests > 200 ? 3 : 2;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApplyVipTemplate = () => {
    setStructure('bike');
    setGuests(200);
    setHours(4);
    setDiscountPercent(10);
    setFreight(200);
    showToast('Template VIP aplicado: Bike Retrô + 200 pax + 10% cortesia!');
  };

  const handleConvertContractClick = () => {
    setIsGeneratingContract(true);
    setTimeout(() => {
      setIsGeneratingContract(false);
      onConvertToContract({
        clientName: activeLead?.name || 'Mariana Silva',
        eventType: activeLead?.eventType || 'Casamento Romântico no Campo',
        eventDate: activeLead?.eventDate || '2025-11-14',
        location: activeLead?.location || 'Campinas / SP',
        structure: structure,
        hours: hours,
        totalValue: totalValue,
        signalValue: signalValue
      });
    }, 1000);
  };

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

      {/* Top Utility Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider text-[#6E6762] font-bold">
              Módulo Comercial
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#87a99c]" />
            <span className="text-[11px] text-[#45655a] font-bold">
              Orçamento Ativo #MC-2025-0842
            </span>
          </div>
          <h1 className="font-headline font-semibold text-3xl md:text-4xl text-[#262220] tracking-tight">
            Montador de Propostas Comerciais
          </h1>
          <p className="text-[14px] text-[#6E6762] mt-1">
            Configure os parâmetros técnicos, estação cenográfica e cardápio sensorial com sincronização em tempo real da folha executiva.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => showToast('Versão anterior restaurada com sucesso.')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#eae8e4] text-[#1b1c1a] border border-[#EBE5DB] rounded-full shadow-sm text-[12px] font-bold transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span>Versão Anterior</span>
          </button>
          <button
            onClick={() => showToast('Rascunho comercial salvo no banco de dados.')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#eae8e4] text-[#1b1c1a] border border-[#EBE5DB] rounded-full shadow-sm text-[12px] font-bold transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Salvar Rascunho</span>
          </button>
          <button
            onClick={handleApplyVipTemplate}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#45655a] text-white hover:bg-[#4A6E60] rounded-full shadow-md text-[12px] font-bold transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
            <span>Aplicar Template VIP</span>
          </button>
        </div>
      </div>

      {/* Main Split Architecture */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Proposal Builder & Inputs (7 Columns) */}
        <section className="xl:col-span-7 flex flex-col gap-6">
          {/* 1. Cliente & Detalhes do Evento */}
          <div className="bg-white border border-[#EBE5DB] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#EBE5DB]/50">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#F5E9D7] flex items-center justify-center text-[#7a5826]">
                  <span className="material-symbols-outlined text-[16px]">person_pin</span>
                </span>
                <span className="font-bold text-[16px] text-[#262220]">
                  1. Cliente & Detalhes do Evento
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#c7eadc] text-[#1e3e34] text-[11px] font-bold">
                CRM Sincronizado
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#6E6762] uppercase tracking-wider mb-1">
                  Lead Vinculado
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] text-[#1b1c1a] text-[14px] rounded-xl px-3.5 py-2.5 outline-none appearance-none cursor-pointer focus:bg-white transition-all"
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.eventType})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 text-[#6E6762] pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6E6762] uppercase tracking-wider mb-1">
                  Tipo de Evento
                </label>
                <div className="flex items-center gap-2 bg-[#FDFBF7] border border-[#EBE5DB] px-3.5 py-2.5 rounded-xl">
                  <span className="material-symbols-outlined text-[#874e4f] text-[18px]">
                    favorite
                  </span>
                  <span className="text-[14px] text-[#262220] font-semibold truncate">
                    {activeLead?.eventType || 'Casamento'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6E6762] uppercase tracking-wider mb-1">
                  Data Prevista
                </label>
                <div className="flex items-center gap-2 bg-[#FDFBF7] border border-[#EBE5DB] px-3.5 py-2.5 rounded-xl">
                  <span className="material-symbols-outlined text-[#6E6762] text-[18px]">
                    event
                  </span>
                  <span className="text-[14px] text-[#262220] font-semibold">
                    {activeLead?.eventDate.split('-').reverse().join('/') || '14/11/2025'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6E6762] uppercase tracking-wider mb-1">
                  Localização / Espaço
                </label>
                <div className="flex items-center gap-2 bg-[#FDFBF7] border border-[#EBE5DB] px-3.5 py-2.5 rounded-xl">
                  <span className="material-symbols-outlined text-[#6E6762] text-[18px]">
                    location_on
                  </span>
                  <span className="text-[14px] text-[#262220] font-semibold truncate">
                    {activeLead?.location || 'Fazenda / Buffet'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Estrutura Cenográfica */}
          <div className="bg-white border border-[#EBE5DB] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#EBE5DB]/50">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#DCE7E2] flex items-center justify-center text-[#4A6E60]">
                  <span className="material-symbols-outlined text-[16px]">storefront</span>
                </span>
                <span className="font-bold text-[16px] text-[#262220]">
                  2. Estrutura Cenográfica do Bar de Sorvete
                </span>
              </div>
              <span className="text-[12px] text-[#6E6762]">
                Selecione o modelo do mobiliário
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Estação Tradicional */}
              <div
                onClick={() => setStructure('tradicional')}
                className={`relative group cursor-pointer rounded-2xl p-4 transition-all border ${
                  structure === 'tradicional'
                    ? 'bg-[#c7eadc]/50 border-[#45655a] shadow-md ring-2 ring-[#45655a]/40'
                    : 'bg-[#FDFBF7] border-[#EBE5DB] hover:bg-[#efeeea]'
                }`}
              >
                <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                  <img
                    className="w-full h-full object-cover"
                    alt="Estação Tradicional"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6TMxAaRzLjAyym6u9_ofaqfXZySs1YBLM-KPfWxKcz4OKcmAhr-Vd-qxXRrn7wzwbyC7tJOzMsp600uzuUu01GCiGYhSGiUMouKMYulWOFoMkkyAkOmM2OoC9kxgDH9s4WJwl1Y9_1yw1pjTCjsgEmLiTqPZIkZBbM1d21hKtrcbui-4-ZCnnrvr0gXZ7ztBbljO6RXazuhZ4sbiqyukcNv9I3CMy8tuI1BXGzi0WxxXl_G8eaqyv3A"
                  />
                  <span className="absolute top-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded text-[11px] font-bold">
                    R$ 2.400,00
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-headline font-bold text-lg text-[#262220] leading-tight">
                      Estação Tradicional
                    </h4>
                    <p className="text-[13px] text-[#6E6762] mt-1">
                      Bancada geométrica em carvalho claro e tampo em mármore, perfeita para salões fechados.
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 shrink-0 ${
                      structure === 'tradicional'
                        ? 'bg-[#45655a] text-white'
                        : 'bg-white border border-[#EBE5DB] text-[#c1c8c4]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {structure === 'tradicional' ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bike Retrô */}
              <div
                onClick={() => setStructure('bike')}
                className={`relative group cursor-pointer rounded-2xl p-4 transition-all border ${
                  structure === 'bike'
                    ? 'bg-[#c7eadc]/50 border-[#45655a] shadow-md ring-2 ring-[#45655a]/40'
                    : 'bg-[#FDFBF7] border-[#EBE5DB] hover:bg-[#efeeea]'
                }`}
              >
                <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                  <img
                    className="w-full h-full object-cover"
                    alt="Bike Retrô Cenográfica"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlPmnrJAH3qjSBtzHmZn1vGOETZKzsdI1nI8PKvUge3Zn4F_HNOno3mLsZWWYsfUQNuimTHTXXoIzc4v-vHn15zgzPld8i1MtygbC7Xq6Xfx32Xn-1vK_6CNKjFEkwVPtbTJbijTh4ZLaX5JCzi3MKol1le84GKgGY5Q0HY_AqT_n3WL0gLSg2_Ykxyy90dutvzlXCg-bvAiUAoFQhn9sxON3NccQxo-qDN_O_FdhYo7kofWUmIeqkAg"
                  />
                  <span className="absolute top-2 left-2 bg-[#45655a] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                    R$ 3.200,00
                  </span>
                  <span className="absolute top-2 right-2 bg-[#874e4f] text-white px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[12px]">star</span>
                    Mais Escolhido
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-headline font-bold text-lg text-[#262220] leading-tight">
                      Bike Retrô Cenográfica
                    </h4>
                    <p className="text-[13px] text-[#6E6762] mt-1">
                      Triciclo clássico italiano restaurado com toldo personalizado, lousa de caligrafia e spots quentes.
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 shrink-0 ${
                      structure === 'bike'
                        ? 'bg-[#45655a] text-white'
                        : 'bg-white border border-[#EBE5DB] text-[#c1c8c4]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {structure === 'bike' ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Escopo Operacional & Equipe */}
          <div className="bg-white border border-[#EBE5DB] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#EBE5DB]/50">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#FBE6E6] flex items-center justify-center text-[#8F4E4E]">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                </span>
                <span className="font-bold text-[16px] text-[#262220]">
                  3. Escopo Operacional & Equipe
                </span>
              </div>
              <span className="text-[12px] text-[#6E6762]">
                Dimensionamento automático
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Guests */}
              <div className="p-4 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#6E6762] uppercase">
                    Convidados
                  </span>
                  <span className="material-symbols-outlined text-[#45655a] text-[18px]">
                    groups
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="30"
                    max="1000"
                    step="10"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="font-headline text-2xl font-bold text-[#262220] w-24 bg-transparent border-b border-[#45655a] outline-none"
                  />
                  <span className="text-[13px] text-[#6E6762]">pessoas</span>
                </div>
                <p className="text-[12px] text-[#6E6762] mt-2">
                  Capacidade recomendada de até {Math.round(guests * 1.2)} porções.
                </p>
              </div>

              {/* Duration */}
              <div className="p-4 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#6E6762] uppercase">
                    Tempo de Atendimento
                  </span>
                  <span className="material-symbols-outlined text-[#45655a] text-[18px]">
                    schedule
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="font-headline text-2xl font-bold text-[#262220] bg-transparent border-b border-[#45655a] outline-none cursor-pointer"
                  >
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                  </select>
                  <span className="text-[13px] text-[#6E6762]">horas ininterruptas</span>
                </div>
                <p className="text-[12px] text-[#6E6762] mt-2">
                  Inclui 1h30 de montagem prévia sem custo adicional.
                </p>
              </div>

              {/* Operators */}
              <div className="p-4 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#6E6762] uppercase">
                    Staff / Monitores
                  </span>
                  <span className="material-symbols-outlined text-[#45655a] text-[18px]">
                    badge
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline text-2xl font-bold text-[#262220]">
                    {staffCount}
                  </span>
                  <span className="text-[13px] text-[#6E6762]">operadores</span>
                </div>
                <p className="text-[12px] text-[#6E6762] mt-2">
                  Uniformes em linho fino e avental verde sálvia.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Sabores */}
          <div className="bg-white border border-[#EBE5DB] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#EBE5DB]/50">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#F5E9D7] flex items-center justify-center text-[#7a5826]">
                  <span className="material-symbols-outlined text-[16px]">icecream</span>
                </span>
                <span className="font-bold text-[16px] text-[#262220]">
                  4. Cardápio de Sabores Selecionados (4 Cubas)
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#eae8e4] text-[#414845] font-bold">
                4 de 4 definidos
              </span>
            </div>
            <p className="text-[13px] text-[#6E6762] mb-3">
              Alternativas selecionadas com opções frutadas e inclusivas (sem glúten e sem lactose).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="flex items-center justify-between p-3 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-[#fdb4b3] flex items-center justify-center text-[#7a4344]">
                    <span className="material-symbols-outlined text-[16px]">eco</span>
                  </span>
                  <div>
                    <span className="text-[14px] text-[#262220] block font-bold leading-tight">
                      Morango Silvestre Cremoso
                    </span>
                    <span className="text-[11px] text-[#6E6762]">
                      Acompanha Casquinha Waffle Artesanal
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#DCE7E2] text-[#45655a] text-[11px] font-bold">
                  Clássico
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-[#fdb4b3] flex items-center justify-center text-[#7a4344]">
                    <span className="material-symbols-outlined text-[16px]">spa</span>
                  </span>
                  <div>
                    <span className="text-[14px] text-[#262220] block font-bold leading-tight">
                      Frutas Vermelhas
                    </span>
                    <span className="text-[11px] text-[#874e4f] font-bold">
                      0% Lactose & 100% Vegano
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#FBE6E6] text-[#8F4E4E] text-[11px] font-bold">
                  Inclusivo
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-[#ffddb4] flex items-center justify-center text-[#7a5826]">
                    <span className="material-symbols-outlined text-[16px]">nutrition</span>
                  </span>
                  <div>
                    <span className="text-[14px] text-[#262220] block font-bold leading-tight">
                      Uva Niágara da Serra
                    </span>
                    <span className="text-[11px] text-[#6E6762]">
                      Sorbet refrescante e aromático
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#DCE7E2] text-[#45655a] text-[11px] font-bold">
                  Sorbet
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-[#ffddb4] flex items-center justify-center text-[#7a5826]">
                    <span className="material-symbols-outlined text-[16px]">local_florist</span>
                  </span>
                  <div>
                    <span className="text-[14px] text-[#262220] block font-bold leading-tight">
                      Jabuticaba Nativa Sabará
                    </span>
                    <span className="text-[11px] text-[#6E6762]">
                      Edição Limitada da Estação
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#F5E9D7] text-[#7a5826] text-[11px] font-bold">
                  Assinatura
                </span>
              </div>
            </div>
          </div>

          {/* 5. Coberturas, Logística e Condições */}
          <div className="bg-white border border-[#EBE5DB] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#EBE5DB]/50">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#DCE7E2] flex items-center justify-center text-[#4A6E60]">
                  <span className="material-symbols-outlined text-[16px]">cookie</span>
                </span>
                <span className="font-bold text-[16px] text-[#262220]">
                  5. Coberturas, Logística e Condições
                </span>
              </div>
              <span className="text-[11px] text-[#45655a] font-bold">
                Tabela Oficial 2025
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-[#6E6762] uppercase tracking-wider mb-2">
                  Toppings Inclusos no Pacote
                </label>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#EBE5DB] text-[#262220] rounded-full text-[12px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#45655a]">
                      done
                    </span>{' '}
                    Chocoball Crocante
                  </span>
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#EBE5DB] text-[#262220] rounded-full text-[12px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#45655a]">
                      done
                    </span>{' '}
                    Calda Quente Belga
                  </span>
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#EBE5DB] text-[#262220] rounded-full text-[12px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#45655a]">
                      done
                    </span>{' '}
                    Calda Artesanal de Morango
                  </span>
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#EBE5DB] text-[#262220] rounded-full text-[12px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#45655a]">
                      done
                    </span>{' '}
                    Farofa de Castanhas
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6E6762] uppercase tracking-wider mb-1">
                    Frete / Deslocamento Técnico (R$)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      className="w-full bg-[#FDFBF7] border border-[#EBE5DB] text-[#262220] font-bold text-[15px] rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#45655a]/30"
                      type="number"
                      step="50"
                      value={freight}
                      onChange={(e) => setFreight(Number(e.target.value))}
                    />
                    <span className="text-[12px] text-[#6E6762] whitespace-nowrap">
                      {activeLead?.city || 'Campinas / SP'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6E6762] uppercase tracking-wider mb-1">
                    Desconto Comercial
                  </label>
                  <select
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] text-[#262220] text-[13px] rounded-xl px-3 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-[#45655a]/30"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  >
                    <option value={5}>5% Especial (Fechamento à Vista ou PIX)</option>
                    <option value={10}>10% Cortesia Parceria Assessoria</option>
                    <option value={0}>0% Sem desconto aplicado</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#45655a] text-[20px]">
                  verified
                </span>
                <span className="text-[13px] text-[#414845] font-medium">
                  Personalização inclusa: Pás sustentáveis de bambu e copos com monograma dos noivos.
                </span>
              </div>
              <span className="text-[11px] text-[#45655a] font-bold uppercase tracking-wider">
                Sem Custo Extra
              </span>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Live A4 Executive Proposal Sheet (5 Columns) */}
        <aside className="xl:col-span-5 flex flex-col gap-4 sticky top-24">
          {/* Preview Action Floating Bar */}
          <div className="bg-white border border-[#EBE5DB] rounded-2xl p-2.5 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-2 pl-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#45655a] animate-pulse" />
              <span className="text-[11px] uppercase tracking-wider text-[#6E6762] font-bold">
                Folha A4 Executiva Sincronizada
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('Link da proposta copiado para a área de transferência!');
                }}
                className="p-1.5 rounded-full hover:bg-[#eae8e4] text-[#6E6762] hover:text-[#1b1c1a] transition-colors"
                title="Copiar Link"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">link</span>
              </button>
              <a
                className="p-1.5 rounded-full hover:bg-[#DCE7E2] text-[#45655a] transition-colors"
                href={`https://wa.me/55${(activeLead?.phone || '').replace(
                  /\D/g,
                  ''
                )}?text=Ol%C3%A1%20${encodeURIComponent(
                  activeLead?.name || ''
                )}!%20Sua%20proposta%20personalizada%20da%20Memory%20Cream%20est%C3%A1%20pronta!%20Valor%20total:%20R$%20${totalValue.toLocaleString(
                  'pt-BR'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Enviar no WhatsApp"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </a>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#45655a] text-white hover:bg-[#4A6E60] text-[12px] font-bold shadow-sm transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Baixar PDF</span>
              </button>
            </div>
          </div>

          {/* A4 Sheet Simulation Canvas */}
          <div className="bg-white border border-[#EBE5DB] rounded-2xl shadow-xl overflow-hidden relative">
            {/* Top Accent Strip */}
            <div className="h-2 bg-gradient-to-r from-[#45655a] via-[#87a99c] to-[#874e4f]" />

            <div className="p-6 flex flex-col gap-5 text-[#262220]">
              {/* Proposal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#EBE5DB]/60">
                <div>
                  <h2 className="font-headline text-2xl font-bold text-[#45655a] leading-tight">
                    Memory Cream
                  </h2>
                  <span className="text-[10px] uppercase tracking-widest text-[#6E6762] block mt-0.5">
                    Alta Confeitaria em Eventos
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-[#eae8e4] text-[10px] font-bold text-[#6E6762] block">
                    PROPOSTA #MC-2025-0842
                  </span>
                  <span className="text-[11px] text-[#6E6762] block mt-0.5">
                    Validade: 7 dias corridos
                  </span>
                </div>
              </div>

              {/* Client Card Inside PDF */}
              <div className="p-3.5 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] uppercase text-[#6E6762] block">
                      Apresentado a:
                    </span>
                    <span className="font-bold text-[15px] text-[#262220] block">
                      {activeLead?.name || 'Mariana Silva'}
                    </span>
                    <span className="text-[12px] text-[#6E6762] block">
                      {activeLead?.eventType || 'Casamento Exclusivo'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[#6E6762] block">
                      Data & Local:
                    </span>
                    <span className="font-bold text-[15px] text-[#262220] block">
                      {activeLead?.eventDate.split('-').reverse().join('.') || '14.11.2025'}
                    </span>
                    <span className="text-[12px] text-[#6E6762] block">
                      {activeLead?.city || 'Campinas / SP'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Package Summary Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-headline font-bold text-lg text-[#262220]">
                    Configuração Selecionada
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#c7eadc] text-[#1e3e34] text-[11px] font-bold">
                    {structure === 'bike' ? 'Estação Premium' : 'Estação Tradicional'}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl mb-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#EBE5DB]">
                    <img
                      className="w-full h-full object-cover"
                      alt="Miniatura Cart"
                      src={
                        structure === 'bike'
                          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB3Xu_9n00LI-4FVwwwhi6wFzrPjOQo-IRTPIisFzFevQqLZvgcG9Llt8Yy7M-S07PB6RPjvnB3fNzsULud_TQUoPRymXTdTl92C00xAhoItboS92ghT9gtkPCxjwRgYJMFYJRE_Dx4f5T2MSTl5wJgOkrf0PCchXdYdl4keCIHZtDO4cnB0sguNJu-iX2Fs1adSYH2yz74KmgEp_zH6apPGR_Y11H42rrQdONPGFYnTN-NY3QnXQvUQ'
                          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6TMxAaRzLjAyym6u9_ofaqfXZySs1YBLM-KPfWxKcz4OKcmAhr-Vd-qxXRrn7wzwbyC7tJOzMsp600uzuUu01GCiGYhSGiUMouKMYulWOFoMkkyAkOmM2OoC9kxgDH9s4WJwl1Y9_1yw1pjTCjsgEmLiTqPZIkZBbM1d21hKtrcbui-4-ZCnnrvr0gXZ7ztBbljO6RXazuhZ4sbiqyukcNv9I3CMy8tuI1BXGzi0WxxXl_G8eaqyv3A'
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[14px] text-[#262220] truncate">
                      {structure === 'bike'
                        ? 'Bike Retrô Cenográfica'
                        : 'Estação Tradicional de Balcão'}
                    </h4>
                    <p className="text-[12px] text-[#6E6762] mt-0.5">
                      Atendimento de {guests} convidados durante {hours} horas contínuas com {staffCount} operadores certificados.
                    </p>
                  </div>
                </div>

                {/* Bulleted Inclusions */}
                <div className="space-y-1.5 text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#45655a] text-[16px]">
                      check
                    </span>
                    <span>Sorvete e sorbet artesanais à vontade servidos na hora</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#45655a] text-[16px]">
                      check
                    </span>
                    <span>Casquinhas crocantes assadas no dia e copinhos ecológicos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#45655a] text-[16px]">
                      check
                    </span>
                    <span>4 Sabores selecionados (incluso opções sem lactose)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#45655a] text-[16px]">
                      check
                    </span>
                    <span>Bar completo de coberturas belgas quentes e crocantes finos</span>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl text-[13px]">
                <span className="text-[10px] uppercase tracking-wider text-[#6E6762] font-bold block mb-2">
                  Discriminação de Investimento
                </span>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6E6762]">
                      {structure === 'bike' ? 'Bike Retrô' : 'Estação Tradicional'} ({guests} pax / {hours}h)
                    </span>
                    <span className="font-semibold text-[#262220]">
                      R$ {subtotal.toLocaleString('pt-BR')},00
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6E6762]">
                      Deslocamento Técnico ({activeLead?.city || 'Região'})
                    </span>
                    <span className="font-semibold text-[#262220]">
                      + R$ {freight.toLocaleString('pt-BR')},00
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-[#874e4f]">
                      <span>Desconto Cortesia ({discountPercent}%)</span>
                      <span className="font-bold">
                        - R$ {discountAmount.toLocaleString('pt-BR')},00
                      </span>
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t border-[#EBE5DB] flex items-baseline justify-between">
                    <div>
                      <span className="font-headline font-bold text-lg text-[#262220] block">
                        Valor Total
                      </span>
                      <span className="text-[11px] text-[#6E6762]">
                        Proposta com validade de 7 dias
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-headline text-2xl font-bold text-[#45655a] block">
                        R$ {totalValue.toLocaleString('pt-BR')},00
                      </span>
                      <span className="text-[11px] text-[#6E6762]">à vista via PIX</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Condition */}
              <div className="p-3 bg-[#F5E9D7]/60 border border-[#c49a62]/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7a5826] text-[18px]">
                    credit_card
                  </span>
                  <span className="text-[12px] text-[#7a5826] font-bold">
                    Condição Facilitada:
                  </span>
                </div>
                <span className="text-[12px] text-[#7a5826] font-semibold">
                  Entrada 30% (R$ {signalValue.toLocaleString('pt-BR')},00) + saldo (R$ {balanceValue.toLocaleString('pt-BR')},00)
                </span>
              </div>

              {/* Signatory Disclaimer */}
              <div className="flex items-center justify-between text-[#6E6762] text-[11px] pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#45655a]">
                    verified_user
                  </span>
                  <span>Certificado de Higiene Sanitária & Selo Verde</span>
                </div>
                <span className="italic">Memory Cream Catering Ltda.</span>
              </div>
            </div>

            {/* Bottom Proposal Action */}
            <div className="p-4 bg-[#efeeea] border-t border-[#EBE5DB] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#6E6762]">Pronto para formalizar?</span>
                <span className="text-[13px] text-[#262220] font-bold">
                  Gere o contrato com 1 clique
                </span>
              </div>
              <button
                onClick={handleConvertContractClick}
                disabled={isGeneratingContract}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#45655a] text-white hover:bg-[#4A6E60] rounded-full shadow-md text-[13px] font-bold transition-all disabled:opacity-50"
                type="button"
              >
                {isGeneratingContract ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">
                      sync
                    </span>
                    <span>Gerando Minuta...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">draw</span>
                    <span>Transformar em Contrato</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl p-3.5 flex items-start gap-2.5 shadow-sm">
            <span className="material-symbols-outlined text-[#45655a] text-[20px] mt-0.5">
              lightbulb
            </span>
            <p className="text-[12px] text-[#6E6762] leading-relaxed">
              <strong className="text-[#262220]">Dica de Conversão:</strong> Propostas enviadas com a foto da Bike Retrô têm{' '}
              <span className="text-[#45655a] font-bold">78% de taxa de aceite</span> no segmento de casamentos em Campinas e Grande São Paulo.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
