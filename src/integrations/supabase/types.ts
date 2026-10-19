export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type TimestampFields = { created_at: string; updated_at: string };

export type Database = {
  __InternalSupabase: { PostgrestVersion: '14.18' };
  public: {
    Tables: {
      leads: Table<{
        id: string; lead_code: string; name: string; event_type: string; event_date: string;
        guest_count: number; location: string; city: string; structure: string; status: string;
        phone: string; email: string; notes: string | null; preferred_flavors: Json;
        vegan_requested: boolean; received_at: string; avatar_text: string; avatar_color: string;
        checklist: Json; proposal_amount: number | null;
      } & TimestampFields>;
      payments: Table<{
        id: string; client_name: string; client_initials: string; client_color: string;
        event_name: string; event_date: string; package_type: string; total_value: number;
        signal_desc: string; signal_status_desc: string; balance_value: number;
        balance_due_date: string; liquidation_status: string; method: string; category: string;
        auth_code: string | null;
      } & TimestampFields>;
      contracts: Table<{
        id: string; contract_code: string; client_name: string; client_short: string;
        client_cpf: string; client_rg: string; client_address: string; event_type: string;
        event_date: string; event_location: string; model: string; hours: number; total_value: number;
        signal_value: number; status: string; badge_class: string; badge_text: string;
        signed_by_contractor: boolean; contractor_sign_date: string; contractor_name: string;
        client_signed: boolean; client_sign_date: string | null; client_ip: string | null;
        security_hash: string; valid_days: number; flavors_desc: string; channel_desc: string;
      } & TimestampFields>;
      settings: Table<{
        id: string; company_name: string; cnpj: string; phone: string; email: string;
        address: string; bike_price: number; station_price: number; extra_hour_price: number;
        updated_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
