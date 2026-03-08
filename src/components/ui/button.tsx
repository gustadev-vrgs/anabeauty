import { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {}

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-xl bg-coffee-mocha px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coffee-hazelnut focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-caramel disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
}
