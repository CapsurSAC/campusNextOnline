import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const usuarioId = parseInt(params.id);

    if (isNaN(usuarioId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const inscripciones = await prisma.inscripcion.findMany({
      where: { usuarioId },
      include: {
        curso: true
      }
    });

    return NextResponse.json(inscripciones);
  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}