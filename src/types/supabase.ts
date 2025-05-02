/**
 * Supabase Database Types
 * 
 * This file defines TypeScript types for the Supabase database tables.
 * These types should be kept in sync with the actual database schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          full_name: string | null
          bio: string | null
          profile_image_url: string | null
          location_city: string | null
          location_state: string | null
          location_country: string | null
          location_lat: number | null
          location_lng: number | null
          location_visibility: string | null
          created_at: string
          updated_at: string
          last_active_at: string
          is_verified: boolean
          account_status: string
          marketing_consent: boolean
          tos_accepted_version: string | null
          tos_accepted_at: string | null
          preferred_language: string | null
          preferred_currency: string | null
          time_zone: string | null
        }
        Insert: {
          id?: string
          email: string
          phone?: string | null
          full_name?: string | null
          bio?: string | null
          profile_image_url?: string | null
          location_city?: string | null
          location_state?: string | null
          location_country?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_visibility?: string | null
          created_at?: string
          updated_at?: string
          last_active_at?: string
          is_verified?: boolean
          account_status?: string
          marketing_consent?: boolean
          tos_accepted_version?: string | null
          tos_accepted_at?: string | null
          preferred_language?: string | null
          preferred_currency?: string | null
          time_zone?: string | null
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          full_name?: string | null
          bio?: string | null
          profile_image_url?: string | null
          location_city?: string | null
          location_state?: string | null
          location_country?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_visibility?: string | null
          created_at?: string
          updated_at?: string
          last_active_at?: string
          is_verified?: boolean
          account_status?: string
          marketing_consent?: boolean
          tos_accepted_version?: string | null
          tos_accepted_at?: string | null
          preferred_language?: string | null
          preferred_currency?: string | null
          time_zone?: string | null
        }
      }
      skills: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string
          subcategory: string | null
          experience_level: string | null
          hourly_equivalent_value: number | null
          availability: Json | null
          is_offering: boolean
          is_remote_friendly: boolean
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category: string
          subcategory?: string | null
          experience_level?: string | null
          hourly_equivalent_value?: number | null
          availability?: Json | null
          is_offering?: boolean
          is_remote_friendly?: boolean
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: string
          subcategory?: string | null
          experience_level?: string | null
          hourly_equivalent_value?: number | null
          availability?: Json | null
          is_offering?: boolean
          is_remote_friendly?: boolean
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      trades: {
        Row: {
          id: string
          proposer_id: string | null
          receiver_id: string | null
          skill_offered_id: string | null
          skill_requested_id: string | null
          status: string | null
          proposed_hours: number | null
          proposed_schedule: Json | null
          agreed_schedule: Json | null
          location_type: string | null
          location_details: string | null
          trade_notes: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
          cancellation_reason: string | null
          cancellation_initiator: string | null
        }
        Insert: {
          id?: string
          proposer_id?: string | null
          receiver_id?: string | null
          skill_offered_id?: string | null
          skill_requested_id?: string | null
          status?: string | null
          proposed_hours?: number | null
          proposed_schedule?: Json | null
          agreed_schedule?: Json | null
          location_type?: string | null
          location_details?: string | null
          trade_notes?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          cancellation_reason?: string | null
          cancellation_initiator?: string | null
        }
        Update: {
          id?: string
          proposer_id?: string | null
          receiver_id?: string | null
          skill_offered_id?: string | null
          skill_requested_id?: string | null
          status?: string | null
          proposed_hours?: number | null
          proposed_schedule?: Json | null
          agreed_schedule?: Json | null
          location_type?: string | null
          location_details?: string | null
          trade_notes?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          cancellation_reason?: string | null
          cancellation_initiator?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          trade_id: string | null
          sender_id: string | null
          receiver_id: string | null
          content: string
          is_read: boolean
          created_at: string
          attachment_url: string | null
          attachment_type: string | null
        }
        Insert: {
          id?: string
          trade_id?: string | null
          sender_id?: string | null
          receiver_id?: string | null
          content: string
          is_read?: boolean
          created_at?: string
          attachment_url?: string | null
          attachment_type?: string | null
        }
        Update: {
          id?: string
          trade_id?: string | null
          sender_id?: string | null
          receiver_id?: string | null
          content?: string
          is_read?: boolean
          created_at?: string
          attachment_url?: string | null
          attachment_type?: string | null
        }
      }
      ratings: {
        Row: {
          id: string
          trade_id: string | null
          rater_id: string | null
          ratee_id: string | null
          skill_id: string | null
          rating_score: number
          review_text: string | null
          created_at: string
          is_public: boolean
        }
        Insert: {
          id?: string
          trade_id?: string | null
          rater_id?: string | null
          ratee_id?: string | null
          skill_id?: string | null
          rating_score: number
          review_text?: string | null
          created_at?: string
          is_public?: boolean
        }
        Update: {
          id?: string
          trade_id?: string | null
          rater_id?: string | null
          ratee_id?: string | null
          skill_id?: string | null
          rating_score?: number
          review_text?: string | null
          created_at?: string
          is_public?: boolean
        }
      }
      supported_languages: {
        Row: {
          code: string
          name: string
          native_name: string
          is_rtl: boolean
          is_active: boolean
          fallback_language: string | null
        }
        Insert: {
          code: string
          name: string
          native_name: string
          is_rtl?: boolean
          is_active?: boolean
          fallback_language?: string | null
        }
        Update: {
          code?: string
          name?: string
          native_name?: string
          is_rtl?: boolean
          is_active?: boolean
          fallback_language?: string | null
        }
      }
      skill_translations: {
        Row: {
          skill_id: string
          language_code: string
          title: string
          description: string | null
        }
        Insert: {
          skill_id: string
          language_code: string
          title: string
          description?: string | null
        }
        Update: {
          skill_id?: string
          language_code?: string
          title?: string
          description?: string | null
        }
      }
      category_translations: {
        Row: {
          category_id: string
          language_code: string
          name: string
          description: string | null
        }
        Insert: {
          category_id: string
          language_code: string
          name: string
          description?: string | null
        }
        Update: {
          category_id?: string
          language_code?: string
          name?: string
          description?: string | null
        }
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
