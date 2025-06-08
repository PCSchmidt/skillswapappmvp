# SkillSwap Email Notification System

This document provides an overview of the email notification system implemented for SkillSwap.

## System Architecture

The email notification system consists of the following components:

1. **Email Service**: A TypeScript service that handles sending emails through Supabase Edge Functions
2. **Email Templates**: HTML templates for different notification types
3. **Supabase Edge Function**: A serverless function that sends emails using Resend API
4. **Email Preferences**: User settings for controlling which emails they receive
5. **Notification Integration**: Integration with the existing notification system

![Email System Architecture](https://i.imgur.com/vXt9jCV.png)

## Configuration

### Environment Variables

The following environment variables are used:

- `RESEND_API_KEY`: API key for Resend email service
- `NEXT_PUBLIC_SENDER_EMAIL`: Email address used as sender (default: notifications@skillswap.example.com)
- `NEXT_PUBLIC_SITE_URL`: Base URL of the application (used for links in emails)

These are defined in the `.env.example` file and should be set in your local `.env.local` file and on the Supabase project.

## Components

### Email Service (`src/lib/email/emailService.ts`)

This service provides:

- Type definitions for email templates
- Methods to send emails through Supabase Edge Functions
- User preference checking before sending emails

Usage example:

```typescript
import { emailService } from '@/lib/email/emailService';

// Send an email directly
await emailService.sendEmail('trade_proposal', {
  recipientName: 'Jane Doe',
  recipientEmail: 'jane@example.com',
  // Template-specific data
  traderId: 'user-123',
  traderName: 'John Smith',
  skillName: 'Web Development',
  tradeId: 'trade-456'
});

// Send a notification email (checks user preferences)
await emailService.sendNotificationEmail(
  'user-123',
  'trade_proposal',
  {
    traderId: 'user-456',
    traderName: 'John Smith',
    skillName: 'Web Development',
    tradeId: 'trade-789'
  }
);
```

### Email Templates (`src/lib/email/templates/`)

We've implemented the following email templates:

- `baseTemplate.ts`: Common HTML structure and styles for all emails
- `tradeProposalTemplate.ts`: For new trade proposals 
- `newMessageTemplate.ts`: For new messages
- `newRatingTemplate.ts`: For new ratings
- `tradeStatusAcceptedTemplate.ts`: For accepted trade proposals
- `tradeStatusDeclinedTemplate.ts`: For declined trade proposals
- `tradeStatusCancelledTemplate.ts`: For cancelled trades (newly implemented)
- `tradeStatusCompletedTemplate.ts`: For completed trades (newly implemented)

All templates are responsive and follow best practices for email design.

### Supabase Edge Function (`supabase/functions/send-email/`)

A serverless function that:

1. Receives requests containing template type and data
2. Dynamically imports the appropriate template
3. Renders the HTML content
4. Sends the email using Resend API

To deploy the function:

```bash
# Use the provided bat script
./supabase/functions/deploy-email-function.bat

# Or manually
supabase secrets set RESEND_API_KEY=your-resend-api-key
supabase functions deploy send-email
```

### Email Preferences

#### Database Schema (`supabase/migrations/20250503_create_email_preferences_table.sql`)

The `email_preferences` table stores user preferences with columns for each notification type:

- `notify_trade_proposal`: For trade proposal emails
- `notify_trade_status_accepted`: For accepted trade emails
- `notify_trade_status_declined`: For declined trade emails
- `notify_new_message`: For new message emails
- `notify_new_rating`: For new rating emails
- `daily_digest`: For daily summary emails
- `weekly_digest`: For weekly summary emails

The schema includes Row Level Security policies to ensure users can only access their own preferences.

#### User Interface (`src/components/settings/EmailPreferences.tsx`)

A React component that allows users to control their email notification settings through toggles. It handles:

- Loading user preferences
- Updating preferences in real-time
- Saving changes to the database
- Displaying success/error messages

The preferences page is available at `/settings/email-preferences`.

### Notification Integration (`src/lib/notifications/notificationService.ts`)

The existing notification service is enhanced to:

- Send both in-app and email notifications
- Check user preferences before sending emails
- Provide a consistent interface for all notifications

Usage example:

```typescript
import { notificationService } from '@/lib/notifications/notificationService';

await notificationService.sendNotification({
  userId: 'user-123',
  type: 'trade_proposal',
  title: 'New Trade Proposal',
  content: 'John Smith has proposed a trade with you.',
  link: '/trades/trade-456',
  sendEmail: true,  // Set to false to skip email
  emailData: {
    traderId: 'user-789',
    traderName: 'John Smith',
    skillName: 'Web Development',
    tradeId: 'trade-456'
  }
});
```

## Testing the Email System

To test the email notification system:

1. Set up the Resend API key in your `.env.local` file
2. Deploy the Supabase Edge Function
3. Add a test call in a development environment:

```typescript
// Example test call
await notificationService.sendNotification({
  userId: 'YOUR_USER_ID',  // User must exist in your database
  type: 'trade_proposal', 
  title: 'Test Notification',
  content: 'This is a test notification with email',
  link: '/test',
  sendEmail: true,
  emailData: {
    traderId: 'test-user',
    traderName: 'Test User',
    skillName: 'Test Skill',
    tradeId: 'test-trade'
  }
});
```

## Future Enhancements

Potential future improvements to the email system:

1. **Additional Templates**: More specialized templates for other notification types
2. **Digest Emails**: Implement the daily/weekly digest email functionality
3. **Analytics**: Track email open and click rates
4. **A/B Testing**: Test different email templates for effectiveness
5. **Internationalization**: Support for multiple languages
