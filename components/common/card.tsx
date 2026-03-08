import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <section className={`rounded-3xl bg-white p-4 shadow-card sm:p-6 ${className}`}>{children}</section>;
}
