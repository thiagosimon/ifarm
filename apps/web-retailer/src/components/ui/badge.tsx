import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-700',
        secondary: 'bg-secondary-100 text-secondary-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        destructive: 'bg-destructive-100 text-destructive-700',
        outline: 'border border-border text-foreground',
        pending: 'bg-blue-100 text-blue-700',
        active: 'bg-emerald-100 text-emerald-700',
        expired: 'bg-gray-100 text-gray-500',
        disputed: 'bg-red-100 text-red-700',
        shipped: 'bg-indigo-100 text-indigo-700',
        delivered: 'bg-teal-100 text-teal-700',
        preparing: 'bg-amber-100 text-amber-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
