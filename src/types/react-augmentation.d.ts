import React from 'react';

declare module 'react' {
  interface ImplicitProps {
    children?: React.ReactNode;
  }

  // Add typings for common props that might be missing
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    class?: string;
    className?: string;
    style?: React.CSSProperties;
  }

  interface JSX {
    element: JSX.Element;
  }
}

// Fix for 'prev' parameter implicit any type error
declare namespace React {
  interface useState<S> {
    (initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>];
  }
  
  interface SetStateAction<S> {
    (prevState: S): S;
    (prevState: unknown): unknown;
  }
}

// Ensure React exists in the global scope
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: Record<string, unknown>;
    }
  }
}
