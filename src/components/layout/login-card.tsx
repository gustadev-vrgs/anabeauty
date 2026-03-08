'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmail } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function LoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithEmail(email.trim(), password);
      router.push('/dashboard');
    } catch {
      setError('Não foi possível autenticar. Verifique e-mail e senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <h1 className="text-2xl font-bold text-coffee-darkRoast">Ana Beauty Agenda</h1>
      <p className="mt-1 text-sm text-coffee-espresso">Acesse sua área profissional.</p>
      <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
        <Input type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          type="password"
          required
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full">{loading ? 'Entrando...' : 'Entrar'}</Button>
      </form>
    </Card>
  );
}
