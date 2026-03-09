'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { AUTH_SESSION_COOKIE } from '@/lib/auth-constants';
import { setAuthSessionCookie } from '@/lib/auth-session';

export { AUTH_SESSION_COOKIE };

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setAuthSessionCookie(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
      setAuthSessionCookie(Boolean(nextUser));
    });

    return unsubscribe;
  }, []);

  return { user, loading, isAuthenticated: Boolean(user) };
}
