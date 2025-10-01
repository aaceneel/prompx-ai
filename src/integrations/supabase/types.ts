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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ab_test_results: {
        Row: {
          id: string
          metric_name: string
          metric_value: number
          recorded_at: string
          sample_size: number
          test_id: string
          variant: string
        }
        Insert: {
          id?: string
          metric_name: string
          metric_value: number
          recorded_at?: string
          sample_size?: number
          test_id: string
          variant: string
        }
        Update: {
          id?: string
          metric_name?: string
          metric_value?: number
          recorded_at?: string
          sample_size?: number
          test_id?: string
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "ab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_tests: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          status: string
          test_name: string
          user_id: string
          variant_a_prompt: string
          variant_b_prompt: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          test_name: string
          user_id: string
          variant_a_prompt: string
          variant_b_prompt: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          test_name?: string
          user_id?: string
          variant_a_prompt?: string
          variant_b_prompt?: string
        }
        Relationships: []
      }
      analytics_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          prompt_id: string | null
          recorded_at: string
          user_id: string
          workflow_id: string | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          prompt_id?: string | null
          recorded_at?: string
          user_id: string
          workflow_id?: string | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          prompt_id?: string | null
          recorded_at?: string
          user_id?: string
          workflow_id?: string | null
        }
        Relationships: []
      }
      bias_filters: {
        Row: {
          bias_type: string
          created_at: string
          filter_name: string
          id: string
          is_active: boolean | null
          keywords: string[]
          severity: string
        }
        Insert: {
          bias_type: string
          created_at?: string
          filter_name: string
          id?: string
          is_active?: boolean | null
          keywords: string[]
          severity?: string
        }
        Update: {
          bias_type?: string
          created_at?: string
          filter_name?: string
          id?: string
          is_active?: boolean | null
          keywords?: string[]
          severity?: string
        }
        Relationships: []
      }
      compliance_rules: {
        Row: {
          created_at: string
          description: string | null
          detection_pattern: string
          id: string
          industry: string | null
          is_active: boolean | null
          remediation_guidance: string | null
          rule_name: string
          rule_type: string
          severity: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          detection_pattern: string
          id?: string
          industry?: string | null
          is_active?: boolean | null
          remediation_guidance?: string | null
          rule_name: string
          rule_type: string
          severity?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          detection_pattern?: string
          id?: string
          industry?: string | null
          is_active?: boolean | null
          remediation_guidance?: string | null
          rule_name?: string
          rule_type?: string
          severity?: string
          updated_at?: string
        }
        Relationships: []
      }
      industry_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry: string
          platform: string
          template_name: string
          template_prompt: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry: string
          platform: string
          template_name: string
          template_prompt: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string
          platform?: string
          template_name?: string
          template_prompt?: string
        }
        Relationships: []
      }
      legal_prompt_packs: {
        Row: {
          compliance_notes: string | null
          compliance_standards: string[] | null
          created_at: string
          id: string
          industry: string
          is_verified: boolean | null
          pack_name: string
          prompt_content: string
          prompt_title: string
          updated_at: string
          use_case: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          compliance_notes?: string | null
          compliance_standards?: string[] | null
          created_at?: string
          id?: string
          industry: string
          is_verified?: boolean | null
          pack_name: string
          prompt_content: string
          prompt_title: string
          updated_at?: string
          use_case: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          compliance_notes?: string | null
          compliance_standards?: string[] | null
          created_at?: string
          id?: string
          industry?: string
          is_verified?: boolean | null
          pack_name?: string
          prompt_content?: string
          prompt_title?: string
          updated_at?: string
          use_case?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          category: string
          created_at: string
          description: string
          downloads: number | null
          id: string
          is_active: boolean | null
          is_workflow: boolean | null
          preview_available: boolean | null
          preview_content: string | null
          price: number
          prompt_content: string
          seller_id: string
          tags: string[] | null
          title: string
          updated_at: string
          views: number | null
          workflow_steps: Json | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          downloads?: number | null
          id?: string
          is_active?: boolean | null
          is_workflow?: boolean | null
          preview_available?: boolean | null
          preview_content?: string | null
          price: number
          prompt_content: string
          seller_id: string
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number | null
          workflow_steps?: Json | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          downloads?: number | null
          id?: string
          is_active?: boolean | null
          is_workflow?: boolean | null
          preview_available?: boolean | null
          preview_content?: string | null
          price?: number
          prompt_content?: string
          seller_id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number | null
          workflow_steps?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      prompt_compliance_checks: {
        Row: {
          check_results: Json
          checked_at: string
          compliance_score: number | null
          id: string
          prompt_text: string
          user_id: string
        }
        Insert: {
          check_results: Json
          checked_at?: string
          compliance_score?: number | null
          id?: string
          prompt_text: string
          user_id: string
        }
        Update: {
          check_results?: Json
          checked_at?: string
          compliance_score?: number | null
          id?: string
          prompt_text?: string
          user_id?: string
        }
        Relationships: []
      }
      prompt_history: {
        Row: {
          created_at: string
          id: string
          optimized_prompt: string
          original_prompt: string
          platform: string
          rating: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          optimized_prompt: string
          original_prompt: string
          platform: string
          rating?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          optimized_prompt?: string
          original_prompt?: string
          platform?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_purchases: {
        Row: {
          buyer_id: string
          id: string
          listing_id: string
          price: number
          purchased_at: string
        }
        Insert: {
          buyer_id: string
          id?: string
          listing_id: string
          price: number
          purchased_at?: string
        }
        Update: {
          buyer_id?: string
          id?: string
          listing_id?: string
          price?: number
          purchased_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_purchases_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_ratings: {
        Row: {
          created_at: string
          id: string
          prompt_id: string
          rating: number
          review: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_id: string
          rating: number
          review?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt_id?: string
          rating?: number
          review?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_workflows: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          steps: Json
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          steps: Json
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          steps?: Json
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_prompts: {
        Row: {
          category: string | null
          created_at: string
          created_by: string
          id: string
          is_workflow: boolean | null
          optimized_prompt: string | null
          original_prompt: string
          platform: string | null
          team_id: string
          title: string
          updated_at: string
          workflow_steps: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by: string
          id?: string
          is_workflow?: boolean | null
          optimized_prompt?: string | null
          original_prompt: string
          platform?: string | null
          team_id: string
          title: string
          updated_at?: string
          workflow_steps?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string
          id?: string
          is_workflow?: boolean | null
          optimized_prompt?: string | null
          original_prompt?: string
          platform?: string | null
          team_id?: string
          title?: string
          updated_at?: string
          workflow_steps?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "team_prompts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_type: string
          created_at: string
          duration_seconds: number | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          niche: string | null
          preferred_length: string | null
          preferred_tone: string | null
          style: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          niche?: string | null
          preferred_length?: string | null
          preferred_tone?: string | null
          style?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          niche?: string | null
          preferred_length?: string | null
          preferred_tone?: string | null
          style?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_listing_views: {
        Args: { listing_id: string }
        Returns: undefined
      }
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
