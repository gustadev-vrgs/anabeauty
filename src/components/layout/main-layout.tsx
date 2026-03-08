import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-white pb-[max(5.5rem,env(safe-area-inset-bottom))] md:pb-10">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-3 py-4 sm:p-7 md:flex-row md:items-start md:gap-8 md:p-8 lg:p-10">
        <AppSidebar />

        <div className="w-full space-y-5">
          <header className="sticky top-2 z-30 rounded-2xl border border-coffee-cappuccino/70 bg-coffee-latte/45 px-5 py-4 shadow-card backdrop-blur sm:top-3 md:top-6 md:px-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee-espresso">Sistema</p>
                <p className="text-base font-semibold text-coffee-darkRoast">Agenda em foco</p>
              </div>
              <div className="rounded-full border border-coffee-cappuccino/70 bg-white px-3 py-1 text-xs font-medium text-coffee-espresso">Modo autenticado</div>
            </div>
          </header>

          <main className="rounded-3xl border border-coffee-cappuccino/65 bg-white p-5 shadow-card sm:p-7 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
