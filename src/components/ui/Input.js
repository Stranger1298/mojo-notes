'use client';

import clsx from 'clsx';
import { useId } from 'react';

export function Input({ label, className, error, hint, type = 'text', ...rest }) {
  const id = useId();
  return (
    <div className={clsx('group relative', className)}>
      {label && (
        <label
          htmlFor={id}
          className={clsx(
            'block text-xs font-medium mb-1 tracking-wide uppercase text-foreground/70'
          )}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={clsx(
          'w-full rounded-md bg-white/70 dark:bg-white/5 border border-border/60 dark:border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 shadow-sm backdrop-blur-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400',
          error && 'border-rose-500 focus:ring-rose-400/50 focus:border-rose-500'
        )}
        {...rest}
      />
      {hint && !error && <p className="mt-1 text-[11px] text-foreground/50">{hint}</p>}
      {error && <p className="mt-1 text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}

export function Textarea({ label, className, error, hint, rows = 4, ...rest }) {
  const id = useId();
  return (
    <div className={clsx('group relative', className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium mb-1 tracking-wide uppercase text-foreground/70"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={clsx(
          'w-full resize-none rounded-md bg-white/70 dark:bg-white/5 border border-border/60 dark:border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 shadow-sm backdrop-blur-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400',
          error && 'border-rose-500 focus:ring-rose-400/50 focus:border-rose-500'
        )}
        {...rest}
      />
      {hint && !error && <p className="mt-1 text-[11px] text-foreground/50">{hint}</p>}
      {error && <p className="mt-1 text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}

export default Input;
