/**
 * New Rating Email Template
 * 
 * Email sent when a user receives a new rating for a completed trade.
 */

import { baseTemplate } from './baseTemplate';
import { RatingTemplateData } from '../emailService';

export const newRatingTemplate = (data: RatingTemplateData): string => {
  const { recipientName, raterName, tradeId, rating, skillName } = data;
  
  // Create the base URL for the application
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skillswap.example.com';
  
  // Create a link to the user's profile
  const profileUrl = `${appUrl}/profile`;
  
  // Generate star rating display
  const starRating = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  
  // Create the content for the email
  const content = `
    <h1>New Rating Received</h1>
    
    <p>Hello ${recipientName},</p>
    
    <p><strong>${raterName}</strong> has rated their experience trading skills with you.</p>
    
    <div class="skill-card">
      <h3>${skillName}</h3>
      <p class="rating">${starRating}</p>
      <p>Rating: ${rating}/5</p>
    </div>
    
    <p>Great ratings build your reputation in the SkillSwap community and help you find more trading opportunities!</p>
    
    <div class="text-center">
      <a href="${profileUrl}" class="btn">View Your Profile</a>
    </div>
    
    <div class="divider"></div>
    
    <p class="text-secondary">
      Your average rating is calculated based on all ratings you've received. Continue providing great value in your skill trades to maintain a high rating!
    </p>
  `;
  
  // Return the complete email using the base template
  return baseTemplate(content);
};
