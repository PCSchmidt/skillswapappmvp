// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for login
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/auth/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    // Verify login was successful by checking for dashboard URL or user-specific element
    cy.url().should('include', '/dashboard');
  });
});

// Custom command for registering a new user
Cypress.Commands.add('register', (userData) => {
  cy.visit('/auth/signup');
  cy.get('[data-testid="full-name-input"]').type(userData.fullName);
  cy.get('[data-testid="email-input"]').type(userData.email);
  cy.get('[data-testid="password-input"]').type(userData.password);
  cy.get('[data-testid="confirm-password-input"]').type(userData.password);
  cy.get('[data-testid="location-input"]').type(userData.location);
  cy.get('[data-testid="signup-button"]').click();
  
  // Verify registration was successful
  cy.url().should('include', '/onboarding');
});

// Custom command for creating a new skill
Cypress.Commands.add('createSkill', (skillData) => {
  cy.get('[data-testid="create-skill-button"]').click();
  cy.get('[data-testid="skill-title-input"]').type(skillData.title);
  cy.get('[data-testid="skill-description-input"]').type(skillData.description);
  cy.get('[data-testid="skill-category-select"]').click();
  cy.contains(skillData.category).click();
  
  cy.get('[data-testid="submit-skill-button"]').click();
  
  // Verify skill was created successfully
  cy.contains(skillData.title).should('be.visible');
});

// Custom command for proposing a trade
Cypress.Commands.add('proposeTrade', (targetSkillTitle, mySkillTitle, notes) => {
  cy.contains(targetSkillTitle).click();
  cy.get('[data-testid="propose-trade-button"]').click();
  
  // Select my skill to offer
  cy.get('[data-testid="my-skill-select"]').click();
  cy.contains(mySkillTitle).click();
  
  // Add notes
  if (notes) {
    cy.get('[data-testid="trade-notes-input"]').type(notes);
  }
  
  // Submit the proposal
  cy.get('[data-testid="submit-proposal-button"]').click();
  
  // Verify success message
  cy.contains('Trade proposal sent successfully').should('be.visible');
});
