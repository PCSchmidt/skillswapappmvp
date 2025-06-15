/**
 * Welcome Email Template
 * 
 * Email sent to new users when they sign up for SkillSwap.
 */

import { WelcomeTemplateData } from '../emailService';
import { baseTemplate } from './baseTemplate';

export const welcomeTemplate = (data: WelcomeTemplateData): string => {
  const { recipientName, verificationLink } = data;
  
  // Create the base URL for the application
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skillswap.example.com';
  
  // Create content based on whether there's a verification link
  const verificationSection = verificationLink ? `
    <div class="text-center">
      <p>Please verify your email address to access all features:</p>
      <a href="${verificationLink}" class="btn">Verify Email</a>
    </div>
    
    <div class="divider"></div>
  ` : '';
  
  // Create the content for the email
  const content = `
    <h1>Welcome to SkillSwap!</h1>
    
    <p>Hello ${recipientName},</p>
    
    <p>Thank you for joining SkillSwap, the platform where skills meet opportunity. We're excited to have you on board!</p>
    
    <div class="skill-card">
      <h3>Getting Started</h3>
      <p>Here are a few things you can do right away:</p>
      <ul>
        <li>Complete your profile to showcase your expertise</li>
        <li>Add skills that you want to offer or learn</li>
        <li>Browse for potential skill swap partners</li>
        <li>Set your notification preferences</li>
      </ul>
    </div>
    
    ${verificationSection}
    
    <div class="text-center">
      <a href="${appUrl}/dashboard" class="btn">Go to Dashboard</a>
    </div>
    
    <div class="divider"></div>
    
    <p>SkillSwap works best when you:</p>
    <ul>
      <li>Add detailed descriptions of your skills</li>
      <li>Respond promptly to trade proposals</li>
      <li>Leave ratings and reviews after successful exchanges</li>
      <li>Keep your availability information up to date</li>
    </ul>
    
    <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
    
    <p class="text-secondary">
      We're thrilled to have you as part of our community and can't wait to see the valuable skills you'll exchange!
    </p>
  `;
  
  // Return the complete email using the base template
  return baseTemplate(content);
};
