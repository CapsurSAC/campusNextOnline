import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const decoded: any = jwt.verify(token, SECRET);
    if (decoded.rol !== 'ADMIN') return NextResponse.json({ error: 'Prohibido' }, { status: 403 });

    const body = await req.json();
    const id = parseInt(params.id);

    const updated = await prisma.material.update({
      where: { id },
      data: {
        tipo: body.tipo,
        descripcion: body.descripcion,
        urlArchivo: body.urlArchivo,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error al actualizar material:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
