import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest, { params }: { params: { moduloId: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const decoded: any = jwt.verify(token, SECRET);
    const userId = decoded.userId;
    const { moduloId } = params;

    const inscripcion = await prisma.inscripcion.findFirst({
      where: { usuarioId: userId },
    });

    if (!inscripcion) {
      return NextResponse.json({ progreso: 0 });
    }

    const totalLecciones = await prisma.leccion.count({
      where: { cursoId: Number(moduloId) },
    });

    const completadas = await prisma.progresoLeccion.count({
      where: {
        inscripcionId: inscripcion.id,
        completado: true,
        leccion: {
          cursoId: Number(moduloId),
        },
      },
    });

    const progreso = totalLecciones === 0 ? 0 : Math.round((completadas / totalLecciones) * 100);

    return NextResponse.json({ progreso });
  } catch (error) {
    console.error('Error al obtener progreso del módulo:', error);
    return NextResponse.json({ progreso: 0 });
  }
}
