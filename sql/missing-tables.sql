-- SkillSwap MVP - Missing Database Tables
-- Creates the essential tables identified during testing

-- Table: user_skills (connects users to their offered/wanted skills)
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  skill_type TEXT NOT NULL CHECK (skill_type IN ('offered', 'wanted')),
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'intermediate',
  description TEXT, -- User's specific notes about their skill
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can't have duplicate skill entries
  CONSTRAINT unique_user_skill_type UNIQUE(user_id, skill_id, skill_type)
);

-- Table: trade_proposals (skill exchange proposals)
CREATE TABLE IF NOT EXISTS trade_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offered_skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  requested_skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')) DEFAULT 'pending',
  message TEXT, -- Proposal message from proposer
  response_message TEXT, -- Response from receiver
  scheduled_date TIMESTAMP WITH TIME ZONE, -- When the skill exchange is scheduled
  duration_minutes INTEGER DEFAULT 60, -- Expected duration
  location TEXT, -- Meeting location (physical or virtual)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure users can't propose to themselves
  CONSTRAINT no_self_proposals CHECK (proposer_id != receiver_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_type ON user_skills(skill_type);

CREATE INDEX IF NOT EXISTS idx_trade_proposals_proposer ON trade_proposals(proposer_id);
CREATE INDEX IF NOT EXISTS idx_trade_proposals_receiver ON trade_proposals(receiver_id);
CREATE INDEX IF NOT EXISTS idx_trade_proposals_status ON trade_proposals(status);
CREATE INDEX IF NOT EXISTS idx_trade_proposals_created ON trade_proposals(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_proposals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_skills
CREATE POLICY "Users can view all user skills" ON user_skills
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own skills" ON user_skills
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for trade_proposals  
CREATE POLICY "Users can view trades involving them" ON trade_proposals
  FOR SELECT USING (auth.uid() = proposer_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create trade proposals" ON trade_proposals
  FOR INSERT WITH CHECK (auth.uid() = proposer_id);

CREATE POLICY "Users can update trades involving them" ON trade_proposals
  FOR UPDATE USING (auth.uid() = proposer_id OR auth.uid() = receiver_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_user_skills_updated_at
  BEFORE UPDATE ON user_skills
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_trade_proposals_updated_at
  BEFORE UPDATE ON trade_proposals  
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert some sample skills if the skills table is empty
INSERT INTO skills (name, category, description) 
SELECT * FROM (VALUES
  ('JavaScript', 'Programming', 'Modern JavaScript development and frameworks'),
  ('Python', 'Programming', 'Python programming for web development and data science'),
  ('React', 'Programming', 'React.js frontend development'),
  ('Node.js', 'Programming', 'Backend development with Node.js'),
  ('PostgreSQL', 'Database', 'Database design and administration'),
  ('UI/UX Design', 'Design', 'User interface and user experience design'),
  ('Project Management', 'Business', 'Agile project management and team leadership'),
  ('Digital Marketing', 'Marketing', 'Online marketing strategies and social media'),
  ('Content Writing', 'Writing', 'Technical and creative content creation'),
  ('Photography', 'Creative', 'Digital photography and photo editing')
) AS sample_skills(name, category, description)
WHERE NOT EXISTS (SELECT 1 FROM skills LIMIT 1);

-- Verify the tables were created successfully
SELECT 
  'user_skills' as table_name,
  count(*) as row_count
FROM user_skills
UNION ALL
SELECT 
  'trade_proposals' as table_name,
  count(*) as row_count  
FROM trade_proposals
UNION ALL
SELECT
  'skills' as table_name,
  count(*) as row_count
FROM skills;
