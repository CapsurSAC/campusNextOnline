// app/api/lecciones/[id]/materiales/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const leccionId = parseInt(params.id);

    const materiales = await prisma.material.findMany({
      where: { leccionId },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json(materiales);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener materiales' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const leccionId = parseInt(params.id);
    const { tipo, descripcion, urlArchivo } = await req.json();

    if (!tipo || !descripcion || !urlArchivo) {
      return NextResponse.json({ error: 'Campos incompletos' }, { status: 400 });
    }

    const material = await prisma.material.create({
      data: {
        leccionId,
        tipo,
        descripcion,
        urlArchivo,
      },
    });

    return NextResponse.json(material);
  } catch (error) {
    console.error('❌ Error al crear material:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
