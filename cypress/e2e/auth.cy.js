/**
 * End-to-End tests for authentication flows
 */

describe('Authentication Flows', () => {
  beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Login', () => {
    it('should allow a user to login with valid credentials', () => {
      // Visit the login page
      cy.visit('/auth/login');
      
      // Ensure the form loads properly
      cy.get('[data-testid="login-form"]').should('be.visible');
      
      // Fill out the form
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      
      // Submit the form
      cy.get('[data-testid="login-button"]').click();
      
      // Verify successful login by checking URL or dashboard element
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-greeting"]').should('contain', 'Welcome');
    });

    it('should show error message with invalid credentials', () => {
      // Visit the login page
      cy.visit('/auth/login');
      
      // Fill out the form with invalid credentials
      cy.get('[data-testid="email-input"]').type('invalid@example.com');
      cy.get('[data-testid="password-input"]').type('wrongpassword');
      
      // Submit the form
      cy.get('[data-testid="login-button"]').click();
      
      // Verify error message is displayed
      cy.get('[data-testid="auth-error"]').should('be.visible');
      cy.get('[data-testid="auth-error"]').should('contain', 'Invalid email or password');
      
      // Verify we are still on the login page
      cy.url().should('include', '/auth/login');
    });

    it('should validate form inputs', () => {
      // Visit the login page
      cy.visit('/auth/login');
      
      // Try to submit without entering anything
      cy.get('[data-testid="login-button"]').click();
      
      // Verify validation errors appear
      cy.get('[data-testid="email-error"]').should('be.visible');
      cy.get('[data-testid="password-error"]').should('be.visible');
      
      // Enter invalid email format
      cy.get('[data-testid="email-input"]').type('not-an-email');
      cy.get('[data-testid="login-button"]').click();
      
      // Verify email format validation
      cy.get('[data-testid="email-error"]').should('contain', 'valid email');
      
      // Enter valid email but short password
      cy.get('[data-testid="email-input"]').clear().type('test@example.com');
      cy.get('[data-testid="password-input"]').type('short');
      cy.get('[data-testid="login-button"]').click();
      
      // Verify password length validation
      cy.get('[data-testid="password-error"]').should('contain', 'at least');
    });

    it('should navigate to signup page when clicking signup link', () => {
      // Visit the login page
      cy.visit('/auth/login');
      
      // Click on the signup link
      cy.get('[data-testid="signup-link"]').click();
      
      // Verify we are redirected to signup page
      cy.url().should('include', '/auth/signup');
    });
  });

  describe('Signup', () => {
    it('should allow a new user to register', () => {
      // Generate a unique email using timestamp
      const uniqueEmail = `test-${Date.now()}@example.com`;
      
      // Visit the signup page
      cy.visit('/auth/signup');
      
      // Ensure the form loads properly
      cy.get('[data-testid="signup-form"]').should('be.visible');
      
      // Fill out the form
      cy.get('[data-testid="full-name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type(uniqueEmail);
      cy.get('[data-testid="password-input"]').type('SecurePass123');
      cy.get('[data-testid="confirm-password-input"]').type('SecurePass123');
      cy.get('[data-testid="location-input"]').type('Boston, MA');
      
      // Submit the form
      cy.get('[data-testid="signup-button"]').click();
      
      // Verify successful signup by checking for onboarding page redirect
      cy.url().should('include', '/onboarding');
    });

    it('should validate matching passwords', () => {
      // Visit the signup page
      cy.visit('/auth/signup');
      
      // Fill out the form with non-matching passwords
      cy.get('[data-testid="full-name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="confirm-password-input"]').type('different123');
      
      // Submit the form
      cy.get('[data-testid="signup-button"]').click();
      
      // Verify password matching error
      cy.get('[data-testid="password-match-error"]').should('be.visible');
      cy.get('[data-testid="password-match-error"]').should('contain', 'match');
    });

    it('should validate email uniqueness', () => {
      // Visit the signup page
      cy.visit('/auth/signup');
      
      // Fill out the form with an existing email (assuming test@example.com already exists)
      cy.get('[data-testid="full-name-input"]').type('Another User');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="confirm-password-input"]').type('password123');
      cy.get('[data-testid="location-input"]').type('New York, NY');
      
      // Submit the form
      cy.get('[data-testid="signup-button"]').click();
      
      // Verify duplicate email error
      cy.get('[data-testid="auth-error"]').should('be.visible');
      cy.get('[data-testid="auth-error"]').should('contain', 'already in use');
    });

    it('should navigate to login page when clicking login link', () => {
      // Visit the signup page
      cy.visit('/auth/signup');
      
      // Click on the login link
      cy.get('[data-testid="login-link"]').click();
      
      // Verify we are redirected to login page
      cy.url().should('include', '/auth/login');
    });
  });

  describe('Password Reset', () => {
    it('should allow a user to request password reset', () => {
      // Visit the password reset page
      cy.visit('/auth/forgot-password');
      
      // Ensure the form loads properly
      cy.get('[data-testid="reset-form"]').should('be.visible');
      
      // Fill out the form
      cy.get('[data-testid="email-input"]').type('test@example.com');
      
      // Submit the form
      cy.get('[data-testid="request-reset-button"]').click();
      
      // Verify success message
      cy.get('[data-testid="reset-success-message"]').should('be.visible');
      cy.get('[data-testid="reset-success-message"]').should('contain', 'email has been sent');
    });
  });
});
