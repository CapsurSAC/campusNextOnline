import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    console.log('✅ Entrando a /api/evaluaciones/intentos');

    const { usuarioId, cursoId, numeroEvaluacion } = await req.json();
    console.log('📥 Datos recibidos:', { usuarioId, cursoId, numeroEvaluacion });

    // Buscar todas las inscripciones del usuario
    const inscripciones = await prisma.inscripcion.findMany({
      where: { usuarioId },
    });

    if (inscripciones.length === 0) {
      console.warn('⚠️ No se encontraron inscripciones.');
      return NextResponse.json({ error: 'No tienes inscripciones registradas.' }, { status: 404 });
    }

    // Buscar la inscripción que corresponde al curso enviado
    const inscripcion = inscripciones.find((i) => i.cursoId === cursoId);

    if (!inscripcion) {
      console.warn('⚠️ No estás inscrito en el curso solicitado.');
      return NextResponse.json({ error: 'No estás inscrito en este curso.' }, { status: 404 });
    }

    // Buscar evaluaciones del curso
    let evaluaciones = await prisma.evaluacion.findMany({
      where: { cursoId },
      orderBy: { id: 'asc' },
    });

    // Crear la evaluación si no existe
    while (evaluaciones.length < numeroEvaluacion) {
      const nueva = await prisma.evaluacion.create({
        data: {
          cursoId,
          titulo: `Evaluación ${evaluaciones.length + 1}`,
          descripcion: 'Evaluación generada automáticamente por intentos',
          tipo: 'QUIZ',
        },
      });
      evaluaciones.push(nueva);
    }

    const evaluacion = evaluaciones[numeroEvaluacion - 1];

    if (!evaluacion) {
      console.warn('⚠️ Evaluación no encontrada después de crear.');
      return NextResponse.json({ error: 'Evaluación no encontrada.' }, { status: 404 });
    }

    // Contar intentos
    const intentos = await prisma.respuestaUsuario.count({
      where: {
        evaluacionId: evaluacion.id,
        inscripcionId: inscripcion.id,
      },
    });

    const restante = 3 - intentos;

    console.log(`🧮 Intentos usados: ${intentos}, restantes: ${restante}`);

    return NextResponse.json({
      bloqueado: restante <= 0,
      intentosRealizados: intentos,
      intentosRestantes: Math.max(0, restante),
    });
  } catch (error) {
    console.error('❌ Error en validación de intentos:', error);
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 });
  }
}