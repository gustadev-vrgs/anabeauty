import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { formFieldSelectClass } from '@/components/ui/form-field';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, error, helperText, id, children, ...props },
  ref,
) {
  const selectId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-medium text-coffee-darkRoast">
          {label}
        </label>
      ) : null}

      <select
        id={selectId}
        ref={ref}
        className={cn(
          formFieldSelectClass,
          error ? 'border-destructive focus:border-destructive focus:ring-destructive/30' : '',
          className,
        )}
        {...props}
      >
        {children}
      </select>

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
});
