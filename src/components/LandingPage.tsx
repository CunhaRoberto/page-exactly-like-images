import React, { useState } from 'react';
import { Lead } from '../types';
import { LOGO_URL } from './Sidebar';

interface LandingPageProps {
  onOpenAdmin: () => void;
  onAddLeadFromWebsite: (newLead: Lead) => Promise<void>;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAdmin,
  onAddLeadFromWebsite
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [modelSelect, setModelSelect] = useState('Estação com Bike Retrô');
  const [cepLocation, setCepLocation] = useState('');
  const [observations, setObservations] = useState('');
  const [veganRequested, setVeganRequested] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    const newId = 'lead-' + Date.now();
    const paxByRange: Record<string, number> = {
      'Até 50 pessoas': 50,
      '50 a 100 pessoas': 100,
      '100 a 200 pessoas': 200,
      '200 a 350 pessoas': 350,
      'Acima de 350 pessoas': 400
    };
    const parsedPax = paxByRange[guestCount] ?? 100;

    const newLead: Lead = {
      id: newId,
      leadCode: `#MC-${Math.floor(843 + Math.random() * 50)}`,
      name: fullName,
      eventType: eventType || 'Casamento',
      eventDate: eventDate || '2025-11-25',
      guestCount: parsedPax,
      location: cepLocation || 'São Paulo / SP',
      city: cepLocation.split(',')[0]?.trim() || 'São Paulo / SP',
      structure: modelSelect.includes('Bike') ? 'bike' : 'tradicional',
      status: 'novo',
      phone: phone,
      email: email,
      notes: observations,
      preferredFlavors: [],
      veganRequested,
      receivedAt: 'Agora pelo site',
      avatarText: fullName.substring(0, 2).toUpperCase(),
      avatarColor: 'bg-[#87a99c] text-[#1e3e34]',
      checklist: {
        dataAgenda: false,
        logistica: false,
        propostaEnviada: false,
        degustacao: false
      },
      proposalAmount: modelSelect.includes('Bike') ? 3200 : 2400
    };

    try {
      await onAddLeadFromWebsite(newLead);
      setSubmittedLeadId(newId);
      setFormSubmitted(true);
    } catch {
      setSubmitError('Não foi possível enviar seu pedido. Seus dados continuam preenchidos; tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToQuote = (modelName?: string) => {
    if (modelName) setModelSelect(modelName);
    const el = document.getElementById('orcamento');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen text-[#1b1c1a] antialiased">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-[#fbf9f5]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(38,34,32,0.04)] border-b border-[#EBE5DB]">
        <div className="h-20 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              alt="Memory Cream Logo"
              className="h-8 w-auto object-contain"
              src={LOGO_URL}
            />
            <span className="font-headline font-semibold text-xl text-[#1b1c1a] tracking-tight hidden sm:inline-block">
              Memory Cream
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-[14px] font-bold text-[#414845]">
            <a href="#inicio" className="hover:text-[#45655a] transition-colors">
              Início
            </a>
            <a href="#sobre" className="hover:text-[#45655a] transition-colors">
              Sobre
            </a>
            <a href="#modelos" className="hover:text-[#45655a] transition-colors">
              Modelos & Estrutura
            </a>
            <a href="#sabores" className="hover:text-[#45655a] transition-colors">
              Sabores
            </a>
            <a href="#diferenciais" className="hover:text-[#45655a] transition-colors">
              Diferenciais
            </a>
            <a href="#como-funciona" className="hover:text-[#45655a] transition-colors">
              Como Funciona
            </a>
            <a href="#orcamento" className="hover:text-[#45655a] transition-colors">
              Contato
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToQuote()}
              className="inline-flex items-center justify-center bg-[#fdb4b3] text-[#360d10] hover:bg-[#874e4f] hover:text-white font-bold text-[13px] px-5 py-2.5 rounded-full transition-all shadow-sm hover:scale-[1.02]"
              type="button"
            >
              Pedir Orçamento
            </button>

            {/* Back-Office Access Button */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 bg-[#45655a] hover:bg-[#4A6E60] text-white px-3.5 py-2 rounded-full text-[12px] font-bold shadow-md transition-all"
              title="Acessar o Back-Office Administrativo & CRM"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span className="hidden sm:inline">Painel Back-Office</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-20" id="inicio">
        {/* HERO SECTION */}
        <section className="relative w-full overflow-hidden bg-[#FDFBF7] pt-12 pb-20 border-b border-[#EBE5DB]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Text Column */}
              <div className="lg:col-span-7 flex flex-col items-start gap-4">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F5E9D7] text-[#7a5826] border border-[#c49a62]/20">
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Experiência em Eventos & Celebrações
                  </span>
                </div>

                <h1 className="font-headline font-bold text-4xl sm:text-5xl lg:text-6xl text-[#262220] max-w-2xl leading-[1.15]">
                  Sorvete à vontade para tornar seu evento inesquecível!
                </h1>

                <p className="text-[16px] md:text-[18px] text-[#6E6762] max-w-xl leading-relaxed">
                  Com a <strong className="text-[#4A6E60]">MEMORY CREAM</strong>, o seu evento ganha uma atração única: sorvete soft americano servido à vontade. Cuidamos de toda a montagem, maquinário e operação com hospitalidade e afeto.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => scrollToQuote()}
                    className="inline-flex items-center justify-center gap-2 bg-[#fdb4b3] text-[#360d10] hover:bg-[#874e4f] hover:text-white font-bold text-[14px] px-6 py-3.5 rounded-full shadow-md transition-all hover:scale-[1.02]"
                    type="button"
                  >
                    <span>Planeje seu evento</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                  <a
                    href="#modelos"
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#4A6E60] hover:bg-[#DCE7E2] border border-[#EBE5DB] font-bold text-[14px] px-6 py-3.5 rounded-full shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">icecream</span>
                    <span>Conhecer Estrutura & Modelos</span>
                  </a>
                </div>

                {/* Proof Metrics Strip */}
                <div className="grid grid-cols-3 gap-3 pt-6 w-full max-w-xl">
                  <div className="flex flex-col p-3 rounded-2xl bg-white border border-[#EBE5DB] shadow-sm">
                    <span className="font-headline text-2xl font-bold text-[#4A6E60]">+500</span>
                    <span className="text-[12px] text-[#6E6762]">Eventos realizados</span>
                  </div>
                  <div className="flex flex-col p-3 rounded-2xl bg-white border border-[#EBE5DB] shadow-sm">
                    <span className="font-headline text-2xl font-bold text-[#8F4E4E]">100%</span>
                    <span className="text-[12px] text-[#6E6762]">Sorvete à vontade</span>
                  </div>
                  <div className="flex flex-col p-3 rounded-2xl bg-white border border-[#EBE5DB] shadow-sm">
                    <span className="font-headline text-2xl font-bold text-[#7a5826]">Premium</span>
                    <span className="text-[12px] text-[#6E6762]">Estrutura completa</span>
                  </div>
                </div>
              </div>

              {/* Visual Hero Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative rounded-3xl overflow-hidden bg-white border border-[#EBE5DB] shadow-xl p-2.5">
                    <div className="rounded-2xl overflow-hidden aspect-[4/5] relative">
                      <img
                        className="w-full h-full object-cover"
                        alt="Criança feliz com sorvete artesanal Memory Cream em celebração"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmsIvNOg-ccKsrOJvhuZhZ9kG8w28B5kWSQtEs8pFRO4U07xQstUD7Fmjlw9jvsuYvrKa0kx1p79droLJ92QJFgtEktIxYHj_pHiH2LqOxILHhlt4OmwweagVBs0zHoeDWliBLRt00f0DLIPhSdGDEgK0tbM-K_RbeSCGbzLdV2rYJdk5ohYnmvC2l_fcm9nQ3cPUSGcsBpy0yYdFB9lIYT1vN4PzyuxUyEOcoZ0AXrGIlgG_LnFpviA"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/30 backdrop-blur-md text-white text-[12px] font-bold mb-1">
                          <span className="material-symbols-outlined text-[14px]">favorite</span>
                          Momentos Memoráveis
                        </div>
                        <p className="font-headline font-bold text-xl text-white drop-shadow">
                          Alegria servida na casquinha
                        </p>
                      </div>
                    </div>

                    {/* Floating Micro-Card */}
                    <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-3 bg-white border border-[#EBE5DB] p-3 rounded-2xl shadow-xl">
                      <div className="w-10 h-10 rounded-xl bg-[#DCE7E2] flex items-center justify-center text-[#4A6E60]">
                        <span className="material-symbols-outlined text-[24px]">bakery_dining</span>
                      </div>
                      <div>
                        <p className="font-bold text-[13px] text-[#262220]">Casquinhas Crocantes</p>
                        <p className="text-[11px] text-[#6E6762]">Produção artesanal diária</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EVENT TYPES SECTION */}
        <section className="w-full py-20 bg-[#fbf9f5]" id="sobre">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[12px] font-bold text-[#45655a] uppercase tracking-wider">
                Celebrações Exclusivas
              </span>
              <h2 className="font-headline font-bold text-3xl sm:text-4xl text-[#262220] mt-1">
                Perfeito para todo tipo de evento
              </h2>
              <p className="text-[15px] text-[#6E6762] mt-2">
                Levamos nossa estrutura completa para onde você precisar, combinando com o estilo da sua festa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Debutantes */}
              <div className="p-6 rounded-2xl bg-[#FBE6E6]/60 border border-[#EBE5DB] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#8F4E4E] mb-4">
                  <span className="material-symbols-outlined text-[28px]">crown</span>
                </div>
                <h3 className="font-headline font-bold text-xl text-[#262220] mb-2">Debutantes</h3>
                <p className="text-[13px] text-[#6E6762] leading-relaxed">
                  A sofisticação ideal para tornar o seu grande baile ainda mais memorável para amigos e familiares.
                </p>
              </div>

              {/* Formatura */}
              <div className="p-6 rounded-2xl bg-[#DCE7E2]/60 border border-[#EBE5DB] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#4A6E60] mb-4">
                  <span className="material-symbols-outlined text-[28px]">school</span>
                </div>
                <h3 className="font-headline font-bold text-xl text-[#262220] mb-2">Formatura</h3>
                <p className="text-[13px] text-[#6E6762] leading-relaxed">
                  O brinde perfeito ao sucesso, celebrando conquistas especiais com muito sabor e requinte visual.
                </p>
              </div>

              {/* Festa Infantil */}
              <div className="p-6 rounded-2xl bg-[#F5E9D7]/70 border border-[#EBE5DB] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#7a5826] mb-4">
                  <span className="material-symbols-outlined text-[28px]">celebration</span>
                </div>
                <h3 className="font-headline font-bold text-xl text-[#262220] mb-2">Festa Infantil</h3>
                <p className="text-[13px] text-[#6E6762] leading-relaxed">
                  Alegria contagiante em uma experiência lúdica pensada com carinho para os pequenos e grandes.
                </p>
              </div>

              {/* Corporativo */}
              <div className="p-6 rounded-2xl bg-white border border-[#EBE5DB] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#f5f3ef] shadow-sm flex items-center justify-center text-[#45655a] mb-4">
                  <span className="material-symbols-outlined text-[28px]">apartment</span>
                </div>
                <h3 className="font-headline font-bold text-xl text-[#262220] mb-2">Corporativo</h3>
                <p className="text-[13px] text-[#6E6762] leading-relaxed">
                  Proporcione pausas inspiradoras e networking qualificado com uma atração gourmet sofisticada.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATION MODELS SECTION */}
        <section className="w-full py-20 bg-[#FDFBF7] border-y border-[#EBE5DB]" id="modelos">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[12px] font-bold text-[#45655a] uppercase tracking-wider">
                Design & Cenografia
              </span>
              <h2 className="font-headline font-bold text-3xl sm:text-4xl text-[#262220] mt-1">
                Conheça os nossos modelos
              </h2>
              <p className="text-[15px] text-[#6E6762] mt-2">
                Escolha a estrutura que se harmoniza perfeitamente com a proposta e o espaço do seu evento.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Model 1: Tradicional */}
              <div className="bg-white border border-[#EBE5DB] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-[#efeeea] mb-4 relative">
                  <img
                    className="w-full h-full object-cover"
                    alt="Estação Tradicional"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKq59tjI4Mbub_R3w7QyLXKDsny01pObSk9v-1qDU0nCuw0Qj3PhutckJ6nJVY6I3Soddiro_S8OzfoQQSzffFiJCAkKG0dsdJ9YQtdNcLzerF6B1ZUadiwQnXBBJ1EehKWgQL1G3hRm03DpdKzU4a_gJnBfoTIXWGu6GnaW9wdnRzu-9Mtq6nomBFO7s4lz43Yn9bvl3ZLeLlAcpDIjjdBoMecKHMCaZovM3zXuHuzUm_xNMVX1CEbg"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-[#4A6E60] font-bold text-[11px]">
                    Design Versátil
                  </div>
                </div>

                <div className="p-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-headline font-bold text-2xl text-[#262220]">
                        Estação Tradicional
                      </h3>
                      <span className="text-[11px] font-bold bg-[#DCE7E2] text-[#4A6E60] px-3 py-1 rounded-full">
                        Espaços Internos / Salões
                      </span>
                    </div>
                    <p className="text-[14px] text-[#6E6762] mb-4 leading-relaxed">
                      Design clean, minimalista e sofisticado. Integra-se com elegância a qualquer estilo de decoração, seja no campo, praia ou salão clássico. Conta com bancada em madeira clara, dispensador premium e operação ágil.
                    </p>
                    <ul className="space-y-2 mb-6 text-[#414845] text-[13px]">
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4A6E60] text-[18px]">
                          check_circle
                        </span>
                        <span>Ocupação compacta (requer apenas ponto elétrico comum 220V)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4A6E60] text-[18px]">
                          check_circle
                        </span>
                        <span>Dispenser vertical com 6 tubos para confeitos e coberturas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4A6E60] text-[18px]">
                          check_circle
                        </span>
                        <span>Atendimento contínuo com operadores capacitados</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => scrollToQuote('Estação Tradicional')}
                    className="w-full text-center py-3 rounded-full bg-[#efeeea] text-[#1b1c1a] hover:bg-[#DCE7E2] hover:text-[#4A6E60] font-bold text-[13px] transition-all"
                    type="button"
                  >
                    Consultar Disponibilidade deste Modelo
                  </button>
                </div>
              </div>

              {/* Model 2: Bike Retrô */}
              <div className="bg-white border border-[#EBE5DB] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-[#efeeea] mb-4 relative">
                  <img
                    className="w-full h-full object-cover"
                    alt="Estação com Bike Retrô"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgFa1CrMOaGsc9aQ_KQ1uesxlIQyX6uOJw4tALwDPDZQEzGqMRntD3aNV2SeJDn2jiPeWL3zPY7MkTm_4jt-eEQB4Q-iRSA08lfqwss2Q5sClow3DbNh-tDxArlMTwbKQ-bFPMVJfthsiTOVo0QZvce7lv2vzAcLrMzqo9Q6UkQs2W5EjkFbnTn26zl1nXnLa-6fM7S8S3sULGyJ74E1bkCWNBOS1H0friHcTBMkcnXJK-n6Vkq0CYaA"
                  />
                  <div className="absolute top-4 left-4 bg-[#fdb4b3]/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-[#7a4344] font-bold text-[11px]">
                    Cenográfico & Charmoso
                  </div>
                </div>

                <div className="p-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-headline font-bold text-2xl text-[#262220]">
                        Estação com Bike Retrô
                      </h3>
                      <span className="text-[11px] font-bold bg-[#FBE6E6] text-[#8F4E4E] px-3 py-1 rounded-full">
                        Queridinho para Fotos
                      </span>
                    </div>
                    <p className="text-[14px] text-[#6E6762] mb-4 leading-relaxed">
                      Design exclusivo estilo bike vintage europeia, unindo charme visual único e praticidade operacional. Um verdadeiro cenário interativo que atrai olhares e rende registros fotográficos espetaculares.
                    </p>
                    <ul className="space-y-2 mb-6 text-[#414845] text-[13px]">
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#874e4f] text-[18px]">
                          check_circle
                        </span>
                        <span>Bicicleta cenográfica acoplada com acabamento retrô artesanal</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#874e4f] text-[18px]">
                          check_circle
                        </span>
                        <span>Excelente impacto visual na entrada ou lounges ao ar livre</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#874e4f] text-[18px]">
                          check_circle
                        </span>
                        <span>Inclui decoração floral sutil e ambientação temática</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => scrollToQuote('Estação com Bike Retrô')}
                    className="w-full text-center py-3 rounded-full bg-[#fdb4b3] text-[#360d10] hover:bg-[#874e4f] hover:text-white font-bold text-[13px] transition-all"
                    type="button"
                  >
                    Consultar Disponibilidade da Bike
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DIFFERENTIALS */}
        <section className="w-full py-20 bg-[#fbf9f5]" id="diferenciais">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[12px] font-bold text-[#45655a] uppercase tracking-wider">
                Cuidado em Cada Detalhe
              </span>
              <h2 className="font-headline font-bold text-3xl sm:text-4xl text-[#262220] mt-1">
                Diferenciais Exclusivos
              </h2>
              <p className="text-[15px] text-[#6E6762] mt-2">
                Segurança alimentar, inclusão e sabor inigualável em uma experiência pensada para todos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-6 rounded-2xl bg-white border border-[#EBE5DB] shadow-sm text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#DCE7E2] flex items-center justify-center text-[#4A6E60] mb-3">
                  <span className="material-symbols-outlined text-[24px]">eco</span>
                </div>
                <h4 className="font-headline font-bold text-lg text-[#262220] mb-1">Sem Gordura</h4>
                <p className="text-[12px] text-[#6E6762]">
                  Opções leves e refrescantes, feitas à base de água e polpas selecionadas.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#EBE5DB] shadow-sm text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#FBE6E6] flex items-center justify-center text-[#8F4E4E] mb-3">
                  <span className="material-symbols-outlined text-[24px]">grain</span>
                </div>
                <h4 className="font-headline font-bold text-lg text-[#262220] mb-1">Sem Glúten</h4>
                <p className="text-[12px] text-[#6E6762]">
                  Delicioso e seguro para que todos os convidados celíacos aproveitem sem medo.
                </p>
              </div>

              {/* Featured: Sorvete à Vontade */}
              <div className="p-6 rounded-2xl bg-[#4A6E60] text-white shadow-md text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white mb-3">
                  <span className="material-symbols-outlined text-[24px]">all_inclusive</span>
                </div>
                <h4 className="font-headline font-bold text-lg text-white mb-1">Sorvete à Vontade</h4>
                <p className="text-[12px] text-[#DCE7E2]">
                  Sem cotas nem restrições: experiência doce ilimitada durante todo o serviço.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#EBE5DB] shadow-sm text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#F5E9D7] flex items-center justify-center text-[#7a5826] mb-3">
                  <span className="material-symbols-outlined text-[24px]">water_drop</span>
                </div>
                <h4 className="font-headline font-bold text-lg text-[#262220] mb-1">0% Lactose</h4>
                <p className="text-[12px] text-[#6E6762]">
                  Sabores frutados e formulações especiais sem leite para total inclusão.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#EBE5DB] shadow-sm text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#eae8e4] flex items-center justify-center text-[#45655a] mb-3">
                  <span className="material-symbols-outlined text-[24px]">room_service</span>
                </div>
                <h4 className="font-headline font-bold text-lg text-[#262220] mb-1">Staff Uniformizado</h4>
                <p className="text-[12px] text-[#6E6762]">
                  Monitores treinados realizam o serviço com avental temático e cordialidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FLAVORS & MENU SHOWCASE */}
        <section className="w-full py-20 bg-[#FDFBF7] border-y border-[#EBE5DB]" id="sabores">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div>
                  <span className="text-[12px] font-bold text-[#45655a] uppercase tracking-wider">
                    Cardápio & Combinações
                  </span>
                  <h2 className="font-headline font-bold text-3xl sm:text-4xl text-[#262220] mt-1">
                    Nossos Sorvetes & Coberturas
                  </h2>
                  <p className="text-[15px] text-[#6E6762] mt-2 leading-relaxed">
                    Sorvetes leves, cremosos e irresistíveis. Nosso cardápio conta com opções consagradas e frutadas para surpreender seus convidados em uma experiência refrescante.
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-[#6E6762] uppercase tracking-wider block mb-3">
                    Sabores Favoritos dos Eventos:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#FBE6E6] text-[#8F4E4E] font-bold text-[13px] border border-[#EBE5DB] shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#8F4E4E]" /> Morango
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-white text-[#262220] font-bold text-[13px] border border-[#EBE5DB] shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400" /> Uva
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-white text-[#262220] font-bold text-[13px] border border-[#EBE5DB] shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-400" /> Chiclete
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-white text-[#262220] font-bold text-[13px] border border-[#EBE5DB] shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> Abacaxi
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-white text-[#262220] font-bold text-[13px] border border-[#EBE5DB] shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" /> Groselha Azul
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-white text-[#262220] font-bold text-[13px] border border-[#EBE5DB] shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" /> Maracujá
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-[#DCE7E2] text-[#4A6E60] font-bold text-[13px] border border-[#EBE5DB] shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#4A6E60]" /> Limão Refrescante
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-white text-[#262220] font-bold text-[13px] border border-[#EBE5DB] shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-900" /> Jabuticaba
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-[#F5E9D7] text-[#7a5826] font-bold text-[13px] border border-[#EBE5DB] shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#7a5826]" /> Milho Verde
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-[#FBE6E6] text-[#8F4E4E] font-bold text-[13px] border border-[#EBE5DB] shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500" /> Frutas Vermelhas
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-[#EBE5DB] shadow-sm flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#7a5826] text-[24px]">grain</span>
                    <div>
                      <p className="font-bold text-[14px] text-[#262220]">Toppings & Confeitos</p>
                      <p className="text-[12px] text-[#6E6762]">Chocoball, granulados coloridos, amendoim triturado, marshmallow e confetes.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#EBE5DB] shadow-sm flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#874e4f] text-[24px]">liquor</span>
                    <div>
                      <p className="font-bold text-[14px] text-[#262220]">Caldas Especiais</p>
                      <p className="text-[12px] text-[#6E6762]">Chocolate nobre, morango silvestre, caramelo artesanal e leite condensado.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Photography Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden bg-white border border-[#EBE5DB] shadow-xl p-2.5">
                  <div className="rounded-2xl overflow-hidden aspect-[3/4] relative">
                    <img
                      className="w-full h-full object-cover"
                      alt="Casquinha personalizada de gelato Memory Cream"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrStSrf_R3W2GHl2WB5DLjRA1H4VV4pu2kIZ0xkTLnwFEqqXuIywqIod2MVUiJuxNXu3UISZ1FK3K7l3zBJeoFSSE0uYapDO13GEqkoEVQmqjkcc85AAsgvb_y-oMvhyhpToE9D0G-zIH1rhViZWm427UwHibYZ2i4HgHInihSUe-SiKijwrUNf6roTTqlge80_d5s5EUpgKy8d8OImW7xrH_uT9pcoxMj7tfylCi_OLu88Y30RGFCOg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <span className="text-[11px] uppercase tracking-wider text-[#F5E9D7] font-bold">
                        Casquinha Personalizada
                      </span>
                      <p className="font-headline font-bold text-2xl text-white mt-1">
                        Sabor inigualável em cada detalhe
                      </p>
                      <p className="text-[13px] text-white/90">Apresentação fotogênica que encanta os convidados.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="w-full py-20 bg-[#fbf9f5]" id="como-funciona">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[12px] font-bold text-[#45655a] uppercase tracking-wider">
                Sem Complicações
              </span>
              <h2 className="font-headline font-bold text-3xl sm:text-4xl text-[#262220] mt-1">
                Como Funciona?
              </h2>
              <p className="text-[15px] text-[#6E6762] mt-2">
                Cuidamos de tudo para que sua única preocupação seja aproveitar a festa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-[#EBE5DB] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#DCE7E2] text-[#4A6E60] font-bold flex items-center justify-center mb-4">
                  1
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] flex items-center justify-center text-[#4A6E60] mb-3">
                  <span className="material-symbols-outlined text-[26px]">chat</span>
                </div>
                <h3 className="font-headline font-bold text-lg text-[#262220] mb-1">Entre em Contato</h3>
                <p className="text-[13px] text-[#6E6762] leading-relaxed">
                  Envie uma mensagem pelo WhatsApp ou preencha o formulário informando a data, local e número estimado de convidados.
                </p>
              </div>

              <div className="bg-white border border-[#EBE5DB] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#FBE6E6] text-[#8F4E4E] font-bold flex items-center justify-center mb-4">
                  2
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] flex items-center justify-center text-[#874e4f] mb-3">
                  <span className="material-symbols-outlined text-[26px]">tune</span>
                </div>
                <h3 className="font-headline font-bold text-lg text-[#262220] mb-1">Personalize</h3>
                <p className="text-[13px] text-[#6E6762] leading-relaxed">
                  Escolha o modelo de estação (Tradicional ou Bike Retrô), seus sabores favoritos e o mix de coberturas para seu evento.
                </p>
              </div>

              <div className="bg-white border border-[#EBE5DB] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#F5E9D7] text-[#7a5826] font-bold flex items-center justify-center mb-4">
                  3
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] flex items-center justify-center text-[#7a5826] mb-3">
                  <span className="material-symbols-outlined text-[26px]">sentiment_very_satisfied</span>
                </div>
                <h3 className="font-headline font-bold text-lg text-[#262220] mb-1">Aproveite Sem Limites</h3>
                <p className="text-[13px] text-[#6E6762] leading-relaxed">
                  Nossa equipe chega com antecedência, monta a estrutura completa, serve sorvete cremoso à vontade e desmonta tudo ao final.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE BOOKING FORM */}
        <section className="w-full py-20 bg-[#FDFBF7] border-t border-[#EBE5DB]" id="orcamento">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[12px] font-bold text-[#874e4f] uppercase tracking-wider">
                Garanta sua Data
              </span>
              <h2 className="font-headline font-bold text-3xl sm:text-4xl text-[#262220] mt-1">
                Vamos levar essa alegria para seu evento?
              </h2>
              <p className="text-[15px] text-[#6E6762] mt-2">
                Preencha as informações abaixo e receba seu orçamento personalizado em poucos minutos via WhatsApp.
              </p>
            </div>

            <div className="bg-white border border-[#EBE5DB] rounded-3xl p-6 md:p-10 shadow-xl">
              {formSubmitted ? (
                <div className="p-8 rounded-2xl bg-[#DCE7E2] text-[#4A6E60] text-center flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#4A6E60] shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">check</span>
                  </div>
                  <h4 className="font-headline font-bold text-2xl text-[#1e3e34]">
                    Solicitação Enviada com Sucesso!
                  </h4>
                  <p className="text-[15px] max-w-md text-[#2d4d42]">
                    Olá <strong>{fullName}</strong>, recebemos o seu pedido para {eventType} e já adicionamos no pipeline operacional da Memory Cream.
                  </p>
                  <div className="flex items-center gap-3 mt-4 flex-wrap justify-center">
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="px-4 py-2 bg-white text-[#4A6E60] font-bold rounded-full text-[13px] shadow-sm hover:bg-[#eae8e4]"
                    >
                      Enviar outro orçamento
                    </button>
                    <button
                      onClick={onOpenAdmin}
                      className="px-5 py-2.5 bg-[#45655a] text-white font-bold rounded-full text-[13px] shadow-md hover:bg-[#1e3e34]"
                    >
                      Ver Lead no Painel Back-Office →
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-bold text-[#262220]">
                        Nome completo *
                      </label>
                      <input
                        className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB] text-[#1b1c1a] placeholder:text-[#6E6762]/60 focus:outline-none focus:ring-2 focus:ring-[#45655a]/30 transition-all text-[14px]"
                        placeholder="Ex.: Mariana Silva"
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-bold text-[#262220]">
                        WhatsApp / Telefone *
                      </label>
                      <input
                        className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB] text-[#1b1c1a] placeholder:text-[#6E6762]/60 focus:outline-none focus:ring-2 focus:ring-[#45655a]/30 transition-all text-[14px]"
                        placeholder="(11) 99999-9999"
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-bold text-[#262220]">E-mail *</label>
                    <input
                      className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB] text-[#1b1c1a] placeholder:text-[#6E6762]/60 focus:outline-none focus:ring-2 focus:ring-[#45655a]/30 transition-all text-[14px]"
                      placeholder="seuemail@exemplo.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-bold text-[#262220]">
                        Tipo de evento *
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB] text-[#1b1c1a] focus:outline-none focus:ring-2 focus:ring-[#45655a]/30 transition-all text-[14px]"
                        required
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                      >
                        <option value="">Selecione o tipo de evento...</option>
                        <option value="Casamento">Casamento</option>
                        <option value="Debutante (15 Anos)">Debutante (15 Anos)</option>
                        <option value="Formatura">Formatura</option>
                        <option value="Festa Infantil">Festa Infantil</option>
                        <option value="Evento Corporativo">Evento Corporativo</option>
                        <option value="Aniversário Adulto">Aniversário Adulto</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-bold text-[#262220]">
                        Data do evento *
                      </label>
                      <input
                        className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB] text-[#1b1c1a] focus:outline-none focus:ring-2 focus:ring-[#45655a]/30 transition-all text-[14px]"
                        required
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-bold text-[#262220]">
                        Qtd. de convidados *
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB] text-[#1b1c1a] focus:outline-none focus:ring-2 focus:ring-[#45655a]/30 transition-all text-[14px]"
                        required
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        <option value="Até 50 pessoas">Até 50 convidados</option>
                        <option value="50 a 100 pessoas">50 a 100 convidados</option>
                        <option value="100 a 200 pessoas">100 a 200 convidados</option>
                        <option value="200 a 350 pessoas">200 a 350 convidados</option>
                        <option value="Acima de 350 pessoas">+ de 350 convidados</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-bold text-[#262220]">
                        Modelo preferido *
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB] text-[#1b1c1a] focus:outline-none focus:ring-2 focus:ring-[#45655a]/30 transition-all text-[14px]"
                        required
                        value={modelSelect}
                        onChange={(e) => setModelSelect(e.target.value)}
                      >
                        <option value="Estação com Bike Retrô">Estação com Bike Retrô</option>
                        <option value="Estação Tradicional">Estação Tradicional</option>
                        <option value="Sem preferência / Quero recomendação">
                          Sem preferência / Quero recomendação
                        </option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-bold text-[#262220]">
                        CEP ou Cidade do Local *
                      </label>
                      <input
                        className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB] text-[#1b1c1a] placeholder:text-[#6E6762]/60 focus:outline-none focus:ring-2 focus:ring-[#45655a]/30 transition-all text-[14px]"
                        placeholder="Ex.: Campinas, São Paulo..."
                        required
                        type="text"
                        value={cepLocation}
                        onChange={(e) => setCepLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={veganRequested}
                      onChange={(e) => setVeganRequested(e.target.checked)}
                      className="w-4 h-4 accent-[#45655a]"
                    />
                    <span className="text-[13px] font-bold text-[#262220]">
                      Preciso de opções veganas / sem lactose
                    </span>
                  </label>

                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-bold text-[#262220]">
                      Observações / Horário de início
                    </label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB] text-[#1b1c1a] placeholder:text-[#6E6762]/60 focus:outline-none focus:ring-2 focus:ring-[#45655a]/30 transition-all text-[14px] resize-none"
                      placeholder="Conte-nos detalhes adicionais sobre o local, restrições alimentares ou dúvidas..."
                      rows={3}
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    {submitError && <p role="alert" className="text-destructive mb-3">{submitError}</p>}
                    <button
                      className="w-full py-4 px-6 bg-[#fdb4b3] text-[#360d10] hover:bg-[#874e4f] hover:text-white font-headline font-bold text-lg rounded-full shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                      type="submit"
                      disabled={submitting}
                    >
                      <span className="material-symbols-outlined text-[24px]">send</span>
                      <span>{submitting ? 'Enviando pedido…' : 'Enviar Pedido de Orçamento'}</span>
                    </button>
                    <p className="text-[12px] text-[#6E6762] text-center mt-2 flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#4A6E60]">
                        lock
                      </span>
                      Seus dados estão protegidos. Respondemos em até 2 horas úteis.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#FDFBF7] border-t border-[#EBE5DB] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img
                  alt="Memory Cream Logo"
                  className="h-8 w-auto object-contain"
                  src={LOGO_URL}
                />
                <span className="font-headline font-semibold text-lg text-[#1b1c1a]">
                  Memory Cream
                </span>
              </div>
              <p className="text-[13px] text-[#6E6762] leading-relaxed">
                Experiência artesanal inesquecível em soft serve gelato para casamentos, celebrações marcantes e eventos corporativos de alto padrão.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-bold text-[14px] text-[#1b1c1a] mb-1">Navegação</span>
              <nav className="flex flex-col gap-1 text-[13px] text-[#414845]">
                <a href="#inicio" className="hover:text-[#45655a]">Início</a>
                <a href="#sobre" className="hover:text-[#45655a]">Sobre a Experiência</a>
                <a href="#modelos" className="hover:text-[#45655a]">Modelos & Carrinhos</a>
                <a href="#sabores" className="hover:text-[#45655a]">Cardápio de Sabores</a>
                <a href="#como-funciona" className="hover:text-[#45655a]">Como Funciona</a>
              </nav>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-bold text-[14px] text-[#1b1c1a] mb-1">Contato & Atendimento</span>
              <div className="flex flex-col gap-1 text-[13px] text-[#414845]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#45655a] text-[18px]">chat</span>
                  <span>WhatsApp: (11) 98765-4321</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#45655a] text-[18px]">mail</span>
                  <span>contato@memorycream.com.br</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-[#45655a] text-[18px]">location_on</span>
                  <span>São Paulo, Campinas, Litoral & Regiões</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-bold text-[14px] text-[#1b1c1a]">Acesso Restrito</span>
              <button
                onClick={onOpenAdmin}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#EBE5DB] text-[#45655a] hover:bg-[#DCE7E2] font-bold text-[13px] shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Entrar no Back-Office</span>
              </button>
              <p className="text-[11px] text-[#6E6762]">
                Área restrita para a equipe comercial e gerência operacional Memory Cream.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#EBE5DB] flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-[#6E6762]">
            <p>© 2025 Memory Cream Sorvetes Artesanais. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => alert('Termos de Privacidade: Política de proteção de dados e sigilo.')} className="hover:text-[#45655a]">
                Privacidade
              </button>
              <button onClick={() => alert('Termos de Serviço para locação de estações gourmet.')} className="hover:text-[#45655a]">
                Termos de Serviço
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
