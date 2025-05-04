import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Dynamically generate sitemap.xml for the application
 * This includes all public pages and dynamically generated content pages
 */
export async function GET(request: Request) {
  // Get the site URL from environment or construct from request
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    new URL(request.url).origin;

  try {
    // Generate sitemap XML content
    const xml = await generateSitemapXml(siteUrl);
    
    // Return XML response
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

/**
 * Generate XML sitemap content
 */
async function generateSitemapXml(siteUrl: string): Promise<string> {
  // Only generate full sitemap in production environment
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
  
  // Array to hold all URLs in the sitemap
  const sitemapEntries: SitemapEntry[] = [];
  
  // Add static pages
  addStaticPagesToSitemap(sitemapEntries, siteUrl);
  
  // Only add dynamic content pages in production
  if (isProduction) {
    // Add dynamic content pages (skills, profiles, etc.)
    await addDynamicPagesToSitemap(sitemapEntries, siteUrl);
  }
  
  // Generate the XML
  return formatSitemapXml(sitemapEntries);
}

/**
 * Add static pages to the sitemap
 */
function addStaticPagesToSitemap(entries: SitemapEntry[], siteUrl: string) {
  // Main pages
  entries.push({ 
    loc: `${siteUrl}/`, 
    changefreq: 'daily',
    priority: 1.0,
    lastmod: new Date().toISOString()
  });
  
  entries.push({ 
    loc: `${siteUrl}/about`, 
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString()
  });
  
  entries.push({ 
    loc: `${siteUrl}/skills`, 
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date().toISOString()
  });
  
  entries.push({ 
    loc: `${siteUrl}/contact`, 
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString()
  });
  
  entries.push({ 
    loc: `${siteUrl}/faq`, 
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString()
  });
  
  entries.push({ 
    loc: `${siteUrl}/terms`, 
    changefreq: 'yearly',
    priority: 0.5,
    lastmod: new Date().toISOString()
  });
  
  entries.push({ 
    loc: `${siteUrl}/privacy`, 
    changefreq: 'yearly',
    priority: 0.5,
    lastmod: new Date().toISOString()
  });
}

/**
 * Add dynamic pages to the sitemap by querying the database
 */
async function addDynamicPagesToSitemap(entries: SitemapEntry[], siteUrl: string) {
  try {
    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    
    // Fetch public skill categories
    const { data: categories } = await supabase
      .from('skill_categories')
      .select('slug, updated_at')
      .eq('is_active', true);
    
    if (categories) {
      categories.forEach(category => {
        entries.push({
          loc: `${siteUrl}/skills/category/${category.slug}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: category.updated_at || new Date().toISOString()
        });
      });
    }
    
    // Fetch public skills (limit to reasonable number to avoid huge sitemaps)
    const { data: skills } = await supabase
      .from('skills')
      .select('id, title, updated_at, user_id')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1000); // Limit to 1000 most recently updated skills
    
    if (skills) {
      skills.forEach(skill => {
        entries.push({
          loc: `${siteUrl}/skills/${skill.id}`,
          changefreq: 'weekly',
          priority: 0.6,
          lastmod: skill.updated_at || new Date().toISOString()
        });
      });
    }
    
    // Fetch public user profiles (only those who have set profile as public)
    const { data: profiles } = await supabase
      .from('users')
      .select('id, updated_at')
      .eq('is_verified', true)
      .eq('account_status', 'active')
      .limit(1000); // Limit to 1000 user profiles
    
    if (profiles) {
      profiles.forEach(profile => {
        entries.push({
          loc: `${siteUrl}/profile/${profile.id}`,
          changefreq: 'weekly',
          priority: 0.5,
          lastmod: profile.updated_at || new Date().toISOString()
        });
      });
    }
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error);
    // Continue with static pages even if dynamic content fails
  }
}

/**
 * Format the sitemap entries into XML
 */
function formatSitemapXml(entries: SitemapEntry[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add each URL entry
  entries.forEach(entry => {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }
    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    }
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Sitemap entry interface
 */
interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number; // 0.0 to 1.0
}
