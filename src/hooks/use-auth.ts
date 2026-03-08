'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/firebase/client';

export const AUTH_SESSION_COOKIE = 'ab_session';

function writeSessionCookie(isAuthenticated: boolean) {
  if (typeof document === 'undefined') {
    return;
  }

  if (isAuthenticated) {
    document.cookie = `${AUTH_SESSION_COOKIE}=1; Path=/; Max-Age=86400; SameSite=Lax; Secure`;
    return;
  }

  document.cookie = `${AUTH_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax; Secure`;
}

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      writeSessionCookie(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
      writeSessionCookie(Boolean(nextUser));
    });

    return unsubscribe;
  }, []);

  return { user, loading, isAuthenticated: Boolean(user) };
}
