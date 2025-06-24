/**
 * JSX Runtime Type Declaration
 * 
 * This file provides type declarations for JSX elements to prevent "JSX element implicitly has type 'any'"
 * errors in TypeScript strict mode.
 */

import React from 'react'

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<unknown, unknown> {}
    
    interface ElementClass extends React.Component<unknown> {
      render(): React.ReactNode
    }

    interface ElementAttributesProperty {
      props: Record<string, unknown>
    }

    interface ElementChildrenAttribute {
      children: Record<string, unknown>
    }

    interface IntrinsicAttributes extends React.Attributes {}
    
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}
  }
}

// This file is a module
export {}
