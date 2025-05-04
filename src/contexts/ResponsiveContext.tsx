/**
 * Responsive Context
 * 
 * This context provides responsive device information to components
 * to help build responsive interfaces and optimize performance.
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Breakpoint definitions in pixels
const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type OrientationType = 'portrait' | 'landscape';

interface ResponsiveContextType {
  width: number;
  height: number;
  breakpoint: keyof typeof BREAKPOINTS;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  isPortrait: boolean;
  isLandscape: boolean;
  orientation: OrientationType;
  isTouchDevice: boolean;
  prefersReducedMotion: boolean;
}

const defaultContext: ResponsiveContextType = {
  width: 0,
  height: 0,
  breakpoint: 'md',
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  deviceType: 'desktop',
  isPortrait: true,
  isLandscape: false,
  orientation: 'portrait',
  isTouchDevice: false,
  prefersReducedMotion: false,
};

const ResponsiveContext = createContext<ResponsiveContextType>(defaultContext);

export function useResponsive() {
  return useContext(ResponsiveContext);
}

export const ResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ResponsiveContextType>(defaultContext);

  useEffect(() => {
    // Detect if the device has touch capability
    const detectTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Detect if user prefers reduced motion
    const detectReducedMotion = () => 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Update dimensions and device info
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determine current breakpoint
      let breakpoint: keyof typeof BREAKPOINTS = 'xs';
      Object.entries(BREAKPOINTS).forEach(([key, value]) => {
        if (width >= value) {
          breakpoint = key as keyof typeof BREAKPOINTS;
        }
      });
      
      // Determine device type
      let deviceType: DeviceType = 'desktop';
      const isMobile = width < BREAKPOINTS.md;
      const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
      const isDesktop = width >= BREAKPOINTS.lg;
      
      if (isMobile) deviceType = 'mobile';
      else if (isTablet) deviceType = 'tablet';
      
      // Determine orientation
      const isPortrait = height > width;
      const orientation: OrientationType = isPortrait ? 'portrait' : 'landscape';
      
      setState({
        width,
        height,
        breakpoint,
        isMobile,
        isTablet,
        isDesktop,
        deviceType,
        isPortrait,
        isLandscape: !isPortrait,
        orientation,
        isTouchDevice: detectTouch(),
        prefersReducedMotion: detectReducedMotion(),
      });
    };
    
    // Initial update
    updateDimensions();
    
    // Listen for window resize
    window.addEventListener('resize', updateDimensions);
    
    // Listen for orientation change (particularly important for mobile)
    window.addEventListener('orientationchange', updateDimensions);
    
    // Listen for reduced motion preference changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionQuery.addEventListener('change', updateDimensions);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
      reducedMotionQuery.removeEventListener('change', updateDimensions);
    };
  }, []);
  
  return (
    <ResponsiveContext.Provider value={state}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export default ResponsiveProvider;
