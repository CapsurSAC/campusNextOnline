import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const inscripciones = await prisma.inscripcion.findMany({
      include: {
        curso: {
          select: {
            id: true,
            titulo: true, // ✅ correcto según tu modelo
            imagenPortada: true,
            duracionHoras: true,
            categoria: true
          }
        }
      }
    });

    const cursos = inscripciones.map((i) => i.curso); // ahora ya incluye curso correctamente
    return NextResponse.json({ cursos });
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
    return NextResponse.json({ error: 'Error al obtener inscripciones' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { usuarioId, cursoId } = body;

    const inscripcion = await prisma.inscripcion.create({
      data: {
        usuarioId,
        cursoId,
      },
    });

    return NextResponse.json(inscripcion);
  } catch (error) {
    console.error("Error al inscribir al usuario:", error);
    return NextResponse.json({ error: 'Error al inscribir al usuario' }, { status: 500 });
  }
}
