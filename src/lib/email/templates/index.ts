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

// Export types
export { EmailTemplateType, EmailTemplateData } from '../emailService';

// Template mapping function to get the right template based on notification type
import { EmailTemplateType, EmailTemplateData } from '../emailService';
import { tradeProposalTemplate } from './tradeProposalTemplate';
import { newMessageTemplate } from './newMessageTemplate';
import { newRatingTemplate } from './newRatingTemplate';

/**
 * Get the appropriate email template function based on notification type
 */
export const getTemplateForType = (type: EmailTemplateType): ((data: any) => string) => {
  switch (type) {
    case 'trade_proposal':
      return tradeProposalTemplate;
    case 'trade_status_accepted':
    case 'trade_status_declined':
    case 'trade_status_cancelled':
    case 'trade_status_completed':
      // Could create specific templates for these later
      return tradeProposalTemplate;
    case 'new_message':
      return newMessageTemplate;
    case 'new_rating':
      return newRatingTemplate;
    default:
      // Default to the trade proposal template for now
      return tradeProposalTemplate;
  }
};
