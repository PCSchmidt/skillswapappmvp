/**
 * Types for Supabase client interactions
 * 
 * This file contains shared type definitions for Supabase responses and database models
 * to ensure consistent typing across the application and tests.
 */

/**
 * Generic Supabase response type 
 */
export interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

/**
 * Supabase error type
 */
export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

/**
 * Basic User type for Supabase auth
 */
export interface User {
  id: string;
  email: string;
  // Add other common user properties from Supabase auth if needed
}

/**
 * Supabase Auth response type
 */
export interface AuthResponse {
  session: SupabaseSession | null;
  user: User | null;
}

/**
 * User settings table model
 */
export interface UserSettings {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  location_sharing: boolean;
  profile_visibility: string;
  theme_preference: string;
  notification_frequency?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Profile table model
 */
export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Skill table model
 */
export interface Skill {
  id: string;
  title: string;
  description: string;
  user_id: string;
  category: string;
  subcategory?: string | null;
  experience_level: string;
  location?: string;
  is_remote: boolean;
  is_remote_friendly?: boolean;
  availability: string;
  tags?: string[];
  is_offering?: boolean;
  is_active?: boolean;
  hourly_equivalent_value?: number;
  created_at?: string;
  updated_at?: string;
  // Include relationships for joined queries
  users?: {
    id: string;
    username?: string;
    full_name?: string | null;
    avatar_url?: string;
    profile_image_url?: string | null;
    location?: string;
    location_city?: string | null;
    location_state?: string | null;
  } | null;
}

/**
 * Notification table model
 */
export interface Notification {
  id: string;
  user_id: string;
  type: string; // e.g., 'trade_proposal', 'trade_accepted', 'message'
  title: string;
  content: string | null;
  link: string | null; // URL to navigate to when notification is clicked
  is_read: boolean;
  created_at: string;
  expires_at: string | null;
  metadata: Record<string, unknown> | null; // JSONB field for additional data
  priority: 'low' | 'medium' | 'high' | 'urgent' | null;
}

/**
 * Type guard to check if a Supabase response contains an error
 * Fixed return type to correctly implement type predicate pattern
 */
export function isSupabaseError<T>(response: SupabaseResponse<T>): response is SupabaseResponse<T> & { error: SupabaseError } {
  return response.error !== null;
}

/**
 * Type for Supabase query builder functions
 */
export interface SupabaseQueryBuilder<T> {
  select: (columns?: string) => SupabaseSelectQuery<T>;
  insert: (values: Partial<T> | Partial<T>[]) => SupabaseInsertQuery<T>;
  update: (values: Partial<T>) => SupabaseUpdateQuery<T>;
  delete: () => SupabaseDeleteQuery<T>;
}

/**
 * Type for Supabase select query
 */
export interface SupabaseSelectQuery<T> {
  eq: (column: keyof T, value: T[keyof T]) => SupabaseFilterQuery<T>;
  in: (column: keyof T, values: Array<T[keyof T]>) => SupabaseFilterQuery<T>;
  order: (column: string, options?: { ascending?: boolean }) => SupabaseSelectQuery<T>;
  limit: (count: number) => SupabaseSelectQuery<T>;
}

/**
 * Type for Supabase filter query
 */
export interface SupabaseFilterQuery<T> {
  single: () => Promise<SupabaseResponse<T>>;
  eq: (column: keyof T, value: T[keyof T]) => SupabaseFilterQuery<T>;
  in: (column: keyof T, values: Array<T[keyof T]>) => SupabaseFilterQuery<T>;
}

/**
 * Type for Supabase insert query
 */
export interface SupabaseInsertQuery<T> {
  select: (columns?: string) => Promise<SupabaseResponse<T[]>>;
}

/**
 * Type for Supabase update query
 */
export interface SupabaseUpdateQuery<T> {
  eq: (column: keyof T, value: T[keyof T]) => SupabaseFilterQueryWithModifier<T>;
  match: (query: Partial<T>) => SupabaseFilterQueryWithModifier<T>;
}

/**
 * Type for Supabase delete query
 */
export interface SupabaseDeleteQuery<T> {
  eq: (column: keyof T, value: T[keyof T]) => SupabaseFilterQueryWithModifier<T>;
  match: (query: Partial<T>) => SupabaseFilterQueryWithModifier<T>;
}

/**
 * Type for Supabase filter query with modifier
 */
export interface SupabaseFilterQueryWithModifier<T> {
  then: (callback: (response: SupabaseResponse<T>) => void) => {
    catch: (callback: (error: unknown) => void) => void;
  };
}

/**
 * Type for Supabase session
 */
export interface SupabaseSession {
  user: {
    id: string;
    email?: string;
    aud?: string;
    role?: string;
  };
  access_token?: string;
  refresh_token?: string;
}

/**
 * Type for Supabase client
 */
export interface SupabaseClient {
  from: <T>(table: string) => SupabaseQueryBuilder<T>;
  auth: {
    signIn: (credentials: { email: string; password: string }) => Promise<SupabaseResponse<AuthResponse>>;
    signUp: (credentials: { email: string; password: string }) => Promise<SupabaseResponse<AuthResponse>>;
    signOut: () => Promise<SupabaseResponse<null>>;
    session: () => SupabaseSession | null;
  };
}

/**
 * Generated Database Types
 * This interface mimics the structure expected by components that were using
 * the Supabase-generated Database type.
 */
export interface Database {
  public: {
    Tables: {
      user_settings: {
        Row: UserSettings;
        Insert: Omit<UserSettings, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserSettings, 'user_id' | 'created_at' | 'updated_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      skills: {
        Row: Skill;
        Insert: Omit<Skill, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Skill, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'>;
        Update: Partial<Omit<Notification, 'id' | 'user_id' | 'created_at'>>;
      };
      // Add other tables as needed
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
  };
}
