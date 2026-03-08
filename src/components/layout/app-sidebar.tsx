'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { logout } from '@/services/auth.service';

const links = [
  { href: '/agenda', label: 'Agenda' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/servicos', label: 'Serviços' },
  { href: '/dashboard', label: 'Dashboard' },
];

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <>
      <aside className="hidden w-72 shrink-0 rounded-3xl border border-coffee-cappuccino/70 bg-coffee-latte/80 p-5 shadow-card backdrop-blur md:sticky md:top-6 md:block md:max-h-[calc(100vh-3rem)]">
        <div className="mb-8 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coffee-espresso">Painel</p>
          <h2 className="text-xl font-semibold text-coffee-darkRoast">Ana Beauty</h2>
          <p className="text-sm text-coffee-espresso">Gestão de agendamentos</p>
        </div>

        <nav className="space-y-2" aria-label="Navegação principal">
          {links.map((link) => {
            const isActive = isPathActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'border-coffee-mocha bg-coffee-mocha text-white shadow-[0_8px_20px_rgba(168,111,71,0.35)]'
                    : 'border-transparent bg-white/70 text-coffee-darkRoast hover:border-coffee-cappuccino hover:bg-white',
                )}
              >
                <span>{link.label}</span>
                <span
                  className={cn(
                    'h-2 w-2 rounded-full transition-colors',
                    isActive ? 'bg-coffee-latte' : 'bg-coffee-cappuccino group-hover:bg-coffee-macchiato',
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <Button variant="secondary" className="mt-6 w-full" onClick={() => void handleLogout()}>
          Sair
        </Button>
      </aside>

      <nav className="safe-area-bottom safe-area-x fixed inset-x-2 bottom-2 z-50 rounded-2xl border border-coffee-cappuccino/70 bg-coffee-latte/95 p-2 shadow-elevated backdrop-blur md:hidden" aria-label="Navegação mobile">
        <div className="grid grid-cols-4 gap-2">
          {links.map((link) => {
            const isActive = isPathActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'min-h-11 rounded-xl px-2 py-2.5 text-center text-xs font-semibold transition-colors',
                  isActive ? 'bg-coffee-mocha text-white' : 'text-coffee-darkRoast hover:bg-white/90',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
