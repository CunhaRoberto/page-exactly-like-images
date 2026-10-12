export interface Lead {
  id: string;
  leadCode: string; // e.g. #MC-842
  name: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  location: string;
  city: string;
  structure: 'bike' | 'tradicional';
  status: 'novo' | 'atendimento' | 'proposta' | 'contrato' | 'ganho' | 'perdido';
  phone: string;
  email: string;
  notes?: string;
  preferredFlavors: string[];
  veganRequested?: boolean;
  receivedAt: string;
  avatarText: string;
  avatarColor: string;
  checklist: {
    dataAgenda: boolean;
    logistica: boolean;
    propostaEnviada: boolean;
    degustacao: boolean;
  };
  proposalAmount?: number;
}

export interface ProposalItem {
  id: string;
  leadId: string;
  proposalCode: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  location: string;
  structure: 'tradicional' | 'bike';
  guestCount: number;
  hours: number;
  staffCount: number;
  flavors: string[];
  toppings: string[];
  freight: number;
  freightDesc: string;
  discountPercent: number;
  totalValue: number;
  validDays: number;
  paymentCondition: string;
}

export interface PaymentItem {
  id: string;
  clientName: string;
  clientInitials: string;
  clientColor: string;
  eventName: string;
  eventDate: string;
  packageType: string;
  totalValue: number;
  signalDesc: string;
  signalStatusDesc: string;
  balanceValue: number;
  balanceDueDate: string;
  liquidationStatus: 'aguardando' | 'quitado' | 'pendente_parcela' | 'pago';
  method: 'pix' | 'cartao' | 'boleto';
  category: 'social' | 'corporativo';
  authCode?: string;
}

export interface ContractItem {
  id: string;
  contractCode: string; // e.g. CTR-2025-084
  clientName: string;
  clientShort: string;
  clientCpf: string;
  clientRg: string;
  clientAddress: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  model: string;
  hours: number;
  totalValue: number;
  signalValue: number;
  status: 'pendente' | 'assinado' | 'registrado' | 'aguardando';
  badgeClass: string;
  badgeText: string;
  signedByContractor: boolean;
  contractorSignDate: string;
  contractorName: string;
  clientSigned: boolean;
  clientSignDate?: string;
  clientIp?: string;
  securityHash: string;
  validDays: number;
  flavorsDesc: string;
  channelDesc: string;
}
