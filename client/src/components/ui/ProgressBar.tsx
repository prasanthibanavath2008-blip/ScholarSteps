import React from 'react';
import { ReadinessScore } from '@shared/types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export interface ProgressBarProps {
  score: ReadinessScore;
  showDetails?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ score, showDetails = true, className = '' }) => {
  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-ink flex items-center gap-1.5">
          {score.isFullyReady ? (
            <CheckCircle2 className="w-4 h-4 text-success" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
          {score.label}
        </span>
        <span className="font-semibold text-ink font-mono">{score.percentage}%</span>
      </div>

      <div
        className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden border border-border/50"
        role="progressbar"
        aria-valuenow={score.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Application preparation readiness"
      >
        <div
          className={`h-full transition-progress ${
            score.isFullyReady ? 'bg-success' : 'bg-primary'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, score.percentage))}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex flex-col gap-1 text-xs text-ink-muted mt-1">
          <div className="flex justify-between items-center">
            <span>
              Required: {score.requiredCompleted}/{score.requiredTotal} marked ready
            </span>
            {score.optionalTotal > 0 && (
              <span>
                Optional: {score.optionalCompleted}/{score.optionalTotal}
              </span>
            )}
          </div>
          {score.hasUnknownApplicability && (
            <p className="flex items-center gap-1 text-warning text-xs mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Some requirements have unknown applicability and need your review.</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

