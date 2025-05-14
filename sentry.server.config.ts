// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  // Set environment based on Vercel environment or fallback to development
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
  
  // Prevent sensitive data from being sent to Sentry
  beforeSend(event) {
    // Sanitize user information to protect privacy
    if (event.user) {
      // Keep user ID for correlation but remove identifiable fields
      delete event.user.ip_address;
      delete event.user.email;
      delete event.user.username;
    }
    
    return event;
  },
});
