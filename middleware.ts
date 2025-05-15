import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/registro'];
const STATIC_EXTENSIONS = ['.webm', '.webp', '.jpg', '.png', '.css', '.js', '.ico', '.svg'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isPublic = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const isStatic = STATIC_EXTENSIONS.some(ext => pathname.endsWith(ext));

  if (isPublic || pathname.startsWith('/api') || pathname.startsWith('/_next') || isStatic) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  // ⚠️ En vez de verificar el token aquí...
  // Solo verifica su existencia para no romper render
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
