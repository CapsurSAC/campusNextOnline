import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const lecciones = await prisma.leccion.findMany({
    select: {
      id: true,
      titulo: true,
    },
    orderBy: { id: 'asc' },
  });

  return NextResponse.json(lecciones);
}
