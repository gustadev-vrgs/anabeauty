import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-6">
      <div className="w-full max-w-5xl">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden rounded-2xl border border-coffee-macchiato/70 bg-coffee-cappuccino/35 p-8 lg:block">
            <p className="text-sm uppercase tracking-[0.2em] text-coffee-espresso">Sistema de agendamentos</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-coffee-darkRoast">
              Acolha suas clientes com uma rotina mais organizada.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-coffee-espresso">
              Controle horários, acompanhe atendimentos e mantenha seu dia produtivo com uma experiência visual
              elegante, profissional e confortável.
            </p>
          </section>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
