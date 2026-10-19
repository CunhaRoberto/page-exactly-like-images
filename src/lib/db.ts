import { supabase } from '../integrations/supabase/client';
import { ContractItem, Lead, PaymentItem } from '../types';

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

function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === 0) return null;
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length === 0) return null;
    return parsed as T;
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Não foi possível atualizar o cache local.', error);
  }
}

const MIGRATION_FLAG = 'mc_cloud_migrated_v1';
function hasMigrated(): boolean {
  try { return localStorage.getItem(MIGRATION_FLAG) === 'true'; } catch { return true; }
}
function markMigrated() {
  try { localStorage.setItem(MIGRATION_FLAG, 'true'); } catch (error) { console.warn(error); }
}

/** Todas as tabelas de registros possuem created_at; position não existe no esquema real. */
async function fetchRows(table: 'leads' | 'payments' | 'contracts'): Promise<AnyRow[]> {
  const { data, error } = await supabase.from(table as any).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as AnyRow[];
}

/** Salva/atualiza registros sem apagar os que não vieram nesta cópia da lista.
 * Exclusões devem ser explícitas, por ID, para evitar apagar dados de outro usuário/dispositivo.
 */
async function upsertRows(table: 'leads' | 'payments' | 'contracts', rows: AnyRow[]) {
  if (!rows.length) return;
  const { error } = await supabase.from(table as any).upsert(rows, { onConflict: 'id' });
  if (error) throw error;
}

async function deleteRow(table: 'leads' | 'payments' | 'contracts', id: string) {
  const { error } = await supabase.from(table as any).delete().eq('id', id);
  if (error) throw error;
}

// ---------- Leads ----------
const leadToRow = (lead: Lead): AnyRow => ({
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
  proposal_amount: lead.proposalAmount ?? null
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
  proposalAmount: row.proposal_amount == null ? undefined : Number(row.proposal_amount)
});

export async function saveLeads(leads: Lead[]) {
  await upsertRows('leads', leads.map(leadToRow));
  writeLocal('leads', leads);
}
export async function addLead(lead: Lead): Promise<void> {
  const { error } = await supabase.from('leads' as any).upsert(leadToRow(lead) as any, { onConflict: 'id' });
  if (error) throw error;
  const local = readLocal<Lead[]>('leads') ?? [];
  writeLocal('leads', [lead, ...local.filter((item) => item.id !== lead.id)]);
}
export async function deleteLead(id: string): Promise<void> {
  await deleteRow('leads', id);
  writeLocal('leads', (readLocal<Lead[]>('leads') ?? []).filter((item) => item.id !== id));
}
export async function loadLeads(): Promise<Lead[]> {
  const rows = await fetchRows('leads');
  const leads = rows.map(rowToLead);
  // Importa somente dados preexistentes no navegador; nunca semeia dados fictícios automaticamente.
  if (!rows.length && !hasMigrated()) {
    const local = readLocal<Lead[]>('leads') ?? [];
    if (local.length) await saveLeads(local);
    markMigrated();
    return local;
  }
  writeLocal('leads', leads);
  return leads;
}

// ---------- Pagamentos ----------
const paymentToRow = (item: PaymentItem): AnyRow => ({
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
  auth_code: item.authCode ?? null
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
  await upsertRows('payments', payments.map(paymentToRow));
  writeLocal('mc_payments', payments);
}
export async function addPayment(item: PaymentItem): Promise<void> {
  const { error } = await supabase.from('payments' as any).upsert(paymentToRow(item) as any, { onConflict: 'id' });
  if (error) throw error;
  writeLocal('mc_payments', [item, ...(readLocal<PaymentItem[]>('mc_payments') ?? []).filter((row) => row.id !== item.id)]);
}
export async function deletePayment(id: string): Promise<void> {
  await deleteRow('payments', id);
  writeLocal('mc_payments', (readLocal<PaymentItem[]>('mc_payments') ?? []).filter((item) => item.id !== id));
}
export async function loadPayments(): Promise<PaymentItem[]> {
  const rows = await fetchRows('payments');
  const payments = rows.map(rowToPayment);
  if (!rows.length && !hasMigrated()) {
    const local = readLocal<PaymentItem[]>('mc_payments') ?? [];
    if (local.length) await savePayments(local);
    return local;
  }
  writeLocal('mc_payments', payments);
  return payments;
}

// ---------- Contratos ----------
const contractToRow = (item: ContractItem): AnyRow => ({
  id: item.id,
  contract_code: item.contractCode,
  client_name: item.clientName,
  client_short: item.clientShort,
  client_cpf: item.clientCpf ?? '',
  client_rg: item.clientRg ?? '',
  client_address: item.clientAddress ?? '',
  event_type: item.eventType,
  event_date: item.eventDate,
  event_location: item.eventLocation,
  model: item.model,
  hours: item.hours,
  total_value: item.totalValue,
  signal_value: item.signalValue,
  status: item.status,
  badge_class: item.badgeClass ?? '',
  badge_text: item.badgeText ?? '',
  signed_by_contractor: item.signedByContractor,
  contractor_sign_date: item.contractorSignDate ?? '',
  contractor_name: item.contractorName ?? '',
  client_signed: item.clientSigned,
  client_sign_date: item.clientSignDate ?? null,
  client_ip: item.clientIp ?? null,
  security_hash: item.securityHash ?? '',
  valid_days: item.validDays,
  flavors_desc: item.flavorsDesc ?? '',
  channel_desc: item.channelDesc ?? ''
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
  await upsertRows('contracts', contracts.map(contractToRow));
  writeLocal('mc_contracts', contracts);
}
export async function addContract(item: ContractItem): Promise<void> {
  const { error } = await supabase.from('contracts' as any).upsert(contractToRow(item) as any, { onConflict: 'id' });
  if (error) throw error;
  writeLocal('mc_contracts', [item, ...(readLocal<ContractItem[]>('mc_contracts') ?? []).filter((row) => row.id !== item.id)]);
}
export async function deleteContract(id: string): Promise<void> {
  await deleteRow('contracts', id);
  writeLocal('mc_contracts', (readLocal<ContractItem[]>('mc_contracts') ?? []).filter((item) => item.id !== id));
}
export async function loadContracts(): Promise<ContractItem[]> {
  const rows = await fetchRows('contracts');
  const contracts = rows.map(rowToContract);
  if (!rows.length && !hasMigrated()) {
    const local = readLocal<ContractItem[]>('mc_contracts') ?? [];
    if (local.length) await saveContracts(local);
    return local;
  }
  writeLocal('mc_contracts', contracts);
  return contracts;
}

// ---------- Configurações ----------
const settingsToRow = (values: Record<string, unknown>): AnyRow => ({
  id: 'default',
  company_name: String(values.companyName ?? DEFAULT_SETTINGS.companyName),
  cnpj: String(values.cnpj ?? DEFAULT_SETTINGS.cnpj),
  phone: String(values.phone ?? DEFAULT_SETTINGS.phone),
  email: String(values.email ?? DEFAULT_SETTINGS.email),
  address: String(values.address ?? DEFAULT_SETTINGS.address),
  bike_price: Number(values.bikePrice ?? DEFAULT_SETTINGS.bikePrice),
  station_price: Number(values.stationPrice ?? DEFAULT_SETTINGS.stationPrice),
  extra_hour_price: Number(values.extraHourPrice ?? DEFAULT_SETTINGS.extraHourPrice)
});
const rowToSettings = (row: AnyRow): Record<string, unknown> => ({
  companyName: row.company_name,
  cnpj: row.cnpj,
  phone: row.phone,
  email: row.email,
  address: row.address,
  bikePrice: Number(row.bike_price ?? DEFAULT_SETTINGS.bikePrice),
  stationPrice: Number(row.station_price ?? DEFAULT_SETTINGS.stationPrice),
  extraHourPrice: Number(row.extra_hour_price ?? DEFAULT_SETTINGS.extraHourPrice)
});
export async function saveSettings(values: Record<string, unknown>) {
  const next = { ...settingsCache, ...values };
  const { error } = await supabase.from('settings' as any).upsert(settingsToRow(next) as any, { onConflict: 'id' });
  if (error) throw error;
  settingsCache = next;
  writeLocal('mc_settings', settingsCache);
}
export async function loadSettings(): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.from('settings' as any).select('*').eq('id', 'default').maybeSingle();
  if (error) throw error;
  if (data) {
    settingsCache = { ...DEFAULT_SETTINGS, ...rowToSettings(data as AnyRow) };
    writeLocal('mc_settings', settingsCache);
    return settingsCache;
  }
  // Defaults are shown locally but are not inserted automatically into the database.
  const local = readLocal<Record<string, unknown>>('mc_settings');
  settingsCache = { ...DEFAULT_SETTINGS, ...(local ?? {}) };
  return settingsCache;
}

export interface BackofficeData {
  leads: Lead[];
  payments: PaymentItem[];
  contracts: ContractItem[];
}
export async function loadBackofficeData(): Promise<BackofficeData> {
  const migrateLocal = !hasMigrated();
  const localSnapshot = migrateLocal ? {
    leads: readLocal<Lead[]>('leads') ?? [],
    payments: readLocal<PaymentItem[]>('mc_payments') ?? [],
    contracts: readLocal<ContractItem[]>('mc_contracts') ?? [],
    settings: readLocal<Record<string, unknown>>('mc_settings')
  } : null;

  let [leads, payments, contracts] = await Promise.all([loadLeads(), loadPayments(), loadContracts()]);
  await loadSettings();

  if (localSnapshot) {
    const mergeMissing = <T extends { id: string }>(remote: T[], local: T[]) => {
      const ids = new Set(remote.map((item) => item.id));
      return [...local.filter((item) => !ids.has(item.id)), ...remote];
    };
    const mergedLeads = mergeMissing(leads, localSnapshot.leads);
    const mergedPayments = mergeMissing(payments, localSnapshot.payments);
    const mergedContracts = mergeMissing(contracts, localSnapshot.contracts);
    if (mergedLeads.length !== leads.length) { leads = mergedLeads; await saveLeads(leads); }
    if (mergedPayments.length !== payments.length) { payments = mergedPayments; await savePayments(payments); }
    if (mergedContracts.length !== contracts.length) { contracts = mergedContracts; await saveContracts(contracts); }
    if (localSnapshot.settings && Object.keys(localSnapshot.settings).length) await saveSettings(localSnapshot.settings);
    markMigrated();
  }
  return { leads, payments, contracts };
}
