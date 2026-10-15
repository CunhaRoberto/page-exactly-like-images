import React, { useState, useMemo } from 'react';
import { PaymentItem } from '../types';

interface FinanceViewProps {
  payments: PaymentItem[];
  onUpdatePayment: (updated: PaymentItem) => void;
  onAddPayment: (newItem: PaymentItem) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  payments,
  onUpdatePayment
}) => {
  const [filterType, setFilterType] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form modal state
  const [selectedPayId, setSelectedPayId] = useState<string>(payments[0]?.id || '');
  const [payAmount, setPayAmount] = useState<string>('2303,00');
  const [payDate, setPayDate] = useState<string>('2025-10-24');
  const [payMethod, setPayMethod] = useState<'pix' | 'cartao' | 'boleto'>('pix');
  const [authNote, setAuthNote] = useState<string>('PIX Aut. 9847291 Banco Inter');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const matchSearch =
        searchQuery === '' ||
        item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.packageType.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (filterType === 'todos') return true;
      if (filterType === 'pendentes')
        return (
          item.liquidationStatus === 'aguardando' ||
          item.liquidationStatus === 'pendente_parcela'
        );
      if (filterType === 'quitados')
        return (
          item.liquidationStatus === 'quitado' ||
          item.liquidationStatus === 'pago'
        );
      if (filterType === 'corporativo')
        return item.category === 'corporativo';

      return true;
    });
  }, [payments, searchQuery, filterType]);

  const fmtBRL = (n: number) =>
    n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const parseBRL = (s: string) => {
    const n = Number(s.replace(/\./g, '').replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  };

  const stats = useMemo(() => {
    const isSettled = (s: PaymentItem['liquidationStatus']) =>
      s === 'quitado' || s === 'pago';
    const settled = payments.filter((p) => isSettled(p.liquidationStatus));
    const open = payments.filter((p) => !isSettled(p.liquidationStatus));
    const received = settled.reduce((sum, p) => sum + p.totalValue, 0);
    const toReceive = open.reduce((sum, p) => sum + p.balanceValue, 0);
    const deposits = payments.reduce((sum, p) => sum + (p.totalValue - p.balanceValue), 0);
    const settlementPct = payments.length
      ? Math.round((settled.length / payments.length) * 100)
      : 0;
    const byMethod = (m: PaymentItem['method']) =>
      payments.filter((p) => p.method === m).reduce((sum, p) => sum + p.totalValue, 0);
    const methodTotal = payments.reduce((sum, p) => sum + p.totalValue, 0) || 1;
    let pixPct = Math.round((byMethod('pix') / methodTotal) * 100);
    let cartaoPct = Math.round((byMethod('cartao') / methodTotal) * 100);
    let boletoPct = 100 - pixPct - cartaoPct;
    if (boletoPct < 0) {
      cartaoPct += boletoPct;
      boletoPct = 0;
    }
    const statusRows = [
      { key: 'quitado', label: 'Quitados (sinal + saldo)', color: 'bg-[#45655a]' },
      { key: 'pago', label: 'Pagos via boleto / NF', color: 'bg-[#4A6E60]' },
      { key: 'aguardando', label: 'Aguardando liquidação', color: 'bg-[#ecbf84]' },
      { key: 'pendente_parcela', label: 'Parcelas em aberto', color: 'bg-[#c49a62]' }
    ].map((row) => ({
      ...row,
      value: payments
        .filter((p) => p.liquidationStatus === row.key)
        .reduce((sum, p) => sum + p.totalValue, 0)
    }));
    const maxStatus = Math.max(...statusRows.map((r) => r.value), 1);
    return {
      received,
      toReceive,
      deposits,
      settlementPct,
      openCount: open.length,
      settledCount: settled.length,
      byMethod,
      pixPct,
      cartaoPct,
      boletoPct,
      statusRows,
      maxStatus
    };
  }, [payments]);

  const handleOpenBaixa = (item: PaymentItem) => {
    setSelectedPayId(item.id);
    setPayAmount(
      item.balanceValue > 0
        ? item.balanceValue.toString().replace('.', ',')
        : item.totalValue.toString().replace('.', ',')
    );
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = payments.find((p) => p.id === selectedPayId);
    if (!target) {
      showToast('Selecione um lançamento válido antes de registrar a baixa.');
      return;
    }
    const paid = parseBRL(payAmount);
    const remaining = Math.max(0, Math.round((target.balanceValue - paid) * 100) / 100);
    if (remaining > 0) {
      const updated: PaymentItem = {
        ...target,
        balanceValue: remaining,
        signalStatusDesc: `Pagamento parcial de R$ ${fmtBRL(paid)} via ${payMethod.toUpperCase()} em ${payDate}`,
        authCode: authNote
      };
      onUpdatePayment(updated);
      showToast(
        `Pagamento parcial de R$ ${fmtBRL(paid)} registrado para ${target.clientName}. Saldo restante: R$ ${fmtBRL(remaining)}.`
      );
    } else {
      const updated: PaymentItem = {
        ...target,
        balanceValue: 0,
        balanceDueDate: 'Totalmente liquidado',
        liquidationStatus: 'quitado',
        signalStatusDesc: `Liquidado via ${payMethod.toUpperCase()} em ${payDate}`,
        authCode: authNote
      };
      onUpdatePayment(updated);
      showToast(
        `Baixa confirmada! Saldo de R$ ${fmtBRL(paid)} liquidado para ${target.clientName}.`
      );
    }
    setIsModalOpen(false);
  };

  const handleExportCsv = () => {
    const headers = 'Cliente,Evento,Data,Pacote,Valor Total,Saldo,Status,Metodo\n';
    const rows = payments
      .map(
        (p) =>
          `"${p.clientName}","${p.eventName}","${p.eventDate}","${p.packageType}","R$ ${p.totalValue}","R$ ${p.balanceValue}","${p.liquidationStatus}","${p.method}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `financeiro_memory_cream_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Planilha financeira consolidada (CSV) baixada.');
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

      {/* Top Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pt-4">
        <div>
          <div className="flex items-center gap-1.5 text-[#4A6E60] mb-1">
            <span className="material-symbols-outlined text-[18px]">
              account_balance_wallet
            </span>
            <span className="text-[11px] tracking-widest uppercase font-bold">
              Gestão Orçamentária • Back-Office
            </span>
          </div>
          <h1 className="font-headline font-semibold text-3xl md:text-4xl text-[#262220] tracking-tight">
            Financeiro & Pagamentos de Eventos
          </h1>
          <p className="text-[15px] text-[#6E6762] mt-1 max-w-2xl">
            Acompanhamento em tempo real de liquidações, parcelas contratuais, sinais garantidores e conciliação bancária das estações de gelato.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-white border border-[#EBE5DB] px-4 py-2 rounded-full shadow-sm text-[#414845] text-[13px] font-bold">
            <span className="material-symbols-outlined text-[18px] mr-2 text-[#45655a]">
              calendar_today
            </span>
            <span>Outubro 2025</span>
          </div>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 bg-white hover:bg-[#eae8e4] text-[#1b1c1a] border border-[#EBE5DB] px-4 py-2 rounded-full shadow-sm transition-all text-[13px] font-bold"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#7a5826]">
              download
            </span>
            <span>Exportar Relatório</span>
          </button>
          <button
            onClick={() => {
              setSelectedPayId(payments[0]?.id || '');
              setPayAmount('2303,00');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#874e4f] hover:bg-[#8F4E4E] text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all text-[13px] font-bold"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Registrar Baixa / Pagamento</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Faturamento do Mês */}
        <div className="bg-white border border-[#EBE5DB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6E6762] font-bold">
                Faturamento do Mês
              </span>
              <div className="font-headline text-2xl font-bold text-[#262220] mt-1">
                R$ {fmtBRL(stats.received)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#c7eadc] flex items-center justify-center text-[#1e3e34]">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-[#EBE5DB]/50">
            <div className="flex items-center gap-1 text-[#4A6E60] text-[12px] font-bold">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              <span>{stats.settledCount} de {payments.length}</span>
              <span className="text-[#6E6762] font-normal ml-0.5">lançamentos quitados</span>
            </div>
            {/* Sparkline */}
            <svg className="w-16 h-5 text-[#87a99c]" fill="none" viewBox="0 0 80 24">
              <path
                d="M2 18 C 15 17, 20 12, 35 14 C 50 16, 58 6, 78 4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: A Receber */}
        <div className="bg-white border border-[#EBE5DB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6E6762] font-bold">
                A Receber (Próx. 30 dias)
              </span>
              <div className="font-headline text-2xl font-bold text-[#262220] mt-1">
                R$ {fmtBRL(stats.toReceive)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F5E9D7] flex items-center justify-center text-[#7a5826]">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-[#EBE5DB]/50">
            <span className="text-[12px] text-[#6E6762]">{stats.openCount} lançamentos com saldo</span>
            <span className="px-2 py-0.5 rounded-full bg-[#F5E9D7] text-[#7a5826] text-[10px] font-bold">
              Previsão Normal
            </span>
          </div>
        </div>

        {/* Card 3: Sinais & Entradas */}
        <div className="bg-white border border-[#EBE5DB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6E6762] font-bold">
                Sinais & Entradas Pagas
              </span>
              <div className="font-headline text-2xl font-bold text-[#262220] mt-1">
                R$ {fmtBRL(stats.deposits)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#DCE7E2] flex items-center justify-center text-[#4A6E60]">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-[#EBE5DB]/50">
            <span className="text-[12px] text-[#6E6762]">Datas 100% reservadas</span>
            <span className="text-[12px] text-[#45655a] font-bold">{payments.length} lançamentos no período</span>
          </div>
        </div>

        {/* Card 4: Eventos 100% Quitados */}
        <div className="bg-white border border-[#EBE5DB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6E6762] font-bold">
                Eventos 100% Quitados
              </span>
              <div className="font-headline text-2xl font-bold text-[#262220] mt-1">
                {stats.settledCount} <span className="text-sm font-normal text-[#6E6762]">eventos</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#ffdad9] flex items-center justify-center text-[#874e4f]">
              <span className="material-symbols-outlined text-[20px]">task_alt</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-[#EBE5DB]/50">
            <span className="text-[12px] text-[#6E6762]">{stats.settlementPct}% da carteira quitada</span>
            <div className="w-20 bg-[#eae8e4] rounded-full h-2 overflow-hidden">
              <div className="bg-[#45655a] h-full rounded-full" style={{ width: `${stats.settlementPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Section (Cash Flow & Payment Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Weekly Cash Flow Visual (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#EBE5DB] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-headline font-bold text-xl text-[#262220]">
                Situação dos Lançamentos
              </h2>
              <p className="text-[13px] text-[#6E6762]">
                Valores por situação de cada lançamento cadastrado
              </p>
            </div>
          </div>

          {/* Derived status breakdown */}
          <div className="flex flex-col gap-3 pt-2 pb-2">
            {stats.statusRows.map((row) => (
              <div key={row.key} className="flex items-center gap-3">
                <span className="text-[12px] font-bold text-[#6E6762] w-44 shrink-0">
                  {row.label}
                </span>
                <div className="flex-1 h-5 bg-[#FDFBF7] border border-[#EBE5DB] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${row.color}`}
                    style={{ width: `${Math.max((row.value / stats.maxStatus) * 100, 2)}%` }}
                  />
                </div>
                <span className="text-[12px] font-bold text-[#262220] w-32 text-right shrink-0">
                  R$ {fmtBRL(row.value)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-[#FDFBF7] border border-[#EBE5DB] px-3.5 py-2.5 rounded-xl mt-2">
            <span className="text-[12px] text-[#6E6762]">
              Barra proporcional ao total por situação
            </span>
            <span className="text-[11px] text-[#4A6E60] font-bold">
              A receber: R$ {fmtBRL(stats.toReceive)}
            </span>
          </div>
        </div>

        {/* Distribution by Payment Method (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#EBE5DB] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-headline font-bold text-xl text-[#262220]">
                Métodos de Pagamento
              </h2>
              <p className="text-[13px] text-[#6E6762]">
                Preferência dos contratantes nos eventos
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#f5f3ef] flex items-center justify-center text-[#6E6762]">
              <span className="material-symbols-outlined text-[18px]">pie_chart</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 my-4">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#F5F3EF" strokeWidth="16" />
                {/* PIX */}
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#45655a"
                  strokeDasharray={`${(stats.pixPct * 2.512).toFixed(2)} 251.2`}
                  strokeDashoffset="0"
                  strokeWidth="16"
                />
                {/* Cartão */}
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#c49a62"
                  strokeDasharray={`${(stats.cartaoPct * 2.512).toFixed(2)} 251.2`}
                  strokeDashoffset={`-${(stats.pixPct * 2.512).toFixed(2)}`}
                  strokeWidth="16"
                />
                {/* Boleto */}
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#874e4f"
                  strokeDasharray={`${(stats.boletoPct * 2.512).toFixed(2)} 251.2`}
                  strokeDashoffset={`-${((stats.pixPct + stats.cartaoPct) * 2.512).toFixed(2)}`}
                  strokeWidth="16"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-headline text-2xl font-bold text-[#262220] leading-none">
                  {stats.pixPct}%
                </span>
                <span className="text-[10px] text-[#6E6762] uppercase font-bold">PIX</span>
              </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-2 w-full text-[13px]">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#45655a]" />
                  <span className="font-bold text-[#262220]">PIX Instantâneo</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#262220]">{stats.pixPct}%</span>
                  <span className="text-[11px] text-[#6E6762] block">R$ {fmtBRL(stats.byMethod('pix'))}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c49a62]" />
                  <span className="font-bold text-[#262220]">Cartão de Crédito</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#262220]">{stats.cartaoPct}%</span>
                  <span className="text-[11px] text-[#6E6762] block">R$ {fmtBRL(stats.byMethod('cartao'))}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FDFBF7] border border-[#EBE5DB]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#874e4f]" />
                  <span className="font-bold text-[#262220]">Boleto Faturado</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#262220]">{stats.boletoPct}%</span>
                  <span className="text-[11px] text-[#6E6762] block">R$ {fmtBRL(stats.byMethod('boleto'))}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-[#EBE5DB]/50">
            <span className="text-[11px] text-[#6E6762]">
              Percentuais calculados a partir dos lançamentos cadastrados
            </span>
          </div>
        </div>
      </div>

      {/* Operational Filter Strip */}
      <div className="bg-white border border-[#EBE5DB] rounded-2xl p-4 shadow-sm mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span className="text-[#6E6762] uppercase tracking-wider font-bold mr-1">
            Filtrar por:
          </span>
          <button
            onClick={() => setFilterType('todos')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all ${
              filterType === 'todos'
                ? 'bg-[#45655a] text-white'
                : 'bg-[#efeeea] text-[#262220] hover:bg-[#eae8e4]'
            }`}
          >
            Todos ({payments.length})
          </button>
          <button
            onClick={() => setFilterType('pendentes')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all ${
              filterType === 'pendentes'
                ? 'bg-[#45655a] text-white'
                : 'bg-[#efeeea] text-[#262220] hover:bg-[#eae8e4]'
            }`}
          >
            Pendentes / Aguardando
          </button>
          <button
            onClick={() => setFilterType('quitados')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all ${
              filterType === 'quitados'
                ? 'bg-[#45655a] text-white'
                : 'bg-[#efeeea] text-[#262220] hover:bg-[#eae8e4]'
            }`}
          >
            Quitados
          </button>
          <button
            onClick={() => setFilterType('corporativo')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all ${
              filterType === 'corporativo'
                ? 'bg-[#45655a] text-white'
                : 'bg-[#efeeea] text-[#262220] hover:bg-[#eae8e4]'
            }`}
          >
            Corporativo
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="material-symbols-outlined text-[18px] text-[#6E6762] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              search
            </span>
            <input
              className="bg-[#FDFBF7] border border-[#EBE5DB] pl-9 pr-4 py-1.5 rounded-full text-[13px] text-[#1b1c1a] placeholder:text-[#6E6762] outline-none focus:ring-2 focus:ring-[#45655a]/30"
              placeholder="Filtrar por noivos, cliente..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Detailed Ledger Table */}
      <div className="bg-white border border-[#EBE5DB] rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="p-4 flex items-center justify-between border-b border-[#EBE5DB]">
          <div>
            <h2 className="font-headline font-bold text-xl text-[#262220]">
              Contas a Receber & Transações de Eventos
            </h2>
            <p className="text-[13px] text-[#6E6762]">
              Detalhamento contratual, sinal de garantia e vencimentos finais
            </p>
          </div>
          <span className="text-[12px] text-[#4A6E60] font-semibold bg-[#DCE7E2] px-3 py-1 rounded-full">
            {filteredPayments.length} registros ativos
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f5f3ef] text-[#6E6762] text-[12px] font-bold uppercase tracking-wider border-b border-[#EBE5DB]">
                <th className="py-3 px-4">Contratante / Evento</th>
                <th className="py-3 px-4">Valor Total</th>
                <th className="py-3 px-4">Estrutura de Pagamento & Entrada</th>
                <th className="py-3 px-4">Saldo / Vencimento</th>
                <th className="py-3 px-4">Status de Liquidação</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="text-[14px] divide-y divide-[#EBE5DB]/60">
              {filteredPayments.map((item) => (
                <tr key={item.id} className="hover:bg-[#FDFBF7] transition-colors">
                  {/* Client */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0 ${item.clientColor}`}
                      >
                        {item.clientInitials}
                      </div>
                      <div>
                        <div className="font-bold text-[#262220] leading-tight">
                          {item.clientName}
                        </div>
                        <div className="text-[12px] text-[#6E6762] flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[13px] text-[#7a5826]">
                            celebration
                          </span>
                          {item.eventName} • {item.eventDate}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Value */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#262220]">
                      R$ {item.totalValue.toLocaleString('pt-BR')},00
                    </span>
                    <span className="text-[11px] text-[#6E6762] block">
                      {item.packageType}
                    </span>
                  </td>

                  {/* Signal */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#4A6E60] font-bold">
                        <span className="material-symbols-outlined text-[16px]">
                          check_circle
                        </span>
                        <span>{item.signalDesc}</span>
                      </div>
                      <span className="text-[11px] text-[#6E6762]">
                        {item.signalStatusDesc}
                      </span>
                    </div>
                  </td>

                  {/* Balance */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span
                        className={`font-semibold ${
                          item.balanceValue > 0 ? 'text-[#262220]' : 'text-[#4A6E60]'
                        }`}
                      >
                        R$ {item.balanceValue.toLocaleString('pt-BR')},00
                      </span>
                      <span className="text-[11px] text-[#7a5826] flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[13px]">
                          event
                        </span>
                        {item.balanceDueDate}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {item.liquidationStatus === 'aguardando' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5E9D7] text-[#7a5826] text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7a5826]" />
                        Aguardando Saldo
                      </span>
                    )}
                    {item.liquidationStatus === 'quitado' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c7eadc] text-[#1e3e34] text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">
                          done_all
                        </span>
                        Quitado
                      </span>
                    )}
                    {item.liquidationStatus === 'pendente_parcela' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#eae8e4] text-[#414845] text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#874e4f]" />
                        Parcela 3/3 Pendente
                      </span>
                    )}
                    {item.liquidationStatus === 'pago' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c7eadc] text-[#1e3e34] text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">
                          done_all
                        </span>
                        Pago
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.balanceValue > 0 ? (
                        <button
                          onClick={() => handleOpenBaixa(item)}
                          className="px-3 py-1 rounded-full bg-[#DCE7E2] hover:bg-[#45655a] hover:text-white text-[#4A6E60] transition-all text-[12px] font-bold shadow-sm"
                          type="button"
                        >
                          Baixar
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            showToast(
                              `Comprovante autenticado baixado para ${item.clientName} (Código: ${item.authCode}).`
                            )
                          }
                          className="px-3 py-1 rounded-full bg-[#eae8e4] hover:bg-[#d8d5ce] text-[#262220] transition-all text-[12px] font-bold shadow-sm"
                          type="button"
                        >
                          Comprovante
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#EBE5DB] rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DCE7E2] flex items-center justify-center text-[#4A6E60] shrink-0">
            <span className="material-symbols-outlined text-[20px]">
              verified_user
            </span>
          </div>
          <div>
            <h3 className="font-bold text-[14px] text-[#262220]">
              Regra de Segurança de Sinal
            </h3>
            <p className="text-[12px] text-[#6E6762] mt-1">
              Nenhuma data de carrinho é bloqueada na agenda dos confeiteiros sem o comprovante do sinal de 30% devidamente validado no sistema.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#EBE5DB] rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5E9D7] flex items-center justify-center text-[#7a5826] shrink-0">
            <span className="material-symbols-outlined text-[20px]">
              notifications_active
            </span>
          </div>
          <div>
            <h3 className="font-bold text-[14px] text-[#262220]">
              Lembrete Automático D-10
            </h3>
            <p className="text-[12px] text-[#6E6762] mt-1">
              Os noivos recebem lembrete cordial via WhatsApp com a chave PIX e link de pagamento do saldo restante 10 dias antes do evento.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#EBE5DB] rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FBE6E6] flex items-center justify-center text-[#8F4E4E] shrink-0">
            <span className="material-symbols-outlined text-[20px]">
              point_of_sale
            </span>
          </div>
          <div>
            <h3 className="font-bold text-[14px] text-[#262220]">
              Horas Adicionais no Local
            </h3>
            <p className="text-[12px] text-[#6E6762] mt-1">
              Caso o anfitrião solicite tempo extra de serviço no dia, a cobrança complementar de R$ 380/hora pode ser lançada instantaneamente.
            </p>
          </div>
        </div>
      </div>

      {/* Modal: Registrar Baixa / Pagamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-[#EBE5DB]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE5DB] mb-4">
              <div>
                <span className="text-[11px] font-bold text-[#4A6E60] uppercase tracking-wider">
                  Conciliação de Caixa
                </span>
                <h3 className="font-headline font-bold text-2xl text-[#262220]">
                  Registrar Pagamento Manual / Baixa
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-[#6E6762] hover:bg-[#eae8e4]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-[#262220] block mb-1">
                  Evento / Contratante
                </label>
                <select
                  value={selectedPayId}
                  onChange={(e) => {
                    setSelectedPayId(e.target.value);
                    const p = payments.find((x) => x.id === e.target.value);
                    if (p) {
                      setPayAmount(
                        p.balanceValue > 0
                          ? p.balanceValue.toString().replace('.', ',')
                          : p.totalValue.toString().replace('.', ',')
                      );
                    }
                  }}
                  className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none"
                >
                  {payments.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.clientName} - {p.eventName} • Saldo: R${' '}
                      {p.balanceValue.toLocaleString('pt-BR')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    Valor Recebido (R$)
                  </label>
                  <input
                    type="text"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#262220] block mb-1">
                    Data da Efetivação
                  </label>
                  <input
                    type="date"
                    required
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#262220] block mb-1">
                  Método de Liquidação
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('pix')}
                    className={`py-2 rounded-xl text-[12px] font-bold border transition-all ${
                      payMethod === 'pix'
                        ? 'bg-[#45655a] text-white border-[#45655a]'
                        : 'bg-[#FDFBF7] text-[#262220] border-[#EBE5DB]'
                    }`}
                  >
                    PIX
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('cartao')}
                    className={`py-2 rounded-xl text-[12px] font-bold border transition-all ${
                      payMethod === 'cartao'
                        ? 'bg-[#45655a] text-white border-[#45655a]'
                        : 'bg-[#FDFBF7] text-[#262220] border-[#EBE5DB]'
                    }`}
                  >
                    Cartão
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('boleto')}
                    className={`py-2 rounded-xl text-[12px] font-bold border transition-all ${
                      payMethod === 'boleto'
                        ? 'bg-[#45655a] text-white border-[#45655a]'
                        : 'bg-[#FDFBF7] text-[#262220] border-[#EBE5DB]'
                    }`}
                  >
                    Boleto / TED
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#262220] block mb-1">
                  Código de Autenticação / Observação
                </label>
                <input
                  type="text"
                  value={authNote}
                  onChange={(e) => setAuthNote(e.target.value)}
                  placeholder="Ex: PIX Aut. 9847291 Banco Inter"
                  className="w-full bg-[#FDFBF7] border border-[#EBE5DB] rounded-xl px-3 py-2 text-[14px] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EBE5DB]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#6E6762] hover:bg-[#eae8e4] font-semibold text-[13px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#45655a] text-white font-bold text-[13px] shadow-md hover:bg-[#4A6E60]"
                >
                  Confirmar e Liquidar Baixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
