import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padded?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, interactive = false, padded = true, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-surface rounded-card border border-border shadow-card ${
          interactive
            ? 'transition-card hover:border-border-strong hover:shadow-raised cursor-pointer'
            : ''
        } ${padded ? 'p-5 sm:p-6' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

