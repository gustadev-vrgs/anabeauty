import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AUTH_SESSION_COOKIE } from '@/lib/auth-constants';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const isSessionActive = cookies().get(AUTH_SESSION_COOKIE)?.value === '1';

  if (!isSessionActive) {
    redirect('/login');
  }

  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}
