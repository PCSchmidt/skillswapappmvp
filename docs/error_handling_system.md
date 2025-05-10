# Error Handling System for SkillSwap

This document provides an overview of the comprehensive error handling system implemented in the SkillSwap application. The system is designed to provide consistent error handling, detailed error reporting, and a better user experience when errors occur.

## Architecture Overview

The error handling system is built with multiple layers:

1. **React Error Boundaries**: Component-level error catching
2. **Next.js Error Pages**: Route-level error handling
3. **Error Hooks**: Custom hooks for handling errors in functional components
4. **UI Components**: Standardized error UI components
5. **Monitoring Integration**: Sentry integration for error tracking

### Directory Structure

```
src/
├── components/
│   └── ui/
│       ├── ErrorBoundary.tsx     // React Error Boundary component
│       ├── ErrorProvider.tsx     // Error boundary provider with Sentry
│       └── ErrorMessage.tsx      // UI component for displaying errors
├── lib/
│   └── hooks/
│       └── useErrorHandler.ts    // Error handling hooks
├── app/
│   ├── error.tsx                 // Next.js error page
│   └── not-found.tsx             // Next.js 404 page
```

## Key Components

### 1. Error Boundary (ErrorBoundary.tsx)

A class component that uses React's error boundary feature to catch JavaScript errors anywhere in the component tree:

- Catches errors in child components
- Prevents the entire app from crashing
- Displays a fallback UI
- Supports custom fallback components
- Provides error reset functionality

Usage example:

```tsx
<ErrorBoundary fallback={<CustomErrorFallback />}>
  <ComponentThatMightThrow />
</ErrorBoundary>
```

### 2. Error Provider (ErrorProvider.tsx)

A higher-order component that wraps the application with ErrorBoundary and adds Sentry integration:

- Integrates with Sentry for error reporting
- Provides environment-aware error logging
- Acts as a centralized error handling wrapper

Usage example:

```tsx
<ErrorProvider>
  <App />
</ErrorProvider>
```

### 3. Next.js Error Page (error.tsx)

A dedicated page component for handling unhandled errors at the route level:

- Catches errors not handled by Error Boundaries
- Reports errors to Sentry
- Provides a user-friendly error page
- Shows detailed error information in development
- Includes retry and navigation options

### 4. Error Handling Hooks (useErrorHandler.ts)

Custom React hooks for managing errors in functional components:

- `useErrorHandler`: General-purpose error handling with severity levels
- `useDataFetchingErrorHandler`: Specialized for data fetching errors

Features:
- Error state management
- Severity classification (info, warning, error, critical)
- Sentry integration
- Retry functionality
- Contextual error information

Usage example:

```tsx
const { errorState, handleError, clearError, retryLastOperation } = useErrorHandler();

try {
  await fetchData();
} catch (error) {
  handleError(error, { 
    severity: 'warning',
    userMessage: 'Unable to load data. Please try again.',
    retry: fetchData
  });
}

if (errorState.hasError) {
  return <ErrorMessage 
    message={errorState.message} 
    severity={errorState.severity}
    onRetry={retryLastOperation}
    onDismiss={clearError}
  />;
}
```

### 5. Error Message Component (ErrorMessage.tsx)

A reusable UI component for displaying error messages:

- Consistent styling based on error severity
- Support for retry and dismiss actions
- Accessibility features (ARIA roles)
- Visual differentiation by severity level

Usage example:

```tsx
<ErrorMessage 
  message="Failed to load user data" 
  severity="warning"
  onRetry={() => refetchData()}
  onDismiss={() => clearError()} 
/>
```

## Error Handling Flow

1. **Component-Level Errors**:
   - Caught by nearest ErrorBoundary
   - Fallback UI displayed
   - Error reported to Sentry via ErrorProvider

2. **Data Fetching Errors**:
   - Caught in try/catch blocks
   - Handled with useErrorHandler or useDataFetchingErrorHandler
   - Displayed with ErrorMessage component
   - Optionally reported to Sentry

3. **Server-Side/Route Errors**:
   - Caught by Next.js error.tsx
   - Reported to Sentry
   - Custom error page displayed

4. **404 Errors**:
   - Handled by Next.js not-found.tsx
   - Custom 404 page displayed

## Severity Levels

The system defines four severity levels for errors:

1. **Info** (Blue):
   - Informational messages
   - No functional impact
   - Example: "Data is being refreshed"

2. **Warning** (Yellow):
   - Minor issues that don't prevent core functionality
   - Temporary or recoverable problems
   - Example: "Unable to load recommendations"

3. **Error** (Red):
   - Significant issues affecting functionality
   - Important features unavailable
   - Example: "Failed to save your profile changes"

4. **Critical** (Dark Red):
   - Severe issues preventing core functionality
   - Application may be unusable
   - Example: "Authentication system is unavailable"

## Error Reporting with Sentry

All errors are automatically reported to Sentry with rich contextual information:

- Error type and message
- Component stack trace
- User information (if available)
- Browser and device details
- Custom context added via error handlers

## Best Practices

### When to Use Error Boundaries

- Wrap complex component trees
- Isolate unstable or third-party components
- Protect critical UI sections

### When to Use Error Hooks

- For async operations
- When fetching data
- For operations that might fail
- When you need retry functionality

### Error Message Guidelines

- Use clear, non-technical language
- Explain what happened
- Suggest possible solutions
- Provide action buttons when appropriate

## Implementation Examples

### Wrapping a Page with Error Boundary

```tsx
// In a page component
export default function ProfilePage() {
  return (
    <ErrorBoundary
      fallback={<ProfileErrorFallback />}
    >
      <ProfileContent />
    </ErrorBoundary>
  );
}
```

### Handling Data Fetching Errors

```tsx
// In a component that fetches data
function UserProfile({ userId }) {
  const { errorState, handleError, clearError, retryLastOperation } = 
    useDataFetchingErrorHandler();
  const [userData, setUserData] = useState(null);
  
  const fetchUserData = async () => {
    try {
      const data = await api.getUser(userId);
      setUserData(data);
    } catch (error) {
      handleError(error, {
        userMessage: `Could not load the user profile. Please try again.`,
        context: { userId },
        retry: fetchUserData
      });
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, [userId]);
  
  if (errorState.hasError) {
    return (
      <ErrorMessage 
        message={errorState.message} 
        severity={errorState.severity}
        onRetry={retryLastOperation}
        onDismiss={clearError}
      />
    );
  }
  
  return userData ? <UserProfileView user={userData} /> : <Loading />;
}
```

### Integrating with SWR

```tsx
// Using with SWR data fetching
import useSWR from 'swr';
import { useDataFetchingErrorHandler } from '@/lib/hooks/useErrorHandler';
import ErrorMessage from '@/components/ui/ErrorMessage';

function ProductList() {
  const { errorState, handleError, clearError } = useDataFetchingErrorHandler();
  
  const { data, error, mutate } = useSWR('/api/products', {
    onError: (err) => {
      handleError(err, {
        userMessage: 'Failed to load products. Please try again.',
        retry: () => mutate()
      });
    }
  });
  
  if (errorState.hasError) {
    return (
      <ErrorMessage 
        message={errorState.message}
        severity={errorState.severity}
        onRetry={() => mutate()}
        onDismiss={clearError}
      />
    );
  }
  
  // Render products
}
```

## Benefits

This error handling system provides several key benefits:

1. **Resilience**: Prevents the entire app from crashing due to isolated errors
2. **Consistency**: Standardized error handling and display across the application
3. **User Experience**: Clear error messages with appropriate actions
4. **Monitoring**: Comprehensive error reporting to Sentry
5. **Developer Experience**: Simple, reusable error handling patterns
6. **Recovery**: Built-in retry mechanisms for transient errors

## Future Improvements

Potential areas for enhancement:

1. **Error Aggregation**: Group similar errors to prevent overwhelming users
2. **Offline Error Queuing**: Store errors when offline for later reporting
3. **User Feedback Collection**: Allow users to provide additional context for errors
4. **Automated Recovery**: Smart retry strategies based on error types
5. **A/B Testing**: Test different error message formats for better user experience
