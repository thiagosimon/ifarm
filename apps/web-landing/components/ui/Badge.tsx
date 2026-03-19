import React from 'react'

type BadgeVariant = 'active' | 'coming-soon' | 'roadmap'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  active: 'bg-ifarm-primary-fixed text-ifarm-primary font-semibold',
  'coming-soon': 'bg-ifarm-secondary-container text-ifarm-secondary font-semibold',
  roadmap:
    'bg-transparent border border-ifarm-outline-variant text-ifarm-on-surface-variant font-medium',
}

export default function Badge({ variant = 'active', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-pill text-xs ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
