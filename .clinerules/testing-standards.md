# SkillSwap Testing Standards

This document defines testing standards for the SkillSwap MVP.

## Test Types and Coverage

1. **Unit Tests**:
   - Required for utility functions and hooks
   - Focus on pure logic and state management
   - Target coverage: 80%+

2. **Component Tests**:
   - Focus on user interactions and rendering
   - Test both success and error states
   - Mock external dependencies

3. **Integration Tests**:
   - Critical user flows using Cypress
   - Focus on happy paths and key error scenarios

## Test Organization

- Place tests in the `/tests` directory mirroring the src structure
- Name test files with `.test.tsx` suffix
- Group related tests with describe blocks
- Name tests descriptively: "should [behavior] when [condition]"

## Mocking Guidelines

- Use Jest mocks for external dependencies
- Mock Supabase using the supabaseMock utility
- Keep mocks minimal and focused on the test's needs
- Prefer function mocks over implementation mocks when possible

## Test Writing Patterns

### Component Test Pattern
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from '@/components/path/ComponentName';
import { mockData } from '../../mocks/data';

describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    render(<ComponentName prop1="value" />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  it('should handle user interaction correctly', () => {
    const mockFn = jest.fn();
    render(<ComponentName onAction={mockFn} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Test Pattern
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import useHookName from '@/lib/hooks/useHookName';

describe('useHookName', () => {
  it('should return the expected initial state', () => {
    const { result } = renderHook(() => useHookName());
    expect(result.current.value).toBe(expectedValue);
  });

  it('should update state correctly when action is called', () => {
    const { result } = renderHook(() => useHookName());
    act(() => {
      result.current.action(param);
    });
    expect(result.current.value).toBe(newExpectedValue);
  });
});
