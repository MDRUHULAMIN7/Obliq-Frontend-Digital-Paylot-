'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  iconRight?: ReactNode;
  onIconClick?: () => void;
};

export default function Input({
  className,
  iconRight,
  onIconClick,
  ...props
}: InputProps) {
  return (
    <div className="relative">
      <input
        className={cn(
          'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100',
          iconRight ? 'pr-10' : '',
          className,
        )}
        {...props}
      />
      {iconRight ? (
        <button
          type="button"
          onClick={onIconClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500"
        >
          {iconRight}
        </button>
      ) : null}
    </div>
  );
}
