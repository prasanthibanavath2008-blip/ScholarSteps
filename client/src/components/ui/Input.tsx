import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, id, className = '', ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <label htmlFor={inputId} className="font-label text-ink select-none">
          {label}
          {props.required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
        </label>

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-ink-muted pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            aria-invalid={Boolean(error)}
            className={`w-full h-12 rounded-control bg-surface border ${
              error ? 'border-danger focus:border-danger' : 'border-border hover:border-border-strong focus:border-focus'
            } ${leftIcon ? 'pl-10' : 'px-3.5'} pr-3.5 text-ink text-base placeholder:text-ink-muted focus:outline-none focus:ring-2 ${
              error ? 'focus:ring-danger/20' : 'focus:ring-focus/20'
            } transition-colors ${className}`}
            {...props}
          />
        </div>

        {error ? (
          <p id={errorId} className="flex items-center gap-1.5 text-sm text-danger mt-0.5">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-ink-muted mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

