'use client';

import { useEffect } from 'react';
import clsx from 'clsx';

export function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (open) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md animate-in',
          sizes[size]
        )}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)]">
          <h3 className="text-sm font-medium text-[var(--color-foreground)]">{title}</h3>
          <button
            onClick={onClose}
            className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-[var(--color-border)]/60 transition"
            aria-label="Close modal"
          >
            <span className="text-base leading-none">×</span>
          </button>
        </div>
        <div className="p-5 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
