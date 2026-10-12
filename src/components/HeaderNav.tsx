import React from 'react';
import { LOGO_URL } from './Sidebar';

interface HeaderNavProps {
  currentTabTitle: string;
  onOpenPublicSite: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentTabTitle,
  onOpenPublicSite,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-[#FDFBF7]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#EBE5DB] z-40 px-6 flex items-center justify-between">
      {/* Left breadcrumb */}
      <div className="flex items-center gap-4">
        <img
          alt="Memory Cream Logo"
          className="h-8 w-auto object-contain cursor-pointer"
          src={LOGO_URL}
          onClick={onOpenPublicSite}
          title="Ver Site Institucional"
        />
        <div className="flex items-center gap-2 text-[#6E6762] text-[14px]">
          <span className="text-[#45655a] font-bold">Memory Cream</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-[#414845] font-medium">{currentTabTitle}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Search input */}
        <div className="hidden md:flex items-center bg-white border border-[#EBE5DB] px-3.5 py-1.5 rounded-full shadow-[0_1px_8px_rgba(0,0,0,0.04)] gap-2">
          <span className="material-symbols-outlined text-[#414845] text-[18px]">search</span>
          <input
            className="bg-transparent border-0 outline-none text-[14px] text-[#1b1c1a] placeholder:text-[#6E6762] w-56"
            placeholder="Buscar orçamento, noivos, data..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-[#6E6762] hover:text-[#1b1c1a]"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>

        {/* WhatsApp Direto */}
        <a
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#87a99c] text-[#1e3e34] hover:bg-[#45655a] hover:text-white transition-all text-[12px] font-bold shadow-sm"
          href="https://wa.me/5519998234120?text=Ol%C3%A1!%20Estou%20no%20sistema%20da%20Memory%20Cream%20e%20gostaria%20de%20falar%20sobre%20or%C3%A7amentos."
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          <span className="hidden sm:inline">WhatsApp Direto</span>
        </a>

        {/* Switcher to Public Site */}
        <button
          onClick={onOpenPublicSite}
          className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5E9D7] text-[#7a5826] hover:bg-[#c49a62] hover:text-white transition-all text-[12px] font-bold shadow-sm"
          title="Ver o site da Memory Cream com os olhos do cliente"
        >
          <span className="material-symbols-outlined text-[16px]">public</span>
          <span>Site do Cliente</span>
        </button>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-full text-[#414845] hover:bg-[#eae8e4] hover:text-[#1b1c1a] transition-all"
          type="button"
          title="4 notificações operacionais ativas"
          onClick={() => alert('Notificações operacionais: 4 noivos aguardam retorno de proposta ou confirmação de degustação.')}
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#874e4f]" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-[#EBE5DB]">
          <div className="w-8 h-8 rounded-full bg-[#45655a] flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
