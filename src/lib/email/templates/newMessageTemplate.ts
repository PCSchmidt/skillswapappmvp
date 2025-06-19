/**
 * New Message Email Template
 * 
 * Email sent when a user receives a new message in a trade conversation.
 */

import { MessageTemplateData } from '@/types/email';
import { baseTemplate } from './baseTemplate';

export const newMessageTemplate = (data: MessageTemplateData): string => {
  const { recipientName, senderName, tradeId, messagePreview } = data;
  
  // Create the base URL for the application
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skillswap.example.com';
  
  // Create a link to the messages for this trade
  const messagesUrl = `${appUrl}/messages/${tradeId}`;
  
  // Create the content for the email
  const content = `
    <h1>New Message Received</h1>
    
    <p>Hello ${recipientName},</p>
    
    <p>You've received a new message from <strong>${senderName}</strong> about your skill trade.</p>
    
    <div class="skill-card">
      <p><em>"${messagePreview}"</em></p>
    </div>
    
    <div class="text-center">
      <a href="${messagesUrl}" class="btn">View Conversation</a>
    </div>
    
    <div class="divider"></div>
    
    <p class="text-secondary">
      Quick communication helps build trust in the SkillSwap community. Respond promptly to keep your trades moving forward.
    </p>
  `;
  
  // Return the complete email using the base template
  return baseTemplate(content);
};
