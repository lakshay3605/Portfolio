import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BETA_MODE = process.env.NEXT_PUBLIC_BETA_MODE !== 'false';

export function middleware(request: NextRequest) {
  if (!BETA_MODE) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/ai') ||
    pathname.startsWith('/mission-control') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (pathname === '/' || pathname.startsWith('/choose') || pathname.startsWith('/portfolio')) {
    return NextResponse.redirect(new URL('/ai', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
