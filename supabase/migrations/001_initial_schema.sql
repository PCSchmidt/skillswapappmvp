-- Create initial schema for SkillSwap MVP
-- Migration 001: Initial schema with core tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT,
  bio TEXT,
  profile_image_url TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT,
  location_lat FLOAT,
  location_lng FLOAT,
  location_visibility TEXT DEFAULT 'approximate', -- 'precise', 'approximate', 'city-only'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE,
  account_status TEXT DEFAULT 'active', -- 'active', 'suspended', 'deactivated'
  marketing_consent BOOLEAN DEFAULT FALSE,
  tos_accepted_version TEXT,
  tos_accepted_at TIMESTAMP WITH TIME ZONE,
  preferred_language TEXT DEFAULT 'en',
  preferred_currency TEXT DEFAULT 'USD',
  time_zone TEXT DEFAULT 'UTC'
);

-- Skills Table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  experience_level TEXT, -- 'beginner', 'intermediate', 'expert'
  hourly_equivalent_value FLOAT, -- optional suggested value
  availability JSONB, -- days/times available
  is_offering BOOLEAN DEFAULT TRUE, -- TRUE if offering, FALSE if seeking
  is_remote_friendly BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Trades Table
CREATE TABLE public.trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposer_id UUID REFERENCES public.users(id),
  receiver_id UUID REFERENCES public.users(id),
  skill_offered_id UUID REFERENCES public.skills(id),
  skill_requested_id UUID REFERENCES public.skills(id),
  status TEXT DEFAULT 'proposed', -- 'proposed', 'accepted', 'completed', 'cancelled', 'disputed'
  proposed_hours FLOAT,
  proposed_schedule JSONB, -- suggested dates/times
  agreed_schedule JSONB, -- final agreed date/time
  location_type TEXT, -- 'in-person', 'remote'
  location_details TEXT, -- address or video link
  trade_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  cancellation_initiator UUID REFERENCES public.users(id)
);

-- Messages Table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trade_id UUID REFERENCES public.trades(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id),
  receiver_id UUID REFERENCES public.users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attachment_url TEXT,
  attachment_type TEXT
);

-- Ratings Table
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trade_id UUID REFERENCES public.trades(id) ON DELETE CASCADE,
  rater_id UUID REFERENCES public.users(id),
  ratee_id UUID REFERENCES public.users(id),
  skill_id UUID REFERENCES public.skills(id),
  rating_score INT NOT NULL CHECK (rating_score BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT TRUE
);

-- Supported Languages Table
CREATE TABLE public.supported_languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  is_rtl BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  fallback_language TEXT REFERENCES public.supported_languages(code)
);

-- Skill Translations Table
CREATE TABLE public.skill_translations (
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  language_code TEXT REFERENCES public.supported_languages(code),
  title TEXT NOT NULL,
  description TEXT,
  PRIMARY KEY (skill_id, language_code)
);

-- Category Translations Table
CREATE TABLE public.category_translations (
  category_id TEXT,
  language_code TEXT REFERENCES public.supported_languages(code),
  name TEXT NOT NULL,
  description TEXT,
  PRIMARY KEY (category_id, language_code)
);

-- Set up Row Level Security (RLS)
-- Users table RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Skills table RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills are viewable by everyone"
  ON public.skills FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can insert their own skills"
  ON public.skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills"
  ON public.skills FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills"
  ON public.skills FOR DELETE
  USING (auth.uid() = user_id);

-- Trades table RLS
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trades"
  ON public.trades FOR SELECT
  USING (auth.uid() = proposer_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert trades they propose"
  ON public.trades FOR INSERT
  WITH CHECK (auth.uid() = proposer_id);

CREATE POLICY "Users can update their own trades"
  ON public.trades FOR UPDATE
  USING (auth.uid() = proposer_id OR auth.uid() = receiver_id);

-- Messages table RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages they send"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Ratings table RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public ratings are viewable by everyone"
  ON public.ratings FOR SELECT
  USING (is_public = TRUE OR auth.uid() = rater_id OR auth.uid() = ratee_id);

CREATE POLICY "Users can insert ratings for completed trades they participated in"
  ON public.ratings FOR INSERT
  WITH CHECK (
    auth.uid() = rater_id AND
    EXISTS (
      SELECT 1 FROM public.trades 
      WHERE trades.id = trade_id 
      AND (trades.proposer_id = auth.uid() OR trades.receiver_id = auth.uid())
      AND trades.status = 'completed'
    )
  );

-- Indexes for performance
CREATE INDEX idx_skills_user_id ON public.skills(user_id);
CREATE INDEX idx_skills_category ON public.skills(category);
CREATE INDEX idx_skills_subcategory ON public.skills(subcategory);
CREATE INDEX idx_skills_is_offering ON public.skills(is_offering);
CREATE INDEX idx_skills_is_active ON public.skills(is_active);

CREATE INDEX idx_trades_proposer_id ON public.trades(proposer_id);
CREATE INDEX idx_trades_receiver_id ON public.trades(receiver_id);
CREATE INDEX idx_trades_status ON public.trades(status);

CREATE INDEX idx_messages_trade_id ON public.messages(trade_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_is_read ON public.messages(is_read);

CREATE INDEX idx_ratings_trade_id ON public.ratings(trade_id);
CREATE INDEX idx_ratings_rater_id ON public.ratings(rater_id);
CREATE INDEX idx_ratings_ratee_id ON public.ratings(ratee_id);
CREATE INDEX idx_ratings_rating_score ON public.ratings(rating_score);

-- Insert default language data
INSERT INTO public.supported_languages (code, name, native_name, is_rtl, is_active)
VALUES 
  ('en', 'English', 'English', FALSE, TRUE),
  ('es', 'Spanish', 'Español', FALSE, TRUE),
  ('fr', 'French', 'Français', FALSE, TRUE),
  ('de', 'German', 'Deutsch', FALSE, TRUE),
  ('zh', 'Chinese', '中文', FALSE, TRUE),
  ('ja', 'Japanese', '日本語', FALSE, TRUE),
  ('ar', 'Arabic', 'العربية', TRUE, TRUE);

-- Update fallback languages
UPDATE public.supported_languages SET fallback_language = 'en' WHERE code != 'en';

-- Function to trigger updated_at update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trades_updated_at
BEFORE UPDATE ON public.trades
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
