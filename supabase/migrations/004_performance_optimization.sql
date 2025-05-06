                                -- Migration for Performance Optimization (Phase 4.2)
-- This migration adds additional database indexes and optimizes existing ones

-- Add composite indexes for frequently joined tables
CREATE INDEX IF NOT EXISTS idx_skills_user_category ON public.skills(user_id, category, is_active);
CREATE INDEX IF NOT EXISTS idx_skills_location ON public.skills(user_id, is_remote_friendly);
CREATE INDEX IF NOT EXISTS idx_skills_title_search ON public.skills USING gin(to_tsvector('english', title || ' ' || description));

-- Optimize trade queries with composite indexes
CREATE INDEX IF NOT EXISTS idx_trades_proposer_status ON public.trades(proposer_id, status);
CREATE INDEX IF NOT EXISTS idx_trades_receiver_status ON public.trades(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_trades_skills ON public.trades(skill_offered_id, skill_requested_id);

-- Optimize message and notification queries
CREATE INDEX IF NOT EXISTS idx_messages_trade_timestamp ON public.messages(trade_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_timestamp ON public.notifications(user_id, is_read, created_at);

-- Add indexes for email preferences lookups (if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'email_preferences'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_email_preferences_notification_types ON public.email_preferences(
      user_id,
      notify_trade_proposal,
      notify_trade_status_accepted,
      notify_new_message
    )';
  END IF;
END $$;

-- Add index for ratings summary
CREATE INDEX IF NOT EXISTS idx_ratings_ratee_score ON public.ratings(ratee_id, rating_score, is_public);

-- Create materialized view for user statistics to improve dashboard performance
CREATE MATERIALIZED VIEW IF NOT EXISTS public.user_statistics AS
SELECT
  u.id AS user_id,
  u.full_name,
  u.profile_image_url,
  u.location_city,
  u.location_state,
  u.average_rating,
  COUNT(DISTINCT s.id) FILTER (WHERE s.is_offering = true) AS skills_offered_count,
  COUNT(DISTINCT s.id) FILTER (WHERE s.is_offering = false) AS skills_wanted_count,
  COUNT(DISTINCT t_proposed.id) AS trades_proposed_count,
  COUNT(DISTINCT t_received.id) AS trades_received_count,
  COUNT(DISTINCT t_completed.id) AS trades_completed_count,
  MAX(t_last.updated_at) AS last_trade_activity,
  COUNT(DISTINCT r.id) AS ratings_received_count,
  COALESCE(AVG(r.rating_score) FILTER (WHERE r.is_public = true), 0) AS average_rating_score
FROM
  public.users u
LEFT JOIN
  public.skills s ON u.id = s.user_id AND s.is_active = true
LEFT JOIN
  public.trades t_proposed ON u.id = t_proposed.proposer_id
LEFT JOIN
  public.trades t_received ON u.id = t_received.receiver_id
LEFT JOIN
  public.trades t_completed ON (u.id = t_completed.proposer_id OR u.id = t_completed.receiver_id) 
  AND t_completed.status = 'completed'
LEFT JOIN (
  SELECT
    CASE
      WHEN proposer_id = t.proposer_id THEN proposer_id
      ELSE receiver_id
    END AS user_id,
    updated_at
  FROM
    public.trades t
) AS t_last ON u.id = t_last.user_id
LEFT JOIN
  public.ratings r ON u.id = r.ratee_id
GROUP BY
  u.id, u.full_name, u.profile_image_url, u.location_city, u.location_state, u.average_rating;

-- Create indexes on the materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_statistics_user_id ON public.user_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_statistics_rating ON public.user_statistics(average_rating_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_statistics_activity ON public.user_statistics(last_trade_activity DESC);

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.user_statistics;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to refresh the materialized view when relevant tables change
DROP TRIGGER IF EXISTS refresh_user_statistics_on_users ON public.users;
CREATE TRIGGER refresh_user_statistics_on_users
AFTER INSERT OR UPDATE OR DELETE ON public.users
FOR EACH STATEMENT EXECUTE FUNCTION refresh_user_statistics();

DROP TRIGGER IF EXISTS refresh_user_statistics_on_skills ON public.skills;
CREATE TRIGGER refresh_user_statistics_on_skills
AFTER INSERT OR UPDATE OR DELETE ON public.skills
FOR EACH STATEMENT EXECUTE FUNCTION refresh_user_statistics();

DROP TRIGGER IF EXISTS refresh_user_statistics_on_trades ON public.trades;
CREATE TRIGGER refresh_user_statistics_on_trades
AFTER INSERT OR UPDATE OR DELETE ON public.trades
FOR EACH STATEMENT EXECUTE FUNCTION refresh_user_statistics();

DROP TRIGGER IF EXISTS refresh_user_statistics_on_ratings ON public.ratings;
CREATE TRIGGER refresh_user_statistics_on_ratings
AFTER INSERT OR UPDATE OR DELETE ON public.ratings
FOR EACH STATEMENT EXECUTE FUNCTION refresh_user_statistics();

-- Create function to implement query caching with expiration
CREATE OR REPLACE FUNCTION cache_get(
  cache_key TEXT,
  expiry_seconds INTEGER DEFAULT 300 -- 5 minutes default
)
RETURNS JSONB AS $$
DECLARE
  cached_result JSONB;
  cache_time TIMESTAMPTZ;
BEGIN
  -- Try to get cached result
  SELECT 
    value, 
    created_at 
  INTO 
    cached_result, 
    cache_time 
  FROM 
    public.query_cache 
  WHERE 
    key = cache_key 
  LIMIT 1;
  
  -- Check if we have a valid, non-expired result
  IF cached_result IS NOT NULL AND 
     cache_time + (expiry_seconds * interval '1 second') > now() THEN
    RETURN cached_result;
  END IF;
  
  -- Return null if no valid cache entry
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cache_set(
  cache_key TEXT,
  cache_value JSONB,
  expiry_seconds INTEGER DEFAULT 300 -- 5 minutes default
)
RETURNS VOID AS $$
BEGIN
  -- Insert or update cache entry
  INSERT INTO public.query_cache (key, value, created_at)
  VALUES (cache_key, cache_value, now())
  ON CONFLICT (key)
  DO UPDATE SET 
    value = cache_value,
    created_at = now();
END;
$$ LANGUAGE plpgsql;

-- Create query cache table
CREATE TABLE IF NOT EXISTS public.query_cache (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index on created_at for cache cleanup
CREATE INDEX IF NOT EXISTS idx_query_cache_created_at ON public.query_cache(created_at);

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache(max_age_seconds INTEGER DEFAULT 86400) -- 24 hours default
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.query_cache
  WHERE created_at < now() - (max_age_seconds * interval '1 second')
  RETURNING COUNT(*) INTO deleted_count;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired cache entries (if using pgAgent or similar)
COMMENT ON FUNCTION clean_expired_cache IS 'Call this function periodically to clean expired cache entries';
