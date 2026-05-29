import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const evaluacionId = parseInt(params.id);
    
    if (isNaN(evaluacionId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const evaluacion = await prisma.evaluacion.findUnique({
      where: { id: evaluacionId },
      include: {
        preguntas: {
          orderBy: { orden: 'asc' }
        }
      }
    });

    if (!evaluacion) {
      return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 });
    }

    return NextResponse.json(evaluacion);
  } catch (error) {
    console.error('Error fetching evaluacion:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
