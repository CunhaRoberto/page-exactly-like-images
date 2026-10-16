import { supabase } from '../integrations/supabase/client';
import type { Json } from '../integrations/supabase/types';
import { ContractItem, Lead, PaymentItem } from '../types';
import { INITIAL_CONTRACTS, INITIAL_LEADS, INITIAL_PAYMENTS } from '../data/initialData';

type AnyRow = Record<string, any>;

export const DEFAULT_SETTINGS: Record<string, unknown> = {
  companyName: 'Memory Cream Eventos e Gelatos Ltda.',
  cnpj: '45.192.839/0001-92',
  phone: '(11) 98765-4321',
  email: 'contato@memorycream.com.br',
  address: 'Av. dos Bandeirantes, 1240, São Paulo/SP',
  bikePrice: 3200,
  stationPrice: 2400,
  extraHourPrice: 380
};

let settingsCache: Record<string, unknown> = { ...DEFAULT_SETTINGS };

export const getCachedSettings = () => settingsCache;

/** Lê um valor salvo no navegador (usado só para migrar dados antigos quando o banco está vazio). */
function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === 0) return null;
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length === 0) return null;
    return parsed as T;
  } catch (e) {
    return null;
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
}

// A migracao dos dados que estavam salvos no navegador roda uma unica vez por computador.
const MIGRATION_FLAG = 'mc_cloud_migrated_v1';

function hasMigrated(): boolean {
  try {
    return localStorage.getItem(MIGRATION_FLAG) === 'true';
  } catch (e) {
    return true;
  }
}

function markMigrated() {
  try {
    localStorage.setItem(MIGRATION_FLAG, 'true');
  } catch (e) {
    console.error(e);
  }
}

async function fetchRows(table: string): Promise<AnyRow[]> {
  const { data, error } = await supabase
    .from(table as any)
    .select('*')
    .order('position', { ascending: true });
  if (error) throw error;
  return (data ?? []) as AnyRow[];
}

/** Grava a lista completa no banco, preservando a ordem exibida na tela. */
async function syncRows(table: string, rows: AnyRow[], keepIds: string[]) {
  if (rows.length) {
    const { error } = await supabase.from(table as any).upsert(rows, { onConflict: 'id' });
    if (error) throw error;
  }
  const { data, error: selectError } = await supabase.from(table as any).select('id');
  if (selectError) throw selectError;
  const keep = new Set(keepIds);
  const toDelete = ((data ?? []) as AnyRow[]).map((r) => r.id as string).filter((id) => !keep.has(id));
  if (toDelete.length) {
    const { error: deleteError } = await supabase.from(table as any).delete().in('id', toDelete);
    if (deleteError) throw deleteError;
  }
}

// ---------- Leads ----------

const leadToRow = (lead: Lead, position: number): AnyRow => ({
  id: lead.id,
  lead_code: lead.leadCode,
  name: lead.name,
  event_type: lead.eventType,
  event_date: lead.eventDate,
  guest_count: lead.guestCount,
  location: lead.location,
  city: lead.city,
  structure: lead.structure,
  status: lead.status,
  phone: lead.phone,
  email: lead.email,
  notes: lead.notes ?? null,
  preferred_flavors: lead.preferredFlavors ?? [],
  vegan_requested: lead.veganRequested ?? false,
  received_at: lead.receivedAt,
  avatar_text: lead.avatarText,
  avatar_color: lead.avatarColor,
  checklist: lead.checklist ?? {},
  proposal_amount: lead.proposalAmount ?? null,
  position
});

const rowToLead = (row: AnyRow): Lead => ({
  id: row.id,
  leadCode: row.lead_code,
  name: row.name,
  eventType: row.event_type,
  eventDate: row.event_date,
  guestCount: Number(row.guest_count ?? 0),
  location: row.location,
  city: row.city,
  structure: row.structure === 'bike' ? 'bike' : 'tradicional',
  status: row.status,
  phone: row.phone,
  email: row.email,
  notes: row.notes ?? undefined,
  preferredFlavors: Array.isArray(row.preferred_flavors) ? row.preferred_flavors : [],
  veganRequested: Boolean(row.vegan_requested),
  receivedAt: row.received_at,
  avatarText: row.avatar_text,
  avatarColor: row.avatar_color,
  checklist: {
    dataAgenda: Boolean(row.checklist?.dataAgenda),
    logistica: Boolean(row.checklist?.logistica),
    propostaEnviada: Boolean(row.checklist?.propostaEnviada),
    degustacao: Boolean(row.checklist?.degustacao)
  },
  proposalAmount: row.proposal_amount === null ? undefined : Number(row.proposal_amount)
});

export async function saveLeads(leads: Lead[]) {
  writeLocal('mc_leads', leads);
  await syncRows(
    'mc_leads',
    leads.map((lead, i) => leadToRow(lead, i)),
    leads.map((lead) => lead.id)
  );
}

export async function loadLeads(): Promise<Lead[]> {
  const rows = await fetchRows('mc_leads');
  if (rows.length) return rows.map(rowToLead);
  const seed = readLocal<Lead[]>('mc_leads') ?? INITIAL_LEADS;
  await saveLeads(seed);
  return seed;
}

// ---------- Pagamentos ----------

const paymentToRow = (item: PaymentItem, position: number): AnyRow => ({
  id: item.id,
  client_name: item.clientName,
  client_initials: item.clientInitials,
  client_color: item.clientColor,
  event_name: item.eventName,
  event_date: item.eventDate,
  package_type: item.packageType,
  total_value: item.totalValue,
  signal_desc: item.signalDesc,
  signal_status_desc: item.signalStatusDesc,
  balance_value: item.balanceValue,
  balance_due_date: item.balanceDueDate,
  liquidation_status: item.liquidationStatus,
  method: item.method,
  category: item.category,
  auth_code: item.authCode ?? null,
  position
});

const rowToPayment = (row: AnyRow): PaymentItem => ({
  id: row.id,
  clientName: row.client_name,
  clientInitials: row.client_initials,
  clientColor: row.client_color,
  eventName: row.event_name,
  eventDate: row.event_date,
  packageType: row.package_type,
  totalValue: Number(row.total_value ?? 0),
  signalDesc: row.signal_desc,
  signalStatusDesc: row.signal_status_desc,
  balanceValue: Number(row.balance_value ?? 0),
  balanceDueDate: row.balance_due_date,
  liquidationStatus: row.liquidation_status,
  method: row.method,
  category: row.category,
  authCode: row.auth_code ?? undefined
});

export async function savePayments(payments: PaymentItem[]) {
  writeLocal('mc_payments', payments);
  await syncRows(
    'mc_payments',
    payments.map((item, i) => paymentToRow(item, i)),
    payments.map((item) => item.id)
  );
}

export async function loadPayments(): Promise<PaymentItem[]> {
  const rows = await fetchRows('mc_payments');
  if (rows.length) return rows.map(rowToPayment);
  const seed = readLocal<PaymentItem[]>('mc_payments') ?? INITIAL_PAYMENTS;
  await savePayments(seed);
  return seed;
}

// ---------- Contratos ----------

const contractToRow = (item: ContractItem, position: number): AnyRow => ({
  id: item.id,
  contract_code: item.contractCode,
  client_name: item.clientName,
  client_short: item.clientShort,
  client_cpf: item.clientCpf ?? null,
  client_rg: item.clientRg ?? null,
  client_address: item.clientAddress ?? null,
  event_type: item.eventType,
  event_date: item.eventDate,
  event_location: item.eventLocation,
  model: item.model,
  hours: item.hours,
  total_value: item.totalValue,
  signal_value: item.signalValue,
  status: item.status,
  badge_class: item.badgeClass ?? null,
  badge_text: item.badgeText ?? null,
  signed_by_contractor: item.signedByContractor,
  contractor_sign_date: item.contractorSignDate ?? null,
  contractor_name: item.contractorName ?? null,
  client_signed: item.clientSigned,
  client_sign_date: item.clientSignDate ?? null,
  client_ip: item.clientIp ?? null,
  security_hash: item.securityHash ?? null,
  valid_days: item.validDays,
  flavors_desc: item.flavorsDesc ?? null,
  channel_desc: item.channelDesc ?? null,
  position
});

const rowToContract = (row: AnyRow): ContractItem => ({
  id: row.id,
  contractCode: row.contract_code,
  clientName: row.client_name,
  clientShort: row.client_short,
  clientCpf: row.client_cpf ?? undefined,
  clientRg: row.client_rg ?? undefined,
  clientAddress: row.client_address ?? undefined,
  eventType: row.event_type,
  eventDate: row.event_date,
  eventLocation: row.event_location,
  model: row.model,
  hours: Number(row.hours ?? 0),
  totalValue: Number(row.total_value ?? 0),
  signalValue: Number(row.signal_value ?? 0),
  status: row.status,
  badgeClass: row.badge_class ?? '',
  badgeText: row.badge_text ?? '',
  signedByContractor: Boolean(row.signed_by_contractor),
  contractorSignDate: row.contractor_sign_date ?? '',
  contractorName: row.contractor_name ?? '',
  clientSigned: Boolean(row.client_signed),
  clientSignDate: row.client_sign_date ?? undefined,
  clientIp: row.client_ip ?? undefined,
  securityHash: row.security_hash ?? '',
  validDays: Number(row.valid_days ?? 5),
  flavorsDesc: row.flavors_desc ?? undefined,
  channelDesc: row.channel_desc ?? undefined
});

export async function saveContracts(contracts: ContractItem[]) {
  writeLocal('mc_contracts', contracts);
  await syncRows(
    'mc_contracts',
    contracts.map((item, i) => contractToRow(item, i)),
    contracts.map((item) => item.id)
  );
}

export async function loadContracts(): Promise<ContractItem[]> {
  const rows = await fetchRows('mc_contracts');
  if (rows.length) return rows.map(rowToContract);
  const seed = readLocal<ContractItem[]>('mc_contracts') ?? INITIAL_CONTRACTS;
  await saveContracts(seed);
  return seed;
}

// ---------- Configurações ----------

export async function saveSettings(values: Record<string, unknown>) {
  settingsCache = { ...settingsCache, ...values };
  writeLocal('mc_settings', settingsCache);
  const { error } = await supabase
    .from('mc_settings')
    .upsert({ id: 'default', data: settingsCache as Json }, { onConflict: 'id' });
  if (error) throw error;
}

export async function loadSettings(): Promise<Record<string, unknown>> {
  const { data, error } = await supabase
    .from('mc_settings')
    .select('data')
    .eq('id', 'default')
    .maybeSingle();
  if (!error && data?.data && typeof data.data === 'object') {
    settingsCache = { ...DEFAULT_SETTINGS, ...(data.data as Record<string, unknown>) };
    writeLocal('mc_settings', settingsCache);
    return settingsCache;
  }
  const local = readLocal<Record<string, unknown>>('mc_settings');
  const seed = { ...DEFAULT_SETTINGS, ...(local ?? {}) };
  await saveSettings(seed);
  return settingsCache;
}

// ---------- Carregamento inicial ----------

export interface BackofficeData {
  leads: Lead[];
  payments: PaymentItem[];
  contracts: ContractItem[];
}

export async function loadBackofficeData(): Promise<BackofficeData> {
  // Guarda o que existe no navegador ANTES de qualquer leitura do banco.
  const localSnapshot = hasMigrated()
    ? null
    : {
        leads: readLocal<Lead[]>('mc_leads') ?? [],
        payments: readLocal<PaymentItem[]>('mc_payments') ?? [],
        contracts: readLocal<ContractItem[]>('mc_contracts') ?? [],
        settings: readLocal<Record<string, unknown>>('mc_settings')
      };

  let [leads, payments, contracts] = await Promise.all([
    loadLeads(),
    loadPayments(),
    loadContracts()
  ]);
  await loadSettings();

  // 1ª vez neste computador: traz para o banco o que ainda so existia no navegador.
  if (!hasMigrated() && localSnapshot) {
    const localLeads = localSnapshot.leads;
    const localPayments = localSnapshot.payments;
    const localContracts = localSnapshot.contracts;
    const localSettings = localSnapshot.settings;

    const knownLeads = new Set(leads.map((l) => l.id));
    const missingLeads = localLeads.filter((l) => !knownLeads.has(l.id));
    if (missingLeads.length) {
      leads = [...missingLeads, ...leads];
      await saveLeads(leads);
    }

    const knownPayments = new Set(payments.map((p) => p.id));
    const missingPayments = localPayments.filter((p) => !knownPayments.has(p.id));
    if (missingPayments.length) {
      payments = [...missingPayments, ...payments];
      await savePayments(payments);
    }

    const knownContracts = new Set(contracts.map((c) => c.id));
    const missingContracts = localContracts.filter((c) => !knownContracts.has(c.id));
    if (missingContracts.length) {
      contracts = [...missingContracts, ...contracts];
      await saveContracts(contracts);
    }

    if (localSettings && Object.keys(localSettings).length) {
      await saveSettings(localSettings);
    }

    markMigrated();
  }

  return { leads, payments, contracts };
}
