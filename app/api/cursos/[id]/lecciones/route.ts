// app/api/cursos/[id]/lecciones/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const cursoId = parseInt(params.id);

  try {
    const lecciones = await prisma.leccion.findMany({
      where: { cursoId },
      orderBy: { orden: 'asc' },
    });

    return NextResponse.json(lecciones);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener lecciones' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const cursoId = parseInt(params.id);
  const body = await req.json();
  const { titulo, contenido, tipo, orden } = body;

  try {
    const nuevaLeccion = await prisma.leccion.create({
      data: {
        cursoId,
        titulo,
        contenido,
        orden,
      },
    });

    return NextResponse.json(nuevaLeccion);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear lección' }, { status: 500 });
  }
}
