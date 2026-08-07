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
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      about_page: {
        Row: {
          created_at: string
          cta_description_translations: Json
          cta_highlight_translations: Json
          cta_label_translations: Json
          cta_title_translations: Json
          cta_url: string | null
          eyebrow_translations: Json
          highlight_translations: Json
          intro_translations: Json
          is_visible: boolean
          mission_translations: Json
          singleton_key: boolean
          stats: Json
          story_translations: Json
          team_translations: Json
          title_translations: Json
          updated_at: string
          values: Json
        }
        Insert: {
          created_at?: string
          cta_description_translations?: Json
          cta_highlight_translations?: Json
          cta_label_translations?: Json
          cta_title_translations?: Json
          cta_url?: string | null
          eyebrow_translations?: Json
          highlight_translations?: Json
          intro_translations?: Json
          is_visible?: boolean
          mission_translations?: Json
          singleton_key?: boolean
          stats?: Json
          story_translations?: Json
          team_translations?: Json
          title_translations?: Json
          updated_at?: string
          values?: Json
        }
        Update: {
          created_at?: string
          cta_description_translations?: Json
          cta_highlight_translations?: Json
          cta_label_translations?: Json
          cta_title_translations?: Json
          cta_url?: string | null
          eyebrow_translations?: Json
          highlight_translations?: Json
          intro_translations?: Json
          is_visible?: boolean
          mission_translations?: Json
          singleton_key?: boolean
          stats?: Json
          story_translations?: Json
          team_translations?: Json
          title_translations?: Json
          updated_at?: string
          values?: Json
        }
        Relationships: []
      }
      acquisition_section: {
        Row: {
          benefits: Json
          businesses: Json
          created_at: string
          cta_label_translations: Json
          cta_url: string | null
          description_translations: Json
          is_visible: boolean
          media_id: string | null
          singleton_key: boolean
          title_translations: Json
          updated_at: string
          variant: string
        }
        Insert: {
          benefits?: Json
          businesses?: Json
          created_at?: string
          cta_label_translations?: Json
          cta_url?: string | null
          description_translations?: Json
          is_visible?: boolean
          media_id?: string | null
          singleton_key?: boolean
          title_translations?: Json
          updated_at?: string
          variant?: string
        }
        Update: {
          benefits?: Json
          businesses?: Json
          created_at?: string
          cta_label_translations?: Json
          cta_url?: string | null
          description_translations?: Json
          is_visible?: boolean
          media_id?: string | null
          singleton_key?: boolean
          title_translations?: Json
          updated_at?: string
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "acquisition_section_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          display_name: string | null
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          role?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_faq_settings: {
        Row: {
          allowed_categories: string[]
          created_at: string
          cta_label_translations: Json
          cta_url: string | null
          fallback_translations: Json
          intro_translations: Json
          is_enabled: boolean
          singleton_key: boolean
          suggested_questions: Json
          updated_at: string
        }
        Insert: {
          allowed_categories?: string[]
          created_at?: string
          cta_label_translations?: Json
          cta_url?: string | null
          fallback_translations?: Json
          intro_translations?: Json
          is_enabled?: boolean
          singleton_key?: boolean
          suggested_questions?: Json
          updated_at?: string
        }
        Update: {
          allowed_categories?: string[]
          created_at?: string
          cta_label_translations?: Json
          cta_url?: string | null
          fallback_translations?: Json
          intro_translations?: Json
          is_enabled?: boolean
          singleton_key?: boolean
          suggested_questions?: Json
          updated_at?: string
        }
        Relationships: []
      }
      announcement_bar: {
        Row: {
          created_at: string
          ends_at: string | null
          is_enabled: boolean
          link_label_translations: Json
          link_url: string | null
          message_translations: Json
          singleton_key: boolean
          slides: Json
          starts_at: string | null
          updated_at: string
          variant: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          is_enabled?: boolean
          link_label_translations?: Json
          link_url?: string | null
          message_translations?: Json
          singleton_key?: boolean
          slides?: Json
          starts_at?: string | null
          updated_at?: string
          variant?: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          is_enabled?: boolean
          link_label_translations?: Json
          link_url?: string | null
          message_translations?: Json
          singleton_key?: boolean
          slides?: Json
          starts_at?: string | null
          updated_at?: string
          variant?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          id: string
          metadata: Json
          new_data: Json | null
          previous_data: Json | null
          target_id: string | null
          target_table: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          new_data?: Json | null
          previous_data?: Json | null
          target_id?: string | null
          target_table: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          new_data?: Json | null
          previous_data?: Json | null
          target_id?: string | null
          target_table?: string
        }
        Relationships: []
      }
      chat_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          assigned_to: string
          conversation_id: string
          ended_at: string | null
          id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          assigned_to: string
          conversation_id: string
          ended_at?: string | null
          id?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          assigned_to?: string
          conversation_id?: string
          ended_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_assignments_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          archived_at: string | null
          assigned_to: string | null
          created_at: string
          id: string
          last_message_at: string
          lead_id: string | null
          metadata: Json
          mode: string
          resolved_at: string | null
          source_page: string | null
          status: string
          updated_at: string
          visitor_id: string
        }
        Insert: {
          archived_at?: string | null
          assigned_to?: string | null
          created_at?: string
          id?: string
          last_message_at?: string
          lead_id?: string | null
          metadata?: Json
          mode?: string
          resolved_at?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          visitor_id: string
        }
        Update: {
          archived_at?: string | null
          assigned_to?: string | null
          created_at?: string
          id?: string
          last_message_at?: string
          lead_id?: string | null
          metadata?: Json
          mode?: string
          resolved_at?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "chat_visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_internal_notes: {
        Row: {
          author_user_id: string
          conversation_id: string
          created_at: string
          id: string
          note: string
          updated_at: string
        }
        Insert: {
          author_user_id: string
          conversation_id: string
          created_at?: string
          id?: string
          note: string
          updated_at?: string
        }
        Update: {
          author_user_id?: string
          conversation_id?: string
          created_at?: string
          id?: string
          note?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_internal_notes_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          ai_model: string | null
          ai_provider: string | null
          content: string
          content_format: string
          conversation_id: string
          created_at: string
          delivery_status: string
          id: string
          is_internal: boolean
          sender_type: string
          sender_user_id: string | null
        }
        Insert: {
          ai_model?: string | null
          ai_provider?: string | null
          content: string
          content_format?: string
          conversation_id: string
          created_at?: string
          delivery_status?: string
          id?: string
          is_internal?: boolean
          sender_type: string
          sender_user_id?: string | null
        }
        Update: {
          ai_model?: string | null
          ai_provider?: string | null
          content?: string
          content_format?: string
          conversation_id?: string
          created_at?: string
          delivery_status?: string
          id?: string
          is_internal?: boolean
          sender_type?: string
          sender_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_visitors: {
        Row: {
          anonymous_token_hash: string | null
          contact_id: string | null
          created_at: string
          first_seen_at: string
          id: string
          last_seen_at: string
          metadata: Json
          visitor_number: number | null
          preferred_locale: string
          updated_at: string
        }
        Insert: {
          anonymous_token_hash?: string | null
          contact_id?: string | null
          created_at?: string
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          metadata?: Json
          visitor_number?: number | null
          preferred_locale?: string
          updated_at?: string
        }
        Update: {
          anonymous_token_hash?: string | null
          contact_id?: string | null
          created_at?: string
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          metadata?: Json
          visitor_number?: number | null
          preferred_locale?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_visitors_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_knowledge: {
        Row: {
          category: string
          content_translations: Json
          created_at: string
          id: string
          is_ai_eligible: boolean
          is_enabled: boolean
          last_reviewed_at: string | null
          priority: number
          reviewed_by: string | null
          slug: string
          source_id: string | null
          source_type: string
          title_translations: Json
          updated_at: string
        }
        Insert: {
          category?: string
          content_translations?: Json
          created_at?: string
          id?: string
          is_ai_eligible?: boolean
          is_enabled?: boolean
          last_reviewed_at?: string | null
          priority?: number
          reviewed_by?: string | null
          slug: string
          source_id?: string | null
          source_type?: string
          title_translations?: Json
          updated_at?: string
        }
        Update: {
          category?: string
          content_translations?: Json
          created_at?: string
          id?: string
          is_ai_eligible?: boolean
          is_enabled?: boolean
          last_reviewed_at?: string | null
          priority?: number
          reviewed_by?: string | null
          slug?: string
          source_id?: string | null
          source_type?: string
          title_translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      chatbot_settings: {
        Row: {
          allowed_categories: string[]
          created_at: string
          escalation_message_translations: Json
          fallback_message_translations: Json
          human_support_enabled: boolean
          is_enabled: boolean
          lead_capture_mode: string
          offline_message_translations: Json
          provider_config_public: Json
          response_style: string
          singleton_key: boolean
          updated_at: string
          welcome_message_translations: Json
        }
        Insert: {
          allowed_categories?: string[]
          created_at?: string
          escalation_message_translations?: Json
          fallback_message_translations?: Json
          human_support_enabled?: boolean
          is_enabled?: boolean
          lead_capture_mode?: string
          offline_message_translations?: Json
          provider_config_public?: Json
          response_style?: string
          singleton_key?: boolean
          updated_at?: string
          welcome_message_translations?: Json
        }
        Update: {
          allowed_categories?: string[]
          created_at?: string
          escalation_message_translations?: Json
          fallback_message_translations?: Json
          human_support_enabled?: boolean
          is_enabled?: boolean
          lead_capture_mode?: string
          offline_message_translations?: Json
          provider_config_public?: Json
          response_style?: string
          singleton_key?: boolean
          updated_at?: string
          welcome_message_translations?: Json
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company: string | null
          consent_marketing: boolean
          consent_timestamp: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          preferred_locale: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          consent_marketing?: boolean
          consent_timestamp?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          preferred_locale?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          consent_marketing?: boolean
          consent_timestamp?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          preferred_locale?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversation_events: {
        Row: {
          actor_user_id: string | null
          conversation_id: string
          created_at: string
          event_type: string
          id: string
          metadata: Json
        }
        Insert: {
          actor_user_id?: string | null
          conversation_id: string
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          actor_user_id?: string | null
          conversation_id?: string
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "conversation_events_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      detail_pages: {
        Row: {
          content_translations: Json
          created_at: string
          id: string
          is_visible: boolean
          slug: string
          subtitle_translations: Json
          title_translations: Json
          updated_at: string
        }
        Insert: {
          content_translations?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          slug: string
          subtitle_translations?: Json
          title_translations?: Json
          updated_at?: string
        }
        Update: {
          content_translations?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          slug?: string
          subtitle_translations?: Json
          title_translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      email_events: {
        Row: {
          created_at: string
          delivered_at: string | null
          error_code: string | null
          error_message: string | null
          id: string
          idempotency_key: string | null
          metadata: Json
          provider: string
          provider_message_id: string | null
          recipient_email: string
          related_id: string | null
          related_type: string | null
          sender_email: string
          sent_at: string | null
          status: string
          template_key: string
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          provider?: string
          provider_message_id?: string | null
          recipient_email: string
          related_id?: string | null
          related_type?: string | null
          sender_email: string
          sent_at?: string | null
          status?: string
          template_key: string
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          provider?: string
          provider_message_id?: string | null
          recipient_email?: string
          related_id?: string | null
          related_type?: string | null
          sender_email?: string
          sent_at?: string | null
          status?: string
          template_key?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer_translations: Json
          category: string
          created_at: string
          display_order: number
          id: string
          is_ai_eligible: boolean
          is_featured: boolean
          is_visible: boolean
          question_translations: Json
          status: string
          updated_at: string
        }
        Insert: {
          answer_translations?: Json
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          is_ai_eligible?: boolean
          is_featured?: boolean
          is_visible?: boolean
          question_translations?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          answer_translations?: Json
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          is_ai_eligible?: boolean
          is_featured?: boolean
          is_visible?: boolean
          question_translations?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      final_cta: {
        Row: {
          created_at: string
          description_translations: Json
          is_visible: boolean
          primary_cta_label_translations: Json
          primary_cta_url: string | null
          secondary_cta_label_translations: Json
          secondary_cta_url: string | null
          singleton_key: boolean
          title_translations: Json
          updated_at: string
          variant: string
        }
        Insert: {
          created_at?: string
          description_translations?: Json
          is_visible?: boolean
          primary_cta_label_translations?: Json
          primary_cta_url?: string | null
          secondary_cta_label_translations?: Json
          secondary_cta_url?: string | null
          singleton_key?: boolean
          title_translations?: Json
          updated_at?: string
          variant?: string
        }
        Update: {
          created_at?: string
          description_translations?: Json
          is_visible?: boolean
          primary_cta_label_translations?: Json
          primary_cta_url?: string | null
          secondary_cta_label_translations?: Json
          secondary_cta_url?: string | null
          singleton_key?: boolean
          title_translations?: Json
          updated_at?: string
          variant?: string
        }
        Relationships: []
      }
      footer_groups: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_visible: boolean
          title_translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          title_translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          title_translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      footer_links: {
        Row: {
          created_at: string
          display_order: number
          group_id: string
          href: string
          id: string
          is_external: boolean
          is_visible: boolean
          label_translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          group_id: string
          href: string
          id?: string
          is_external?: boolean
          is_visible?: boolean
          label_translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          group_id?: string
          href?: string
          id?: string
          is_external?: boolean
          is_visible?: boolean
          label_translations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "footer_links_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "footer_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      hero: {
        Row: {
          animation_preset: string
          created_at: string
          description_translations: Json
          eyebrow_translations: Json
          highlight_translations: Json
          is_visible: boolean
          media_id: string | null
          metrics: Json
          primary_cta_label_translations: Json
          primary_cta_url: string | null
          secondary_cta_label_translations: Json
          secondary_cta_url: string | null
          singleton_key: boolean
          tech_stack: Json
          tech_stack_description_translations: Json
          tech_stack_heading_translations: Json
          title_translations: Json
          updated_at: string
          variant: string
        }
        Insert: {
          animation_preset?: string
          created_at?: string
          description_translations?: Json
          eyebrow_translations?: Json
          highlight_translations?: Json
          is_visible?: boolean
          media_id?: string | null
          metrics?: Json
          primary_cta_label_translations?: Json
          primary_cta_url?: string | null
          secondary_cta_label_translations?: Json
          secondary_cta_url?: string | null
          singleton_key?: boolean
          tech_stack?: Json
          tech_stack_description_translations?: Json
          tech_stack_heading_translations?: Json
          title_translations?: Json
          updated_at?: string
          variant?: string
        }
        Update: {
          animation_preset?: string
          created_at?: string
          description_translations?: Json
          eyebrow_translations?: Json
          highlight_translations?: Json
          is_visible?: boolean
          media_id?: string | null
          metrics?: Json
          primary_cta_label_translations?: Json
          primary_cta_url?: string | null
          secondary_cta_label_translations?: Json
          secondary_cta_url?: string | null
          singleton_key?: boolean
          tech_stack?: Json
          tech_stack_description_translations?: Json
          tech_stack_heading_translations?: Json
          title_translations?: Json
          updated_at?: string
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "hero_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      insight_categories: {
        Row: {
          created_at: string
          description_translations: Json
          id: string
          name_translations: Json
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_translations?: Json
          id?: string
          name_translations?: Json
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_translations?: Json
          id?: string
          name_translations?: Json
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      insight_category_links: {
        Row: {
          category_id: string
          insight_id: string
        }
        Insert: {
          category_id: string
          insight_id: string
        }
        Update: {
          category_id?: string
          insight_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insight_category_links_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "insight_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insight_category_links_insight_id_fkey"
            columns: ["insight_id"]
            isOneToOne: false
            referencedRelation: "insights"
            referencedColumns: ["id"]
          },
        ]
      }
      insights: {
        Row: {
          author_user_id: string | null
          content_translations: Json
          created_at: string
          excerpt_translations: Json
          featured_media_id: string | null
          id: string
          is_featured: boolean
          published_at: string | null
          reading_time_minutes: number | null
          seo_description_translations: Json
          seo_title_translations: Json
          slug: string
          status: string
          title_translations: Json
          updated_at: string
        }
        Insert: {
          author_user_id?: string | null
          content_translations?: Json
          created_at?: string
          excerpt_translations?: Json
          featured_media_id?: string | null
          id?: string
          is_featured?: boolean
          published_at?: string | null
          reading_time_minutes?: number | null
          seo_description_translations?: Json
          seo_title_translations?: Json
          slug: string
          status?: string
          title_translations?: Json
          updated_at?: string
        }
        Update: {
          author_user_id?: string | null
          content_translations?: Json
          created_at?: string
          excerpt_translations?: Json
          featured_media_id?: string | null
          id?: string
          is_featured?: boolean
          published_at?: string | null
          reading_time_minutes?: number | null
          seo_description_translations?: Json
          seo_title_translations?: Json
          slug?: string
          status?: string
          title_translations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insights_featured_media_id_fkey"
            columns: ["featured_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget_range: string | null
          business_interest: string | null
          company: string | null
          consent_data: Json
          contact_id: string | null
          created_at: string
          email: string | null
          id: string
          internal_notes: string | null
          message: string | null
          name: string | null
          phone: string | null
          preferred_locale: string
          project_timeline: string | null
          requested_service_id: string | null
          requested_service_ids: string[] | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          budget_range?: string | null
          business_interest?: string | null
          company?: string | null
          consent_data?: Json
          contact_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          name?: string | null
          phone?: string | null
          preferred_locale?: string
          project_timeline?: string | null
          requested_service_id?: string | null
          requested_service_ids?: string[] | null
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          budget_range?: string | null
          business_interest?: string | null
          company?: string | null
          consent_data?: Json
          contact_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          name?: string | null
          phone?: string | null
          preferred_locale?: string
          project_timeline?: string | null
          requested_service_id?: string | null
          requested_service_ids?: string[] | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_requested_service_id_fkey"
            columns: ["requested_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text_translations: Json
          bucket_name: string
          caption_translations: Json
          category: string
          created_at: string
          file_size_bytes: number
          height: number | null
          id: string
          is_public: boolean
          mime_type: string
          original_filename: string
          storage_path: string
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text_translations?: Json
          bucket_name: string
          caption_translations?: Json
          category?: string
          created_at?: string
          file_size_bytes: number
          height?: number | null
          id?: string
          is_public?: boolean
          mime_type: string
          original_filename: string
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text_translations?: Json
          bucket_name?: string
          caption_translations?: Json
          category?: string
          created_at?: string
          file_size_bytes?: number
          height?: number | null
          id?: string
          is_public?: boolean
          mime_type?: string
          original_filename?: string
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          display_order: number
          href: string
          id: string
          is_external: boolean
          is_visible: boolean
          label_translations: Json
          location: string
          open_in_new_tab: boolean
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          href: string
          id?: string
          is_external?: boolean
          is_visible?: boolean
          label_translations?: Json
          location: string
          open_in_new_tab?: boolean
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          href?: string
          id?: string
          is_external?: boolean
          is_visible?: boolean
          label_translations?: Json
          location?: string
          open_in_new_tab?: boolean
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_media: {
        Row: {
          caption_translations: Json
          created_at: string
          display_order: number
          id: string
          is_featured: boolean
          media_id: string
          portfolio_id: string
          updated_at: string
        }
        Insert: {
          caption_translations?: Json
          created_at?: string
          display_order?: number
          id?: string
          is_featured?: boolean
          media_id: string
          portfolio_id: string
          updated_at?: string
        }
        Update: {
          caption_translations?: Json
          created_at?: string
          display_order?: number
          id?: string
          is_featured?: boolean
          media_id?: string
          portfolio_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_media_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          approach_translations: Json
          challenge_translations: Json
          client_name: string
          created_at: string
          deliverables_translations: Json
          featured_media_id: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          metrics: Json
          published_at: string | null
          results_translations: Json
          seo_description_translations: Json
          seo_title_translations: Json
          slug: string
          solution_translations: Json
          status: string
          summary_translations: Json
          testimonial_id: string | null
          title_translations: Json
          updated_at: string
        }
        Insert: {
          approach_translations?: Json
          challenge_translations?: Json
          client_name: string
          created_at?: string
          deliverables_translations?: Json
          featured_media_id?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          metrics?: Json
          published_at?: string | null
          results_translations?: Json
          seo_description_translations?: Json
          seo_title_translations?: Json
          slug: string
          solution_translations?: Json
          status?: string
          summary_translations?: Json
          testimonial_id?: string | null
          title_translations?: Json
          updated_at?: string
        }
        Update: {
          approach_translations?: Json
          challenge_translations?: Json
          client_name?: string
          created_at?: string
          deliverables_translations?: Json
          featured_media_id?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          metrics?: Json
          published_at?: string | null
          results_translations?: Json
          seo_description_translations?: Json
          seo_title_translations?: Json
          slug?: string
          solution_translations?: Json
          status?: string
          summary_translations?: Json
          testimonial_id?: string | null
          title_translations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_projects_featured_media_id_fkey"
            columns: ["featured_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_projects_testimonial_id_fkey"
            columns: ["testimonial_id"]
            isOneToOne: false
            referencedRelation: "testimonials"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_service_links: {
        Row: {
          portfolio_id: string
          service_id: string
        }
        Insert: {
          portfolio_id: string
          service_id: string
        }
        Update: {
          portfolio_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_service_links_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_service_links_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          billing_label_translations: Json
          created_at: string
          cta_label_translations: Json
          cta_url: string | null
          description_translations: Json
          disclaimer_translations: Json
          display_order: number
          features_translations: Json
          id: string
          is_featured: boolean
          is_visible: boolean
          limitations_translations: Json
          name_translations: Json
          price_label_translations: Json
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          billing_label_translations?: Json
          created_at?: string
          cta_label_translations?: Json
          cta_url?: string | null
          description_translations?: Json
          disclaimer_translations?: Json
          display_order?: number
          features_translations?: Json
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          limitations_translations?: Json
          name_translations?: Json
          price_label_translations?: Json
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          billing_label_translations?: Json
          created_at?: string
          cta_label_translations?: Json
          cta_url?: string | null
          description_translations?: Json
          disclaimer_translations?: Json
          display_order?: number
          features_translations?: Json
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          limitations_translations?: Json
          name_translations?: Json
          price_label_translations?: Json
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      process_steps: {
        Row: {
          created_at: string
          description_translations: Json
          display_order: number
          icon_name: string | null
          id: string
          is_visible: boolean
          number: number
          step_key: string
          title_translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_translations?: Json
          display_order?: number
          icon_name?: string | null
          id?: string
          is_visible?: boolean
          number: number
          step_key: string
          title_translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_translations?: Json
          display_order?: number
          icon_name?: string | null
          id?: string
          is_visible?: boolean
          number?: number
          step_key?: string
          title_translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      section_settings: {
        Row: {
          created_at: string
          cta_label_translations: Json | null
          cta_url: string | null
          description_translations: Json
          display_order: number
          eyebrow_translations: Json
          highlight_translations: Json
          is_visible: boolean
          label: string
          section_key: string
          title_translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label_translations?: Json | null
          cta_url?: string | null
          description_translations?: Json
          display_order?: number
          eyebrow_translations?: Json
          highlight_translations?: Json
          is_visible?: boolean
          label: string
          section_key: string
          title_translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label_translations?: Json | null
          cta_url?: string | null
          description_translations?: Json
          display_order?: number
          eyebrow_translations?: Json
          highlight_translations?: Json
          is_visible?: boolean
          label?: string
          section_key?: string
          title_translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      service_pages: {
        Row: {
          capabilities: Json
          capabilities_title_translations: Json
          created_at: string
          cta_button_label_translations: Json
          cta_subtitle_translations: Json
          cta_title_translations: Json
          deliverables: Json
          deliverables_title_translations: Json
          hero_description_translations: Json
          hero_eyebrow_translations: Json
          hero_highlight_translations: Json
          hero_stats: Json
          hero_title_translations: Json
          id: string
          is_visible: boolean
          process: Json
          process_title_translations: Json
          service_id: string | null
          slug: string
          toolkit: Json
          toolkit_title_translations: Json
          updated_at: string
          why_badges: Json
          why_description_translations: Json
          why_title_translations: Json
        }
        Insert: {
          capabilities?: Json
          capabilities_title_translations?: Json
          created_at?: string
          cta_button_label_translations?: Json
          cta_subtitle_translations?: Json
          cta_title_translations?: Json
          deliverables?: Json
          deliverables_title_translations?: Json
          hero_description_translations?: Json
          hero_eyebrow_translations?: Json
          hero_highlight_translations?: Json
          hero_stats?: Json
          hero_title_translations?: Json
          id?: string
          is_visible?: boolean
          process?: Json
          process_title_translations?: Json
          service_id?: string | null
          slug: string
          toolkit?: Json
          toolkit_title_translations?: Json
          updated_at?: string
          why_badges?: Json
          why_description_translations?: Json
          why_title_translations?: Json
        }
        Update: {
          capabilities?: Json
          capabilities_title_translations?: Json
          created_at?: string
          cta_button_label_translations?: Json
          cta_subtitle_translations?: Json
          cta_title_translations?: Json
          deliverables?: Json
          deliverables_title_translations?: Json
          hero_description_translations?: Json
          hero_eyebrow_translations?: Json
          hero_highlight_translations?: Json
          hero_stats?: Json
          hero_title_translations?: Json
          id?: string
          is_visible?: boolean
          process?: Json
          process_title_translations?: Json
          service_id?: string | null
          slug?: string
          toolkit?: Json
          toolkit_title_translations?: Json
          updated_at?: string
          why_badges?: Json
          why_description_translations?: Json
          why_title_translations?: Json
        }
        Relationships: [
          {
            foreignKeyName: "service_pages_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          cta_label_translations: Json
          cta_style: string
          cta_url: string | null
          deliverables_translations: Json
          display_order: number
          featured_media_id: string | null
          full_description_translations: Json
          icon_name: string | null
          id: string
          is_featured: boolean
          is_visible: boolean
          seo_description_translations: Json
          seo_title_translations: Json
          short_description_translations: Json
          slug: string
          status: string
          title_translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label_translations?: Json
          cta_style?: string
          cta_url?: string | null
          deliverables_translations?: Json
          display_order?: number
          featured_media_id?: string | null
          full_description_translations?: Json
          icon_name?: string | null
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          seo_description_translations?: Json
          seo_title_translations?: Json
          short_description_translations?: Json
          slug: string
          status?: string
          title_translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label_translations?: Json
          cta_style?: string
          cta_url?: string | null
          deliverables_translations?: Json
          display_order?: number
          featured_media_id?: string | null
          full_description_translations?: Json
          icon_name?: string | null
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          seo_description_translations?: Json
          seo_title_translations?: Json
          short_description_translations?: Json
          slug?: string
          status?: string
          title_translations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_featured_media_id_fkey"
            columns: ["featured_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          address_translations: Json
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          default_locale: string
          default_seo: Json
          singleton_key: boolean
          site_description_translations: Json
          site_name: string
          social_links: Json
          supported_locales: string[]
          updated_at: string
        }
        Insert: {
          address_translations?: Json
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          default_locale?: string
          default_seo?: Json
          singleton_key?: boolean
          site_description_translations?: Json
          site_name?: string
          social_links?: Json
          supported_locales?: string[]
          updated_at?: string
        }
        Update: {
          address_translations?: Json
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          default_locale?: string
          default_seo?: Json
          singleton_key?: boolean
          site_description_translations?: Json
          site_name?: string
          social_links?: Json
          supported_locales?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          company_name: string | null
          created_at: string
          display_order: number
          id: string
          is_featured: boolean
          is_verified: boolean
          is_visible: boolean
          person_media_id: string | null
          person_name: string
          person_role_translations: Json
          quote_translations: Json
          related_portfolio_id: string | null
          related_service_id: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_featured?: boolean
          is_verified?: boolean
          is_visible?: boolean
          person_media_id?: string | null
          person_name: string
          person_role_translations?: Json
          quote_translations?: Json
          related_portfolio_id?: string | null
          related_service_id?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_featured?: boolean
          is_verified?: boolean
          is_visible?: boolean
          person_media_id?: string | null
          person_name?: string
          person_role_translations?: Json
          quote_translations?: Json
          related_portfolio_id?: string | null
          related_service_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_person_media_id_fkey"
            columns: ["person_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_related_portfolio_id_fkey"
            columns: ["related_portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_related_service_id_fkey"
            columns: ["related_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      why_choose_us: {
        Row: {
          created_at: string
          description_translations: Json
          eyebrow_translations: Json
          is_visible: boolean
          items: Json
          media_id: string | null
          singleton_key: boolean
          title_translations: Json
          updated_at: string
          variant: string
        }
        Insert: {
          created_at?: string
          description_translations?: Json
          eyebrow_translations?: Json
          is_visible?: boolean
          items?: Json
          media_id?: string | null
          singleton_key?: boolean
          title_translations?: Json
          updated_at?: string
          variant?: string
        }
        Update: {
          created_at?: string
          description_translations?: Json
          eyebrow_translations?: Json
          is_visible?: boolean
          items?: Json
          media_id?: string | null
          singleton_key?: boolean
          title_translations?: Json
          updated_at?: string
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "why_choose_us_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_admin_role: { Args: { required_roles: string[] }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
