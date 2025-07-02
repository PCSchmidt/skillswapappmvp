-- Enable RLS and create policies for missing tables
-- Migration: 005_enable_rls_for_support_tables

-- Enable RLS for supported_languages table
ALTER TABLE public.supported_languages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to supported languages (read-only reference data)
CREATE POLICY "Allow public read access to supported languages"
  ON public.supported_languages FOR SELECT
  USING (TRUE);

-- Only service role can modify supported languages
CREATE POLICY "Only service role can modify supported languages"
  ON public.supported_languages FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Enable RLS for skill_translations table
ALTER TABLE public.skill_translations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to skill translations
CREATE POLICY "Allow public read access to skill translations"
  ON public.skill_translations FOR SELECT
  USING (TRUE);

-- Users can only modify translations for skills they own
CREATE POLICY "Users can modify translations for their own skills"
  ON public.skill_translations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.skills 
      WHERE skills.id = skill_translations.skill_id 
      AND skills.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.skills 
      WHERE skills.id = skill_translations.skill_id 
      AND skills.user_id = auth.uid()
    )
  );

-- Service role can manage all skill translations
CREATE POLICY "Service role can manage all skill translations"
  ON public.skill_translations FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Enable RLS for category_translations table
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to category translations (read-only reference data)
CREATE POLICY "Allow public read access to category translations"
  ON public.category_translations FOR SELECT
  USING (TRUE);

-- Only service role can modify category translations
CREATE POLICY "Only service role can modify category translations"
  ON public.category_translations FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Enable RLS for query_cache table
ALTER TABLE public.query_cache ENABLE ROW LEVEL SECURITY;

-- Only service role and authenticated users can access query cache
-- This is an internal performance optimization table
CREATE POLICY "Authenticated users can read query cache"
  ON public.query_cache FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Service role can manage query cache"
  ON public.query_cache FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Authenticated users can insert cache entries for performance optimization
CREATE POLICY "Authenticated users can insert cache entries"
  ON public.query_cache FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Add comment to document the migration
COMMENT ON TABLE public.supported_languages IS 'Read-only language configuration table with RLS enabled';
COMMENT ON TABLE public.skill_translations IS 'Internationalization table for skill translations with user-owned RLS';
COMMENT ON TABLE public.category_translations IS 'Read-only category translations table with RLS enabled';
COMMENT ON TABLE public.query_cache IS 'Performance cache table with restricted RLS access';
