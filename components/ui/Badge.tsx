'use client';

import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'purple' | 'blue' | 'green' | 'gray' | 'yellow' | 'red';
};

export default function Badge({
  className,
  variant = 'gray',
  ...props
}: BadgeProps) {
  const styles: Record<typeof variant, string> = {
    purple: 'bg-purple-100 text-purple-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-700',
    gray: 'bg-slate-100 text-slate-600',
    yellow: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
