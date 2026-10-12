import React, { useState } from 'react';
import { ALL_FLAVORS } from '../data/initialData';

export const SettingsView: React.FC = () => {
  const [companyName, setCompanyName] = useState(
    'Memory Cream Eventos e Gelatos Ltda.'
  );
  const [cnpj, setCnpj] = useState('45.192.839/0001-92');
  const [phone, setPhone] = useState('(11) 98765-4321');
  const [email, setEmail] = useState('contato@memorycream.com.br');
  const [address, setAddress] = useState(
    'Av. dos Bandeirantes, 1240, São Paulo/SP'
  );
  const [bikePrice, setBikePrice] = useState(3200);
  const [stationPrice, setStationPrice] = useState(2400);
  const [extraHourPrice, setExtraHourPrice] = useState(380);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Configurações salvas e aplicadas em todos os módulos!');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#1b1c1a] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-[#EBE5DB]/20 animate-fade-in">
          <span className="material-symbols-outlined text-[#87a99c]">
            check_circle
          </span>
          <span className="text-[13px] font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="pt-4 mb-6">
        <h1 className="font-headline font-semibold text-3xl md:text-4xl text-[#262220] tracking-tight">
          Configurações do Sistema
        </h1>
        <p className="text-[15px] text-[#6E6762] mt-1">
          Gerencie os dados cadastrais da empresa, precificação dos carrinhos, parâmetros operacionais e cardápio mestre.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Company Data */}
        <div className="lg:col-span-6 bg-white border border-[#EBE5DB] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EBE5DB]">
            <span className="material-symbols-outlined text-[#45655a] text-[22px]">
              store
            </span>
            <h2 className="font-headline font-bold text-lg text-[#262220]">
              Dados Cadastrais da Empresa
            </h2>
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#262220] block mb-1">
              Razão Social
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3.5 py-2.5 text-[14px] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-bold text-[#262220] block mb-1">
                CNPJ
              </label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3.5 py-2.5 text-[14px] outline-none"
              />
            </div>
            <div>
              <label className="text-[12px] font-bold text-[#262220] block mb-1">
                WhatsApp Principal
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3.5 py-2.5 text-[14px] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#262220] block mb-1">
              E-mail de Contato Comercial
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3.5 py-2.5 text-[14px] outline-none"
            />
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#262220] block mb-1">
              Endereço da Base Operacional
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3.5 py-2.5 text-[14px] outline-none"
            />
          </div>
        </div>

        {/* Pricing & Operations */}
        <div className="lg:col-span-6 bg-white border border-[#EBE5DB] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EBE5DB]">
            <span className="material-symbols-outlined text-[#7a5826] text-[22px]">
              payments
            </span>
            <h2 className="font-headline font-bold text-lg text-[#262220]">
              Tabela Base de Preços (2025/2026)
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-bold text-[#262220] block mb-1">
                Bike Retrô (Base 4h)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#6E6762] text-[13px]">
                  R$
                </span>
                <input
                  type="number"
                  step="50"
                  value={bikePrice}
                  onChange={(e) => setBikePrice(Number(e.target.value))}
                  className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl pl-10 pr-3 py-2.5 text-[14px] outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#262220] block mb-1">
                Estação Tradicional (Base 4h)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#6E6762] text-[13px]">
                  R$
                </span>
                <input
                  type="number"
                  step="50"
                  value={stationPrice}
                  onChange={(e) => setStationPrice(Number(e.target.value))}
                  className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl pl-10 pr-3 py-2.5 text-[14px] outline-none font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#262220] block mb-1">
              Hora Adicional de Operação no Local
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-[#6E6762] text-[13px]">
                R$
              </span>
              <input
                type="number"
                step="20"
                value={extraHourPrice}
                onChange={(e) => setExtraHourPrice(Number(e.target.value))}
                className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl pl-10 pr-3 py-2.5 text-[14px] outline-none font-bold"
              />
            </div>
          </div>

          <div className="p-3 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl">
            <span className="text-[12px] font-bold text-[#262220] block mb-1">
              Automações Ativas
            </span>
            <div className="space-y-1.5 text-[12px] text-[#6E6762]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#45655a] text-[16px]">
                  check_circle
                </span>
                <span>Notificação WhatsApp ao registrar novo lead</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#45655a] text-[16px]">
                  check_circle
                </span>
                <span>Disparo automático do link de assinatura ZapSign</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#45655a] text-[16px]">
                  check_circle
                </span>
                <span>Lembrete cordial D-10 com chave PIX para quitação</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#45655a] hover:bg-[#4A6E60] text-white font-bold text-[14px] shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>

        {/* Master Flavors List */}
        <div className="lg:col-span-12 bg-white border border-[#EBE5DB] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#EBE5DB] mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#874e4f] text-[22px]">
                icecream
              </span>
              <h2 className="font-headline font-bold text-lg text-[#262220]">
                Cardápio Mestre de Sabores Oficiais
              </h2>
            </div>
            <span className="text-[12px] text-[#6E6762]">
              {ALL_FLAVORS.length} sabores cadastrados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ALL_FLAVORS.map((flavor) => (
              <div
                key={flavor.id}
                className="p-3 bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${flavor.color}`} />
                  <div className="min-w-0">
                    <span className="text-[13px] font-bold text-[#262220] block truncate">
                      {flavor.name}
                    </span>
                    <span className="text-[11px] text-[#6E6762]">
                      {flavor.tag}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c7eadc] text-[#1e3e34]">
                  Ativo
                </span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
