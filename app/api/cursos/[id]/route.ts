import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { nombre, descripcion, imagen } = body;

    const cursoActualizado = await prisma.curso.update({
      where: {
        id: Number(params.id),
      },
      data: {
        titulo: nombre,
        descripcion,
        imagenPortada: imagen,
      },
    });

    return NextResponse.json(cursoActualizado);
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    return NextResponse.json({ error: 'No se pudo actualizar el curso' }, { status: 500 });
  }
}
