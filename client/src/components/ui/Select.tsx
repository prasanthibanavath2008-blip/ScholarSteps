import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, helperText, error, id, className = '', ...props }, ref) => {
    const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <label htmlFor={selectId} className="font-label text-ink select-none">
          {label}
          {props.required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
        </label>

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            aria-invalid={Boolean(error)}
            className={`w-full h-12 appearance-none rounded-control bg-surface border ${
              error ? 'border-danger focus:border-danger' : 'border-border hover:border-border-strong focus:border-focus'
            } px-3.5 pr-10 text-ink text-base focus:outline-none focus:ring-2 ${
              error ? 'focus:ring-danger/20' : 'focus:ring-focus/20'
            } transition-colors cursor-pointer ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 w-4 h-4 text-ink-muted pointer-events-none" />
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

Select.displayName = 'Select';

