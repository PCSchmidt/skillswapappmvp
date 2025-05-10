# Testing Infrastructure Setup

This document outlines the comprehensive testing setup for the SkillSwap MVP project, including unit testing with Jest, integration testing, and end-to-end testing with Cypress.

## Unit Testing with Jest

We've configured Jest to provide thorough test coverage reporting and specialized test commands for different parts of the application.

### Key Features

- **Code Coverage Reporting**: Configured to generate detailed coverage reports
- **Coverage Thresholds**: Set minimum coverage requirements for critical parts of the application
- **Component Testing**: Using React Testing Library to test UI components
- **Unit Testing**: For utility functions and business logic

### Jest Configuration

Our Jest configuration in `jest.config.js` includes:

- Coverage collection from all TypeScript and JavaScript files
- Exclusion of declaration files, stories, and special pages from coverage
- Component-specific and utility-specific coverage thresholds
- Multiple coverage report formats (HTML, JSON, lcov, text)
- Watch mode for continuous testing during development

### Available Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (great for development)
npm run test:watch

# Run only UI component tests
npm run test:ui

# Run only library/utility tests
npm run test:lib

# Generate coverage report
npm run test:coverage

# Run in CI mode with coverage
npm run test:ci

# Generate coverage badges for documentation
npm run test:badges

# Update test snapshots
npm run test:updateSnapshots

# Run comprehensive coverage report with formatted output
npm run test:coverage:report
```

The `test:coverage:report` script uses our custom reporting tool that provides a detailed breakdown of coverage statistics with color-coded output and threshold verification.

## Coverage Thresholds

We've established the following minimum coverage requirements:

- **Global**:
  - Statements: 70%
  - Branches: 60%
  - Functions: 70%
  - Lines: 70%

- **UI Components**:
  - Statements: 80%
  - Branches: 70%
  - Functions: 80%
  - Lines: 80%

- **Utility Functions**:
  - Statements: 90%
  - Branches: 80%
  - Functions: 90%
  - Lines: 90%

## E2E Testing with Cypress

For end-to-end testing, we use Cypress to test critical user flows and integrations.

### Available Cypress Commands

```bash
# Open Cypress Test Runner UI
npm run cypress:open

# Run Cypress tests in terminal
npm run cypress:run

# Run Cypress tests headlessly (for CI)
npm run cypress:ci
```

## Test Mocks

We've configured various mocks in `jest.setup.js`:

- **fetch API**: Mocked globally for API testing
- **Next.js Navigation**: Router functions, search params, and pathname
- **IntersectionObserver**: For components using viewport detection
- **matchMedia**: For responsive design testing

## Writing Tests

### Unit Test Example (Component)

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button Component', () => {
  test('renders button with correct text', () => {
    render(<Button>Test Button</Button>);
    const buttonElement = screen.getByText('Test Button');
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const buttonElement = screen.getByText('Click Me');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Unit Test Example (Utility)

```tsx
import { formatDate, validateEmail } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2025-05-10T12:00:00');
      expect(formatDate(date)).toBe('May 10, 2025');
    });
  });

  describe('validateEmail', () => {
    test('validates correct email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    test('rejects invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });
});
```

### E2E Test Example

```js
describe('Login Flow', () => {
  it('allows user to log in', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('h1').should('contain', 'Dashboard');
  });
});
```

## Best Practices

1. **Test Structure**: Follow the Arrange-Act-Assert pattern
2. **Component Testing**: Test behavior, not implementation details
3. **Mocking**: Mock external dependencies, but keep mocks minimal
4. **Coverage**: Aim for high coverage of critical paths
5. **Maintenance**: Keep tests updated as components change

## Continuous Integration

Tests are automatically run in CI/CD pipelines to ensure code quality before deployment. The pipeline:

1. Runs linting checks
2. Executes unit tests with coverage reporting
3. Runs E2E tests on critical flows
4. Checks coverage thresholds

## Future Improvements

- Integration with Storybook for component visual testing
- Property-based testing for API validation
- Performance testing for critical user flows
- Automated accessibility testing with axe-core
