import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leccion = await prisma.leccion.findUnique({
      where: { id: Number(params.id) },
    });

    if (!leccion) {
      return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 });
    }

    return NextResponse.json(leccion);
  } catch (error) {
    return NextResponse.json({ error: 'Error al cargar lección' }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const leccionId = parseInt(params.id);

  try {
    await prisma.leccion.delete({
      where: { id: leccionId },
    });

    return NextResponse.json({ message: 'Lección eliminada' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar lección' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();

    const { titulo, contenido, disponible } = body;

    const leccion = await prisma.leccion.update({
      where: { id },
      data: {
        titulo,
        contenido,
        ...(disponible !== undefined && { disponible }), // solo actualiza si se pasa
      },
    });

    return NextResponse.json(leccion);
  } catch (err) {
    return NextResponse.json({ error: 'Error al actualizar lección' }, { status: 500 });
  }
}
