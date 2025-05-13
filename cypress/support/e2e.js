// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Set up global hooks
beforeEach(() => {
  // Reset localStorage before each test
  cy.clearLocalStorage();
  
  // Default viewport
  cy.viewport(1280, 720);
  
  // Log test name
  cy.log(`Running: ${Cypress.currentTest.title}`);
  
  // Preserve cookies between tests
  Cypress.Cookies.preserveOnce('supabase-auth-token');
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // This is useful for handling third-party library errors
  // that don't actually affect our test
  console.log('Uncaught exception:', err.message);
  return false;
});

// Add custom assertion for checking if element has a specific data attribute
chai.Assertion.addMethod('dataAttribute', function (attribute) {
  const subject = this._obj;
  const hasAttr = subject.attr(`data-${attribute}`) !== undefined;
  this.assert(
    hasAttr,
    `expected #{this} to have data attribute '${attribute}'`,
    `expected #{this} not to have data attribute '${attribute}'`
  );
});

// Configure retry behavior for flaky tests
Cypress.env('retries', {
  runMode: 2,
  openMode: 0
});

// Set default timeout values
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('requestTimeout', 15000);
