/**
 * Trade Status Cancelled Email Template
 * 
 * Email sent to users when a trade has been cancelled.
 */

import { TradeTemplateData } from '@/types/email';
import { baseTemplate } from './baseTemplate';

export const tradeStatusCancelledTemplate = (data: TradeTemplateData): string => {
  const { recipientName, traderName, skillName, tradeId } = data;
  
  // Create the base URL for the application
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skillswap.example.com';
  const matchesUrl = `${appUrl}/matches`;
  
  // Create the content for the email
  const content = `
    <h1>Trade Cancelled</h1>
    
    <p>Hello ${recipientName},</p>
    
    <p>We're writing to inform you that the skill exchange with <strong>${traderName}</strong> has been cancelled:</p>
    
    <div class="skill-card">
      <h3>${skillName}</h3>
      <p><strong>Trade ID:</strong> ${tradeId}</p>
      <p><strong>Status:</strong> <span style="color: #6b7280;">Cancelled</span></p>
    </div>
    
    <p>There could be many reasons why a trade gets cancelled, from scheduling conflicts to changing priorities. Don't worry - this is a normal part of the skill exchange process.</p>
    
    <div class="text-center">
      <a href="${matchesUrl}" class="btn">Find New Matches</a>
    </div>
    
    <div class="divider"></div>
    
    <h3>Next steps you can take:</h3>
    <ul>
      <li>Reach out to other potential skill exchange partners</li>
      <li>Review your skill offerings to ensure they're clear and appealing</li>
      <li>Consider adjusting your availability if scheduling was an issue</li>
      <li>Browse new skills that have been added to the platform</li>
    </ul>
    
    <p>Remember that SkillSwap is all about making connections that work for both parties. Sometimes it takes a few attempts to find the right match!</p>
    
    <div class="divider"></div>
    
    <p class="text-secondary">
      You received this email because you have email notifications enabled for trade status updates.
      You can manage your email preferences in your <a href="${appUrl}/settings/notifications" style="color: #7c3aed;">notification settings</a>.
    </p>
  `;
  
  // Return the complete email using the base template
  return baseTemplate(content);
};
