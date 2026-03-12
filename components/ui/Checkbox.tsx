'use client';

import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export default function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        'h-4 w-4 rounded border border-slate-200 text-orange-500 focus:ring-2 focus:ring-orange-200',
        className,
      )}
      {...props}
    />
  );
}
