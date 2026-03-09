import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_SESSION_COOKIE } from '@/lib/auth-constants';

export default function HomePage() {
  const isSessionActive = cookies().get(AUTH_SESSION_COOKIE)?.value === '1';

  if (isSessionActive) {
    redirect('/agenda');
  }

  redirect('/login');
}
