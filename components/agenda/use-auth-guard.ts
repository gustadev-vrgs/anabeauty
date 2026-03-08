'use client';

import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/client';

export function useAuthGuard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (sessionUser) => {
      setUser(sessionUser);
      setLoading(false);
      if (!sessionUser) {
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function logout() {
    await signOut(auth);
    router.replace('/login');
  }

  return { user, loading, logout };
}
