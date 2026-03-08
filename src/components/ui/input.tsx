import { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends ComponentPropsWithoutRef<'input'> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-coffee-cappuccino bg-white px-3 py-2 text-sm text-coffee-blackCoffee placeholder:text-coffee-hazelnut/70 focus:outline-none focus:ring-2 focus:ring-coffee-caramel',
        className,
      )}
      {...props}
    />
  );
}
