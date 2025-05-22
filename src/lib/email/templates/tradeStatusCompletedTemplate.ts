/**
 * Trade Status Completed Email Template
 * 
 * Email sent to users when a trade has been marked as completed.
 */

import { TradeTemplateData } from '../emailService';
import { baseTemplate } from './baseTemplate';

export const tradeStatusCompletedTemplate = (data: TradeTemplateData): string => {
  const { recipientName, traderName, skillName, tradeId, tradeDate } = data;
  
  // Create the base URL for the application
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skillswap.example.com';
  const tradeUrl = `${appUrl}/trades/${tradeId}`;
  const reviewUrl = `${appUrl}/trades/${tradeId}/review`;
  
  // Create the content for the email
  const content = `
    <h1>Skill Exchange Completed!</h1>
    
    <p>Hello ${recipientName},</p>
    
    <p>Congratulations! Your skill exchange with <strong>${traderName}</strong> has been successfully completed:</p>
    
    <div class="skill-card">
      <h3>${skillName}</h3>
      <p><strong>Trade ID:</strong> ${tradeId}</p>
      ${tradeDate ? `<p><strong>Exchange Date:</strong> ${tradeDate}</p>` : ''}
      <p><strong>Status:</strong> <span style="color: #10b981;">Completed</span></p>
    </div>
    
    <p>We hope that this skill exchange was valuable for both of you! Learning new skills and connecting with others in the community is what SkillSwap is all about.</p>
    
    <div class="text-center">
      <a href="${reviewUrl}" class="btn">Leave a Review</a>
    </div>
    
    <div class="divider"></div>
    
    <h3>What's next?</h3>
    <ul>
      <li><strong>Share your experience</strong> - Leave a review for ${traderName} to help others in the community</li>
      <li><strong>Apply what you've learned</strong> - Put your new skills into practice</li>
      <li><strong>Keep learning</strong> - Browse more skills and connect with other members</li>
      <li><strong>Share your knowledge</strong> - Consider offering additional skills that you're proficient in</li>
    </ul>
    
    <p>Reviews are an important part of building trust in our community. Your honest feedback helps other members make informed decisions about potential skill exchanges.</p>
    
    <div class="text-center">
      <a href="${tradeUrl}" class="btn-secondary">View Trade Details</a>
    </div>
    
    <div class="divider"></div>
    
    <p class="text-secondary">
      You received this email because you have email notifications enabled for trade status updates.
      You can manage your email preferences in your <a href="${appUrl}/settings/notifications" style="color: #7c3aed;">notification settings</a>.
    </p>
  `;
  
  // Return the complete email using the base template
  return baseTemplate(content);
};
