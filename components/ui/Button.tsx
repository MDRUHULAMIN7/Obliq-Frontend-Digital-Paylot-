'use client';

import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
};

export default function Button({
  className,
  variant = 'primary',
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants: Record<typeof variant, string> = {
    primary:
      'bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-600 hover:to-orange-500',
    outline:
      'border border-orange-200 text-orange-700 hover:border-orange-300 hover:bg-orange-50',
    ghost: 'text-orange-600 hover:bg-orange-50',
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
}
