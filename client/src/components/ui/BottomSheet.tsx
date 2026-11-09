import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-ink/40 sm:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        className="relative z-10 w-full max-h-[85vh] bg-surface rounded-t-panel border-t border-border shadow-raised flex flex-col animate-sheet-up overflow-hidden"
      >
        <div className="w-12 h-1.5 bg-border rounded-full mx-auto my-3 shrink-0" />
        <div className="px-5 pb-4 border-b border-border flex items-center justify-between">
          <h2 className="font-card-title text-ink text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-muted hover:text-ink rounded-lg hover:bg-surface-muted transition-colors cursor-pointer"
            aria-label="Close sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">{children}</div>

        {footer && <div className="p-4 bg-surface-muted/50 border-t border-border">{footer}</div>}
      </div>
    </div>
  );
};

