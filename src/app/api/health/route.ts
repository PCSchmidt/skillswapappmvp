import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Health check timeouts in milliseconds
const TIMEOUT_MS = 5000;

/**
 * Health check endpoint for monitoring services
 * Returns system health information including:
 * - API status
 * - Database connection status
 * - Version information
 * - Uptime
 * - System load
 */
export async function GET() {
  // Start timer for response time calculation
  const startTime = Date.now();
  
  // Initialize services status
  let databaseStatus = 'unknown';
  let databaseResponseTime: number | null = null;
  let error: string | null = null;
  
  try {
    // Create Supabase client for database check
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    
    // Check database connection with timeout
    const dbCheckStart = Date.now();
    const dbCheckPromise = supabase.from('system_health').select('last_check_time').limit(1);
    
    // Add timeout to database check
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database health check timed out')), TIMEOUT_MS);
    });
    
    // Race the database check against timeout
    await Promise.race([dbCheckPromise, timeoutPromise]);
    
    // If we get here, database check succeeded
    databaseStatus = 'healthy';
    databaseResponseTime = Date.now() - dbCheckStart;
  } catch (err) {
    // Handle database connection error
    databaseStatus = 'unhealthy';
    error = err instanceof Error ? err.message : 'Unknown database error';
    console.error('Health check database error:', error);
  }
  
  // Calculate total response time
  const responseTime = Date.now() - startTime;
  
  // Get application version from package.json
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

  // Construct response object
  const healthStatus = {
    status: databaseStatus === 'healthy' ? 'healthy' : 'degraded',
    version: appVersion,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      api: {
        status: 'healthy',
        responseTime: `${responseTime}ms`,
      },
      database: {
        status: databaseStatus,
        responseTime: databaseResponseTime ? `${databaseResponseTime}ms` : null,
        error: error,
      },
    },
    uptime: process.uptime(),
  };

  // Return health status with appropriate status code
  return NextResponse.json(
    healthStatus,
    { 
      status: databaseStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
