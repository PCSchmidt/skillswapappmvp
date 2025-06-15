/**
 * End-to-End tests for the trade flow
 */

describe('Trade Proposal Flow', () => {
  // Test user data
  const user = {
    email: 'test@example.com',
    password: 'password123'
  };
  
  // Test skill data
  const mySkill = {
    title: 'JavaScript Tutoring',
    description: 'Learn modern JavaScript with hands-on projects',
    category: 'Programming'
  };
  
  beforeEach(() => {
    // Login before each test
    cy.supabaseLogin(user.email, user.password);
    
    // Create a skill for testing if needed
    cy.visit('/dashboard');
    
    // Check if my test skill exists, if not create it
    cy.get('body').then($body => {
      if (!$body.text().includes(mySkill.title)) {
        cy.createSkill(mySkill);
      }
    });
  });

  it('should allow a user to propose a trade from search results', () => {
    // Visit the search page
    cy.visit('/search');
    
    // Search for a skill category
    cy.get('[data-testid="search-input"]').type('Design');
    cy.get('[data-testid="search-button"]').click();
    
    // Click on a search result
    cy.get('[data-testid="search-results"]')
      .find('[data-testid="skill-card"]')
      .first()
      .find('[data-testid="skill-title"]')
      .invoke('text')
      .as('targetSkillTitle');
    
    cy.get('[data-testid="search-results"]')
      .find('[data-testid="skill-card"]')
      .first()
      .click();
    
    // Verify skill details page loaded
    cy.get('[data-testid="skill-details"]').should('be.visible');
    
    // Click on propose trade button
    cy.get('[data-testid="propose-trade-button"]').click();
    
    // Verify trade proposal form is displayed
    cy.get('[data-testid="trade-proposal-form"]').should('be.visible');
    
    // Select my skill to offer
    cy.get('[data-testid="my-skill-select"]').click();
    cy.contains(mySkill.title).click();
    
    // Add notes to the proposal
    cy.get('[data-testid="trade-notes-input"]').type('I would love to trade skills with you! I can offer flexible hours for JavaScript tutoring.');
    
    // Submit the proposal
    cy.get('[data-testid="submit-proposal-button"]').click();
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
    cy.get('[data-testid="success-message"]').should('contain', 'Trade proposal sent successfully');
    
    // Verify redirection to trades page
    cy.url().should('include', '/trades');
    
    // Verify the new trade appears in the list
    cy.get('@targetSkillTitle').then(targetSkillTitle => {
      cy.get('[data-testid="trades-list"]').should('contain', targetSkillTitle);
    });
  });

  it('should allow a user to propose a trade from user profile', () => {
    // Visit a random user profile
    // For testing purposes, we'll go to discover page first
    cy.visit('/discover');
    
    // Click on a user profile
    cy.get('[data-testid="featured-users"]')
      .find('[data-testid="user-card"]')
      .first()
      .click();
    
    // Verify profile page loaded
    cy.get('[data-testid="profile-header"]').should('be.visible');
    
    // Find a skill on their profile
    cy.get('[data-testid="profile-skills"]')
      .find('[data-testid="skill-card"]')
      .first()
      .find('[data-testid="skill-title"]')
      .invoke('text')
      .as('targetSkillTitle');
    
    // Click on the trade button for that skill
    cy.get('[data-testid="profile-skills"]')
      .find('[data-testid="skill-card"]')
      .first()
      .find('[data-testid="trade-button"]')
      .click();
    
    // Verify trade proposal form is displayed
    cy.get('[data-testid="trade-proposal-form"]').should('be.visible');
    
    // Select my skill to offer
    cy.get('[data-testid="my-skill-select"]').click();
    cy.contains(mySkill.title).click();
    
    // Add notes to the proposal
    cy.get('[data-testid="trade-notes-input"]').type('I noticed your skill and think we could help each other out!');
    
    // Submit the proposal
    cy.get('[data-testid="submit-proposal-button"]').click();
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
    cy.get('[data-testid="success-message"]').should('contain', 'Trade proposal sent successfully');
  });

  it('should handle validation in the trade proposal form', () => {
    // Find a skill to trade with
    cy.visit('/search');
    cy.get('[data-testid="search-input"]').type('Cooking');
    cy.get('[data-testid="search-button"]').click();
    
    // Click on first result
    cy.get('[data-testid="search-results"]')
      .find('[data-testid="skill-card"]')
      .first()
      .click();
    
    // Click on propose trade button
    cy.get('[data-testid="propose-trade-button"]').click();
    
    // Try to submit without selecting a skill to offer
    cy.get('[data-testid="submit-proposal-button"]').click();
    
    // Verify validation error
    cy.get('[data-testid="my-skill-error"]').should('be.visible');
    cy.get('[data-testid="my-skill-error"]').should('contain', 'Please select a skill to offer');
    
    // Select a skill but try to offer the same skill
    // This assumes the skill we're viewing is also one of our skills
    cy.get('@targetSkillTitle').then(targetSkillTitle => {
      // If we're viewing our own skill, we should see a message
      cy.get('body').then($body => {
        if ($body.text().includes('You cannot propose a trade for your own skill')) {
          // Test passes as the validation is in place
          return;
        }
        
        // Select our skill
        cy.get('[data-testid="my-skill-select"]').click();
        cy.contains(targetSkillTitle).click();
        
        // Submit the proposal
        cy.get('[data-testid="submit-proposal-button"]').click();
        
        // Verify error message about trading same skill
        cy.get('[data-testid="error-message"]').should('be.visible');
        cy.get('[data-testid="error-message"]').should('contain', 'cannot trade the same skill');
      });
    });
  });

  it('should allow users to manage their trade proposals', () => {
    // Visit trades page
    cy.visit('/trades');
    
    // Verify the trades list is visible
    cy.get('[data-testid="trades-list"]').should('be.visible');
    
    // Check if we have any active trades
    cy.get('body').then($body => {
      if ($body.text().includes('No active trades')) {
        // Create a trade proposal first
        cy.visit('/search');
        cy.get('[data-testid="search-input"]').type('Music');
        cy.get('[data-testid="search-button"]').click();
        cy.get('[data-testid="search-results"]')
          .find('[data-testid="skill-card"]')
          .first()
          .click();
        cy.get('[data-testid="propose-trade-button"]').click();
        cy.get('[data-testid="my-skill-select"]').click();
        cy.contains(mySkill.title).click();
        cy.get('[data-testid="trade-notes-input"]').type('Test trade proposal');
        cy.get('[data-testid="submit-proposal-button"]').click();
        
        // Go back to trades page
        cy.visit('/trades');
      }
    });
    
    // Click on a sent trade proposal
    cy.get('[data-testid="sent-trades-tab"]').click();
    cy.get('[data-testid="trades-list"]')
      .find('[data-testid="trade-item"]')
      .first()
      .click();
    
    // Verify trade details page loaded
    cy.get('[data-testid="trade-details"]').should('be.visible');
    
    // Check if the cancel button is available and click it
    cy.get('body').then($body => {
      if ($body.find('[data-testid="cancel-trade-button"]').length > 0) {
        cy.get('[data-testid="cancel-trade-button"]').click();
        
        // Confirm cancellation
        cy.get('[data-testid="confirm-cancel-button"]').click();
        
        // Verify success message
        cy.get('[data-testid="success-message"]').should('be.visible');
        cy.get('[data-testid="success-message"]').should('contain', 'cancelled');
      }
    });
  });

  it('should allow users to accept or decline received trades', () => {
    // Visit trades page - received tab
    cy.visit('/trades');
    cy.get('[data-testid="received-trades-tab"]').click();
    
    // Check if there are any received trades
    cy.get('body').then($body => {
      if (!$body.text().includes('No received trade proposals')) {
        // Click on the first received trade
        cy.get('[data-testid="trades-list"]')
          .find('[data-testid="trade-item"]')
          .first()
          .click();
        
        // Verify trade details page loaded
        cy.get('[data-testid="trade-details"]').should('be.visible');
        
        // If there are accept/decline buttons, test them
        cy.get('body').then($body => {
          if ($body.find('[data-testid="accept-trade-button"]').length > 0) {
            // Test accepting a trade
            cy.get('[data-testid="accept-trade-button"]').click();
            
            // Confirm acceptance
            cy.get('[data-testid="confirm-accept-button"]').click();
            
            // Verify success message
            cy.get('[data-testid="success-message"]').should('be.visible');
            cy.get('[data-testid="success-message"]').should('contain', 'accepted');
            
            // Verify trade status changed
            cy.get('[data-testid="trade-status"]').should('contain', 'Accepted');
          } else if ($body.find('[data-testid="decline-trade-button"]').length > 0) {
            // Test declining a trade
            cy.get('[data-testid="decline-trade-button"]').click();
            
            // Add reason for declining
            cy.get('[data-testid="decline-reason-input"]').type('Not available during the requested time frame');
            
            // Confirm decline
            cy.get('[data-testid="confirm-decline-button"]').click();
            
            // Verify success message
            cy.get('[data-testid="success-message"]').should('be.visible');
            cy.get('[data-testid="success-message"]').should('contain', 'declined');
            
            // Verify trade status changed
            cy.get('[data-testid="trade-status"]').should('contain', 'Declined');
          }
        });
      }
    });
  });
});
