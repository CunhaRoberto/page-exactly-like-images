export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      mc_contracts: {
        Row: {
          badge_class: string | null
          badge_text: string | null
          channel_desc: string | null
          client_address: string | null
          client_cpf: string | null
          client_ip: string | null
          client_name: string
          client_rg: string | null
          client_short: string
          client_sign_date: string | null
          client_signed: boolean
          contract_code: string
          contractor_name: string | null
          contractor_sign_date: string | null
          event_date: string
          event_location: string
          event_type: string
          flavors_desc: string | null
          hours: number
          id: string
          model: string
          position: number
          security_hash: string | null
          signal_value: number
          signed_by_contractor: boolean
          status: string
          total_value: number
          updated_at: string
          valid_days: number
        }
        Insert: {
          badge_class?: string | null
          badge_text?: string | null
          channel_desc?: string | null
          client_address?: string | null
          client_cpf?: string | null
          client_ip?: string | null
          client_name: string
          client_rg?: string | null
          client_short: string
          client_sign_date?: string | null
          client_signed?: boolean
          contract_code: string
          contractor_name?: string | null
          contractor_sign_date?: string | null
          event_date: string
          event_location: string
          event_type: string
          flavors_desc?: string | null
          hours?: number
          id: string
          model: string
          position?: number
          security_hash?: string | null
          signal_value?: number
          signed_by_contractor?: boolean
          status: string
          total_value?: number
          updated_at?: string
          valid_days?: number
        }
        Update: {
          badge_class?: string | null
          badge_text?: string | null
          channel_desc?: string | null
          client_address?: string | null
          client_cpf?: string | null
          client_ip?: string | null
          client_name?: string
          client_rg?: string | null
          client_short?: string
          client_sign_date?: string | null
          client_signed?: boolean
          contract_code?: string
          contractor_name?: string | null
          contractor_sign_date?: string | null
          event_date?: string
          event_location?: string
          event_type?: string
          flavors_desc?: string | null
          hours?: number
          id?: string
          model?: string
          position?: number
          security_hash?: string | null
          signal_value?: number
          signed_by_contractor?: boolean
          status?: string
          total_value?: number
          updated_at?: string
          valid_days?: number
        }
        Relationships: []
      }
      mc_leads: {
        Row: {
          avatar_color: string
          avatar_text: string
          checklist: Json
          city: string
          email: string
          event_date: string
          event_type: string
          guest_count: number
          id: string
          lead_code: string
          location: string
          name: string
          notes: string | null
          phone: string
          position: number
          preferred_flavors: Json
          proposal_amount: number | null
          received_at: string
          status: string
          structure: string
          updated_at: string
          vegan_requested: boolean
        }
        Insert: {
          avatar_color: string
          avatar_text: string
          checklist?: Json
          city: string
          email: string
          event_date: string
          event_type: string
          guest_count?: number
          id: string
          lead_code: string
          location: string
          name: string
          notes?: string | null
          phone: string
          position?: number
          preferred_flavors?: Json
          proposal_amount?: number | null
          received_at: string
          status: string
          structure: string
          updated_at?: string
          vegan_requested?: boolean
        }
        Update: {
          avatar_color?: string
          avatar_text?: string
          checklist?: Json
          city?: string
          email?: string
          event_date?: string
          event_type?: string
          guest_count?: number
          id?: string
          lead_code?: string
          location?: string
          name?: string
          notes?: string | null
          phone?: string
          position?: number
          preferred_flavors?: Json
          proposal_amount?: number | null
          received_at?: string
          status?: string
          structure?: string
          updated_at?: string
          vegan_requested?: boolean
        }
        Relationships: []
      }
      mc_payments: {
        Row: {
          auth_code: string | null
          balance_due_date: string
          balance_value: number
          category: string
          client_color: string
          client_initials: string
          client_name: string
          event_date: string
          event_name: string
          id: string
          liquidation_status: string
          method: string
          package_type: string
          position: number
          signal_desc: string
          signal_status_desc: string
          total_value: number
          updated_at: string
        }
        Insert: {
          auth_code?: string | null
          balance_due_date: string
          balance_value?: number
          category: string
          client_color: string
          client_initials: string
          client_name: string
          event_date: string
          event_name: string
          id: string
          liquidation_status: string
          method: string
          package_type: string
          position?: number
          signal_desc: string
          signal_status_desc: string
          total_value?: number
          updated_at?: string
        }
        Update: {
          auth_code?: string | null
          balance_due_date?: string
          balance_value?: number
          category?: string
          client_color?: string
          client_initials?: string
          client_name?: string
          event_date?: string
          event_name?: string
          id?: string
          liquidation_status?: string
          method?: string
          package_type?: string
          position?: number
          signal_desc?: string
          signal_status_desc?: string
          total_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      mc_settings: {
        Row: {
          data: Json
          id: string
          updated_at: string
        }
        Insert: {
          data?: Json
          id?: string
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
