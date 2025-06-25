/**
 * Comprehensive Skill Suggestions Database
 * 
 * This file contains categorized skill suggestions to help users understand
 * what kinds of skills they can offer or request on the platform.
 */

export interface SkillSuggestion {
  name: string;
  description: string;
  subcategory: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  isPopular?: boolean;
}

export interface CategoryData {
  name: string;
  description: string;
  icon: string;
  subcategories: {
    [key: string]: SkillSuggestion[];
  };
}

export const SKILL_CATEGORIES: { [key: string]: CategoryData } = {
  'Technology': {
    name: 'Technology',
    description: 'Programming, web development, data science, and digital skills',
    icon: '💻',
    subcategories: {
      'Web Development': [
        { name: 'React Development', description: 'Build modern web applications with React', subcategory: 'Web Development', isPopular: true },
        { name: 'JavaScript Programming', description: 'Learn or teach JavaScript fundamentals', subcategory: 'Web Development', isPopular: true },
        { name: 'HTML & CSS', description: 'Create beautiful, responsive websites', subcategory: 'Web Development', isPopular: true },
        { name: 'Node.js Development', description: 'Backend development with Node.js', subcategory: 'Web Development' },
        { name: 'Vue.js Development', description: 'Progressive web app development', subcategory: 'Web Development' },
        { name: 'WordPress Development', description: 'Custom themes and plugin development', subcategory: 'Web Development' },
        { name: 'TypeScript', description: 'Typed JavaScript for better development', subcategory: 'Web Development' },
        { name: 'API Development', description: 'RESTful and GraphQL API creation', subcategory: 'Web Development' },
      ],
      'Mobile Development': [
        { name: 'React Native', description: 'Cross-platform mobile app development', subcategory: 'Mobile Development', isPopular: true },
        { name: 'iOS Development (Swift)', description: 'Native iOS app development', subcategory: 'Mobile Development' },
        { name: 'Android Development (Kotlin)', description: 'Native Android app development', subcategory: 'Mobile Development' },
        { name: 'Flutter Development', description: 'Cross-platform apps with Dart', subcategory: 'Mobile Development' },
        { name: 'App Store Optimization', description: 'Improve app visibility and downloads', subcategory: 'Mobile Development' },
      ],
      'Data Science': [
        { name: 'Python for Data Science', description: 'Data analysis and machine learning', subcategory: 'Data Science', isPopular: true },
        { name: 'SQL Database Queries', description: 'Database design and optimization', subcategory: 'Data Science', isPopular: true },
        { name: 'Data Visualization', description: 'Create charts and dashboards', subcategory: 'Data Science' },
        { name: 'Machine Learning', description: 'AI model development and training', subcategory: 'Data Science' },
        { name: 'Excel/Spreadsheet Mastery', description: 'Advanced formulas and analysis', subcategory: 'Data Science', isPopular: true },
        { name: 'Tableau/Power BI', description: 'Business intelligence tools', subcategory: 'Data Science' },
      ],
      'Cloud Computing': [
        { name: 'AWS Services', description: 'Amazon Web Services deployment', subcategory: 'Cloud Computing' },
        { name: 'Google Cloud Platform', description: 'GCP infrastructure and services', subcategory: 'Cloud Computing' },
        { name: 'Docker & Containers', description: 'Application containerization', subcategory: 'Cloud Computing' },
        { name: 'DevOps Practices', description: 'CI/CD and automation', subcategory: 'Cloud Computing' },
      ],
      'Cybersecurity': [
        { name: 'Ethical Hacking', description: 'Penetration testing and security audits', subcategory: 'Cybersecurity' },
        { name: 'Network Security', description: 'Firewall and VPN configuration', subcategory: 'Cybersecurity' },
        { name: 'Security Best Practices', description: 'Secure coding and data protection', subcategory: 'Cybersecurity' },
      ]
    }
  },
  'Design': {
    name: 'Design',
    description: 'Visual design, user experience, and creative services',
    icon: '🎨',
    subcategories: {
      'Graphic Design': [
        { name: 'Logo Design', description: 'Create memorable brand identities', subcategory: 'Graphic Design', isPopular: true },
        { name: 'Adobe Photoshop', description: 'Photo editing and digital art', subcategory: 'Graphic Design', isPopular: true },
        { name: 'Adobe Illustrator', description: 'Vector graphics and illustrations', subcategory: 'Graphic Design', isPopular: true },
        { name: 'Brand Identity Design', description: 'Complete brand package creation', subcategory: 'Graphic Design' },
        { name: 'Print Design', description: 'Brochures, flyers, and marketing materials', subcategory: 'Graphic Design' },
        { name: 'Packaging Design', description: 'Product packaging and labels', subcategory: 'Graphic Design' },
      ],
      'UI/UX Design': [
        { name: 'User Interface Design', description: 'Create intuitive app and web interfaces', subcategory: 'UI/UX Design', isPopular: true },
        { name: 'User Experience Research', description: 'User testing and behavior analysis', subcategory: 'UI/UX Design' },
        { name: 'Prototyping (Figma)', description: 'Interactive design prototypes', subcategory: 'UI/UX Design', isPopular: true },
        { name: 'Wireframing', description: 'Layout and structure planning', subcategory: 'UI/UX Design' },
        { name: 'Design Systems', description: 'Consistent design component libraries', subcategory: 'UI/UX Design' },
      ],
      'Web Design': [
        { name: 'Responsive Web Design', description: 'Mobile-friendly website layouts', subcategory: 'Web Design', isPopular: true },
        { name: 'Landing Page Design', description: 'High-converting page design', subcategory: 'Web Design' },
        { name: 'E-commerce Design', description: 'Online store design and optimization', subcategory: 'Web Design' },
      ],
      'Animation': [
        { name: 'Motion Graphics', description: 'Animated logos and graphics', subcategory: 'Animation' },
        { name: '2D Animation', description: 'Character and story animation', subcategory: 'Animation' },
        { name: 'Video Editing', description: 'Professional video production', subcategory: 'Animation', isPopular: true },
      ]
    }
  },
  'Business': {
    name: 'Business',
    description: 'Marketing, finance, strategy, and professional services',
    icon: '💼',
    subcategories: {
      'Marketing': [
        { name: 'Digital Marketing Strategy', description: 'Comprehensive online marketing plans', subcategory: 'Marketing', isPopular: true },
        { name: 'Social Media Marketing', description: 'Instagram, Facebook, LinkedIn strategies', subcategory: 'Marketing', isPopular: true },
        { name: 'Content Marketing', description: 'Blog writing and content strategy', subcategory: 'Marketing', isPopular: true },
        { name: 'Email Marketing', description: 'Newsletter and automation campaigns', subcategory: 'Marketing' },
        { name: 'SEO Optimization', description: 'Search engine ranking improvement', subcategory: 'Marketing', isPopular: true },
        { name: 'Google Ads Management', description: 'PPC advertising and optimization', subcategory: 'Marketing' },
        { name: 'Influencer Marketing', description: 'Partnership and campaign management', subcategory: 'Marketing' },
      ],
      'Finance': [
        { name: 'Personal Finance Planning', description: 'Budgeting and investment advice', subcategory: 'Finance', isPopular: true },
        { name: 'QuickBooks Training', description: 'Accounting software mastery', subcategory: 'Finance' },
        { name: 'Tax Preparation', description: 'Individual and business tax filing', subcategory: 'Finance' },
        { name: 'Investment Strategies', description: 'Portfolio management and planning', subcategory: 'Finance' },
        { name: 'Cryptocurrency', description: 'Digital currency trading and education', subcategory: 'Finance' },
      ],
      'Entrepreneurship': [
        { name: 'Business Plan Writing', description: 'Comprehensive startup planning', subcategory: 'Entrepreneurship' },
        { name: 'Startup Consulting', description: 'Early-stage business guidance', subcategory: 'Entrepreneurship' },
        { name: 'Pitch Deck Creation', description: 'Investor presentation design', subcategory: 'Entrepreneurship' },
        { name: 'Market Research', description: 'Industry and competitor analysis', subcategory: 'Entrepreneurship' },
      ],
      'Sales': [
        { name: 'Sales Funnel Optimization', description: 'Conversion rate improvement', subcategory: 'Sales' },
        { name: 'Cold Email Outreach', description: 'B2B prospecting strategies', subcategory: 'Sales' },
        { name: 'Negotiation Skills', description: 'Deal closing and conflict resolution', subcategory: 'Sales' },
        { name: 'CRM Management', description: 'Customer relationship tools', subcategory: 'Sales' },
      ]
    }
  },
  'Education': {
    name: 'Education',
    description: 'Teaching, tutoring, and knowledge transfer',
    icon: '📚',
    subcategories: {
      'Academic Tutoring': [
        { name: 'Math Tutoring', description: 'Algebra, calculus, and statistics help', subcategory: 'Academic Tutoring', isPopular: true },
        { name: 'Science Tutoring', description: 'Physics, chemistry, and biology', subcategory: 'Academic Tutoring', isPopular: true },
        { name: 'English Writing', description: 'Essay writing and grammar improvement', subcategory: 'Academic Tutoring', isPopular: true },
        { name: 'Test Preparation', description: 'SAT, GRE, GMAT prep strategies', subcategory: 'Academic Tutoring' },
        { name: 'College Application Help', description: 'Essay writing and application guidance', subcategory: 'Academic Tutoring' },
      ],
      'Language Teaching': [
        { name: 'English as Second Language', description: 'ESL conversation and grammar', subcategory: 'Language Teaching', isPopular: true },
        { name: 'Spanish Conversation', description: 'Conversational Spanish practice', subcategory: 'Language Teaching', isPopular: true },
        { name: 'French Language', description: 'French grammar and pronunciation', subcategory: 'Language Teaching' },
        { name: 'Mandarin Chinese', description: 'Chinese language and culture', subcategory: 'Language Teaching' },
        { name: 'Sign Language (ASL)', description: 'American Sign Language basics', subcategory: 'Language Teaching' },
      ],
      'Professional Development': [
        { name: 'Public Speaking', description: 'Presentation and communication skills', subcategory: 'Professional Development', isPopular: true },
        { name: 'Resume Writing', description: 'Job application optimization', subcategory: 'Professional Development', isPopular: true },
        { name: 'Interview Preparation', description: 'Mock interviews and coaching', subcategory: 'Professional Development', isPopular: true },
        { name: 'Leadership Training', description: 'Management and team building', subcategory: 'Professional Development' },
        { name: 'Time Management', description: 'Productivity and organization', subcategory: 'Professional Development' },
      ]
    }
  },
  'Languages': {
    name: 'Languages',
    description: 'Language learning and cultural exchange',
    icon: '🌍',
    subcategories: {
      'Popular Languages': [
        { name: 'Spanish Conversation', description: 'Practice speaking and listening', subcategory: 'Popular Languages', isPopular: true },
        { name: 'French Language Basics', description: 'Grammar and vocabulary building', subcategory: 'Popular Languages', isPopular: true },
        { name: 'German Language', description: 'Conversational German practice', subcategory: 'Popular Languages' },
        { name: 'Italian Language', description: 'Italian conversation and culture', subcategory: 'Popular Languages' },
        { name: 'Portuguese Language', description: 'Brazilian and European Portuguese', subcategory: 'Popular Languages' },
      ],
      'Asian Languages': [
        { name: 'Mandarin Chinese', description: 'Chinese characters and tones', subcategory: 'Asian Languages', isPopular: true },
        { name: 'Japanese Language', description: 'Hiragana, katakana, and conversation', subcategory: 'Asian Languages' },
        { name: 'Korean Language', description: 'Hangul and K-culture immersion', subcategory: 'Asian Languages' },
        { name: 'Hindi Language', description: 'Devanagari script and conversation', subcategory: 'Asian Languages' },
      ],
      'Language Exchange': [
        { name: 'English Practice Partner', description: 'Native English conversation', subcategory: 'Language Exchange', isPopular: true },
        { name: 'Cultural Exchange', description: 'Share traditions and customs', subcategory: 'Language Exchange' },
        { name: 'Business Language Skills', description: 'Professional communication', subcategory: 'Language Exchange' },
      ]
    }
  },
  'Arts & Crafts': {
    name: 'Arts & Crafts',
    description: 'Creative arts, crafting, and hands-on making',
    icon: '🎭',
    subcategories: {
      'Visual Arts': [
        { name: 'Watercolor Painting', description: 'Landscape and portrait techniques', subcategory: 'Visual Arts', isPopular: true },
        { name: 'Acrylic Painting', description: 'Canvas painting fundamentals', subcategory: 'Visual Arts' },
        { name: 'Drawing Techniques', description: 'Pencil, charcoal, and digital drawing', subcategory: 'Visual Arts', isPopular: true },
        { name: 'Oil Painting', description: 'Traditional oil painting methods', subcategory: 'Visual Arts' },
        { name: 'Digital Art', description: 'iPad and tablet illustration', subcategory: 'Visual Arts' },
      ],
      'Crafting': [
        { name: 'Jewelry Making', description: 'Beading and metalwork basics', subcategory: 'Crafting', isPopular: true },
        { name: 'Pottery & Ceramics', description: 'Wheel throwing and hand building', subcategory: 'Crafting' },
        { name: 'Knitting & Crochet', description: 'Scarves, sweaters, and patterns', subcategory: 'Crafting', isPopular: true },
        { name: 'Woodworking', description: 'Furniture and home décor projects', subcategory: 'Crafting' },
        { name: 'Sewing & Tailoring', description: 'Clothing alterations and creation', subcategory: 'Crafting', isPopular: true },
        { name: 'Candle Making', description: 'Soy and beeswax candle crafting', subcategory: 'Crafting' },
      ],
      'Paper Crafts': [
        { name: 'Scrapbooking', description: 'Memory preservation and design', subcategory: 'Paper Crafts' },
        { name: 'Origami', description: 'Japanese paper folding art', subcategory: 'Paper Crafts' },
        { name: 'Calligraphy', description: 'Beautiful hand lettering', subcategory: 'Paper Crafts' },
        { name: 'Card Making', description: 'Handmade greeting cards', subcategory: 'Paper Crafts' },
      ]
    }
  }
};

export const POPULAR_SKILLS = Object.values(SKILL_CATEGORIES)
  .flatMap(category => 
    Object.values(category.subcategories)
      .flat()
      .filter(skill => skill.isPopular)
  );

export const TRENDING_SEARCHES = [
  'web development',
  'graphic design',
  'language exchange',
  'tutoring',
  'social media marketing',
  'photography',
  'cooking lessons',
  'music lessons',
  'fitness training',
  'career coaching'
];

/**
 * Get skill suggestions for a specific category
 */
export function getSkillsByCategory(categoryName: string): SkillSuggestion[] {
  const category = SKILL_CATEGORIES[categoryName];
  if (!category) return [];
  
  return Object.values(category.subcategories).flat();
}

/**
 * Get skill suggestions for a specific subcategory
 */
export function getSkillsBySubcategory(categoryName: string, subcategoryName: string): SkillSuggestion[] {
  const category = SKILL_CATEGORIES[categoryName];
  if (!category || !category.subcategories[subcategoryName]) return [];
  
  return category.subcategories[subcategoryName];
}

/**
 * Search skills by name or description
 */
export function searchSkills(query: string): SkillSuggestion[] {
  const lowercaseQuery = query.toLowerCase();
  const allSkills = Object.values(SKILL_CATEGORIES)
    .flatMap(category => Object.values(category.subcategories).flat());
  
  return allSkills.filter(skill => 
    skill.name.toLowerCase().includes(lowercaseQuery) ||
    skill.description.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get random skill suggestions
 */
export function getRandomSkills(count: number = 6): SkillSuggestion[] {
  const allSkills = Object.values(SKILL_CATEGORIES)
    .flatMap(category => Object.values(category.subcategories).flat());
  
  const shuffled = allSkills.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
