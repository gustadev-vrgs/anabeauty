import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase/client';

const FAKE_AUTH_DELAY_MS = 900;

function shouldUseMockAuth() {
  return !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';
}

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function loginWithEmail(email: string, password: string) {
  if (!auth) {
    throw new Error('Autenticação Firebase não configurada.');
  }

  return signInWithEmailAndPassword(auth, email, password);
}

export async function authenticateUser(email: string, password: string) {
  if (shouldUseMockAuth()) {
    await wait(FAKE_AUTH_DELAY_MS);

    if (password.length < 6) {
      throw new Error('A senha precisa ter ao menos 6 caracteres.');
    }

    return { provider: 'mock' as const, email };
  }

  try {
    const credential = await loginWithEmail(email, password);
    return { provider: 'firebase' as const, email: credential.user.email ?? email };
  } catch {
    throw new Error('Não foi possível entrar. Verifique e-mail e senha e tente novamente.');
  }
}

export async function logout() {
  if (!auth) {
    return;
  }

  return signOut(auth);
}
