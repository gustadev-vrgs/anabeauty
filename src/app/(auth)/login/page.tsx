import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import { AUTH_SESSION_COOKIE } from '@/lib/auth-constants';

export default function LoginPage() {
  const isSessionActive = cookies().get(AUTH_SESSION_COOKIE)?.value === '1';

  if (isSessionActive) {
    redirect('/agenda');
  }

  return (
    <main className="safe-area-top safe-area-x flex min-h-dvh items-center justify-center bg-background px-3 py-6 sm:px-6 sm:py-8">
      <div className="w-full max-w-5xl pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden rounded-2xl border border-coffee-macchiato/70 bg-coffee-cappuccino/35 p-8 lg:block">
            <p className="text-sm uppercase tracking-[0.2em] text-coffee-espresso">Sistema de agendamentos</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-coffee-darkRoast">
              Gerencie sua agenda com praticidade.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-coffee-espresso">
              Acompanhe horários, clientes e serviços em um único lugar.
            </p>
          </section>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
