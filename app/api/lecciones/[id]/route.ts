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

    return NextResponse.json({ error: 'Error al actualizar lección' }, { status: 500 });
  }
}
