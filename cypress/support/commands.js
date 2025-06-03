// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Import fixtures
import '@testing-library/cypress/add-commands';
import matches from '../fixtures/matches.json';
import skills from '../fixtures/skills.json';
import users from '../fixtures/users.json';

// -- Authentication Commands --
Cypress.Commands.add('supabaseLogin', (email, password) => {
  cy.log(`Logging in as ${email}`);
  
  // Intercept any auth API calls
  cy.intercept('POST', '**/auth/v1/token*').as('authRequest');
  
  // First check if we're already logged in
  cy.window().then(win => {
    // Set a fixed mocked token
    win.localStorage.setItem('supabase.auth.token', JSON.stringify({
      currentSession: {
        access_token: 'mocked-jwt-token',
        token_type: 'bearer',
        user: users.find(u => u.email === email) || users[0]
      }
    }));
    
    // Set user data in local storage to simulate logged in state
    win.localStorage.setItem('skillswap.auth.user', JSON.stringify(
      users.find(u => u.email === email) || users[0]
    ));
  });
  
  // Return a resolved promise to keep Cypress chain going
  cy.wrap(null);
});

// -- API Mocking Commands --

// Mock skills API
Cypress.Commands.add('stubSkillsApi', () => {
  // Intercept skills data requests
  cy.intercept('GET', '**/api/skills*', {
    statusCode: 200,
    body: {
      skills: skills,
      pagination: {
        total: skills.length,
        page: 1,
        pageSize: 10,
        totalPages: Math.ceil(skills.length / 10)
      }
    }
  }).as('getSkills');
  
  cy.log('Mocked skills API');
});

// Mock user skills API
Cypress.Commands.add('stubUserSkillsApi', () => {
  const userSkills = skills.filter((skill, index) => index < 6);
  const offered = userSkills.filter((_, index) => index < 3);
  const wanted = userSkills.filter((_, index) => index >= 3);
  const inactive = [
    { ...userSkills[0], id: 'inactive-1', name: 'Inactive Skill 1', isActive: false, type: 'offered' },
    { ...userSkills[1], id: 'inactive-2', name: 'Inactive Skill 2', isActive: false, type: 'wanted' }
  ];
  
  // Intercept user skills data requests
  cy.intercept('GET', '**/api/users/*/skills*', {
    statusCode: 200,
    body: {
      offered: offered,
      wanted: wanted,
      inactive: inactive
    }
  }).as('getUserSkills');
  
  cy.log('Mocked user skills API');
});

// Mock matches API
Cypress.Commands.add('stubMatchesApi', () => {
  const pending = matches.filter(match => match.status === 'pending');
  const active = matches.filter(match => match.status === 'accepted');
  const completed = matches.filter(match => match.status === 'completed');
  const declined = matches.filter(match => match.status === 'declined' || match.status === 'cancelled');
  
  // Intercept matches data requests
  cy.intercept('GET', '**/api/matches*', {
    statusCode: 200,
    body: {
      pending: pending,
      active: active, 
      completed: completed,
      declined: declined,
      pagination: {
        total: matches.length,
        page: 1,
        pageSize: 10,
        totalPages: Math.ceil(matches.length / 10)
      }
    }
  }).as('getMatches');
  
  cy.log('Mocked matches API');
});

// -- SEO Testing --
Cypress.Commands.add('checkSeoMetadata', () => {
  // Check for title
  cy.title().should('not.be.empty');
  
  // Check for meta description
  cy.get('head meta[name="description"]').should('have.attr', 'content').should('not.be.empty');
  
  // Check for canonical URL
  cy.get('head link[rel="canonical"]').should('have.attr', 'href');
  
  // Check for Open Graph tags
  cy.get('head meta[property^="og:"]').should('have.length.at.least', 3);
  
  cy.log('Checked SEO metadata');
});

// -- Accessibility Testing --
Cypress.Commands.add('checkA11y', () => {
  // Only run a11y checks if enabled in environment
  if (Cypress.env('ENABLE_A11Y')) {
    // Check for basic accessibility properties
    cy.get('img').should('have.attr', 'alt');
    cy.get('a').should('have.attr', 'href');
    cy.get('button').should('not.have.attr', 'disabled');
    cy.get('input').should('have.attr', 'aria-label');
    
    cy.log('Checked basic accessibility');
  }
});

// -- Form Utilities --
Cypress.Commands.add('fillFormFields', (selectors) => {
  Object.entries(selectors).forEach(([selector, value]) => {
    cy.get(selector).type(value);
  });
});
