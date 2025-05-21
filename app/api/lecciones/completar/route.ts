import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const decoded: any = jwt.verify(token, SECRET);
    const { userId } = decoded;
    const { leccionId } = await req.json();

    // Buscar inscripción activa del usuario
    const inscripcion = await prisma.inscripcion.findFirst({
      where: { usuarioId: userId },
    });

    if (!inscripcion) {
      return NextResponse.json({ error: 'No estás inscrito en ningún curso' }, { status: 403 });
    }

    // Buscar si ya existe el progreso para esa lección
    const existente = await prisma.progresoLeccion.findFirst({
      where: {
        inscripcionId: inscripcion.id,
        leccionId,
      },
    });

    let progreso;

    if (existente) {
      progreso = await prisma.progresoLeccion.update({
        where: { id: existente.id },
        data: {
          completado: true,
          fechaCompletado: new Date(),
        },
      });
    } else {
      progreso = await prisma.progresoLeccion.create({
        data: {
          inscripcionId: inscripcion.id,
          leccionId,
          completado: true,
          fechaCompletado: new Date(),
        },
      });
    }

    return NextResponse.json({ ok: true, progreso });
  } catch (error) {
    console.error('Error al completar lección:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
