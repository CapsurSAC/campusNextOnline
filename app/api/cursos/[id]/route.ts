import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const cursoId = parseInt(params.id);

  try {
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId },
      include: {
        lecciones: true,
        evaluaciones: true,
        inscripciones: true,
      },
    });

    if (!curso) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    return NextResponse.json(curso);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener el curso' }, { status: 500 });
  }
}
