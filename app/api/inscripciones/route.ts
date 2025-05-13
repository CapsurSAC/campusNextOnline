// app/api/inscripciones/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const inscripciones = await prisma.inscripcion.findMany({
      include: {
        usuario: true,
        curso: true,
      },
    });

    return NextResponse.json(inscripciones);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener inscripciones' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { usuarioId, cursoId } = body;

    const inscripcion = await prisma.inscripcion.create({
      data: {
        usuarioId,
        cursoId,
      },
    });

    return NextResponse.json(inscripcion);
  } catch (error) {
    return NextResponse.json({ error: 'Error al inscribir al usuario' }, { status: 500 });
  }
}
