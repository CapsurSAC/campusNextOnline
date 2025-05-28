// app/api/lecciones/[id]/route.ts
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
  try {
    await prisma.leccion.delete({
      where: { id: Number(params.id) },
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
    const id = Number(params.id);
    const body = await req.json();
    const data: {
      titulo?: string;
      contenido?: string;
      disponible?: boolean;
    } = {};

    if (typeof body.titulo === 'string') data.titulo = body.titulo;
    if (typeof body.contenido === 'string') data.contenido = body.contenido;
    if (typeof body.disponible === 'boolean') data.disponible = body.disponible;

    const leccion = await prisma.leccion.update({
      where: { id },
      data,
    });

    return NextResponse.json(leccion);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar lección' }, { status: 500 });
  }
}
