import React from 'react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenPublicSite: () => void;
  newLeadsCount: number;
}

export const LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1X-tTb3vXK9pbJe4iAvHyHIvHcxgks1z2EAAYBUGSvs2xaEFkU4TE1QLMHuMC3fa5l1Qo-Bw15cNSgkhJ1eXosA8RaeYdTKP-ZPCq1HNq8GdiwKDIxFuqChiKE_clGJK6w1i3LuwhKm8L8C8tWjLxdJGsAMkL9VpVIL9ZWcUmXVvzNygt1qB2XfxAr8e_SVRS3xuEFngl999xhpwPVtaLWBdnXjdAyDQT8k38Wi_KjAnH-O1m9c0idW6CLw';

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenPublicSite,
  newLeadsCount
}) => {
  const navItems = [
    {
      id: 'leads-crm',
      label: 'Leads & Orçamentos (CRM)',
      icon: 'group',
      badge: newLeadsCount > 0 ? newLeadsCount : undefined
    },
    {
      id: 'gerador-proposta',
      label: 'Gerador de Proposta',
      icon: 'receipt_long'
    },
    {
      id: 'financeiro-pagamentos',
      label: 'Financeiro & Pagamentos',
      icon: 'payments'
    },
    {
      id: 'contratos-assinaturas',
      label: 'Contratos & Assinaturas',
      icon: 'draw'
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#FDFBF7] z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#EBE5DB]">
      <div className="flex flex-col">
        {/* Brand header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#EBE5DB]/50">
          <div className="flex items-center gap-3">
            <img
              alt="Memory Cream Logo"
              className="h-9 w-auto object-contain cursor-pointer"
              src={LOGO_URL}
              onClick={onOpenPublicSite}
              title="Ver Site do Cliente"
            />
            <div className="flex flex-col">
              <span className="font-headline font-semibold text-xl text-[#45655a] leading-none">
                Memory Cream
              </span>
              <span className="text-[11px] font-bold text-[#6E6762] uppercase tracking-wider mt-1">
                Back-Office Eventos
              </span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="px-4 py-3">
          <div className="bg-white p-3 rounded-xl flex items-center gap-3 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-[#EBE5DB]">
            <div className="w-10 h-10 rounded-full bg-[#45655a] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-[20px]">person</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-bold text-[14px] text-[#262220] truncate leading-tight">
                Helena Duarte
              </span>
              <span className="text-[12px] text-[#6E6762] truncate">
                Gerente Comercial
              </span>
            </div>
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#87a99c] ring-4 ring-[#c7eadc] shrink-0"
              title="Disponível"
            />
          </div>
        </div>

        {/* Section: Operação & Vendas */}
        <div className="px-4 mt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6762] px-3 mb-1.5 block">
            Operação & Vendas
          </span>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left ${
                    isActive
                      ? 'bg-[#87a99c] text-[#1e3e34] font-bold shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
                      : 'text-[#414845] hover:bg-[#eae8e4] hover:text-[#1b1c1a]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="material-symbols-outlined text-[20px] shrink-0">
                      {item.icon}
                    </span>
                    <span className="text-[14px] truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#45655a] text-white shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section: Preferências */}
        <div className="px-4 mt-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6762] px-3 mb-1.5 block">
            Preferências
          </span>
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => onSelectTab('configuracoes')}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-xl transition-all text-left gap-3 ${
                currentTab === 'configuracoes'
                  ? 'bg-[#87a99c] text-[#1e3e34] font-bold'
                  : 'text-[#414845] hover:bg-[#eae8e4] hover:text-[#1b1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="text-[14px]">Configurações</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Footer controls */}
      <div className="p-4 flex flex-col gap-2 border-t border-[#EBE5DB]/50">
        <div className="bg-[#F5E9D7]/70 p-2.5 rounded-xl flex items-center justify-between border border-[#c49a62]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7a5826] text-[18px]">
              icecream
            </span>
            <span className="text-[12px] text-[#7a5826] font-bold">
              Estação Gourmet
            </span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#87a99c] text-[#1e3e34]">
            Ativa
          </span>
        </div>

        <button
          onClick={onOpenPublicSite}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-[#eae8e4] text-[#45655a] border border-[#EBE5DB] font-semibold text-[13px] shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          <span>Ver Site de Clientes</span>
        </button>

        <button
          onClick={() => {
            if (confirm('Deseja alternar para a visão pública institucional da Memory Cream?')) {
              onOpenPublicSite();
            }
          }}
          className="flex items-center px-3.5 py-2 rounded-xl text-[#ba1a1a] hover:bg-[#ffdad6]/60 transition-all gap-3 text-left w-full"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="text-[13px] font-bold">Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
};
