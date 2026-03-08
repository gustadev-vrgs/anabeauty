import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PRIVATE_PATHS = ['/agenda', '/clientes', '/servicos', '/dashboard'];
const AUTH_SESSION_COOKIE = 'ab_session';

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
  matcher: ['/agenda/:path*', '/clientes/:path*', '/servicos/:path*', '/dashboard/:path*'],
};
