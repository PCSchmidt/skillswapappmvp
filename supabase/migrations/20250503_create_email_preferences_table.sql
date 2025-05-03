-- Create email preferences table
CREATE TABLE IF NOT EXISTS public.email_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notify_trade_proposal BOOLEAN NOT NULL DEFAULT TRUE,
  notify_trade_status_accepted BOOLEAN NOT NULL DEFAULT TRUE,
  notify_trade_status_declined BOOLEAN NOT NULL DEFAULT TRUE,
  notify_trade_status_cancelled BOOLEAN NOT NULL DEFAULT TRUE,
  notify_trade_status_completed BOOLEAN NOT NULL DEFAULT TRUE,
  notify_new_message BOOLEAN NOT NULL DEFAULT TRUE,
  notify_new_rating BOOLEAN NOT NULL DEFAULT TRUE,
  notify_platform_updates BOOLEAN NOT NULL DEFAULT TRUE,
  daily_digest BOOLEAN NOT NULL DEFAULT FALSE,
  weekly_digest BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Add RLS policies for email_preferences
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view and modify their own email preferences
CREATE POLICY "Users can view their own email preferences"
  ON public.email_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email preferences"
  ON public.email_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email preferences"
  ON public.email_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to automatically create email preferences when a new user profile is created
CREATE OR REPLACE FUNCTION public.create_initial_email_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.email_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create email preferences for new profiles
DROP TRIGGER IF EXISTS create_email_preferences_for_new_profile ON public.profiles;
CREATE TRIGGER create_email_preferences_for_new_profile
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_initial_email_preferences();

-- Add required permissions for the service role
GRANT ALL ON public.email_preferences TO authenticated;
GRANT ALL ON public.email_preferences TO service_role;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_preferences_user_id ON public.email_preferences (user_id);

-- Version timestamp for migration tracking
COMMENT ON TABLE public.email_preferences IS 'Table for storing user email notification preferences. Created on 2025-05-03.';
