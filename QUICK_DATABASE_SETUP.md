# 🚨 IMMEDIATE ACTION REQUIRED: Database Tables

Copy and paste these SQL commands into your **Supabase Dashboard > SQL Editor**:

```sql
-- Create user_skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  skill_type TEXT NOT NULL CHECK (skill_type IN ('offered', 'wanted')),
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'intermediate',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_skill_type UNIQUE(user_id, skill_id, skill_type)
);

-- Create trade_proposals table  
CREATE TABLE IF NOT EXISTS trade_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offered_skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  requested_skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')) DEFAULT 'pending',
  message TEXT,
  response_message TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT no_self_proposals CHECK (proposer_id != receiver_id)
);

-- Add sample skills data (if skills table is empty)
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
```

## After running this SQL:

✅ **Test the setup:**
```bash
node scripts/test-supabase-integration.mjs
```

You should see:
```
✅ user_skills: accessible
✅ trade_proposals: accessible  
✅ skills: accessible (10 sample rows)
```

## Then continue development:
```bash
npm run dev  # Start the development server
```

**Ready to test Skills CRUD API routes! 🚀**
