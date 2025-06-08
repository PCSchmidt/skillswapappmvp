/**
 * Types definitions for the SkillSwap MVP application
 */

// User profile type
export interface UserProfile {
  id: string;
  username?: string;
  email?: string;
  full_name?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  skills_offered?: Skill[];
  skills_requested?: Skill[];
  rating?: number;
  completed_exchanges?: number;
  is_verified?: boolean;
}

// Skill level enum
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Skill type enum
export type SkillType = 'offering' | 'seeking';

// Location type
export type LocationType = 'in-person' | 'remote' | 'both';

// Compensation type
export type CompensationType = 'free' | 'paid' | 'exchange';

// Contact preference
export type ContactPreference = 'email' | 'phone' | 'platform';

// Skill interface
export interface Skill {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  level: SkillLevel;
  type: SkillType;
  location_type: string;
  compensation_type: string;
  contact_preference: ContactPreference;
  rate?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Skill exchange interface
export interface SkillExchange {
  id: string;
  requester_id: string;
  provider_id: string;
  requester_skill_id?: string;
  provider_skill_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'canceled';
  created_at: string;
  updated_at: string;
  scheduled_date?: string;
  completion_date?: string;
  message?: string;
}

// Message interface
export interface Message {
  id: string;
  exchange_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

// Review interface
export interface Review {
  id: string;
  exchange_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// Notification interface
export interface Notification {
  id: string;
  user_id: string;
  type: 'message' | 'exchange_request' | 'status_update' | 'review' | 'system';
  title: string;
  message: string;
  related_id?: string; // Could be exchange_id, message_id, etc.
  is_read: boolean;
  created_at: string;
}

// User settings interface
export interface UserSettings {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  profile_visibility: 'public' | 'private' | 'contacts_only';
  location_sharing: boolean;
  theme_preference?: 'light' | 'dark' | 'system';
}

// Authentication state
export interface AuthState {
  user: UserProfile | null;
  session: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
}

// Form error
export interface FormError {
  field: string;
  message: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: FormError[];
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
  };
}
