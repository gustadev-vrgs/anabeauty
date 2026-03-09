import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { setAuthSessionCookie } from '@/lib/auth-session';

function mapAuthError(error: unknown) {
  if (error instanceof FirebaseError) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      return 'E-mail ou senha inválidos.';
    }

    if (error.code === 'auth/too-many-requests') {
      return 'Muitas tentativas de acesso. Aguarde alguns minutos e tente novamente.';
    }

    if (error.code === 'auth/network-request-failed') {
      return 'Sem conexão no momento. Verifique a internet e tente novamente.';
    }
  }

  return 'Não foi possível entrar agora. Tente novamente em instantes.';
}

export async function loginWithEmail(email: string, password: string) {
  if (!auth) {
    throw new Error('Autenticação Firebase não configurada.');
  }

  const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  setAuthSessionCookie(true);
  return credential;
}

export async function authenticateUser(email: string, password: string) {
  try {
    const credential = await loginWithEmail(email, password);
    return { provider: 'firebase' as const, email: credential.user.email ?? email };
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}

export async function logout() {
  if (!auth) {
    setAuthSessionCookie(false);
    return;
  }

  await signOut(auth);
  setAuthSessionCookie(false);
}
