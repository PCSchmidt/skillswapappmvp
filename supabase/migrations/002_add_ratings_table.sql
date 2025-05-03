-- Create ratings table for user-to-user ratings
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trade_id UUID NOT NULL REFERENCES public.trades(id) ON DELETE CASCADE,
    rater_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    ratee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    rating_score INTEGER NOT NULL CHECK (rating_score BETWEEN 1 AND 5),
    review_text TEXT,
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS ratings_trade_id_idx ON public.ratings(trade_id);
CREATE INDEX IF NOT EXISTS ratings_rater_id_idx ON public.ratings(rater_id);
CREATE INDEX IF NOT EXISTS ratings_ratee_id_idx ON public.ratings(ratee_id);
CREATE INDEX IF NOT EXISTS ratings_skill_id_idx ON public.ratings(skill_id);

-- Add security policies
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view public ratings
CREATE POLICY "Anyone can view public ratings" ON public.ratings 
    FOR SELECT 
    USING (is_public = true);

-- Allow users to view their own ratings (even if not public)
CREATE POLICY "Users can view their own ratings" ON public.ratings 
    FOR SELECT 
    USING (auth.uid() = rater_id OR auth.uid() = ratee_id);

-- Only raters can insert their own ratings
CREATE POLICY "Users can insert their own ratings" ON public.ratings 
    FOR INSERT 
    WITH CHECK (auth.uid() = rater_id);

-- Only raters can update their own ratings
CREATE POLICY "Users can update their own ratings" ON public.ratings 
    FOR UPDATE 
    USING (auth.uid() = rater_id);

-- Only raters can delete their own ratings
CREATE POLICY "Users can delete their own ratings" ON public.ratings 
    FOR DELETE 
    USING (auth.uid() = rater_id);

-- Add a trigger to update user's average rating
CREATE OR REPLACE FUNCTION public.update_user_average_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate and update average rating for the user
    UPDATE public.users
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating_score), 0)
            FROM public.ratings
            WHERE ratee_id = NEW.ratee_id AND is_public = true
        ),
        ratings_count = (
            SELECT COUNT(*)
            FROM public.ratings
            WHERE ratee_id = NEW.ratee_id AND is_public = true
        )
    WHERE id = NEW.ratee_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating changes
CREATE TRIGGER update_user_rating_on_insert
AFTER INSERT OR UPDATE OR DELETE ON public.ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_user_average_rating();

-- Add new columns to users table to store rating statistics
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS ratings_count INTEGER DEFAULT 0;

-- Reindex
REINDEX TABLE public.ratings;
