# SkillSwap MVP Monitoring Setup

This document outlines the monitoring and observability strategy for the SkillSwap MVP application.

## Monitoring Stack

The SkillSwap MVP uses the following tools for monitoring and observability:

### Error Tracking

**Sentry** is used for real-time error tracking and monitoring:

- Frontend JavaScript errors
- Backend API errors
- Performance monitoring
- User session tracking
- Release tracking

#### Sentry Integration

To integrate Sentry into the application:

1. Install the Sentry SDK:
   ```bash
   npm install @sentry/nextjs
   ```

2. Initialize Sentry in both client and server:
   ```javascript
   // sentry.client.config.js
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 1.0,
     environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
   });
   ```

   ```javascript
   // sentry.server.config.js
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 1.0,
     environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
   });
   ```

3. Configure source maps uploading in the deployment pipeline

### Application Performance Monitoring (APM)

**New Relic** is used for application performance monitoring:

- Real User Monitoring (RUM)
- API endpoint performance
- Database query performance
- External service dependencies
- Custom business metrics

#### New Relic Integration

To integrate New Relic:

1. Install the New Relic agent:
   ```bash
   npm install newrelic
   ```

2. Add New Relic browser script to `_document.js`:
   ```javascript
   <script
     type="text/javascript"
     src={`https://js-agent.newrelic.com/nr-spa-${process.env.NEW_RELIC_ACCOUNT_ID}.min.js`}
   ></script>
   ```

### Log Management

**Datadog** is used for centralized log management:

- Aggregated application logs
- Infrastructure logs
- Log filtering and search
- Alert creation based on log patterns
- Log retention and archiving

#### Datadog Integration

1. Install the Datadog browser SDK:
   ```bash
   npm install @datadog/browser-logs
   ```

2. Initialize in `_app.js`:
   ```javascript
   import { datadogLogs } from '@datadog/browser-logs';

   datadogLogs.init({
     clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
     site: 'us5.datadoghq.com',
     forwardErrorsToLogs: true,
     sessionSampleRate: 100,
   });
   ```

3. Set up a Datadog log forwarder in the production environment

### Uptime Monitoring

**Uptime Robot** is used for external uptime monitoring:

- Endpoint health checks
- SSL certificate monitoring
- Response time tracking
- Downtime alerts via email and Slack

#### Uptime Robot Setup

1. Create an account on Uptime Robot
2. Add the following monitors:
   - Main website URL (https://skillswap.app)
   - API health check endpoint (https://skillswap.app/api/health)
   - Authentication endpoint (https://skillswap.app/api/auth/session)

### Real User Monitoring

**Vercel Analytics** is used for real user monitoring:

- Page load performance
- Web Vitals tracking
- User engagement metrics
- Geographic distribution

## Alert Configuration

### Critical Alerts (24/7)

These alerts require immediate attention and will notify on-call personnel at any time:

- Website downtime > 1 minute
- API endpoint availability < 99.9%
- Error rate > 1% of requests
- Database connection failures
- Authentication service disruptions

### Warning Alerts (Business Hours)

These alerts indicate potential issues but aren't urgent enough for off-hours notification:

- Page load time > 3 seconds
- API response time > 1 second
- CPU utilization > 80%
- Memory usage > 80%
- Database query time > 500ms

### Notification Channels

- **Urgent Issues**: PagerDuty → Phone call + SMS + Slack
- **Warning Issues**: Email + Slack
- **Informational**: Slack only

## Dashboards

### Operations Dashboard

Primary dashboard for monitoring system health, including:

- Service availability
- Error rates
- Response times
- Resource utilization
- User traffic

### Business Dashboard

Metrics focused on user behavior and business performance:

- Daily/weekly active users
- New user registrations
- Skill trades completed
- User retention rates
- Feature usage statistics

## Runbooks

### Incident Response Process

1. **Alert Triggering**: On-call engineer receives alert
2. **Acknowledgment**: Engineer acknowledges the alert in PagerDuty
3. **Investigation**: Engineer investigates using monitoring tools
4. **Communication**: Status updates posted to #incidents Slack channel
5. **Resolution**: Fix applied and verified
6. **Post-mortem**: Incident documented and lessons captured

### Common Issues

#### High Error Rate

1. Check Sentry for error details
2. Review recent deployments
3. Check external service dependencies
4. Consider rolling back recent changes if necessary

#### Performance Degradation

1. Review New Relic APM for bottlenecks
2. Check database query performance
3. Investigate any external API slowdowns
4. Review recent code changes affecting performance

#### Database Issues

1. Check Supabase status page
2. Review database connection pool metrics
3. Examine slow query logs
4. Scale resources if needed

## Log Retention Policy

- **Production Logs**: 30 days online, 1 year archived
- **Error Logs**: 90 days online, 2 years archived
- **Security Logs**: 1 year online, 7 years archived
- **Performance Metrics**: 14 days detailed, 1 year aggregated

## Cost Management

To keep monitoring costs under control:

1. **Sampling Rate**: Use appropriate sampling for high-volume events
2. **Log Filtering**: Filter out noisy logs before sending to storage
3. **Retention Policies**: Implement tiered retention based on importance
4. **Alert Tuning**: Regularly review and adjust alert thresholds

## Implementation Phases

### Phase 1: Basic Monitoring

- Error tracking with Sentry
- Uptime monitoring with Uptime Robot
- Vercel Analytics for user metrics

### Phase 2: Enhanced Observability

- Add APM with New Relic
- Implement central logging with Datadog
- Create operational dashboards

### Phase 3: Advanced Monitoring

- Custom business metrics
- User journey tracking
- Automated anomaly detection
- Correlation between metrics

## Next Steps

1. Set up Sentry account and integrate SDK
2. Configure Uptime Robot monitors
3. Create PagerDuty schedules and escalation policies
4. Design initial dashboards in Datadog
5. Document incident response procedures
