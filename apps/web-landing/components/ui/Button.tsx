import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  className?: string
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  'aria-label'?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-ifarm-primary text-white hover:bg-ifarm-primary-container active:bg-ifarm-primary-container focus-visible:ring-2 focus-visible:ring-ifarm-primary focus-visible:ring-offset-2',
  secondary:
    'bg-ifarm-secondary-container text-ifarm-secondary hover:bg-[#FFD070] active:bg-[#FFD070] focus-visible:ring-2 focus-visible:ring-ifarm-secondary focus-visible:ring-offset-2',
  ghost:
    'border border-ifarm-primary text-ifarm-primary bg-transparent hover:bg-ifarm-surface-low active:bg-ifarm-surface-container focus-visible:ring-2 focus-visible:ring-ifarm-primary focus-visible:ring-offset-2',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm font-medium',
  md: 'px-6 py-3 text-base font-semibold',
  lg: 'px-8 py-4 text-lg font-semibold',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  onClick,
  href,
  type = 'button',
  disabled = false,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-pill transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed'
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
