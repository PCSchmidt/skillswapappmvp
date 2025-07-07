-- Enable RLS for public tables that are currently missing it
-- This migration addresses the security advisor warnings in Supabase dashboard

-- Enable RLS for supported_languages table
ALTER TABLE public.supported_languages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to supported_languages (reference data)
CREATE POLICY "Public read access for supported_languages" ON public.supported_languages
    FOR SELECT USING (true);

-- Enable RLS for skill_translations table  
ALTER TABLE public.skill_translations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to skill_translations (reference data)
CREATE POLICY "Public read access for skill_translations" ON public.skill_translations
    FOR SELECT USING (true);

-- Enable RLS for category_translations table
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to category_translations (reference data) 
CREATE POLICY "Public read access for category_translations" ON public.category_translations
    FOR SELECT USING (true);

-- Enable RLS for query_cache table
ALTER TABLE public.query_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access to query_cache (performance optimization)
-- Note: This table is for caching and doesn't contain sensitive data
CREATE POLICY "Public read access for query_cache" ON public.query_cache
    FOR SELECT USING (true);

-- Allow authenticated users to insert/update cache entries
CREATE POLICY "Authenticated users can manage query_cache" ON public.query_cache
    FOR ALL USING (auth.role() = 'authenticated');
