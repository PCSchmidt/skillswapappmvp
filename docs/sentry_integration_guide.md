# Sentry Integration Guide for SkillSwap MVP

This guide explains the Sentry error monitoring configuration for the SkillSwap MVP project and provides instructions for verifying that the integration is working correctly.

## Configuration Overview

Sentry is integrated into the project using the `@sentry/nextjs` package, which provides automatic error tracking for Next.js applications. The configuration is split into three main files:

1. `sentry.client.config.js` - Client-side configuration
2. `sentry.server.config.ts` - Server-side configuration 
3. `sentry.edge.config.ts` - Edge runtime configuration (for middleware and edge functions)

All three configuration files follow a similar pattern, using environment variables for sensitive information such as the DSN.

### Key Configuration Points

- **DSN**: Sourced from the `SENTRY_DSN` environment variable, defined in `.env.staging` and other environment files
- **Environment**: Set based on the `NEXT_PUBLIC_VERCEL_ENV` environment variable
- **Debug Mode**: Enabled only in development mode
- **Privacy Protection**: All configurations include privacy protections to prevent sending personal identifiable information (PII)
- **Sample Rate**: Set to collect 100% of errors in the current configuration (can be adjusted for production)

## Verifying the Integration

To verify that Sentry is correctly capturing errors, you can use the test page that has been set up:

1. Start your development server:
   ```
   npm run dev
   ```

2. Visit the Sentry test page at:
   ```
   http://localhost:3000/sentry-example-page
   ```

3. Click the "Trigger Test Error" button to generate a test error.

4. After a few moments, check your Sentry dashboard at https://sentry.io to see if the error was captured.

## Alternative Verification Method

If you prefer, you can also verify Sentry by adding a test error manually:

1. Add the following code to any component in your application:
   ```javascript
   // This will throw an error and be captured by Sentry
   myUndefinedFunction();
   ```

2. Visit the page containing this code to trigger the error.

3. Check your Sentry dashboard to confirm the error was captured.

## Deployment Considerations

For production deployments, you may want to adjust the following settings in the Sentry configuration files:

- **tracesSampleRate**: Consider reducing from `1.0` (100%) to a lower value like `0.2` (20%) to reduce the volume of data sent to Sentry in high-traffic environments
- **replaysSessionSampleRate**: Keep at a lower value (currently `0.1` or 10%) to minimize performance impact
- **replaysOnErrorSampleRate**: Maintain at `1.0` (100%) to always capture session replays when errors occur

## Troubleshooting

If errors are not appearing in your Sentry dashboard:

1. Check that the `SENTRY_DSN` environment variable is correctly set in your environment files
2. Verify that the Sentry SDK is being properly initialized by checking for any console errors
3. Ensure that the error is not being caught and handled without being rethrown
4. Check for any Content Security Policy (CSP) restrictions that might be blocking Sentry's reporting

## Additional Resources

- [Next.js Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry JavaScript SDK Documentation](https://docs.sentry.io/platforms/javascript/)
- [Sentry Replay Documentation](https://docs.sentry.io/platforms/javascript/session-replay/)
