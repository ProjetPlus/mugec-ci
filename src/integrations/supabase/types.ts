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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string
          entity: string | null
          entity_id: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      cotisations: {
        Row: {
          created_at: string
          id: string
          member_id: string
          methode: string | null
          montant: number
          paye_le: string | null
          periode: string
          reference: string | null
          statut: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          methode?: string | null
          montant: number
          paye_le?: string | null
          periode: string
          reference?: string | null
          statut?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          methode?: string | null
          montant?: number
          paye_le?: string | null
          periode?: string
          reference?: string | null
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cotisations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      dependants: {
        Row: {
          created_at: string
          date_naissance: string | null
          id: string
          member_id: string
          nom: string
          prenoms: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_naissance?: string | null
          id?: string
          member_id: string
          nom: string
          prenoms?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_naissance?: string | null
          id?: string
          member_id?: string
          nom?: string
          prenoms?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dependants_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          file_name: string | null
          id: string
          member_id: string
          mime_type: string | null
          offline_available: boolean
          title: string | null
          type: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          id?: string
          member_id: string
          mime_type?: string | null
          offline_available?: boolean
          title?: string | null
          type: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string
          file_name?: string | null
          id?: string
          member_id?: string
          mime_type?: string | null
          offline_available?: boolean
          title?: string | null
          type?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_messages: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          topic_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          topic_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_messages_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          author_id: string
          closed: boolean
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          closed?: boolean
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          closed?: boolean
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          adresse: string | null
          ayants_droit: string | null
          cni: string | null
          collectivite: string | null
          created_at: string
          date_embauche: string | null
          date_inscription: string | null
          date_naissance: string | null
          direction: string | null
          email: string | null
          fonction: string | null
          frais_paye: boolean
          id: string
          is_legacy: boolean
          lieu_naissance: string | null
          matricule: string | null
          matricule_pro: string | null
          nom: string
          paiement_methode: string | null
          payment_confirmed_at: string | null
          payment_reference: string | null
          photo_required: boolean
          photo_url: string | null
          prenoms: string
          qr_code: string | null
          region: string | null
          sexe: string | null
          source: string
          statut: string
          telephone: string | null
          updated_at: string
          user_id: string
          validation_mode: string
        }
        Insert: {
          adresse?: string | null
          ayants_droit?: string | null
          cni?: string | null
          collectivite?: string | null
          created_at?: string
          date_embauche?: string | null
          date_inscription?: string | null
          date_naissance?: string | null
          direction?: string | null
          email?: string | null
          fonction?: string | null
          frais_paye?: boolean
          id?: string
          is_legacy?: boolean
          lieu_naissance?: string | null
          matricule?: string | null
          matricule_pro?: string | null
          nom: string
          paiement_methode?: string | null
          payment_confirmed_at?: string | null
          payment_reference?: string | null
          photo_required?: boolean
          photo_url?: string | null
          prenoms: string
          qr_code?: string | null
          region?: string | null
          sexe?: string | null
          source?: string
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id: string
          validation_mode?: string
        }
        Update: {
          adresse?: string | null
          ayants_droit?: string | null
          cni?: string | null
          collectivite?: string | null
          created_at?: string
          date_embauche?: string | null
          date_inscription?: string | null
          date_naissance?: string | null
          direction?: string | null
          email?: string | null
          fonction?: string | null
          frais_paye?: boolean
          id?: string
          is_legacy?: boolean
          lieu_naissance?: string | null
          matricule?: string | null
          matricule_pro?: string | null
          nom?: string
          paiement_methode?: string | null
          payment_confirmed_at?: string | null
          payment_reference?: string | null
          photo_required?: boolean
          photo_url?: string | null
          prenoms?: string
          qr_code?: string | null
          region?: string | null
          sexe?: string | null
          source?: string
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string
          validation_mode?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          author_id: string | null
          body: string
          cover_url: string | null
          created_at: string
          id: string
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body: string
          cover_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          cover_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          active: boolean
          body: string
          channel: string
          created_at: string
          event: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          body: string
          channel: string
          created_at?: string
          event: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          body?: string
          channel?: string
          created_at?: string
          event?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          channel: string
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body: string
          channel: string
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications_log: {
        Row: {
          canal: string
          contenu: string
          created_at: string
          error_message: string | null
          event: string
          id: string
          member_id: string | null
          provider: string | null
          provider_reference: string | null
          sent_at: string | null
          statut: string
          user_id: string | null
        }
        Insert: {
          canal: string
          contenu: string
          created_at?: string
          error_message?: string | null
          event: string
          id?: string
          member_id?: string | null
          provider?: string | null
          provider_reference?: string | null
          sent_at?: string | null
          statut?: string
          user_id?: string | null
        }
        Update: {
          canal?: string
          contenu?: string
          created_at?: string
          error_message?: string | null
          event?: string
          id?: string
          member_id?: string | null
          provider?: string | null
          provider_reference?: string | null
          sent_at?: string | null
          statut?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_log_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunites: {
        Row: {
          created_at: string
          date_limite: string | null
          description: string
          id: string
          lieu: string | null
          published: boolean
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_limite?: string | null
          description: string
          id?: string
          lieu?: string | null
          published?: boolean
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_limite?: string | null
          description?: string
          id?: string
          lieu?: string | null
          published?: boolean
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          member_id: string
          montant_total: number
          operateur: string | null
          paid_at: string | null
          part_miprojet: number
          part_mutuelle: number
          periode: string | null
          reference_transaction: string | null
          statut_paiement: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          montant_total: number
          operateur?: string | null
          paid_at?: string | null
          part_miprojet?: number
          part_mutuelle?: number
          periode?: string | null
          reference_transaction?: string | null
          statut_paiement?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          montant_total?: number
          operateur?: string | null
          paid_at?: string | null
          part_miprojet?: number
          part_mutuelle?: number
          periode?: string | null
          reference_transaction?: string | null
          statut_paiement?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions_miprojet: {
        Row: {
          created_at: string
          date_virement: string | null
          id: string
          montant: number
          reference: string | null
          statut: string
          subscription_id: string
        }
        Insert: {
          created_at?: string
          date_virement?: string | null
          id?: string
          montant: number
          reference?: string | null
          statut?: string
          subscription_id: string
        }
        Update: {
          created_at?: string
          date_virement?: string | null
          id?: string
          montant?: number
          reference?: string | null
          statut?: string
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_miprojet_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          collectivite: string | null
          created_at: string
          id: string
          region: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          collectivite?: string | null
          created_at?: string
          id?: string
          region?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          collectivite?: string | null
          created_at?: string
          id?: string
          region?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin_national"
        | "admin_regional"
        | "admin_local"
        | "agent_saisie"
        | "membre"
        | "president"
        | "secretaire_general"
        | "tresorier_national"
        | "commissaire_comptes"
        | "secretaire_regional"
        | "tresorier_regional"
        | "member"
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
    Enums: {
      app_role: [
        "super_admin",
        "admin_national",
        "admin_regional",
        "admin_local",
        "agent_saisie",
        "membre",
        "president",
        "secretaire_general",
        "tresorier_national",
        "commissaire_comptes",
        "secretaire_regional",
        "tresorier_regional",
        "member",
      ],
    },
  },
} as const
