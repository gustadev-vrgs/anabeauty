import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { formFieldTextareaClass } from '@/components/ui/form-field';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, label, error, helperText, id, ...props },
  ref,
) {
  const textareaId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={textareaId} className="text-sm font-medium text-coffee-darkRoast">
          {label}
        </label>
      ) : null}

      <textarea
        id={textareaId}
        ref={ref}
        className={cn(
          formFieldTextareaClass,
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
