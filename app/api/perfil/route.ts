import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: number };

    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        dni: true,
        idioma: true,
        nivel: true,
        metaSemanal: true,
        progreso: true,
        rol: true,
        fechaRegistro: true,
        ultimoAcceso: true,
      },
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ usuario });
  } catch (err) {
    return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: number };
    const body = await req.json();
    const { nombre, idioma, nivel, metaSemanal } = body;

    const actualizado = await prisma.usuario.update({
      where: { id: decoded.userId },
      data: {
        nombre,
        idioma,
        nivel,
        metaSemanal,
      },
    });

    return NextResponse.json({ usuario: actualizado });
  } catch (err: any) {
    console.error('Error en POST /api/perfil:', err);
    return NextResponse.json({ error: err.message || 'Error al actualizar' }, { status: 500 });
  }
}
