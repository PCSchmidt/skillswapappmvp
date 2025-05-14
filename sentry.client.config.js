// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  // Set environment based on Vercel environment or fallback to development
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
  
  // Enable automatic instrumentation for Next.js routing
  // Note: We removed BrowserTracing and Replay as they're not available in this version
  
  // Performance settings
  // These are kept as they are standard options even if the integrations are different
  replaysSessionSampleRate: 0.1, // Sample rate for performance tracing
  replaysOnErrorSampleRate: 1.0, // Always trace sessions with errors
  
  // Prevent sensitive data from being sent to Sentry
  beforeSend(event) {
    // Sanitize error events before sending to Sentry
    if (event.request?.cookies) {
      event.request.cookies = '[Sanitized]';
    }
    
    // Don't send PII
    if (event.user) {
      delete event.user.ip_address;
      // Keep user ID for correlation but remove identifiable fields
      delete event.user.email;
      delete event.user.username;
    }
    
    return event;
  },
});
