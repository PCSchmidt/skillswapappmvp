# SkillSwap MVP End-to-End Testing

This directory contains end-to-end tests for the SkillSwap MVP using Cypress. These tests validate critical user flows and ensure that the application works correctly from a user's perspective.

## Test Structure

- **e2e/**: Contains the test files organized by feature
  - `auth.cy.js`: Tests for authentication flows (login, signup, password reset)
  - `trade-flow.cy.js`: Tests for the trading system
  - `messaging.cy.js`: Tests for the messaging system
- **fixtures/**: Contains test data
  - `users.json`: Test user data
  - `skills.json`: Sample skills data
- **support/**: Contains Cypress configuration and custom commands
  - `commands.js`: Custom commands for common operations
  - `e2e.js`: Global configuration for e2e tests

## Custom Commands

The following custom commands have been implemented to simplify tests:

- `cy.login(email, password)`: Logs in with the specified credentials
- `cy.register(userData)`: Registers a new user with the provided data
- `cy.createSkill(skillData)`: Creates a new skill
- `cy.proposeTrade(targetSkillTitle, mySkillTitle, notes)`: Proposes a trade

## Running Tests

The following npm scripts have been added to package.json:

```bash
# Open Cypress in interactive mode
npm run cypress

# Run Cypress tests headlessly
npm run cypress:headless

# Start the dev server and run Cypress in interactive mode
npm run e2e

# Start the dev server and run Cypress headlessly
npm run e2e:headless
```

## Writing Tests

When writing new tests, follow these best practices:

1. **Use Data Attributes**: Target elements using `data-testid` attributes rather than relying on CSS classes or text
2. **Handle Conditional States**: Use conditional checks to handle varying application states
3. **Isolate Tests**: Each test should be independent and not rely on the state from previous tests
4. **Use Custom Commands**: Leverage the custom commands for common operations
5. **Use Fixtures**: Store test data in fixture files rather than hardcoding it in tests

Example test pattern:

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Common setup like login
    cy.login('test@example.com', 'password123');
  });

  it('should perform a specific action', () => {
    // Visit a page
    cy.visit('/some-route');
    
    // Interact with elements
    cy.get('[data-testid="some-element"]').click();
    
    // Assert expected outcomes
    cy.url().should('include', '/expected-route');
    cy.get('[data-testid="result-element"]').should('be.visible');
  });
});
```

## CI/CD Integration

Tests are automatically run on GitHub Actions when code is pushed to the repository. The workflow is configured to:

1. Run unit tests first
2. Run e2e tests if unit tests pass
3. Capture and upload screenshots of failed tests
4. Capture and upload videos of test runs

See `.github/workflows/test.yml` for the complete workflow configuration.

## Adding New Test Files

To add a new test file:

1. Create a new file in the `cypress/e2e/` directory with a `.cy.js` extension
2. Import any required modules
3. Write your tests using the Cypress API
4. Add any required fixtures to the `cypress/fixtures/` directory

## Troubleshooting

- **Browser Not Starting**: Ensure you have Chrome installed on your system
- **Tests Failing Due to Timing**: Use `cy.wait()` or adjust timeouts in the config
- **Elements Not Found**: Verify that your selectors are correct and the elements actually exist
- **Session Related Issues**: Ensure you're properly handling authentication in tests
