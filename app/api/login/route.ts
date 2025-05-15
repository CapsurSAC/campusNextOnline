import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { email, contraseña } = await req.json();

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  }

  // ⚠️ Aquí deberías verificar contraseña con bcrypt.compare (si ya lo usas)

  // ✅ Incluye el nombre también
  const token = jwt.sign(
    {
      userId: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre, // 👈 Aquí va el nombre
      rol: usuario.rol,
    },
    SECRET,
    { expiresIn: '1h' }
  );

  cookies().set('token', token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60, // 1 hora
    sameSite: 'lax', // 👈 importante en local y producción
  });
console.log('🧪 Modo actual:', process.env.NODE_ENV);

  return NextResponse.json({ ok: true });
}
