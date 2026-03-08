import { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-coffee-cappuccino bg-white px-3 py-2 text-sm outline-none ring-coffee-mocha transition focus:ring-2 ${className}`}
      {...props}
    />
  );
}
