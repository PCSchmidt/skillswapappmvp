'use client';

/**
 * ButtonWrapper Component
 * 
 * This is a client component wrapper for the Button component.
 * It allows server components to use Button with event handlers
 * by wrapping it with this client component.
 */

import React from 'react';
import Button, { ButtonProps } from '@/components/ui/Button';

interface ButtonWrapperProps extends ButtonProps {
  onClick?: () => void;
}

/**
 * ButtonWrapper is a client component that wraps the Button component
 * to handle client-side interactivity like click events.
 * 
 * This solves the "Event handlers cannot be passed to Client Component props" error
 * that occurs when server components try to pass onClick handlers directly to client components.
 * 
 * @example
 * // In a server component:
 * import { ButtonWrapper } from '@/components/wrappers/ButtonWrapper';
 * 
 * export default function ServerComponent() {
 *   return (
 *     <ButtonWrapper 
 *       variant="primary"
 *       onClick={() => console.log('Button clicked!')}
 *     >
 *       Click Me
 *     </ButtonWrapper>
 *   );
 * }
 */
const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  children,
  onClick,
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ButtonWrapper;
