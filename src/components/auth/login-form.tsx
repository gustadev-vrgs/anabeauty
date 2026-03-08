'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authenticateUser } from '@/services/auth.service';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authenticateUser(email, password);
      router.push('/agenda');
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Ocorreu um erro ao entrar.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-coffee-macchiato/80 bg-coffee-latte/95 p-5 shadow-elevated sm:p-8">
      <CardHeader className="mb-5 space-y-2 sm:mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-coffee-espresso">Ana Beauty Agenda</p>
        <CardTitle className="text-[1.75rem] leading-tight sm:text-3xl">Faça seu login</CardTitle>
        <CardDescription>Entre para gerenciar seus agendamentos com praticidade e elegância.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="h-12 text-base"
          />

          <Input
            label="Senha"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-12 text-base"
            helperText="Use no mínimo 6 caracteres."
          />

          {error ? (
            <p className="rounded-xl border border-coffee-caramel/70 bg-coffee-cappuccino/40 px-3 py-2 text-sm text-coffee-darkRoast">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="h-12 w-full text-base" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="text-center">
          <Link href="#" className="text-sm text-coffee-espresso underline-offset-4 hover:underline">
            Esqueci minha senha
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
