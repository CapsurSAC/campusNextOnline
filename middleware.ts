import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1];

  // Rutas que requieren login
  const isProtected = request.nextUrl.pathname.startsWith('/') ||
                      request.nextUrl.pathname.startsWith('/perfil') ||
                      request.nextUrl.pathname.startsWith('/lecciones') ||
                         request.nextUrl.pathname.startsWith('/musica') ||
                            request.nextUrl.pathname.startsWith('/sonidos') ||
                      request.nextUrl.pathname.startsWith('/evaluaciones');

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/perfil/:path*',
    '/lecciones/:path*',
    '/evaluaciones/:path*',
  ],
};
