import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AUTH_SESSION_COOKIE } from '@/lib/auth-constants';

const PRIVATE_PATHS = ['/agenda', '/clientes', '/servicos'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = PRIVATE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  const hasSessionCookie = request.cookies.get(AUTH_SESSION_COOKIE)?.value === '1';

  if (hasSessionCookie) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/agenda/:path*', '/clientes/:path*', '/servicos/:path*'],
};
