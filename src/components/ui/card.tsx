import { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends ComponentPropsWithoutRef<'div'> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-coffee-cappuccino bg-white/80 p-5 shadow-card backdrop-blur supports-[backdrop-filter]:bg-white/70',
        className,
      )}
      {...props}
    />
  );
}
