import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, helperText, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-coffee-darkRoast">
          {label}
        </label>
      ) : null}

      <input
        id={inputId}
        ref={ref}
        className={cn(
          'h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150',
          'focus:border-coffee-mocha focus:outline-none focus:ring-2 focus:ring-coffee-latte',
          error ? 'border-destructive focus:border-destructive focus:ring-destructive/30' : '',
          className,
        )}
        {...props}
      />

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
});
