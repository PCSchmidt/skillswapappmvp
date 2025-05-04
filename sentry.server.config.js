// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
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
  
  // Enable automatic instrumentation for Next.js API routes and server components
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app: undefined }),
  ],

  // Prevent sensitive data from being sent to Sentry
  beforeSend(event) {
    // Sanitize error events before sending to Sentry
    if (event.request?.cookies) {
      event.request.cookies = '[Sanitized]';
    }
    
    if (event.request?.headers) {
      // Remove authorization headers
      if (event.request.headers.Authorization) {
        event.request.headers.Authorization = '[Sanitized]';
      }
      
      if (event.request.headers.authorization) {
        event.request.headers.authorization = '[Sanitized]';
      }
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
