import React from 'react';
import { CheckCircle2, HelpCircle, XCircle, Clock, ShieldCheck, Bookmark, AlertTriangle, Sparkles } from 'lucide-react';

export type BadgeVariant =
  | 'potential-match'
  | 'need-info'
  | 'no-match'
  | 'open'
  | 'closed'
  | 'review-due'
  | 'official-source'
  | 'saved'
  | 'synthetic'
  | 'neutral';

export interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, label, className = '' }) => {
  const configs: Record<BadgeVariant, { defaultLabel: string; bg: string; text: string; icon: React.ReactNode }> = {
    'potential-match': {
      defaultLabel: 'Potential match',
      bg: 'bg-primary-tint border border-primary/20',
      text: 'text-primary',
      icon: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    'need-info': {
      defaultLabel: 'More information needed',
      bg: 'bg-warning-tint border border-warning/20',
      text: 'text-warning',
      icon: <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    'no-match': {
      defaultLabel: 'Does not match checked criteria',
      bg: 'bg-danger-tint border border-danger/20',
      text: 'text-danger',
      icon: <XCircle className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    'open': {
      defaultLabel: 'Open cycle',
      bg: 'bg-success-tint border border-success/20',
      text: 'text-success',
      icon: <Clock className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    'closed': {
      defaultLabel: 'Cycle closed',
      bg: 'bg-surface-muted border border-border',
      text: 'text-ink-muted',
      icon: <Clock className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    'review-due': {
      defaultLabel: 'Review due',
      bg: 'bg-warning-tint border border-warning/20',
      text: 'text-warning',
      icon: <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    'official-source': {
      defaultLabel: 'Official source linked',
      bg: 'bg-info-tint border border-info/20',
      text: 'text-info',
      icon: <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    'saved': {
      defaultLabel: 'Saved on this browser',
      bg: 'bg-surface-muted border border-border',
      text: 'text-ink-secondary',
      icon: <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    'synthetic': {
      defaultLabel: 'Synthetic demonstration fixture',
      bg: 'bg-warning-tint/80 border border-warning/30',
      text: 'text-warning font-semibold',
      icon: <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    'neutral': {
      defaultLabel: '',
      bg: 'bg-surface-muted border border-border',
      text: 'text-ink-secondary',
      icon: null,
    },
  };

  const config = configs[variant] || configs.neutral;
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      {config.icon}
      <span>{displayLabel}</span>
    </span>
  );
};

