import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
export async function GET() {
  try {
    const cursos = await prisma.curso.findMany({
      include: {
        inscripciones: {
          select: {
            usuarioId: true,
          },
        },
      },
    });

    const cursosFormateados = cursos.map(curso => ({
      id: curso.id,
      nombre: curso.titulo,
      descripcion: curso.descripcion,
      imagen: curso.imagenPortada,
      inscritos: curso.inscripciones.map(i => i.usuarioId),
    }));

    return NextResponse.json(cursosFormateados); // 👈 JSON siempre válido
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    return NextResponse.json([], { status: 200 }); // 👈 Devuelve array vacío si falla
  }
}
export async function POST(req: NextRequest) {
  try {
    console.log('➡️ ENTRANDO A POST /api/cursos');

    const { nombre, descripcion, imagen } = await req.json();
    console.log('📝 BODY:', { nombre, descripcion, imagen });

    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    console.log('🍪 TOKEN:', token);

    const user = token ? verifyToken(token) : null;
    console.log('👤 USER:', user);

    if (!user || user.rol !== 'ADMIN') {
      console.log('❌ NO AUTORIZADO');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (!nombre || !descripcion || !imagen) {
      console.log('⚠️ FALTAN CAMPOS');
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    const nuevoCurso = await prisma.curso.create({
      data: {
        titulo: nombre,
        descripcion,
        imagenPortada: imagen,
        categoria: 'General',
        duracionHoras: 8,
        estado: 'ACTIVO',
        inscripciones: {
          create: [{ usuarioId: user.id }],
        },
      },
    });

    console.log('✅ CURSO CREADO:', nuevoCurso);

    return NextResponse.json({
      id: nuevoCurso.id,
      nombre: nuevoCurso.titulo,
      descripcion: nuevoCurso.descripcion,
      imagen: nuevoCurso.imagenPortada,
      inscritos: [user.id],
    });
  } catch (error) {
    console.error('🔥 ERROR:', error);
    return NextResponse.json({ error: 'Error al crear el curso' }, { status: 500 });
  }
}
