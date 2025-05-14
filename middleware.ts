// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'clave_super_secreta'; // Asegúrate de definirla bien en producción

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rutas públicas
  const isPublic = pathname === '/login' || pathname === '/registro' || pathname.startsWith('/api');
  if (isPublic) return NextResponse.next();

  // Obtener token de cookie
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = jwt.verify(token, SECRET); // 👈 Verifica firma y expiración
    // Puedes usar `decoded` si quieres pasar info a headers, etc.
    return NextResponse.next();
  } catch (err) {
    console.warn('Token inválido:', err);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|fonts|api).*)'],
};
