import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border-border',
        success: 'border-transparent bg-[#89D89E]/20 text-[#a4f5b8] border border-[#89D89E]/30 dark:bg-[#89D89E]/20 dark:text-[#a4f5b8] dark:border-[#89D89E]/30',
        warning: 'border-transparent bg-[#f6be39]/20 text-[#f6be39] border border-[#f6be39]/30 dark:bg-[#f6be39]/20 dark:text-[#f6be39] dark:border-[#f6be39]/30',
        error: 'border-transparent bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30 dark:bg-[#ffb4ab]/20 dark:text-[#ffb4ab] dark:border-[#ffb4ab]/30',
        info: 'border-transparent bg-blue-500/20 text-blue-400 border border-blue-500/30',
        pending: 'border-transparent bg-[#f6be39]/20 text-[#f6be39] border border-[#f6be39]/30',
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
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
