const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Default command timeout
    defaultCommandTimeout: 10000,
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    // Enable experimental features
    experimentalSessionAndOrigin: true,
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
  // Default retry for flaky tests
  retries: {
    runMode: 1,
    openMode: 0,
  },
});
