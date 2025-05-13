import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1]; // Formato: Bearer TOKEN

  if (!token) {
    return NextResponse.json({ error: 'Token requerido' }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
  }

  // Validar rol ADMIN
  if (payload.rol !== 'ADMIN') {
    return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 });
  }

  return NextResponse.json({
    mensaje: 'Bienvenido, admin.',
    usuario: payload
  });
}
