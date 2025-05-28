import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: number };

    const inscripciones = await prisma.inscripcion.findMany({
      where: {
        usuarioId: decoded.userId,
      },
      include: {
        curso: {
          select: {
            id: true,
            titulo: true,
            descripcion: true,
            imagenPortada: true,
            duracionHoras: true,
            categoria: true,
            estado: true,
          }
        }
      }
    });

    // Extraer solo los cursos
    const cursos = inscripciones.map((i) => i.curso);

    return NextResponse.json({ cursos });
  } catch (error) {
    console.error("Error al obtener los cursos del usuario:", error);
    return NextResponse.json({ error: 'Error al obtener cursos' }, { status: 500 });
  }
}
