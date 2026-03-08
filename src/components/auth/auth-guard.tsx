'use client';

import { type ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }

    router.replace(`/login?next=${encodeURIComponent(pathname || '/agenda')}`);
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center rounded-3xl border border-coffee-cappuccino/60 bg-coffee-latte/70 text-coffee-espresso">
        Validando autenticação...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
