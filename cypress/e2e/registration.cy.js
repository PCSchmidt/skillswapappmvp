/// <reference types="cypress" />

describe('User Registration Flow', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
    
    // Intercept API calls
    cy.intercept('POST', '**/auth/v1/signup*').as('signupRequest');
    cy.intercept('POST', '**/auth/v1/token*').as('tokenRequest');
  });

  it('should display signup form when clicking signup button', () => {
    // Click on the signup button in the header
    cy.get('[data-testid="signup-button"]').click();
    
    // Verify signup form is displayed
    cy.get('[data-testid="signup-form"]').should('be.visible');
    cy.get('h2').contains('Create an account').should('be.visible');
  });

  it('should validate required fields in the signup form', () => {
    // Navigate to signup form
    cy.get('[data-testid="signup-button"]').click();
    
    // Try to submit the form without filling in fields
    cy.get('[data-testid="submit-button"]').click();
    
    // Verify validation messages
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="password-error"]').should('be.visible');
  });

  it('should validate password strength requirements', () => {
    // Navigate to signup form
    cy.get('[data-testid="signup-button"]').click();
    
    // Fill in email field but use weak password
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('weak');
    cy.get('[data-testid="submit-button"]').click();
    
    // Verify password strength validation
    cy.get('[data-testid="password-error"]')
      .should('be.visible')
      .and('contain', 'Password must be at least 8 characters');
  });

  it('should successfully register a new user', () => {
    // Generate a random email
    const randomEmail = `test${Math.floor(Math.random() * 100000)}@example.com`;
    const validPassword = 'SecurePassword123!';

    // Navigate to signup form
    cy.get('[data-testid="signup-button"]').click();
    
    // Fill out the form with valid data
    cy.get('[data-testid="email-input"]').type(randomEmail);
    cy.get('[data-testid="password-input"]').type(validPassword);
    cy.get('[data-testid="confirm-password-input"]').type(validPassword);
    cy.get('[data-testid="terms-checkbox"]').check();
    
    // Submit the form
    cy.get('[data-testid="submit-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@signupRequest').its('response.statusCode').should('eq', 200);
    
    // Verify successful registration
    cy.get('[data-testid="registration-success"]').should('be.visible');
    cy.get('[data-testid="verification-message"]')
      .should('be.visible')
      .and('contain', 'Please check your email');
  });

  it('should handle existing email error', () => {
    // Use a fixture email that we'll pretend already exists
    const existingEmail = 'test.user1@example.com';
    const validPassword = 'SecurePassword123!';
    
    // Mock the signup request to return an error for existing email
    cy.intercept('POST', '**/auth/v1/signup*', {
      statusCode: 400,
      body: {
        error: 'User already registered',
        message: 'A user with this email already exists'
      }
    }).as('existingUserRequest');
    
    // Navigate to signup form
    cy.get('[data-testid="signup-button"]').click();
    
    // Fill out the form with an "existing" email
    cy.get('[data-testid="email-input"]').type(existingEmail);
    cy.get('[data-testid="password-input"]').type(validPassword);
    cy.get('[data-testid="confirm-password-input"]').type(validPassword);
    cy.get('[data-testid="terms-checkbox"]').check();
    
    // Submit the form
    cy.get('[data-testid="submit-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@existingUserRequest');
    
    // Verify error message is displayed
    cy.get('[data-testid="form-error"]')
      .should('be.visible')
      .and('contain', 'A user with this email already exists');
  });

  it('should link to the login page and back', () => {
    // Navigate to signup form
    cy.get('[data-testid="signup-button"]').click();
    
    // Click on the "Already have an account?" link
    cy.get('[data-testid="login-link"]').click();
    
    // Verify we're on the login page
    cy.get('[data-testid="login-form"]').should('be.visible');
    
    // Click on the "Create an account" link
    cy.get('[data-testid="signup-link"]').click();
    
    // Verify we're back on the signup page
    cy.get('[data-testid="signup-form"]').should('be.visible');
  });

  it('should navigate to profile completion after registration', () => {
    // Generate a random email
    const randomEmail = `test${Math.floor(Math.random() * 100000)}@example.com`;
    const validPassword = 'SecurePassword123!';
    
    // Mock the signup and token requests for direct verification
    cy.intercept('POST', '**/auth/v1/signup*', {
      statusCode: 200,
      body: {
        id: 'mock-user-id',
        email: randomEmail
      }
    }).as('signupRequest');
    
    cy.intercept('POST', '**/auth/v1/verify*', {
      statusCode: 200,
      body: {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600
      }
    }).as('verifyRequest');
    
    // Navigate to signup form
    cy.get('[data-testid="signup-button"]').click();
    
    // Fill out the form with valid data
    cy.get('[data-testid="email-input"]').type(randomEmail);
    cy.get('[data-testid="password-input"]').type(validPassword);
    cy.get('[data-testid="confirm-password-input"]').type(validPassword);
    cy.get('[data-testid="terms-checkbox"]').check();
    
    // Submit the form
    cy.get('[data-testid="submit-button"]').click();
    
    // Simulate email verification by directly navigating to verification path
    cy.visit('/auth/verify?token=mock-verification-token');
    cy.wait('@verifyRequest');
    
    // Verify redirect to profile completion page
    cy.url().should('include', '/auth/complete-profile');
    cy.get('[data-testid="profile-completion-form"]').should('be.visible');
  });
});
