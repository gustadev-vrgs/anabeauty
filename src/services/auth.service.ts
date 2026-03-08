import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase/client';

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return signOut(auth);
}
