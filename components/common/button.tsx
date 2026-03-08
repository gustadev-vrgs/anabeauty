import { ButtonHTMLAttributes } from 'react';

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-xl bg-coffee-mocha px-4 py-2 text-sm font-semibold text-white transition hover:bg-coffee-hazelnut disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}
