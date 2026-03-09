'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { authenticateUser } from '@/services/auth.service';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';

function getSafeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith('/')) {
    return '/agenda';
  }

  return nextPath;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = useMemo(() => getSafeNextPath(searchParams.get('next')), [searchParams]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(nextPath);
    }
  }, [authLoading, isAuthenticated, nextPath, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError('Informe e-mail e senha para continuar.');
      return;
    }

    setLoading(true);

    try {
      await authenticateUser(normalizedEmail, password);
      router.replace(nextPath);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Ocorreu um erro ao entrar.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-coffee-macchiato/80 bg-coffee-latte/95 p-5 shadow-elevated sm:p-8">
      <CardHeader className="mb-5 space-y-3 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-coffee-cappuccino/80 bg-white/70">
            <Image
              src="/images/favicon.png"
              alt="Logo Ana Beauty"
              width={44}
              height={44}
              priority
              className="h-full w-full object-contain"
            />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-coffee-espresso">Ana Beauty Agenda</p>
        </div>
        <CardTitle className="text-[1.75rem] leading-tight sm:text-3xl">Entrar no sistema</CardTitle>
        <CardDescription>Acesse sua agenda para gerenciar atendimentos.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="cliente@email.com"
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="••••••"
          />

          {error ? <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

          <Button type="submit" className="w-full bg-coffee-mocha text-coffee-cream hover:bg-coffee-espresso" disabled={loading || authLoading}>
            {loading || authLoading ? 'Entrando...' : 'Entrar'}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}
