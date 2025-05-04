/**
 * End-to-End tests for the messaging system
 */

describe('Messaging System', () => {
  // Test user data
  const user = {
    email: 'test@example.com',
    password: 'password123'
  };
  
  beforeEach(() => {
    // Login before each test
    cy.login(user.email, user.password);
  });

  it('should allow users to view conversation list', () => {
    // Visit the messaging page
    cy.visit('/messages');
    
    // Verify that the conversation list is visible
    cy.get('[data-testid="conversation-list"]').should('be.visible');
    
    // Verify that the empty conversation view is shown when no conversation is selected
    cy.get('[data-testid="empty-conversation-view"]').should('be.visible');
  });

  it('should handle the empty state when no conversations exist', () => {
    // This is a conditional test, it won't fail if conversations exist
    cy.visit('/messages');
    
    // Check if the empty state message exists
    cy.get('body').then($body => {
      if ($body.text().includes('No conversations yet')) {
        // If we have the empty state, verify it shows the right message
        cy.get('[data-testid="empty-conversations-message"]').should('be.visible');
        cy.get('[data-testid="empty-conversations-message"]').should('contain', 'No conversations yet');
        
        // Verify that there's a call-to-action to find skills
        cy.get('[data-testid="find-skills-button"]').should('be.visible');
        
        // Click on the CTA button
        cy.get('[data-testid="find-skills-button"]').click();
        
        // Verify redirection to search or discover page
        cy.url().should(url => {
          expect(url).to.match(/\/(search|discover)/);
        });
      }
    });
  });

  it('should allow users to select and view a conversation', () => {
    cy.visit('/messages');
    
    // Check if there are any existing conversations
    cy.get('body').then($body => {
      if (!$body.text().includes('No conversations yet')) {
        // Click on the first conversation in the list
        cy.get('[data-testid="conversation-list"]')
          .find('[data-testid="conversation-item"]')
          .first()
          .click();
        
        // Verify that the message list for that conversation is visible
        cy.get('[data-testid="message-list"]').should('be.visible');
        
        // Verify that the message composer is visible
        cy.get('[data-testid="message-composer"]').should('be.visible');
      } else {
        // If no conversations exist, we'll create one through a trade first
        // Visit search page to find a skill
        cy.visit('/search');
        cy.get('[data-testid="search-input"]').type('Design');
        cy.get('[data-testid="search-button"]').click();
        
        // Click on the first search result
        cy.get('[data-testid="search-results"]')
          .find('[data-testid="skill-card"]')
          .first()
          .click();
        
        // Click on the user's profile
        cy.get('[data-testid="skill-owner-name"]').click();
        
        // Verify profile page loaded
        cy.get('[data-testid="profile-header"]').should('be.visible');
        
        // Click on "Message" button
        cy.get('[data-testid="message-button"]').click();
        
        // Verify redirected to messages with conversation open
        cy.url().should('include', '/messages');
        cy.get('[data-testid="message-list"]').should('be.visible');
        cy.get('[data-testid="message-composer"]').should('be.visible');
      }
    });
  });

  it('should allow users to send new messages', () => {
    cy.visit('/messages');
    
    // Check if there are any existing conversations
    cy.get('body').then($body => {
      if (!$body.text().includes('No conversations yet')) {
        // Click on the first conversation
        cy.get('[data-testid="conversation-list"]')
          .find('[data-testid="conversation-item"]')
          .first()
          .click();
        
        // Type a test message
        const testMessage = `Test message ${Date.now()}`;
        cy.get('[data-testid="message-input"]').type(testMessage);
        
        // Send the message
        cy.get('[data-testid="send-message-button"]').click();
        
        // Verify that the message appears in the message list
        cy.get('[data-testid="message-list"]').should('contain', testMessage);
        
        // Verify that the message input is cleared after sending
        cy.get('[data-testid="message-input"]').should('have.value', '');
      }
    });
  });

  it('should handle message input validation', () => {
    cy.visit('/messages');
    
    // Check if there are any existing conversations
    cy.get('body').then($body => {
      if (!$body.text().includes('No conversations yet')) {
        // Click on the first conversation
        cy.get('[data-testid="conversation-list"]')
          .find('[data-testid="conversation-item"]')
          .first()
          .click();
        
        // Verify send button is disabled when input is empty
        cy.get('[data-testid="send-message-button"]').should('be.disabled');
        
        // Type a space (which should be considered empty after trim)
        cy.get('[data-testid="message-input"]').type(' ');
        cy.get('[data-testid="send-message-button"]').should('be.disabled');
        
        // Type a valid message
        cy.get('[data-testid="message-input"]').clear().type('Valid message');
        cy.get('[data-testid="send-message-button"]').should('be.enabled');
        
        // Test maximum message length (if there's a limit)
        const longMessage = 'A'.repeat(2000); // Assuming 2000+ chars would be too long
        cy.get('[data-testid="message-input"]').clear().type(longMessage);
        
        // If there's a message length limit, we should see an error
        cy.get('body').then($body => {
          if ($body.find('[data-testid="message-length-error"]').length > 0) {
            cy.get('[data-testid="message-length-error"]').should('be.visible');
            cy.get('[data-testid="send-message-button"]').should('be.disabled');
          }
        });
      }
    });
  });

  it('should allow starting a new conversation from the messages page', () => {
    cy.visit('/messages');
    
    // Click on the "New Message" or "Start Conversation" button
    cy.get('[data-testid="new-conversation-button"]').click();
    
    // Verify that a user search or selection interface appears
    cy.get('[data-testid="user-search"]').should('be.visible');
    
    // Search for a user
    cy.get('[data-testid="user-search-input"]').type('john');
    
    // Wait for search results
    cy.get('[data-testid="user-search-results"]').should('be.visible');
    
    // Click on the first user in search results
    cy.get('[data-testid="user-search-results"]')
      .find('[data-testid="user-result-item"]')
      .first()
      .click();
    
    // Verify that a new conversation is created and the message composer is shown
    cy.get('[data-testid="message-composer"]').should('be.visible');
    
    // Send an initial message
    const initialMessage = 'Hello, I would like to discuss potential skill trades.';
    cy.get('[data-testid="message-input"]').type(initialMessage);
    cy.get('[data-testid="send-message-button"]').click();
    
    // Verify the message was sent
    cy.get('[data-testid="message-list"]').should('contain', initialMessage);
  });

  it('should allow users to start a conversation from a trade', () => {
    // Visit trades page
    cy.visit('/trades');
    
    // Check if we have any active trades
    cy.get('body').then($body => {
      if (!$body.text().includes('No active trades')) {
        // Click on the first trade
        cy.get('[data-testid="trades-list"]')
          .find('[data-testid="trade-item"]')
          .first()
          .click();
        
        // Click on "Message" button inside trade details
        cy.get('[data-testid="message-trade-partner-button"]').click();
        
        // Verify redirected to messages with conversation open
        cy.url().should('include', '/messages');
        cy.get('[data-testid="message-list"]').should('be.visible');
        cy.get('[data-testid="message-composer"]').should('be.visible');
        
        // Send a trade-related message
        const tradeMessage = 'Hi, I wanted to discuss details about our trade.';
        cy.get('[data-testid="message-input"]').type(tradeMessage);
        cy.get('[data-testid="send-message-button"]').click();
        
        // Verify the message was sent
        cy.get('[data-testid="message-list"]').should('contain', tradeMessage);
      }
    });
  });

  it('should display unread indicators for new messages', () => {
    // This test is more complex and would typically require two user accounts
    // For E2E testing, we'll focus on the UI elements for unread states
    
    cy.visit('/messages');
    
    // Check for unread indicators in the conversation list
    cy.get('body').then($body => {
      if (!$body.text().includes('No conversations yet')) {
        // Check if any conversations have unread indicators
        const hasUnread = $body.find('[data-testid="unread-indicator"]').length > 0;
        
        if (hasUnread) {
          // Verify unread indicator is visible
          cy.get('[data-testid="unread-indicator"]').should('be.visible');
          
          // Click on a conversation with unread messages
          cy.get('[data-testid="conversation-item"]')
            .filter(':has([data-testid="unread-indicator"])')
            .first()
            .click();
          
          // Verify that the message list is visible
          cy.get('[data-testid="message-list"]').should('be.visible');
          
          // Unread indicator should disappear after viewing
          cy.get('[data-testid="conversation-item"].active')
            .should('not.have.descendants', '[data-testid="unread-indicator"]');
        }
      }
    });
  });

  it('should allow users to view message timestamps', () => {
    cy.visit('/messages');
    
    // Check if there are any existing conversations
    cy.get('body').then($body => {
      if (!$body.text().includes('No conversations yet')) {
        // Click on the first conversation
        cy.get('[data-testid="conversation-list"]')
          .find('[data-testid="conversation-item"]')
          .first()
          .click();
        
        // Verify messages have timestamps
        cy.get('[data-testid="message-list"]')
          .find('[data-testid="message-timestamp"]')
          .should('exist');
      }
    });
  });
});
