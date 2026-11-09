import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`bg-surface rounded-card border border-border p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      {icon ? (
        <div className="w-14 h-14 rounded-2xl bg-surface-muted flex items-center justify-center text-primary mb-4 border border-border/60">
          {icon}
        </div>
      ) : (
        <div className="w-14 h-14 rounded-2xl bg-surface-muted flex items-center justify-center text-primary mb-4 border border-border/60">
          <div className="w-6 h-6 border-2 border-primary border-dashed rounded-lg" />
        </div>
      )}

      <h3 className="font-card-title text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-secondary max-w-sm mb-6 leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

