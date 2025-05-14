import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, contraseña } = await req.json();

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  const match = await bcrypt.compare(contraseña, usuario.contraseña);

  if (!match) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  // Generar JWT
  const token = jwt.sign(
    {
      id: usuario.id,
      rol: usuario.rol,
      email: usuario.email,
    },
    process.env.JWT_SECRET!, // debe estar en tu .env
    { expiresIn: '1h' }
  );

  return NextResponse.json({ token });
}
