'use client';

/**
 * Type definitions for SWR config options
 * 
 * This module defines the type interfaces for SWR configuration options
 * used throughout the application.
 */

import type { SWRConfiguration } from 'swr';

/**
 * Extended SWR configuration options interface
 */
export interface SWRConfigOptions extends SWRConfiguration {
  // Add any custom configuration options here
  customErrorHandler?: boolean;
}

/**
 * Export the SWR configuration type for use in other components
 */
export type { SWRConfiguration };

export default SWRConfigOptions;
