import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="w-full max-w-lg bg-surface rounded-panel border border-border shadow-raised overflow-hidden animate-fade-in focus:outline-none flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-border flex items-start justify-between gap-4">
          <div>
            <h2 id="modal-title" className="font-card-title text-ink">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="text-sm text-ink-secondary mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-muted hover:text-ink rounded-lg hover:bg-surface-muted transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">{children}</div>

        {footer && <div className="p-4 sm:p-6 bg-surface-muted/50 border-t border-border flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};

