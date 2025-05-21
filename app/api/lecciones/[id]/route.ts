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
