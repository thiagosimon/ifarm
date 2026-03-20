import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/15 text-primary',
        secondary: 'bg-secondary/15 text-secondary',
        success: 'bg-primary/15 text-primary',
        warning: 'bg-secondary/20 text-secondary',
        destructive: 'bg-error/15 text-error',
        outline: 'border border-outline-variant text-on-surface',
        pending: 'bg-[#4fc3f7]/15 text-[#4fc3f7]',
        active: 'bg-primary/20 text-primary',
        expired: 'bg-surface-container-highest text-on-surface-variant',
        disputed: 'bg-error/20 text-error',
        shipped: 'bg-[#7c4dff]/15 text-[#b388ff]',
        delivered: 'bg-primary/20 text-primary',
        preparing: 'bg-secondary/15 text-secondary',
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
