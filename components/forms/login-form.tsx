'use client';

import { FormEvent, useMemo, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/client';
import { Card } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isDisabled = useMemo(() => !email || !password || loading, [email, password, loading]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push('/agenda');
    } catch {
      setError('Não foi possível entrar. Verifique e-mail e senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <h1 className="mb-2 text-2xl font-bold text-coffee-darkRoast">Ana Beauty Agenda</h1>
      <p className="mb-6 text-sm text-coffee-espresso">Acesse sua agenda profissional.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-coffee-darkRoast">
          E-mail
          <Input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm font-medium text-coffee-darkRoast">
          Senha
          <Input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={isDisabled} className="w-full py-3 text-base">
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </Card>
  );
}
