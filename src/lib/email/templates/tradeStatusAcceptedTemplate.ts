/**
 * Trade Status Accepted Email Template
 * 
 * Email sent to users when their trade proposal has been accepted.
 */

import { TradeTemplateData } from '@/types/email';
import { baseTemplate } from './baseTemplate';

export const tradeStatusAcceptedTemplate = (data: TradeTemplateData): string => {
  const { recipientName, traderName, skillName, tradeId, tradeDate } = data;
  
  // Create the base URL for the application
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skillswap.example.com';
  const tradeUrl = `${appUrl}/trades/${tradeId}`;
  
  // Create the content for the email
  const content = `
    <h1>Trade Proposal Accepted!</h1>
    
    <p>Hello ${recipientName},</p>
    
    <p>Great news! <strong>${traderName}</strong> has accepted your proposal for the skill exchange:</p>
    
    <div class="skill-card">
      <h3>${skillName}</h3>
      <p><strong>Trade ID:</strong> ${tradeId}</p>
      ${tradeDate ? `<p><strong>Proposed Date:</strong> ${tradeDate}</p>` : ''}
      <p><strong>Status:</strong> <span class="text-primary">Accepted</span></p>
    </div>
    
    <p>The next step is to coordinate the details of your skill exchange. You can use the in-app messaging system to communicate about scheduling, location, and any preparation needed.</p>
    
    <div class="text-center">
      <a href="${tradeUrl}" class="btn">View Trade Details</a>
    </div>
    
    <div class="divider"></div>
    
    <h3>What happens next?</h3>
    <ol>
      <li>Use the messaging system to finalize details with ${traderName}</li>
      <li>Meet at the agreed time and location to exchange skills</li>
      <li>Mark the trade as completed when finished</li>
      <li>Leave a review about your experience</li>
    </ol>
    
    <p>Remember that maintaining good communication is key to a successful skill exchange. If you need to modify any details, you can do so from the trade details page.</p>
    
    <div class="divider"></div>
    
    <p class="text-secondary">
      You received this email because you have email notifications enabled for trade status updates.
      You can manage your email preferences in your <a href="${appUrl}/settings/notifications" style="color: #7c3aed;">notification settings</a>.
    </p>
  `;
  
  // Return the complete email using the base template
  return baseTemplate(content);
};
