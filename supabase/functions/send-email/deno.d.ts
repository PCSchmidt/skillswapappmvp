/**
 * Type declarations for Deno environment
 * These declarations help TypeScript understand Deno-specific APIs
 * This file is only needed for development and wouldn't be used in production
 */

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    toObject(): { [key: string]: string };
  }
  
  export const env: Env;
  
  export function serve(handler: (request: Request) => Promise<Response> | Response): void;
}
