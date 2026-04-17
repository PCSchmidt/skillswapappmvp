-- Migration 006: Add pgvector for AI skill matching
-- Adds vector extension and embedding column to skills table

-- Enable pgvector extension (available on Supabase by default)
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to skills table
-- all-MiniLM-L6-v2 produces 384-dimensional vectors
ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS embedding vector(384);

-- Index for fast similarity search
CREATE INDEX IF NOT EXISTS idx_skills_embedding
  ON public.skills
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 10);

-- Helper function: find similar skills using stored embeddings
CREATE OR REPLACE FUNCTION match_skills(
  query_embedding vector(384),
  match_count int DEFAULT 5,
  match_threshold float DEFAULT 0.1,
  exclude_skill_id uuid DEFAULT NULL,
  exclude_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  title text,
  category text,
  subcategory text,
  description text,
  experience_level text,
  is_offering boolean,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.user_id,
    s.title,
    s.category,
    s.subcategory,
    s.description,
    s.experience_level,
    s.is_offering,
    1 - (s.embedding <=> query_embedding) AS similarity
  FROM public.skills s
  WHERE s.is_active = true
    AND s.embedding IS NOT NULL
    AND (exclude_skill_id IS NULL OR s.id != exclude_skill_id)
    AND (exclude_user_id IS NULL OR s.user_id != exclude_user_id)
    AND 1 - (s.embedding <=> query_embedding) > match_threshold
  ORDER BY s.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
