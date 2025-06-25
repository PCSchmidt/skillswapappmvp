# SkillSwap Sample Data Setup Guide

## Overview

The SkillSwap MVP database is fully configured with all required tables. To enhance the demo experience for friends and family testing, comprehensive sample data has been prepared.

## Sample Data Contents

### Skills Catalog (20 diverse skills)

**Skills Being Offered (15 skills):**
- **Technology:** JavaScript Programming, Python Development, Digital Marketing, Data Analysis
- **Creative Arts:** Photography, Graphic Design, Video Editing  
- **Languages:** Spanish Conversation, French Language
- **Music:** Guitar Playing
- **Health & Fitness:** Yoga Instruction, Personal Training
- **Practical:** Home Organization, Garden Design, Italian Cooking

**Skills Being Sought (5 skills):**
- Piano Lessons, French Cooking, Mandarin Chinese, Advanced Excel, Web Development

### Data Structure Features
- **Realistic pricing:** Skills have appropriate hourly equivalent values ($25-$60)
- **Availability patterns:** Different time preferences (weekdays, evenings, weekends)
- **Experience levels:** Beginner to expert across different skills
- **Remote options:** Mix of remote-friendly and in-person skills
- **Categories:** Well-organized across 8 different categories

## How to Add Sample Data

### Method: Direct SQL Execution (Recommended)

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/mdmydtumpwilynhdrtqp/sql

2. **Run the sample data script:**
   - Copy the contents of `scripts/skills-sample-data.sql`
   - Paste into the SQL editor
   - Click "Run" to execute

3. **Verification:**
   - The script includes verification queries
   - You should see 20 skills added across multiple categories
   - Mix of offered and wanted skills for realistic demo

## Why Sample Data is Important

### Enhanced Demo Experience
- **Immediate value:** Users see a populated, active marketplace
- **Realistic testing:** Actual data to browse, search, and interact with
- **Feature demonstration:** Shows the full potential of the platform

### User Testing Benefits
- **Reduced onboarding friction:** Users don't start with empty lists
- **Better feedback:** Testing with realistic data scenarios
- **Professional appearance:** Looks like an established platform

## Technical Notes

### Database Constraints
- Skills table has Row Level Security (RLS) enabled
- Application-level inserts require authentication
- Direct SQL execution bypasses application triggers
- Data includes proper JSON formatting for availability field

### Conflict Handling
- Script uses `ON CONFLICT (title) DO NOTHING` to prevent duplicates
- Safe to run multiple times without data corruption

## Post-Setup Verification

After running the sample data script, verify the installation:

```sql
-- Check total counts
SELECT 
  COUNT(*) as total_skills,
  COUNT(CASE WHEN is_offering = true THEN 1 END) as skills_offered,
  COUNT(CASE WHEN is_offering = false THEN 1 END) as skills_wanted
FROM skills;

-- View by category
SELECT category, COUNT(*) as count 
FROM skills 
GROUP BY category 
ORDER BY category;
```

Expected results:
- Total skills: 20
- Skills offered: 15
- Skills wanted: 5
- Categories: 8 different categories

## Ready for Testing

With sample data in place, the SkillSwap MVP is now ready for:
- ✅ Friends and family testing
- ✅ Feature demonstrations  
- ✅ User experience validation
- ✅ Feedback collection

The combination of complete database setup and comprehensive sample data provides a professional, realistic testing environment that showcases the full potential of the SkillSwap platform.
