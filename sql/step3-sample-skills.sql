-- Step 3: Add sample skills data (only if skills table is empty)
INSERT INTO skills (name, category, description) 
VALUES
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
ON CONFLICT (name) DO NOTHING;
