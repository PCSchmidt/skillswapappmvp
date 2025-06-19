/**
 * Trade Status Declined Email Template
 * 
 * Email sent to users when their trade proposal has been declined.
 */

import { TradeTemplateData } from '@/types/email';
import { baseTemplate } from './baseTemplate';

export const tradeStatusDeclinedTemplate = (data: TradeTemplateData): string => {
  const { recipientName, traderName, skillName, tradeId } = data;
  
  // Create the base URL for the application
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skillswap.example.com';
  const matchesUrl = `${appUrl}/matches`;
  
  // Create the content for the email
  const content = `
    <h1>Trade Proposal Response</h1>
    
    <p>Hello ${recipientName},</p>
    
    <p>We're writing to let you know that <strong>${traderName}</strong> has declined your proposal for the skill exchange:</p>
    
    <div class="skill-card">
      <h3>${skillName}</h3>
      <p><strong>Trade ID:</strong> ${tradeId}</p>
      <p><strong>Status:</strong> <span style="color: #ef4444;">Declined</span></p>
    </div>
    
    <p>Don't worry! There are many other potential skill exchange partners on SkillSwap. We encourage you to explore more matches and continue finding the right partner for your skill exchange.</p>
    
    <div class="text-center">
      <a href="${matchesUrl}" class="btn">Find New Matches</a>
    </div>
    
    <div class="divider"></div>
    
    <h3>Here are some tips for successful skill exchange proposals:</h3>
    <ul>
      <li>Provide clear information about your expertise and what you're looking to learn</li>
      <li>Be specific about the time commitment and scheduling options</li>
      <li>Highlight any relevant experience or qualifications</li>
      <li>Personalize your message to show why you're interested in their specific skill</li>
    </ul>
    
    <p>Remember that finding the right match is a process, and it may take a few attempts to find someone with compatible skills, schedule, and interests.</p>
    
    <div class="divider"></div>
    
    <p class="text-secondary">
      You received this email because you have email notifications enabled for trade status updates.
      You can manage your email preferences in your <a href="${appUrl}/settings/notifications" style="color: #7c3aed;">notification settings</a>.
    </p>
  `;
  
  // Return the complete email using the base template
  return baseTemplate(content);
};
