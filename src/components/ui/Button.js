'use client';

import clsx from 'clsx';

/**
 * Reusable button component with variants + sizes.
 */
export function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  loading = false,
  disabled,
  ...rest
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2';

  const sizes = {
    xs: 'text-xs px-2.5 py-1.5',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  const variants = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm',
  outline: 'border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]/40 dark:hover:bg-white/5',
  ghost: 'text-[var(--color-foreground)] hover:bg-[var(--color-border)]/60 dark:hover:bg-white/5',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
  };

  return (
    <Comp
      className={clsx(base, sizes[size], variants[variant], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      <span className={clsx(loading && 'opacity-80')}>{children}</span>
    </Comp>
  );
}

export default Button;
