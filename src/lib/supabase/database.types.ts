// ============================================================================
// Stratifit — Supabase Database Types
// Placeholder — replace with `supabase gen types --lang=ts` output.
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          role: "admin" | "editor" | "viewer";
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: "admin" | "editor" | "viewer";
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: "admin" | "editor" | "viewer";
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          language: "en" | "fr" | "de" | "es";
          meta_title: string | null;
          meta_description: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          language: "en" | "fr" | "de" | "es";
          meta_title?: string | null;
          meta_description?: string | null;
          published?: boolean;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          language?: "en" | "fr" | "de" | "es";
          meta_title?: string | null;
          meta_description?: string | null;
          published?: boolean;
          updated_at?: string;
        };
      };
      sections: {
        Row: {
          id: string;
          page_id: string;
          component_type: string;
          display_order: number;
          payload: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          component_type: string;
          display_order: number;
          payload?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          page_id?: string;
          component_type?: string;
          display_order?: number;
          payload?: Record<string, unknown>;
          updated_at?: string;
        };
      };
      content_blocks: {
        Row: {
          id: string;
          section_id: string;
          block_type: string;
          display_order: number;
          payload: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          block_type: string;
          display_order: number;
          payload?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          section_id?: string;
          block_type?: string;
          display_order?: number;
          payload?: Record<string, unknown>;
          updated_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          filename: string;
          alt_text: string | null;
          url: string;
          mime_type: string | null;
          width: number | null;
          height: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          filename: string;
          alt_text?: string | null;
          url: string;
          mime_type?: string | null;
          width?: number | null;
          height?: number | null;
        };
        Update: {
          id?: string;
          filename?: string;
          alt_text?: string | null;
          url?: string;
          mime_type?: string | null;
          width?: number | null;
          height?: number | null;
        };
      };
      translations: {
        Row: {
          id: string;
          entity_type: "page" | "section" | "content_block";
          entity_id: string;
          language: "en" | "fr" | "de" | "es";
          field_path: string;
          translated_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          entity_type: "page" | "section" | "content_block";
          entity_id: string;
          language: "en" | "fr" | "de" | "es";
          field_path: string;
          translated_text: string;
        };
        Update: {
          id?: string;
          entity_type?: "page" | "section" | "content_block";
          entity_id?: string;
          language?: "en" | "fr" | "de" | "es";
          field_path?: string;
          translated_text?: string;
          updated_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          site_name: string;
          logo_media_id: string | null;
          primary_language: "en" | "fr" | "de" | "es";
          available_languages: string[];
          social_links: Record<string, string>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_name: string;
          logo_media_id?: string | null;
          primary_language?: "en" | "fr" | "de" | "es";
          available_languages?: string[];
          social_links?: Record<string, string>;
        };
        Update: {
          id?: string;
          site_name?: string;
          logo_media_id?: string | null;
          primary_language?: "en" | "fr" | "de" | "es";
          available_languages?: string[];
          social_links?: Record<string, string>;
          updated_at?: string;
        };
      };
      section_navigation_header: {
        Row: {
          id: string;
          display_order: number;
          sticky: boolean;
          content: Record<string, unknown>;
          translations: Record<string, Record<string, string>>;
          url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          display_order?: number;
          sticky?: boolean;
          content?: Record<string, unknown>;
          translations?: Record<string, Record<string, string>>;
          url?: string;
        };
        Update: {
          id?: string;
          display_order?: number;
          sticky?: boolean;
          content?: Record<string, unknown>;
          translations?: Record<string, Record<string, string>>;
          url?: string;
          updated_at?: string;
        };
      };
      hero_section: {
        Row: {
          id: string;
          display_order: number;
          sticky: boolean;
          subtitle_translations: Record<string, string>;
          title_translations: Record<string, string>;
          title_highlight_translations: Record<string, string>;
          description_translations: Record<string, string>;
          ctas: Record<string, unknown>[];
          trust_badges: Record<string, unknown>[];
          tech_stack: Record<string, unknown>;
          url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          display_order?: number;
          sticky?: boolean;
          subtitle_translations?: Record<string, string>;
          title_translations?: Record<string, string>;
          title_highlight_translations?: Record<string, string>;
          description_translations?: Record<string, string>;
          ctas?: Record<string, unknown>[];
          trust_badges?: Record<string, unknown>[];
          tech_stack?: Record<string, unknown>;
          url?: string;
        };
        Update: {
          id?: string;
          display_order?: number;
          sticky?: boolean;
          subtitle_translations?: Record<string, string>;
          title_translations?: Record<string, string>;
          title_highlight_translations?: Record<string, string>;
          description_translations?: Record<string, string>;
          ctas?: Record<string, unknown>[];
          trust_badges?: Record<string, unknown>[];
          tech_stack?: Record<string, unknown>;
          url?: string;
          updated_at?: string;
        };
      };
      services_section: {
        Row: {
          id: string;
          display_order: number;
          subtitle_translations: Record<string, string>;
          title_translations: Record<string, string>;
          description_translations: Record<string, string>;
          services: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          display_order?: number;
          subtitle_translations?: Record<string, string>;
          title_translations?: Record<string, string>;
          description_translations?: Record<string, string>;
          services?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          display_order?: number;
          subtitle_translations?: Record<string, string>;
          title_translations?: Record<string, string>;
          description_translations?: Record<string, string>;
          services?: Record<string, unknown>;
          updated_at?: string;
        };
      };
      service_cards: {
        Row: {
          id: string;
          parent_section: string;
          icon: string;
          title_translations: Record<string, string>;
          description_translations: Record<string, string>;
          deliverables: Record<string, string>[];
          url: string;
          display_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_section: string;
          icon?: string;
          title_translations?: Record<string, string>;
          description_translations?: Record<string, string>;
          deliverables?: Record<string, string>[];
          url?: string;
          display_order?: number;
          active?: boolean;
        };
        Update: {
          id?: string;
          parent_section?: string;
          icon?: string;
          title_translations?: Record<string, string>;
          description_translations?: Record<string, string>;
          deliverables?: Record<string, string>[];
          url?: string;
          display_order?: number;
          active?: boolean;
          updated_at?: string;
        };
      };
      how_we_work_section: {
        Row: {
          id: string;
          display_order: number;
          subtitle_translations: Record<string, string>;
          title_translations: Record<string, string>;
          description_translations: Record<string, string>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          display_order?: number;
          subtitle_translations?: Record<string, string>;
          title_translations?: Record<string, string>;
          description_translations?: Record<string, string>;
        };
        Update: {
          id?: string;
          display_order?: number;
          subtitle_translations?: Record<string, string>;
          title_translations?: Record<string, string>;
          description_translations?: Record<string, string>;
          updated_at?: string;
        };
      };
      how_we_work_steps: {
        Row: {
          id: string;
          parent_section: string;
          step_number: number;
          icon: string;
          title_translations: Record<string, string>;
          description_translations: Record<string, string>;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_section: string;
          step_number?: number;
          icon?: string;
          title_translations?: Record<string, string>;
          description_translations?: Record<string, string>;
          display_order?: number;
        };
        Update: {
          id?: string;
          parent_section?: string;
          step_number?: number;
          icon?: string;
          title_translations?: Record<string, string>;
          description_translations?: Record<string, string>;
          display_order?: number;
          updated_at?: string;
        };
      };
      ai_logs: {
        Row: {
          id: string;
          prompt: string;
          response: string;
          model: string;
          tokens_used: number | null;
          duration_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          prompt: string;
          response: string;
          model: string;
          tokens_used?: number | null;
          duration_ms?: number | null;
        };
        Update: {
          id?: string;
          prompt?: string;
          response?: string;
          model?: string;
          tokens_used?: number | null;
          duration_ms?: number | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
