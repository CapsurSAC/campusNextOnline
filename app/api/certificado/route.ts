import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { generarCertificado } from '@/app/utils/generarCertificado';

const SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    // 🧠 Obtener el token desde las cookies
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // 🔐 Decodificar el token para obtener el ID del usuario
    const payload = jwt.verify(token, SECRET) as { userId: number };

    // 🧩 Buscar la inscripción más reciente de ese usuario
    const inscripcion = await prisma.inscripcion.findFirst({
      where: { usuarioId: payload.userId },
      orderBy: { fechaInscripcion: 'desc' },
    });

    if (!inscripcion) {
      return NextResponse.json({ error: 'No se encontró inscripción para este usuario' }, { status: 404 });
    }

    // 📄 Generar el certificado con esa inscripción
    const pdf = await generarCertificado(inscripcion.id);

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=certificado.pdf',
      },
    });
  } catch (error: any) {
    console.error('❌ Error al generar certificado:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}