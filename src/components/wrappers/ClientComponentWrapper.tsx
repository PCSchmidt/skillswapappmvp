'use client';

import React from 'react';

interface ClientComponentWrapperProps {
  children: React.ReactNode;
}

/**
 * Client Component Wrapper
 * 
 * This component is used to wrap client-side components that need to be rendered
 * from server components and may involve event handlers or other client-specific
 * functionality. Using this wrapper helps prevent the "Event handlers cannot be 
 * passed to Client Component props" error that can occur when server components
 * directly render client components with interactivity.
 */
export default function ClientComponentWrapper({ children }: ClientComponentWrapperProps) {
  return <>{children}</>;
}
