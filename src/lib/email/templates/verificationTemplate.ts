/**
 * Email Verification Template
 * 
 * Email sent to users when they need to verify their email address.
 */

import { WelcomeTemplateData } from '../emailService';
import { baseTemplate } from './baseTemplate';

export const verificationTemplate = (data: WelcomeTemplateData): string => {
  const { recipientName, verificationLink } = data;
  
  if (!verificationLink) {
    throw new Error('Verification link is required for verification emails');
  }
  
  // Create the base URL for the application
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skillswap.example.com';
  
  // Create the content for the email
  const content = `
    <h1>Verify Your Email Address</h1>
    
    <p>Hello ${recipientName},</p>
    
    <p>Thank you for creating a SkillSwap account. To ensure the security of your account and gain full access to the platform, please verify your email address by clicking the button below:</p>
    
    <div class="text-center">
      <a href="${verificationLink}" class="btn">Verify Email</a>
    </div>
    
    <div class="divider"></div>
    
    <p class="text-secondary">
      This verification link will expire in 24 hours. If the link has expired, you can request a new one from the 
      <a href="${appUrl}/auth/resend-verification" style="color: #7c3aed;">resend verification page</a>.
    </p>
    
    <div class="skill-card">
      <h3>Why verify your email?</h3>
      <ul>
        <li>Protect your account from unauthorized access</li>
        <li>Receive important updates about your skill exchanges</li>
        <li>Get notified about new matches and opportunities</li>
        <li>Recover your account if you forget your password</li>
      </ul>
    </div>
    
    <div class="divider"></div>
    
    <p>If you're unable to click the button above, copy and paste the following URL into your browser:</p>
    <p style="word-break: break-all; font-size: 12px; background-color: #f3f4f6; padding: 8px; border-radius: 4px;">${verificationLink}</p>
    
    <p class="text-secondary">
      If you did not create this account, please ignore this email or contact our support team if you have concerns.
    </p>
  `;
  
  // Return the complete email using the base template
  return baseTemplate(content);
};
