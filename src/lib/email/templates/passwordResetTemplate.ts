/**
 * Password Reset Email Template
 * 
 * Email sent to users when they request a password reset.
 */

import { PasswordResetTemplateData } from '../emailService';
import { baseTemplate } from './baseTemplate';

export const passwordResetTemplate = (data: PasswordResetTemplateData): string => {
  const { recipientName, resetLink } = data;
  
  // Create the base URL for the application
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skillswap.example.com';
  
  // Create the content for the email
  const content = `
    <h1>Reset Your Password</h1>
    
    <p>Hello ${recipientName},</p>
    
    <p>We received a request to reset your password for your SkillSwap account. If you didn't make this request, you can safely ignore this email.</p>
    
    <div class="skill-card">
      <h3>Password Reset Instructions</h3>
      <p>To reset your password, please follow these steps:</p>
      <ol>
        <li>Click the button below to go to the password reset page</li>
        <li>Create a new secure password (use a combination of letters, numbers, and special characters)</li>
        <li>Confirm your new password</li>
        <li>Submit the form to update your account</li>
      </ol>
    </div>
    
    <div class="text-center">
      <a href="${resetLink}" class="btn">Reset Password</a>
    </div>
    
    <div class="divider"></div>
    
    <p class="text-secondary">
      This password reset link will expire in 24 hours for security reasons. If the link has expired, you can request a new one from the login page.
    </p>
    
    <p class="text-secondary">
      If you did not request a password reset, please contact our support team immediately, as someone may be attempting to access your account.
    </p>
    
    <div class="divider"></div>
    
    <p>For security purposes, if you're unable to click the button above, copy and paste the following URL into your browser:</p>
    <p style="word-break: break-all; font-size: 12px; background-color: #f3f4f6; padding: 8px; border-radius: 4px;">${resetLink}</p>
    
    <p>Thank you for using SkillSwap!</p>
  `;
  
  // Return the complete email using the base template
  return baseTemplate(content);
};
