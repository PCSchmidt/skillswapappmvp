# Cypress E2E Testing Guide for SkillSwap

This document provides an overview of the end-to-end testing approach for the SkillSwap MVP, using Cypress.

## Introduction

End-to-end (E2E) testing helps us verify that our application works correctly from a user's perspective, testing complete user flows from start to finish. Cypress allows us to automate browser-based tests that simulate real user interactions.

## Test Structure

Our E2E test suite is structured as follows:

- `cypress/e2e/`: Contains all test specifications
  - `registration.cy.js`: Tests for user registration and authentication
  - `skill-search.cy.js`: Tests for skill discovery and search functionality
  - `match-flow.cy.js`: Tests for the complete matching process
  - `skill-management.cy.js`: Tests for adding, editing, and removing skills

- `cypress/fixtures/`: Contains test data
  - `users.json`: Mock user profiles and authentication data
  - `skills.json`: Mock skill listings with different categories and attributes
  - `matches.json`: Mock match data with different statuses and interactions

- `cypress/support/`: Contains utilities and shared code
  - `commands.js`: Custom Cypress commands for common operations
  - `e2e.js`: Global test configuration and hooks

## Test Fixtures

We use a consistent set of test fixtures to ensure reliable testing across different test scenarios:

### Users Fixture

Our `users.json` fixture contains a set of user profiles with:
- Personal details (name, email, avatar, location)
- Skills offered and wanted
- Preferences and settings
- Ratings and activity metrics

### Skills Fixture

The `skills.json` fixture provides a variety of skills with:
- Different categories (Technology, Creative, Business, etc.)
- Varying proficiency levels (Beginner to Expert)
- Both offered and wanted skills
- Associated user information and timestamps

### Matches Fixture

Our `matches.json` fixture represents different match scenarios:
- Matches in various states (pending, accepted, declined, completed, cancelled)
- Associated messages between users
- Session records for completed exchanges
- Reviews and ratings

## Custom Commands

We've created several custom Cypress commands to simplify common testing tasks:

```javascript
// Login as a specific user
cy.loginAs('user-1');

// Mock API responses
cy.mockSkillSearch('javascript');

// Access fixture data within tests
cy.getFixture('users').then(users => {
  // Use user data
});

// Verify UI elements in a skill card
cy.checkSkillCard('skill-1');

// Simulate match interactions
cy.acceptMatch('match-1');
```

## Testing Approach

Our E2E tests focus on critical user flows, ensuring that core functionality works as expected from the user's perspective. Key testing principles include:

1. **Test complete flows**: Each test should represent a realistic user journey, not just isolated functionality.
2. **Use stable selectors**: Target elements using data attributes (`data-cy="..."`) rather than CSS classes or DOM structure.
3. **Realistic test data**: Test fixtures should represent realistic data scenarios.
4. **Handle asynchronous operations**: Use Cypress's built-in waiting and retry mechanisms for reliable testing.
5. **Isolation**: Each test should be independent and not rely on the state from previous tests.

## Common Test Patterns

### Authentication Testing

```javascript
describe('User Authentication', () => {
  beforeEach(() => {
    cy.visit('/auth/login');
  });

  it('should allow a user to log in', () => {
    cy.fixture('users').then(users => {
      const user = users[0];
      cy.get('[data-cy="email-input"]').type(user.email);
      cy.get('[data-cy="password-input"]').type('TestPassword123!');
      cy.get('[data-cy="login-button"]').click();
      cy.url().should('include', '/dashboard');
      cy.get('[data-cy="user-greeting"]').should('contain', user.fullName);
    });
  });
});
```

### Search Testing

```javascript
describe('Skill Search', () => {
  beforeEach(() => {
    cy.loginAs('user-1');
    cy.visit('/search');
  });

  it('should filter skills by category', () => {
    cy.get('[data-cy="category-filter"]').select('Technology');
    cy.get('[data-cy="search-button"]').click();
    cy.get('[data-cy="skill-card"]').each($card => {
      cy.wrap($card).should('contain', 'Technology');
    });
  });
});
```

### Match Flow Testing

```javascript
describe('Match Flow', () => {
  beforeEach(() => {
    cy.loginAs('user-1');
    cy.visit('/matches');
  });

  it('should allow a user to accept a match request', () => {
    cy.get('[data-cy="pending-match-card"]').first().within(() => {
      cy.get('[data-cy="accept-match-button"]').click();
    });
    cy.get('[data-cy="match-status"]').should('contain', 'Accepted');
  });
});
```

## Running Tests

### Local Development

To run tests during local development:

```bash
# Run all tests
npm run cypress:run

# Run specific test file
npm run cypress:run -- --spec "cypress/e2e/registration.cy.js"

# Open Cypress Test Runner UI
npm run cypress:open
```

### CI Pipeline

Our CI pipeline runs all Cypress tests automatically on:
- Pull requests to the main branch
- Direct pushes to staging and production branches

The CI configuration includes:
- Headless browser testing
- Recording of test results and screenshots
- Reporting of test coverage

## Best Practices

1. **Descriptive test names**: Use clear, descriptive test names that explain what's being tested.
2. **Minimal setup**: Keep test setup simple and focused on what's necessary.
3. **Avoid test interdependence**: Tests should not depend on the state from other tests.
4. **Handle edge cases**: Test both happy paths and error scenarios.
5. **Maintain test data**: Keep test fixtures up-to-date with application changes.
6. **Use explicit waiting**: Prefer explicit waiting for specific conditions rather than arbitrary delays.
7. **Visual verification**: Use screenshots for visual regression testing when needed.

## Troubleshooting Common Issues

- **Test flakiness**: If tests are inconsistently failing, check for race conditions, timing issues, or selector problems.
- **Authentication failures**: Ensure that the login process works reliably and that sessions are being properly maintained.
- **API mocking issues**: Verify that API interceptors are correctly set up and that response formats match expectations.
- **Selector problems**: If elements can't be found, check if selectors are still valid after UI changes.

## Extending the Test Suite

When adding new tests:

1. Start by identifying critical user flows that need coverage
2. Add or update fixtures as needed
3. Use existing custom commands or create new ones for complex operations
4. Follow the established patterns for test structure and organization
5. Run tests locally to verify they work before committing
