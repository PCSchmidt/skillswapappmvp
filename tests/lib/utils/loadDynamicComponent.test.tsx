// tests/lib/utils/loadDynamicComponent.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { loadDynamicComponent, createResponsiveComponent } from '@/lib/utils/loadDynamicComponent';
import { useResponsive, ResponsiveContextType } from '@/contexts/ResponsiveContext'; // Import useResponsive

// Mock Components
const MockComponent = (props: any) => <div data-testid="mock-component">Mock Component Loaded: {props.message}</div>;
const MockMobileComponent = (props: any) => <div data-testid="mock-mobile-component">Mock Mobile Component Loaded: {props.message}</div>;
const MockErrorFallback = () => <div data-testid="error-fallback">Custom Error Fallback</div>;

// Mocking dynamic imports
const mockImportSuccess = () => Promise.resolve({ default: MockComponent });
const mockMobileImportSuccess = () => Promise.resolve({ default: MockMobileComponent });
const mockImportError = () => Promise.reject(new Error('Failed to load component'));

// Mock the useResponsive hook from ResponsiveContext
jest.mock('@/contexts/ResponsiveContext', () => {
  const actualResponsiveContextModule = jest.requireActual('@/contexts/ResponsiveContext'); // Moved inside
  return {
    __esModule: true,
    ...actualResponsiveContextModule, // Preserve other exports like ResponsiveContextType
    useResponsive: jest.fn(), // This is the function createResponsiveComponent will call
  };
});
const mockedUseResponsive = useResponsive as jest.Mock;


describe('loadDynamicComponent', () => {
  beforeEach(() => {
    // Provide a default mock implementation for useResponsive for all loadDynamicComponent tests
    mockedUseResponsive.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      width: 1024, height: 768, breakpoint: 'lg', deviceType: 'desktop',
      isPortrait: true, isLandscape: false, orientation: 'portrait',
      isTouchDevice: false, prefersReducedMotion: false,
    });
    // Note: The 'delay' test will call jest.useFakeTimers() and jest.useRealTimers() itself.
    // Other tests that do not involve timers explicitly will use real timers by default.
  });

  // Test default loading state
  it('should render default loading state initially', async () => {
    mockedUseResponsive.mockReturnValue({ isMobile: false, isDesktop: true, width: 1024, height: 768, breakpoint: 'lg', deviceType: 'desktop', isPortrait: true, isLandscape: false, orientation: 'portrait', isTouchDevice: false, prefersReducedMotion: false });
    const SimpleLoading = () => <div data-testid="simple-loading">Loading...</div>;
    // Create a promise that never resolves for this test
    const neverResolvingImport = () => new Promise<{ default: React.ComponentType<any> }>(() => {});
    const DynamicComponent = loadDynamicComponent(neverResolvingImport, { loading: <SimpleLoading />, delay: 0 });
    render(<DynamicComponent />);
    // Check for the simple custom loader
    expect(screen.getByTestId('simple-loading')).toBeInTheDocument();
  });

  it('should render custom loading state if provided', async () => {
    const neverResolvingImport = () => new Promise<{ default: React.ComponentType<any> }>(() => {});
    const CustomLoading = () => <div data-testid="custom-loading">Custom Loading...</div>;
    const DynamicComponent = loadDynamicComponent(neverResolvingImport, { loading: <CustomLoading />, delay: 0 });
    render(<DynamicComponent />);
    expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
  });

  it('should render the component after successful import', async () => {
    const DynamicComponent = loadDynamicComponent(mockImportSuccess, { delay: 0 });
    render(<DynamicComponent message="Success!" />);
    expect(await screen.findByTestId('mock-component')).toBeInTheDocument();
    expect(screen.getByText('Mock Component Loaded: Success!')).toBeInTheDocument();
  });

  it('should render the default error fallback on import error', async () => {
    // Suppress console.error for this test as React will log the caught error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const DynamicComponent = loadDynamicComponent(mockImportError, { delay: 0 });
    render(<DynamicComponent />);
    expect(await screen.findByText('The component failed to load. Please try refreshing the page.')).toBeInTheDocument();
    (console.error as jest.Mock).mockRestore();
  });

  it('should render custom error fallback on import error if provided', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const DynamicComponent = loadDynamicComponent(mockImportError, { errorComponent: <MockErrorFallback />, delay: 0 });
    render(<DynamicComponent />);
    expect(await screen.findByTestId('error-fallback')).toBeInTheDocument();
    (console.error as jest.Mock).mockRestore();
  });

  it('should respect the delay option', async () => {
    mockedUseResponsive.mockReturnValue({ isMobile: false, isDesktop: true, width: 1024, height: 768, breakpoint: 'lg', deviceType: 'desktop', isPortrait: true, isLandscape: false, orientation: 'portrait', isTouchDevice: false, prefersReducedMotion: false });
    const SimpleLoading = () => <div data-testid="simple-loading">Loading...</div>;
    jest.useFakeTimers();
    const DynamicComponent = loadDynamicComponent(mockImportSuccess, { loading: <SimpleLoading />, delay: 200 });
    render(<DynamicComponent message="Delayed" />);
    // Should show loading initially
    expect(screen.getByTestId('simple-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-component')).not.toBeInTheDocument();

    // Advance timers just before delay
    jest.advanceTimersByTime(199);
    // Still loading
    expect(screen.getByTestId('simple-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-component')).not.toBeInTheDocument();

    // Advance timers past delay
    jest.advanceTimersByTime(1); // Total 200ms

    expect(await screen.findByTestId('mock-component')).toBeInTheDocument();
    expect(screen.getByText('Mock Component Loaded: Delayed')).toBeInTheDocument();
    jest.useRealTimers(); // Reset timers for subsequent tests if any in this describe block used them
  });
});

describe('createResponsiveComponent', () => {
  beforeEach(() => {
    // Default mock implementation for useResponsive for this suite
    mockedUseResponsive.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      // Provide other necessary fields from ResponsiveContextType with defaults
      width: 1024, height: 768, breakpoint: 'lg', deviceType: 'desktop',
      isPortrait: true, isLandscape: false, orientation: 'portrait',
      isTouchDevice: false, prefersReducedMotion: false,
    });
    jest.useRealTimers(); // Ensure real timers for async component loading
  });

  it('should render default component for desktop', async () => {
    mockedUseResponsive.mockReturnValue({ isMobile: false, isDesktop: true, isTablet: false });
    const ResponsiveComp = createResponsiveComponent(mockImportSuccess, mockMobileImportSuccess);
    render(<ResponsiveComp message="Desktop" />);
    expect(await screen.findByTestId('mock-component')).toBeInTheDocument();
    expect(screen.getByText('Mock Component Loaded: Desktop')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-mobile-component')).not.toBeInTheDocument();
  });

  it('should render mobile component for mobile', async () => {
    mockedUseResponsive.mockReturnValue({ isMobile: true, isDesktop: false, isTablet: false });
    const ResponsiveComp = createResponsiveComponent(mockImportSuccess, mockMobileImportSuccess);
    render(<ResponsiveComp message="Mobile" />);
    expect(await screen.findByTestId('mock-mobile-component')).toBeInTheDocument();
    expect(screen.getByText('Mock Mobile Component Loaded: Mobile')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-component')).not.toBeInTheDocument();
  });

  it('should render default component if no mobile import is provided (desktop)', async () => {
    mockedUseResponsive.mockReturnValue({ isMobile: false, isDesktop: true, isTablet: false });
    const ResponsiveComp = createResponsiveComponent(mockImportSuccess); // No mobileImport
    render(<ResponsiveComp message="Default" />);
    expect(await screen.findByTestId('mock-component')).toBeInTheDocument();
    expect(screen.getByText('Mock Component Loaded: Default')).toBeInTheDocument();
  });

  it('should render default component if no mobile import is provided (mobile)', async () => {
    mockedUseResponsive.mockReturnValue({ isMobile: true, isDesktop: false, isTablet: false });
    const ResponsiveComp = createResponsiveComponent(mockImportSuccess); // No mobileImport
    render(<ResponsiveComp message="Default" />);
    expect(await screen.findByTestId('mock-component')).toBeInTheDocument();
    expect(screen.getByText('Mock Component Loaded: Default')).toBeInTheDocument();
  });
});
