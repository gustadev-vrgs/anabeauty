'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/servicos', label: 'Serviços' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full rounded-2xl border border-coffee-cappuccino bg-white/70 p-4 shadow-card md:sticky md:top-4 md:w-64 md:self-start">
      <p className="mb-4 text-lg font-semibold text-coffee-darkRoast">Ana Beauty</p>
      <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-coffee-mocha text-white' : 'bg-coffee-latte text-coffee-darkRoast hover:bg-coffee-cappuccino',
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
