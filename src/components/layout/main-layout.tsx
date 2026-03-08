import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#f9f3ec] pb-[max(5.5rem,env(safe-area-inset-bottom))] md:pb-8">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-3 py-3 sm:p-6 md:flex-row md:items-start md:gap-6 md:p-6 lg:p-8">
        <AppSidebar />

        <div className="w-full space-y-4">
          <header className="sticky top-2 z-30 rounded-2xl border border-coffee-cappuccino/70 bg-coffee-latte/85 px-4 py-3 shadow-card backdrop-blur sm:top-3 md:top-6 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee-espresso">Sistema</p>
                <p className="text-base font-semibold text-coffee-darkRoast">Agenda em foco</p>
              </div>
              <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-coffee-espresso">Modo autenticado</div>
            </div>
          </header>

          <main className="rounded-3xl border border-coffee-cappuccino/70 bg-white/75 p-4 shadow-card backdrop-blur sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
