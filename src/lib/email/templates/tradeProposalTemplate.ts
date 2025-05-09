/**
 * Trade Proposal Email Template
 * 
 * Email sent when a user receives a new trade proposal.
 */

import { TradeTemplateData } from '../emailService';
import { baseTemplate } from './baseTemplate';

export const tradeProposalTemplate = (data: TradeTemplateData): string => {
  const { recipientName, traderName, skillName, tradeId } = data;
  
  // Create the base URL for the application
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skillswap.example.com';
  
  // Create a link to the trade details
  const tradeUrl = `${appUrl}/trades/${tradeId}`;
  
  // Create the content for the email
  const content = `
    <h1>New Skill Trade Proposal</h1>
    
    <p>Hello ${recipientName},</p>
    
    <p><strong>${traderName}</strong> has proposed a skill trade with you!</p>
    
    <div class="skill-card">
      <h3>${skillName}</h3>
      <p>They're interested in trading skills with you. Click below to view the details and respond to the proposal.</p>
    </div>
    
    <div class="text-center">
      <a href="${tradeUrl}" class="btn">View Trade Proposal</a>
    </div>
    
    <div class="divider"></div>
    
    <p class="text-secondary">
      This trade proposal will expire in 7 days if no action is taken. If you're not interested, please decline the proposal so the other user knows to look elsewhere.
    </p>
  `;
  
  // Return the complete email using the base template
  return baseTemplate(content);
};
