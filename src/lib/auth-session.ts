import { AUTH_SESSION_COOKIE } from '@/lib/auth-constants';

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

function isSecureContext() {
  if (typeof window === 'undefined') {
    return true;
  }

  return window.location.protocol === 'https:';
}

export function setAuthSessionCookie(isAuthenticated: boolean) {
  if (typeof document === 'undefined') {
    return;
  }

  const secureFlag = isSecureContext() ? '; Secure' : '';

  if (isAuthenticated) {
    document.cookie = `${AUTH_SESSION_COOKIE}=1; Path=/; Max-Age=${ONE_DAY_IN_SECONDS}; SameSite=Lax${secureFlag}`;
    return;
  }

  document.cookie = `${AUTH_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secureFlag}`;
}
