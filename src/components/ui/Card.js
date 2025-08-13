'use client';

import clsx from 'clsx';

export function Card({ children, className, as: Comp = 'div', interactive = false, ...rest }) {
  return (
    <Comp
      className={clsx(
        'group relative rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm',
        interactive && 'transition hover:shadow-md',
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function CardHeader({ children, className }) {
  return <div className={clsx('px-6 pt-5 pb-3', className)}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={clsx('text-base font-semibold leading-tight tracking-wide text-foreground', className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }) {
  return <div className={clsx('px-6 pb-6 space-y-4 text-sm text-foreground/75', className)}>{children}</div>;
}

export default Card;
