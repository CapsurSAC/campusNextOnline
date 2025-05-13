2// app/api/cursos/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cursos = await prisma.curso.findMany();
    return NextResponse.json(cursos);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener cursos' }, { status: 500 });
  }
}
