-- SkillSwap MVP - Sample Skills Data
-- Run this SQL directly in the Supabase SQL Editor
-- This bypasses any application-level triggers or constraints

-- Insert comprehensive sample skills for demo
INSERT INTO skills (
  title, 
  description, 
  category, 
  subcategory, 
  experience_level, 
  hourly_equivalent_value, 
  availability, 
  is_offering, 
  is_remote_friendly, 
  is_active
) VALUES 
-- Technology Skills
('JavaScript Programming', 'Modern JavaScript development including React, Node.js, ES6+, and full-stack web applications', 'Technology', 'Web Development', 'intermediate', 45.0, '{"weekdays": true, "evenings": true, "weekends": false}', true, true, true),

('Python Development', 'Python programming for web development, data science, automation, and machine learning', 'Technology', 'Programming', 'advanced', 50.0, '{"weekdays": true, "evenings": false, "weekends": false}', true, true, true),

('Digital Marketing', 'SEO optimization, social media marketing, content strategy, and online advertising campaigns', 'Business', 'Marketing', 'expert', 60.0, '{"weekdays": true, "evenings": false, "weekends": false}', true, true, true),

('Data Analysis', 'Excel mastery, data visualization, business intelligence, and statistical analysis', 'Technology', 'Data Science', 'advanced', 55.0, '{"weekdays": true, "evenings": true, "weekends": false}', true, true, true),

-- Creative Arts
('Photography', 'Portrait, landscape, and event photography with professional editing techniques', 'Creative Arts', 'Visual Arts', 'intermediate', 40.0, '{"weekdays": false, "evenings": false, "weekends": true}', true, false, true),

('Graphic Design', 'Logo design, branding, print materials, and digital design using Adobe Creative Suite', 'Creative Arts', 'Design', 'intermediate', 35.0, '{"weekdays": true, "evenings": false, "weekends": true}', true, true, true),

('Video Editing', 'Professional video editing with Adobe Premiere, DaVinci Resolve, and motion graphics', 'Creative Arts', 'Digital Media', 'advanced', 45.0, '{"weekdays": true, "evenings": true, "weekends": false}', true, true, true),

-- Languages
('Spanish Conversation', 'Conversational Spanish for travel, business, and cultural communication', 'Languages', 'Romance Languages', 'expert', 25.0, '{"weekdays": true, "evenings": true, "weekends": false}', true, true, true),

('French Language', 'French grammar, vocabulary, pronunciation, and cultural context', 'Languages', 'Romance Languages', 'intermediate', 30.0, '{"weekdays": false, "evenings": true, "weekends": true}', true, true, true),

-- Music
('Guitar Playing', 'Acoustic and electric guitar lessons covering various styles from beginner to intermediate', 'Music', 'String Instruments', 'advanced', 30.0, '{"weekdays": false, "evenings": true, "weekends": true}', true, false, true),

-- Health & Fitness
('Yoga Instruction', 'Hatha and Vinyasa yoga classes for stress relief, flexibility, and mindfulness', 'Health & Fitness', 'Mind-Body', 'advanced', 40.0, '{"weekdays": true, "evenings": true, "weekends": true}', true, false, true),

('Personal Training', 'Customized fitness coaching, strength training, and workout planning', 'Health & Fitness', 'Physical Training', 'expert', 50.0, '{"weekdays": true, "evenings": false, "weekends": true}', true, false, true),

-- Practical Skills
('Home Organization', 'Decluttering techniques, storage solutions, and creating organized living spaces', 'Lifestyle', 'Home Improvement', 'intermediate', 25.0, '{"weekdays": true, "evenings": false, "weekends": true}', true, false, true),

('Garden Design', 'Landscape planning, plant selection, sustainable gardening, and seasonal maintenance', 'Home & Garden', 'Landscaping', 'intermediate', 35.0, '{"weekdays": false, "evenings": false, "weekends": true}', true, false, true),

-- Culinary
('Italian Cooking', 'Traditional Italian cooking techniques, pasta making, and authentic regional recipes', 'Culinary', 'International Cuisine', 'intermediate', 35.0, '{"weekdays": false, "evenings": true, "weekends": true}', true, false, true),

-- Skills People Want to Learn (is_offering: false)
('Piano Lessons', 'Classical and contemporary piano instruction for skill development', 'Music', 'Keyboard Instruments', 'beginner', 0.0, '{"weekdays": false, "evenings": true, "weekends": true}', false, false, true),

('French Cooking', 'Classic French culinary techniques and pastry making', 'Culinary', 'International Cuisine', 'beginner', 0.0, '{"weekdays": false, "evenings": true, "weekends": true}', false, false, true),

('Mandarin Chinese', 'Basic Mandarin conversation and writing for business communication', 'Languages', 'East Asian Languages', 'beginner', 0.0, '{"weekdays": true, "evenings": true, "weekends": false}', false, true, true),

('Advanced Excel', 'Macros, VBA programming, and advanced data analysis techniques', 'Technology', 'Business Software', 'beginner', 0.0, '{"weekdays": true, "evenings": false, "weekends": false}', false, true, true),

('Web Development', 'HTML, CSS, JavaScript, and modern web development frameworks', 'Technology', 'Web Development', 'beginner', 0.0, '{"weekdays": true, "evenings": true, "weekends": false}', false, true, true);

-- Verify the insert
SELECT 
  COUNT(*) as total_skills,
  COUNT(CASE WHEN is_offering = true THEN 1 END) as skills_offered,
  COUNT(CASE WHEN is_offering = false THEN 1 END) as skills_wanted,
  COUNT(DISTINCT category) as categories
FROM skills;

-- Show skills by category
SELECT 
  category,
  COUNT(*) as count,
  COUNT(CASE WHEN is_offering = true THEN 1 END) as offered,
  COUNT(CASE WHEN is_offering = false THEN 1 END) as wanted
FROM skills 
GROUP BY category 
ORDER BY category;
