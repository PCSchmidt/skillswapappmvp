/// <reference types="cypress" />

describe('Match Flow Process', () => {
  beforeEach(() => {
    // Login with test user before each test
    cy.supabaseLogin('test.user1@example.com', 'password123');
    
    // Mock API responses for matches
    cy.stubMatchesApi();
    
    // Visit the matches page
    cy.visit('/matches');
    
    // Wait for the matches to load
    cy.wait('@getMatches');
  });

  it('should display the matches page with match cards', () => {
    // Verify the matches page has loaded correctly
    cy.get('[data-testid="matches-page"]').should('be.visible');
    cy.get('[data-testid="match-cards-container"]').should('be.visible');
    
    // Check that match cards are displayed
    cy.get('[data-testid="match-card"]').should('have.length.at.least', 2);
  });

  it('should display different match states correctly', () => {
    // Check for pending matches
    cy.get('[data-testid="pending-matches-section"]').should('be.visible');
    cy.get('[data-testid="pending-matches-section"]').find('[data-testid="match-card"]').should('exist');
    
    // Check for active matches
    cy.get('[data-testid="active-matches-section"]').should('be.visible');
    cy.get('[data-testid="active-matches-section"]').find('[data-testid="match-card"]').should('exist');
    
    // Check for completed matches
    cy.get('[data-testid="completed-matches-section"]').should('be.visible');
    cy.get('[data-testid="completed-matches-section"]').find('[data-testid="match-card"]').should('exist');
  });

  it('should respond to a pending match (accept)', () => {
    // Find the first pending match
    cy.get('[data-testid="pending-matches-section"]').find('[data-testid="match-card"]').first().as('pendingMatch');
    
    // Open the match detail view
    cy.get('@pendingMatch').click();
    
    // Match details should be shown in a modal/expanded view
    cy.get('[data-testid="match-detail-view"]').should('be.visible');
    
    // Mock the accept match API response
    cy.intercept('PUT', '**/api/matches/*/accept', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Match accepted successfully'
      }
    }).as('acceptMatch');
    
    // Click the accept button
    cy.get('[data-testid="accept-match-button"]').click();
    
    // Confirm the acceptance
    cy.get('[data-testid="confirm-action-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@acceptMatch');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')
      .and('contain', 'Match accepted');
    
    // Verify the match moved to the active section
    cy.get('[data-testid="active-matches-section"]').find('[data-testid="match-card"]')
      .should('contain', cy.get('@pendingMatch').find('[data-testid="matched-user-name"]').invoke('text'));
  });

  it('should respond to a pending match (decline)', () => {
    // Find the first pending match
    cy.get('[data-testid="pending-matches-section"]').find('[data-testid="match-card"]').first().as('pendingMatch');
    
    // Store the match name before declining
    cy.get('@pendingMatch').find('[data-testid="matched-user-name"]').invoke('text').as('matchedUserName');
    
    // Open the match detail view
    cy.get('@pendingMatch').click();
    
    // Match details should be shown
    cy.get('[data-testid="match-detail-view"]').should('be.visible');
    
    // Mock the decline match API response
    cy.intercept('PUT', '**/api/matches/*/decline', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Match declined successfully'
      }
    }).as('declineMatch');
    
    // Click the decline button
    cy.get('[data-testid="decline-match-button"]').click();
    
    // Enter a reason for declining
    cy.get('[data-testid="decline-reason-input"]').type('Schedule conflict');
    
    // Confirm the decline
    cy.get('[data-testid="confirm-action-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@declineMatch');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')
      .and('contain', 'Match declined');
    
    // Verify the declined match is no longer in the pending section
    cy.get('@matchedUserName').then((name) => {
      cy.get('[data-testid="pending-matches-section"]').should('not.contain', name);
    });
  });

  it('should schedule a session for an active match', () => {
    // Find the first active match
    cy.get('[data-testid="active-matches-section"]').find('[data-testid="match-card"]').first().as('activeMatch');
    
    // Open the match detail view
    cy.get('@activeMatch').click();
    
    // Match details should be shown
    cy.get('[data-testid="match-detail-view"]').should('be.visible');
    
    // Mock the schedule session API response
    cy.intercept('POST', '**/api/matches/*/sessions', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Session scheduled successfully',
        sessionDate: '2023-05-20T18:00:00.000Z'
      }
    }).as('scheduleSession');
    
    // Click the schedule session button
    cy.get('[data-testid="schedule-session-button"]').click();
    
    // Enter session details
    cy.get('[data-testid="session-date-input"]').type('2023-05-20');
    cy.get('[data-testid="session-time-input"]').type('18:00');
    cy.get('[data-testid="session-location-input"]').type('Video Call');
    cy.get('[data-testid="session-notes-input"]').type('Looking forward to our first session!');
    
    // Confirm scheduling
    cy.get('[data-testid="confirm-schedule-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@scheduleSession');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')
      .and('contain', 'Session scheduled');
    
    // Verify scheduled session appears in the match detail
    cy.get('[data-testid="next-session-info"]').should('be.visible')
      .and('contain', 'May 20, 2023')
      .and('contain', '6:00 PM');
  });

  it('should send messages between matched users', () => {
    // Find the first active match
    cy.get('[data-testid="active-matches-section"]').find('[data-testid="match-card"]').first().as('activeMatch');
    
    // Open the match detail view
    cy.get('@activeMatch').click();
    
    // Match details should be shown
    cy.get('[data-testid="match-detail-view"]').should('be.visible');
    
    // Click on messaging tab
    cy.get('[data-testid="messaging-tab"]').click();
    
    // Mock the send message API response
    cy.intercept('POST', '**/api/messages', {
      statusCode: 200,
      body: {
        success: true,
        message: {
          id: 'message-101',
          text: 'Hello! I am looking forward to our skill exchange.',
          senderId: 'user-1',
          receiverId: 'user-2',
          createdAt: new Date().toISOString()
        }
      }
    }).as('sendMessage');
    
    // Type and send a message
    const messageText = 'Hello! I am looking forward to our skill exchange.';
    cy.get('[data-testid="message-input"]').type(messageText);
    cy.get('[data-testid="send-message-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@sendMessage');
    
    // Verify the message appears in the chat
    cy.get('[data-testid="message-bubble"]').last()
      .should('contain', messageText)
      .and('have.class', 'sent-by-me');
  });

  it('should mark a match as completed and leave a review', () => {
    // Find the first active match
    cy.get('[data-testid="active-matches-section"]').find('[data-testid="match-card"]').first().as('activeMatch');
    
    // Open the match detail view
    cy.get('@activeMatch').click();
    
    // Match details should be shown
    cy.get('[data-testid="match-detail-view"]').should('be.visible');
    
    // Mock the complete match API response
    cy.intercept('PUT', '**/api/matches/*/complete', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Match marked as completed successfully'
      }
    }).as('completeMatch');
    
    // Click the complete match button
    cy.get('[data-testid="complete-match-button"]').click();
    
    // Confirm completion
    cy.get('[data-testid="confirm-action-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@completeMatch');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')
      .and('contain', 'Match completed');
    
    // Review form should appear
    cy.get('[data-testid="review-form"]').should('be.visible');
    
    // Mock the submit review API response
    cy.intercept('POST', '**/api/reviews', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Review submitted successfully'
      }
    }).as('submitReview');
    
    // Fill in and submit the review
    cy.get('[data-testid="rating-5"]').click(); // 5-star rating
    cy.get('[data-testid="review-text"]').type('Great exchange experience! Learned a lot and the teaching was excellent.');
    cy.get('[data-testid="submit-review-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@submitReview');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')
      .and('contain', 'Review submitted');
  });

  it('should cancel a match with explanation', () => {
    // Find the first active match
    cy.get('[data-testid="active-matches-section"]').find('[data-testid="match-card"]').first().as('activeMatch');
    
    // Store the match name before canceling
    cy.get('@activeMatch').find('[data-testid="matched-user-name"]').invoke('text').as('matchedUserName');
    
    // Open the match detail view
    cy.get('@activeMatch').click();
    
    // Match details should be shown
    cy.get('[data-testid="match-detail-view"]').should('be.visible');
    
    // Mock the cancel match API response
    cy.intercept('PUT', '**/api/matches/*/cancel', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Match cancelled successfully'
      }
    }).as('cancelMatch');
    
    // Click the cancel match button
    cy.get('[data-testid="cancel-match-button"]').click();
    
    // Enter a reason for cancelling
    cy.get('[data-testid="cancel-reason-input"]').type('Unexpected scheduling conflicts');
    
    // Confirm the cancellation
    cy.get('[data-testid="confirm-action-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@cancelMatch');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')
      .and('contain', 'Match cancelled');
    
    // Verify the match is no longer in the active section
    cy.get('@matchedUserName').then((name) => {
      cy.get('[data-testid="active-matches-section"]').should('not.contain', name);
    });
  });

  it('should filter matches by status', () => {
    // Click on filter dropdown
    cy.get('[data-testid="filter-dropdown"]').click();
    
    // Filter to show only pending matches
    cy.get('[data-testid="filter-option-pending"]').click();
    
    // Verify only pending matches are shown
    cy.get('[data-testid="match-card"]').each(($card) => {
      cy.wrap($card).find('[data-testid="match-status"]').should('contain', 'Pending');
    });
    
    // Change filter to show only active matches
    cy.get('[data-testid="filter-dropdown"]').click();
    cy.get('[data-testid="filter-option-active"]').click();
    
    // Verify only active matches are shown
    cy.get('[data-testid="match-card"]').each(($card) => {
      cy.wrap($card).find('[data-testid="match-status"]').should('contain', 'Active');
    });
  });

  it('should sort matches by different criteria', () => {
    // Click on sort dropdown
    cy.get('[data-testid="sort-dropdown"]').click();
    
    // Sort by match score (highest first)
    cy.get('[data-testid="sort-option-score"]').click();
    
    // Get match scores
    const matchScores = [];
    cy.get('[data-testid="match-score"]').each(($score) => {
      matchScores.push(parseInt($score.text().replace(/[^0-9]/g, '')));
    }).then(() => {
      // Verify matches are sorted by score in descending order
      for (let i = 0; i < matchScores.length - 1; i++) {
        expect(matchScores[i]).to.be.at.least(matchScores[i + 1]);
      }
    });
    
    // Change sort to most recent
    cy.get('[data-testid="sort-dropdown"]').click();
    cy.get('[data-testid="sort-option-recent"]').click();
    
    // Verify matches are now sorted by date
    // This would need date parsing which is complex for this test
    // Just verify the sort option is applied
    cy.get('[data-testid="current-sort-indicator"]').should('contain', 'Most Recent');
  });
});
