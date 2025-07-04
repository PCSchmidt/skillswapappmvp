import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for handling authentication, route protection, and maintenance mode
 *
 * This middleware:
 * 1. Checks if the site is in maintenance mode and redirects accordingly
 * 2. Refreshes session if needed
 * 3. Redirects unauthenticated users away from protected routes
 * 4. Redirects authenticated users away from auth pages when already logged in
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Check if site is in maintenance mode
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const pathname = req.nextUrl.pathname;
  
  // Skip maintenance mode for specific paths
  const allowedDuringMaintenance = [
    '/maintenance',
    '/api/health',
    '/api/robots',
    '/api/sitemap',
    '/_next',
    '/favicon.ico',
    '/logo.svg'
  ];
  
  // Check if current path should be allowed during maintenance
  const isAllowedDuringMaintenance = allowedDuringMaintenance.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // If site is in maintenance mode and path is not allowed, redirect to maintenance page
  if (isMaintenanceMode && !isAllowedDuringMaintenance) {
    // If the request is for an API endpoint, return a 503 Service Unavailable
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Service Unavailable', 
          message: 'The service is currently in maintenance mode' 
        }),
        { 
          status: 503, 
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '3600' // Suggest retry after 1 hour
          } 
        }
      );
    }
    
    // For regular page requests, redirect to maintenance page
    const maintenanceUrl = new URL('/maintenance', req.url);
    return NextResponse.redirect(maintenanceUrl);
  }
  
  // If we're already on the maintenance page and site is not in maintenance mode,
  // redirect to homepage (prevents users from staying on maintenance page)
  if (pathname === '/maintenance' && !isMaintenanceMode) {
    const homeUrl = new URL('/', req.url);
    return NextResponse.redirect(homeUrl);
  }
  
  // Create supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  // Refresh session if needed
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // pathname is already defined above
  
  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/skills/new',
    '/skills/edit',
    '/trades',
    '/messages',
    '/auth/complete-profile',
  ];
  
  // Define auth routes where authenticated users shouldn't go
  const authRoutes = [
    '/login',
    '/signup',
    '/auth/forgot-password',
  ];
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Special case for verify page - should be accessible without login
  // but needs to have the token parameter
  if (pathname === '/auth/verify' || pathname === '/auth/reset-password') {
    const token = req.nextUrl.searchParams.get('token');
    
    // If no token provided, redirect to login
    if (!token) {
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    return res;
  }
  
  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url);
    // Store the original URL to redirect back after login
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Redirect authenticated users away from auth routes
  if (isAuthRoute && session) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - Most api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api(?!/health|/robots|/sitemap)).*)',
    // Include specific API routes that need middleware
    '/api/health',
    '/api/robots',
    '/api/sitemap',
    '/robots.txt',
    '/sitemap.xml'
  ],
};
