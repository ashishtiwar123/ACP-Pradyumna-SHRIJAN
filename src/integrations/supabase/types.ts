export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
          role: string | null
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
          role?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          }
        ]
      }

      startup_profiles: {
        Row: {
          id: string
          user_id: string
          startup_name: string
          industry: string | null
          stage: string | null
          description: string | null
          team_size: number | null
          founded_year: number | null
          website: string | null
          is_complete: boolean | null
          created_at: string | null
          updated_at: string | null
          headquarters: string | null
          legal_entity_name: string | null
          incorporation_country: string | null
          contact_email: string | null
          contact_phone: number | null
          revenue_current_year: number | null
          monthly_burn: number | null
          runway_months: number | null
          funding_ask: number | null
          funding_use: string | null
        }
        Insert: {
          id?: string
          user_id: string
          startup_name: string
          industry?: string | null
          stage?: string | null
          description?: string | null
          team_size?: number | null
          founded_year?: number | null
          website?: string | null
          is_complete?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          headquarters?: string | null
          legal_entity_name?: string | null
          incorporation_country?: string | null
          contact_email?: string | null
          contact_phone?: number | null
          revenue_current_year?: number | null
          monthly_burn?: number | null
          runway_months?: number | null
          funding_ask?: number | null
          funding_use?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          startup_name?: string
          industry?: string | null
          stage?: string | null
          description?: string | null
          team_size?: number | null
          founded_year?: number | null
          website?: string | null
          is_complete?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          headquarters?: string | null
          legal_entity_name?: string | null
          incorporation_country?: string | null
          contact_email?: string | null
          contact_phone?: number | null
          revenue_current_year?: number | null
          monthly_burn?: number | null
          runway_months?: number | null
          funding_ask?: number | null
          funding_use?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "startup_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      uploads: {
        Row: {
          id: string
          user_id: string
          startup_profile_id: string | null
          file_name: string
          file_path: string
          file_type: string | null
          file_size: number | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          startup_profile_id?: string | null
          file_name: string
          file_path: string
          file_type?: string | null
          file_size?: number | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          startup_profile_id?: string | null
          file_name?: string
          file_path?: string
          file_type?: string | null
          file_size?: number | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploads_startup_profile_id_fkey"
            columns: ["startup_profile_id"]
            isOneToOne: false
            referencedRelation: "startup_profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      analysis_results: {
        Row: {
          id: string
          upload_id: string
          user_id: string
          executive_summary: string | null
          slide_insights: Json | null
          red_flags: Json | null
          key_metrics: Json | null
          overall_score: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          upload_id: string
          user_id: string
          executive_summary?: string | null
          slide_insights?: Json | null
          red_flags?: Json | null
          key_metrics?: Json | null
          overall_score?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          upload_id?: string
          user_id?: string
          executive_summary?: string | null
          slide_insights?: Json | null
          red_flags?: Json | null
          key_metrics?: Json | null
          overall_score?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      analysis_logs: {
        Row: {
          id: string
          user_id: string
          startup_profile_id: string | null
          model_used: string | null
          request_summary: string | null
          response_summary: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          startup_profile_id?: string | null
          model_used?: string | null
          request_summary?: string | null
          response_summary?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          startup_profile_id?: string | null
          model_used?: string | null
          request_summary?: string | null
          response_summary?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_logs_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_logs_startup_fkey"
            columns: ["startup_profile_id"]
            isOneToOne: false
            referencedRelation: "startup_profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      healthcare_details: {
        Row: {
          startup_profile_id: string
          regulatory_approvals: string | null
          clinical_stage: string | null
          target_patient_population: string | null
          reimbursement_strategy: string | null
          clinical_partners: string | null
          estimated_time_to_market_months: number | null
          created_at: string | null
        }
        Insert: {
          startup_profile_id: string
          regulatory_approvals?: string | null
          clinical_stage?: string | null
          target_patient_population?: string | null
          reimbursement_strategy?: string | null
          clinical_partners?: string | null
          estimated_time_to_market_months?: number | null
          created_at?: string | null
        }
        Update: {
          startup_profile_id?: string
          regulatory_approvals?: string | null
          clinical_stage?: string | null
          target_patient_population?: string | null
          reimbursement_strategy?: string | null
          clinical_partners?: string | null
          estimated_time_to_market_months?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "healthcare_details_fkey"
            columns: ["startup_profile_id"]
            isOneToOne: true
            referencedRelation: "startup_profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      fintech_details: {
        Row: {
          startup_profile_id: string
          licencing_requirements: string | null
          payments_volume_30d: number | null
          kyc_process: string | null
          principal_markets: string | null
          integrations: string | null
          created_at: string | null
        }
        Insert: {
          startup_profile_id: string
          licencing_requirements?: string | null
          payments_volume_30d?: number | null
          kyc_process?: string | null
          principal_markets?: string | null
          integrations?: string | null
          created_at?: string | null
        }
        Update: {
          startup_profile_id?: string
          licencing_requirements?: string | null
          payments_volume_30d?: number | null
          kyc_process?: string | null
          principal_markets?: string | null
          integrations?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fintech_details_fkey"
            columns: ["startup_profile_id"]
            isOneToOne: true
            referencedRelation: "startup_profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      food_details: {
        Row: {
          startup_profile_id: string
          suppliers: string | null
          supply_chain_risks: string | null
          perishability_days: number | null
          food_safety_certifications: string | null
          gross_margin_percent: number | null
          created_at: string | null
        }
        Insert: {
          startup_profile_id: string
          suppliers?: string | null
          supply_chain_risks?: string | null
          perishability_days?: number | null
          food_safety_certifications?: string | null
          gross_margin_percent?: number | null
          created_at?: string | null
        }
        Update: {
          startup_profile_id?: string
          suppliers?: string | null
          supply_chain_risks?: string | null
          perishability_days?: number | null
          food_safety_certifications?: string | null
          gross_margin_percent?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_details_fkey"
            columns: ["startup_profile_id"]
            isOneToOne: true
            referencedRelation: "startup_profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      ecommerce_details: {
        Row: {
          startup_profile_id: string
          primary_channels: string | null
          average_order_value: number | null
          monthly_active_buyers: number | null
          fulfillment_strategy: string | null
          return_rate_percent: number | null
          created_at: string | null
        }
        Insert: {
          startup_profile_id: string
          primary_channels?: string | null
          average_order_value?: number | null
          monthly_active_buyers?: number | null
          fulfillment_strategy?: string | null
          return_rate_percent?: number | null
          created_at?: string | null
        }
        Update: {
          startup_profile_id?: string
          primary_channels?: string | null
          average_order_value?: number | null
          monthly_active_buyers?: number | null
          fulfillment_strategy?: string | null
          return_rate_percent?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ecommerce_details_fkey"
            columns: ["startup_profile_id"]
            isOneToOne: true
            referencedRelation: "startup_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      founder_assets: {
        Row: {
          id: string
          user_id: string
          personal_net_worth: number | null
          liquid_assets: number | null
          personal_annual_income: number | null
          credit_score: number | null
          stock_investments: number | null
          crypto_investments: number | null
          real_estate_investments: number | null
          other_investments: number | null
          total_investment_portfolio: number | null
          primary_residence_value: number | null
          investment_properties_value: number | null
          total_real_estate_debt: number | null
          previous_startup_exits: number | null
          current_business_equity_value: number | null
          intellectual_property_value: number | null
          business_assets_description: string | null
          personal_debt: number | null
          monthly_personal_expenses: number | null
          dependents_count: number | null
          personal_funds_committed_to_startup: number | null
          previous_funding_raised: number | null
          investor_connections: string | null
          board_memberships: string | null
          industry_experience_years: number | null
          previous_companies: string | null
          professional_network_value: string | null
          advisory_roles: string | null
          insurance_coverage_amount: number | null
          retirement_savings: number | null
          emergency_fund_months: number | null
          risk_tolerance: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          personal_net_worth?: number | null
          liquid_assets?: number | null
          personal_annual_income?: number | null
          credit_score?: number | null
          stock_investments?: number | null
          crypto_investments?: number | null
          real_estate_investments?: number | null
          other_investments?: number | null
          primary_residence_value?: number | null
          investment_properties_value?: number | null
          total_real_estate_debt?: number | null
          previous_startup_exits?: number | null
          current_business_equity_value?: number | null
          intellectual_property_value?: number | null
          business_assets_description?: string | null
          personal_debt?: number | null
          monthly_personal_expenses?: number | null
          dependents_count?: number | null
          personal_funds_committed_to_startup?: number | null
          previous_funding_raised?: number | null
          investor_connections?: string | null
          board_memberships?: string | null
          industry_experience_years?: number | null
          previous_companies?: string | null
          professional_network_value?: string | null
          advisory_roles?: string | null
          insurance_coverage_amount?: number | null
          retirement_savings?: number | null
          emergency_fund_months?: number | null
          risk_tolerance?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          personal_net_worth?: number | null
          liquid_assets?: number | null
          personal_annual_income?: number | null
          credit_score?: number | null
          stock_investments?: number | null
          crypto_investments?: number | null
          real_estate_investments?: number | null
          other_investments?: number | null
          primary_residence_value?: number | null
          investment_properties_value?: number | null
          total_real_estate_debt?: number | null
          previous_startup_exits?: number | null
          current_business_equity_value?: number | null
          intellectual_property_value?: number | null
          business_assets_description?: string | null
          personal_debt?: number | null
          monthly_personal_expenses?: number | null
          dependents_count?: number | null
          personal_funds_committed_to_startup?: number | null
          previous_funding_raised?: number | null
          investor_connections?: string | null
          board_memberships?: string | null
          industry_experience_years?: number | null
          previous_companies?: string | null
          professional_network_value?: string | null
          advisory_roles?: string | null
          insurance_coverage_amount?: number | null
          retirement_savings?: number | null
          emergency_fund_months?: number | null
          risk_tolerance?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "founder_assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      investors: {
        Row: {
          id: string
          profile_id: string
          org_name: string | null
          investor_type: string | null
          preferred_industries: Json | null
          invested_startups: Json | null
          total_invested: number | null
          recent_activity: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          org_name?: string | null
          investor_type?: string | null
          preferred_industries?: Json | null
          invested_startups?: Json | null
          total_invested?: number | null
          recent_activity?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          org_name?: string | null
          investor_type?: string | null
          preferred_industries?: Json | null
          invested_startups?: Json | null
          total_invested?: number | null
          recent_activity?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investors_profile_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
