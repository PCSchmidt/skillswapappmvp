/**
 * Email Templates Index
 * 
 * Exports all email templates for easy importing throughout the application.
 */

// Export base template
export { baseTemplate } from './baseTemplate';

// Export specific notification templates
export { tradeProposalTemplate } from './tradeProposalTemplate';
export { newMessageTemplate } from './newMessageTemplate';
export { newRatingTemplate } from './newRatingTemplate';
export { welcomeTemplate } from './welcomeTemplate';
export { passwordResetTemplate } from './passwordResetTemplate';
export { tradeStatusAcceptedTemplate } from './tradeStatusAcceptedTemplate';
export { tradeStatusDeclinedTemplate } from './tradeStatusDeclinedTemplate';
export { tradeStatusCancelledTemplate } from './tradeStatusCancelledTemplate';
export { tradeStatusCompletedTemplate } from './tradeStatusCompletedTemplate';
export { verificationTemplate } from './verificationTemplate';

// Export types
export type { EmailTemplateType, EmailTemplateData } from '@/types/email';

// Template mapping function to get the right template based on notification type
import { EmailTemplateType, EmailTemplateData } from '@/types/email';
import { newMessageTemplate } from './newMessageTemplate';
import { newRatingTemplate } from './newRatingTemplate';
import { passwordResetTemplate } from './passwordResetTemplate';
import { tradeProposalTemplate } from './tradeProposalTemplate';
import { tradeStatusAcceptedTemplate } from './tradeStatusAcceptedTemplate';
import { tradeStatusCancelledTemplate } from './tradeStatusCancelledTemplate';
import { tradeStatusCompletedTemplate } from './tradeStatusCompletedTemplate';
import { tradeStatusDeclinedTemplate } from './tradeStatusDeclinedTemplate';
import { verificationTemplate } from './verificationTemplate';
import { welcomeTemplate } from './welcomeTemplate';

/**
 * Get the appropriate email template function based on notification type
 */
export const getTemplateForType = (type: EmailTemplateType): ((data: any) => string) => {
  switch (type) {
    case 'trade_proposal':
      return tradeProposalTemplate;
    case 'trade_status_accepted':
      return tradeStatusAcceptedTemplate;
    case 'trade_status_declined':
      return tradeStatusDeclinedTemplate;
    case 'trade_status_cancelled':
      return tradeStatusCancelledTemplate;
    case 'trade_status_completed':
      return tradeStatusCompletedTemplate;
    case 'new_message':
      return newMessageTemplate;
    case 'new_rating':
      return newRatingTemplate;
    case 'welcome':
      return welcomeTemplate;
    case 'password_reset':
      return passwordResetTemplate;
    case 'verification':
      return verificationTemplate;
    default:
      // Default to the trade proposal template for now
      return tradeProposalTemplate;
  }
};
