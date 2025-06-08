import * as Sentry from '@sentry/nextjs';
import { renderHook, act } from '@testing-library/react';
import useErrorHandler, { useDataFetchingErrorHandler } from '@/lib/hooks/useErrorHandler';

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  withScope: jest.fn((callback) => callback({
    setLevel: jest.fn(),
    setExtra: jest.fn(),
  })),
  captureException: jest.fn(),
}));

// Mock console.error
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = jest.fn();
});
afterEach(() => {
  console.error = originalConsoleError;
});

describe('useErrorHandler hook', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    expect(result.current.errorState).toEqual({
      hasError: false,
      message: null,
      error: null,
      severity: 'error',
      timestamp: null,
    });
  });

  it('should initialize with provided message', () => {
    const { result } = renderHook(() => useErrorHandler('Initial error message'));
    
    expect(result.current.errorState.message).toBe('Initial error message');
    expect(result.current.errorState.hasError).toBe(false);
  });

  it('should handle Error objects', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('Test error message');
    
    act(() => {
      result.current.handleError(testError);
    });
    
    expect(result.current.errorState.hasError).toBe(true);
    expect(result.current.errorState.message).toBe('Test error message');
    expect(result.current.errorState.error).toBe(testError);
    expect(result.current.errorState.severity).toBe('error');
    expect(result.current.errorState.timestamp).toBeInstanceOf(Date);
  });

  it('should handle string errors', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.handleError('String error message');
    });
    
    expect(result.current.errorState.hasError).toBe(true);
    expect(result.current.errorState.message).toBe('String error message');
    expect(result.current.errorState.error).toBeInstanceOf(Error);
    expect(result.current.errorState.error?.message).toBe('String error message');
  });

  it('should use custom user message when provided', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('Original error message');
    
    act(() => {
      result.current.handleError(testError, { 
        userMessage: 'User-friendly error message'
      });
    });
    
    expect(result.current.errorState.hasError).toBe(true);
    expect(result.current.errorState.message).toBe('User-friendly error message');
    expect(result.current.errorState.error).toBe(testError);
  });

  it('should use custom severity when provided', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.handleError('Error message', { severity: 'warning' });
    });
    
    expect(result.current.errorState.severity).toBe('warning');
  });

  it('should clear error state', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.handleError('Error message');
    });
    
    expect(result.current.errorState.hasError).toBe(true);
    
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.errorState.hasError).toBe(false);
    expect(result.current.errorState.message).toBe(null);
    expect(result.current.errorState.error).toBe(null);
  });

  it('should report errors to Sentry when shouldReport is true', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('Test error');
    
    act(() => {
      result.current.handleError(testError, { shouldReport: true });
    });
    
    expect(Sentry.withScope).toHaveBeenCalled();
    expect(Sentry.captureException).toHaveBeenCalledWith(testError);
  });

  it('should not report errors to Sentry when shouldReport is false', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('Test error');
    
    act(() => {
      result.current.handleError(testError, { shouldReport: false });
    });
    
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('should store and execute retry function', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const mockRetry = jest.fn().mockResolvedValue('success');
    
    act(() => {
      result.current.handleError('Error message', { retry: mockRetry });
    });
    
    await act(async () => {
      await result.current.retryLastOperation();
    });
    
    expect(mockRetry).toHaveBeenCalled();
    expect(result.current.errorState.hasError).toBe(false);
  });

  it('should handle errors in retry function', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const retryError = new Error('Retry failed');
    const mockRetry = jest.fn().mockRejectedValue(retryError);
    
    act(() => {
      result.current.handleError('Error message', { retry: mockRetry });
    });
    
    await act(async () => {
      try {
        await result.current.retryLastOperation();
      } catch (e) {
        // Expected to throw
      }
    });
    
    expect(mockRetry).toHaveBeenCalled();
    expect(result.current.errorState.hasError).toBe(true);
    expect(result.current.errorState.error).toBe(retryError);
  });
});

describe('useDataFetchingErrorHandler hook', () => {
  it('should use data-specific defaults', () => {
    const { result } = renderHook(() => useDataFetchingErrorHandler());
    
    act(() => {
      result.current.handleError('Data error');
    });
    
    expect(result.current.errorState.severity).toBe('warning');
    expect(result.current.errorState.message).toBe('Failed to load data. Please try again later.');
  });

  it('should allow overriding default options', () => {
    const { result } = renderHook(() => 
      useDataFetchingErrorHandler({ 
        severity: 'critical',
        userMessage: 'Critical data failure'
      })
    );
    
    act(() => {
      result.current.handleError('Data error');
    });
    
    expect(result.current.errorState.severity).toBe('critical');
    expect(result.current.errorState.message).toBe('Critical data failure');
  });

  it('should allow overriding defaults per error instance', () => {
    const { result } = renderHook(() => useDataFetchingErrorHandler());
    
    act(() => {
      result.current.handleError('Data error', {
        severity: 'info',
        userMessage: 'Data info message'
      });
    });
    
    expect(result.current.errorState.severity).toBe('info');
    expect(result.current.errorState.message).toBe('Data info message');
  });
});
