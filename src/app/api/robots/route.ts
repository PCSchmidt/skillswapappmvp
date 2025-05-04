import { NextResponse } from 'next/server';

/**
 * Dynamic robots.txt generation
 * Allows or disallows search engine crawling based on environment
 */
export async function GET(request: Request) {
  // Get the site URL from environment or construct from request
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    new URL(request.url).origin;
  
  // Determine environment - only allow indexing in production
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
  
  // Generate robots.txt content
  const robotsTxt = generateRobotsTxt(isProduction, siteUrl);
  
  // Return plain text response
  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}

/**
 * Generate appropriate robots.txt content based on environment
 */
function generateRobotsTxt(isProduction: boolean, siteUrl: string): string {
  if (isProduction) {
    // Production environment - allow crawling with some restrictions
    return `# SkillSwap Production Environment
# Allow all search engines to index the site
User-agent: *
Allow: /

# Disallow specific areas
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /profile/*/edit
Disallow: /inbox/
Disallow: /settings/

# Disallow parameters that may create duplicate content
Disallow: /*?source=*
Disallow: /*?ref=*
Disallow: /*&utm_*=*

# Temporary system areas
Disallow: /maintenance
Disallow: /system/

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml
`;
  } else {
    // Non-production environments - disallow all crawling
    return `# SkillSwap Non-Production Environment
# Disallow all search engines from indexing non-production environments
User-agent: *
Disallow: /
`;
  }
}
