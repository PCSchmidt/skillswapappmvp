const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    // Only test files ending with .cy.js
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
  env: {
    // Environment variables that can be accessed in tests via Cypress.env()
    ENABLE_A11Y: true,
    // Configure which env to test against (local, staging, production)
    TEST_ENV: 'local',
  },
  // Retry options
  retries: {
    // Configure retry attempts for 'cypress run'
    runMode: 2,
    // Configure retry attempts for 'cypress open'
    openMode: 0,
  },
  // Configure browser behavior
  chromeWebSecurity: false,
  experimentalStudio: true,
});
