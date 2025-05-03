/**
 * Email Templates Tests
 * 
 * Tests for email template rendering to ensure they generate correct HTML
 */

import { baseTemplate } from '@/lib/email/templates/baseTemplate';
import { newMessageTemplate } from '@/lib/email/templates/newMessageTemplate';
import { newRatingTemplate } from '@/lib/email/templates/newRatingTemplate';
import { tradeProposalTemplate } from '@/lib/email/templates/tradeProposalTemplate';

describe('Email Templates', () => {
  describe('baseTemplate', () => {
    it('should include provided content', () => {
      const testContent = '<p>Test content</p>';
      const result = baseTemplate(testContent);
      
      // Check that the template includes the provided content
      expect(result).toContain(testContent);
      
      // Check that the template includes essential structure
      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<html lang="en">');
      expect(result).toContain('<meta charset="UTF-8">');
      expect(result).toContain('SkillSwap');
    });
    
    it('should include current year in footer copyright', () => {
      const currentYear = new Date().getFullYear().toString();
      const result = baseTemplate('Content');
      
      expect(result).toContain(`&copy; ${currentYear} SkillSwap`);
    });
  });
  
  describe('tradeProposalTemplate', () => {
    it('should include trade and recipient details', () => {
      const templateData = {
        recipientName: 'John Doe',
        recipientEmail: 'john@example.com',
        traderId: 'user-123',
        traderName: 'Jane Smith',
        skillName: 'Guitar Lessons',
        tradeId: 'trade-456'
      };
      
      const result = tradeProposalTemplate(templateData);
      
      // Check that template includes all important data
      expect(result).toContain('John Doe');
      expect(result).toContain('Jane Smith');
      expect(result).toContain('Guitar Lessons');
      expect(result).toContain('trade-456');
      expect(result).toContain('New Skill Trade Proposal');
      
      // Check for call to action button
      expect(result).toContain('View Trade Proposal');
      
      // Check for expiration warning
      expect(result).toContain('will expire in 7 days');
    });
  });
  
  describe('newMessageTemplate', () => {
    it('should include message and sender details', () => {
      const templateData = {
        recipientName: 'John Doe',
        recipientEmail: 'john@example.com',
        senderId: 'user-123',
        senderName: 'Jane Smith',
        tradeId: 'trade-456',
        messagePreview: 'Hi there, I wanted to discuss our upcoming skill trade.'
      };
      
      const result = newMessageTemplate(templateData);
      
      // Check that template includes all important data
      expect(result).toContain('John Doe');
      expect(result).toContain('Jane Smith');
      expect(result).toContain('New Message Received');
      expect(result).toContain('Hi there, I wanted to discuss our upcoming skill trade.');
      
      // Check for call to action button
      expect(result).toContain('View Conversation');
    });
  });
  
  describe('newRatingTemplate', () => {
    it('should include rating and skill details', () => {
      const templateData = {
        recipientName: 'John Doe',
        recipientEmail: 'john@example.com',
        raterId: 'user-123',
        raterName: 'Jane Smith',
        tradeId: 'trade-456',
        skillName: 'Web Development',
        rating: 4
      };
      
      const result = newRatingTemplate(templateData);
      
      // Check that template includes all important data
      expect(result).toContain('John Doe');
      expect(result).toContain('Jane Smith');
      expect(result).toContain('New Rating Received');
      expect(result).toContain('Web Development');
      
      // Check for rating display (4 out of 5 stars)
      expect(result).toContain('★★★★☆');
      expect(result).toContain('Rating: 4/5');
      
      // Check for call to action button
      expect(result).toContain('View Your Profile');
    });
    
    it('should handle different rating values correctly', () => {
      const templateData = {
        recipientName: 'John Doe',
        recipientEmail: 'john@example.com',
        raterId: 'user-123',
        raterName: 'Jane Smith',
        tradeId: 'trade-456',
        skillName: 'Web Development',
        rating: 5 // Full 5-star rating
      };
      
      const result = newRatingTemplate(templateData);
      
      // Check that 5 stars are displayed for a 5-star rating
      expect(result).toContain('★★★★★');
      expect(result).not.toContain('☆'); // No empty stars
      expect(result).toContain('Rating: 5/5');
    });
  });
});
