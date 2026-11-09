import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Height & padding rules from SDD 14.5.6: Standard height: 48px (md), compact: 40px (sm), mobile primary/lg: 52px
    const sizeClasses = {
      sm: 'h-10 px-3.5 text-sm',
      md: 'h-12 px-5 text-base',
      lg: 'h-[52px] px-6 text-base font-semibold',
    }[size];

    const variantClasses = {
      primary:
        'bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed border border-transparent shadow-sm',
      secondary:
        'bg-surface text-ink border border-border hover:border-border-strong hover:bg-surface-muted/50 active:bg-surface-muted',
      tertiary:
        'bg-transparent text-ink-secondary hover:text-ink hover:bg-surface-muted/40 border border-transparent',
      destructive:
        'bg-danger-tint text-danger border border-danger/20 hover:bg-danger hover:text-white active:bg-danger',
      icon:
        'h-12 w-12 p-0 flex items-center justify-center bg-surface border border-border hover:border-border-strong text-ink-secondary hover:text-ink',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-medium rounded-control transition-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 inline-flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 inline-flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

