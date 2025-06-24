# 🗄️ Manual Database Setup Instructions

Since automated SQL execution requires service role permissions, please follow these steps to create the missing tables:

## 1. Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Open your SkillSwap project
3. Navigate to **SQL Editor** in the left sidebar

## 2. Execute Missing Tables SQL
Copy and paste the contents of `sql/missing-tables.sql` into the SQL Editor and click **Run**.

The script will create:
- ✅ `user_skills` table (connects users to their skills)
- ✅ `trade_proposals` table (manages skill exchange proposals)
- ✅ Proper indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Sample skills data

## 3. Verify Creation
After running the SQL, you should see the new tables in the **Database** > **Tables** section.

## 4. Continue Development
Once tables are created, run:
```bash
node scripts/test-supabase-integration.mjs
```

You should see:
```
✅ user_skills: accessible
✅ trade_proposals: accessible
```

## Alternative: Quick Table Creation
If you prefer, here's the minimal SQL to create just the essential tables:

```sql
-- Essential user_skills table
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  skill_type TEXT CHECK (skill_type IN ('offered', 'wanted')),
  proficiency_level TEXT DEFAULT 'intermediate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Essential trade_proposals table  
CREATE TABLE trade_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  offered_skill_id UUID REFERENCES skills(id),
  requested_skill_id UUID REFERENCES skills(id),
  status TEXT DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

This will enable us to continue with skills CRUD and trade functionality immediately!
