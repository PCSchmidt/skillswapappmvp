/**
 * JSX Runtime Type Declaration
 * 
 * This file provides type declarations for JSX elements to prevent "JSX element implicitly has type 'any'"
 * errors in TypeScript strict mode.
 */

import React from 'react'

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode
    }

    interface ElementAttributesProperty {
      props: {}
    }

    interface ElementChildrenAttribute {
      children: {}
    }

    interface IntrinsicAttributes extends React.Attributes {}
    
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}
  }
}

// This file is a module
export {}
