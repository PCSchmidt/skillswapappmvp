import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const stackVariants = cva(
  'flex',
  {
    variants: {
      direction: {
        row: 'flex-row',
        col: 'flex-col',
      },
      spacing: {
        none: 'gap-0',
        xs: 'gap-1', // 4px
        sm: 'gap-2', // 8px
        md: 'gap-4', // 16px
        lg: 'gap-6', // 24px
        xl: 'gap-8', // 32px
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
      },
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      },
      wrap: {
        true: 'flex-wrap',
        false: 'flex-nowrap',
      },
    },
    defaultVariants: {
      direction: 'col',
      spacing: 'md',
      justify: 'start',
      align: 'stretch',
      wrap: false,
    },
  }
);

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  asChild?: boolean;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction, spacing, justify, align, wrap, asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'div' : 'div'; // Can be extended with Slot from @radix-ui/react-slot if needed
    return (
      <Comp
        className={cn(stackVariants({ direction, spacing, justify, align, wrap }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Stack.displayName = 'Stack';

export { Stack, stackVariants };
