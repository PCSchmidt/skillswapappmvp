# SkillSwap Environment Details

This document describes the environment context for the SkillSwap application, including development, testing, and production environments.

## Development Environment

### Local Development Setup

- **Operating System**: Cross-platform (Windows, macOS, Linux)
- **Node.js**: v18.17.0+ (LTS recommended)
- **Package Manager**: npm 9.6.7+ or Yarn 1.22+
- **Database**: Supabase (local development using Docker)
- **IDE**: Visual Studio Code with recommended extensions
- **Git**: 2.34+ for version control
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)

### Development Tools

- **Next.js**: 14+ with App Router
- **React**: 18+
- **TypeScript**: 5.0+
- **Tailwind CSS**: 3.3+
- **ESLint**: For code quality enforcement
- **Prettier**: For consistent code formatting
- **Jest**: For unit and integration testing
- **Cypress**: For end-to-end testing
- **React Testing Library**: For component testing
- **Supabase CLI**: For local Supabase development

### Development Workflow

1. Local development on feature branches
2. Pull request workflow with code review
3. Automated tests run on pull requests
4. Manual QA in development environment
5. Merge to main branch for staging deployment
6. Final QA in staging environment
7. Production deployment via GitOps

## Testing Environment

### Testing Frameworks and Tools

- **Unit Testing**: Jest and React Testing Library
- **Integration Testing**: Jest with Supabase testing utilities
- **End-to-End Testing**: Cypress
- **API Testing**: Postman or Insomnia
- **Performance Testing**: Lighthouse and WebPageTest
- **Accessibility Testing**: axe DevTools
- **Security Testing**: OWASP ZAP and Snyk
- **Internationalization Testing**: Manual testing with mock translations

### Testing Practices

- Test-driven development encouraged
- 80%+ test coverage for core functionality
- Snapshot testing for UI components
- Mock services for external dependencies
- Automated accessibility testing
- Cross-browser compatibility testing
- Mobile responsive design testing

## Staging Environment

- **Hosting**: Vercel Preview Deployments
- **Database**: Dedicated Supabase project for staging
- **Domain**: staging.skillswap.app
- **Authentication**: Test accounts and OAuth integrations
- **Monitoring**: Basic error tracking and analytics
- **Data**: Anonymized production data for testing
- **Feature Flags**: Enabled for beta features

## Production Environment

### Web Application

- **Hosting**: Vercel Production Deployment
- **Database**: Supabase Production Project
- **Domain**: skillswap.app (with regional domains as needed)
- **CDN**: Vercel Edge Network
- **Authentication**: Supabase Auth with multiple providers
- **Storage**: Supabase Storage for user content
- **Caching**: Edge caching for static assets
- **SSL**: Automatic SSL certificates via Vercel

### Mobile Application

- **Platform**: React Native with Expo
- **Distribution**: App Store and Google Play
- **Updates**: Expo OTA for minor updates
- **Push Notifications**: Expo Push Notification Service
- **Deep Linking**: Configured for cross-platform linking
- **Offline Support**: Basic functionality when offline
- **Analytics**: Mobile-specific usage tracking

### Infrastructure

- **Regions**: Multi-region deployment where available
- **Scaling**: Automatic scaling based on demand
- **Database**: Managed PostgreSQL via Supabase
- **Backup**: Automated daily backups
- **Disaster Recovery**: Point-in-time recovery
- **Monitoring**: Application performance monitoring
- **Logging**: Centralized logging solution
- **Alerts**: Critical error and performance alerts

### Security

- **Authentication**: JWT-based authentication
- **Authorization**: Row Level Security in Supabase
- **API Security**: Rate limiting and CORS configuration
- **Data Encryption**: Encryption at rest and in transit
- **Compliance**: GDPR and CCPA compliance measures
- **Vulnerability Scanning**: Regular automated scans
- **Penetration Testing**: Quarterly security assessments
- **Incident Response**: Defined security incident response plan

## CI/CD Pipeline

- **Version Control**: GitHub
- **CI/CD**: GitHub Actions
- **Build Process**: Automated builds on commit
- **Testing**: Automated test suite execution
- **Deployment**: Automated deployment to staging
- **Approval**: Manual approval for production deployment
- **Rollback**: Automated rollback capability
- **Monitoring**: Post-deployment monitoring

## Monitoring and Analytics

- **Error Tracking**: Error monitoring service
- **Performance Monitoring**: Real user monitoring
- **Analytics**: Anonymous usage tracking
- **Dashboards**: Operational dashboards for key metrics
- **User Feedback**: In-app feedback mechanism
- **Health Checks**: Automated endpoint monitoring
- **Alerting**: Escalation for critical issues

## Environment Variables

Key environment variables include:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_KEY`: Supabase service key (server-side only)
- `OPENAI_API_KEY`: OpenAI API key for embeddings
- `NEXT_PUBLIC_SITE_URL`: Application URL
- `NEXT_PUBLIC_API_URL`: API URL if separate from main app
- `NODE_ENV`: Environment (development, test, production)

## Memory Bank Integration

- **Development**: SQLite local storage
- **Production**: PostgreSQL with pgvector extension
- **Embeddings**: OpenAI's text-embedding-ada-002 model
- **Vector Dimensions**: 1536 (OpenAI embeddings)
- **Query Limit**: 5 results per memory query (configurable)
- **Relevance Threshold**: 0.75 (configurable)

## Regional Considerations

- **Primary Region**: North America
- **Additional Regions**: Europe, Asia-Pacific (future)
- **Data Residency**: Regional data storage compliance
- **Languages**: English (initial), with expansion to Spanish, French, German
- **Timezone Handling**: UTC storage with local display
- **Currency**: USD base with local currency display
- **Cultural Adaptation**: Region-specific skill categories

## Resource Limits

- **Database**: Supabase Pro Plan (initial)
- **Storage**: 100GB initial allocation
- **Bandwidth**: 250GB/month estimated
- **API Rate Limits**: 100 requests/minute per user
- **Concurrent Users**: Designed for 10,000+ concurrent users
- **Real-time Connections**: 500 concurrent real-time connections

## Disaster Recovery

- **RPO (Recovery Point Objective)**: 24 hours
- **RTO (Recovery Time Objective)**: 4 hours
- **Backup Schedule**: Daily automated backups
- **Backup Retention**: 30 days
- **Failover Strategy**: Manual failover to secondary region
- **Backup Testing**: Monthly restoration testing

## Compliance and Legal

- **Terms of Service**: Comprehensive user agreement
- **Privacy Policy**: GDPR and CCPA compliant
- **Data Processing**: Data processing agreement available
- **Age Restrictions**: 18+ for account creation
- **Acceptable Use**: Clear acceptable use policy
- **IP Rights**: User retains rights to their content

This environment document will be updated as the platform evolves and scales.
