import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-4 md:flex-row md:items-start">
      <AppSidebar />
      <main className="w-full space-y-4">{children}</main>
    </div>
  );
}
