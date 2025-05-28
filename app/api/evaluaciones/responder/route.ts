import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { usuarioId, numeroEvaluacion, nota } = await req.json();

    console.log({ usuarioId, numeroEvaluacion, nota });

    // ID fijo del curso "Inglés Básico"
    const ID_INGLES_BASICO = 2; // ← Reemplaza este valor con el ID real de tu curso

    // Obtener todas las inscripciones del usuario
    const inscripciones = await prisma.inscripcion.findMany({
      where: { usuarioId }
    });

    // Buscar inscripción vinculada a Inglés Básico
    const inscripcion = inscripciones.find(i => i.cursoId === ID_INGLES_BASICO);

    if (!inscripcion) {
      return NextResponse.json({ error: 'Inscripción no encontrada para Inglés Básico.' }, { status: 404 });
    }

    const cursoId = inscripcion.cursoId;

    // Buscar evaluaciones existentes del curso
    let evaluaciones = await prisma.evaluacion.findMany({
      where: { cursoId },
      orderBy: { id: 'asc' }
    });

    // Crear evaluaciones faltantes hasta llegar a la número solicitada
    while (evaluaciones.length < numeroEvaluacion) {
      const nueva = await prisma.evaluacion.create({
        data: {
          cursoId,
          titulo: `Evaluación ${evaluaciones.length + 1}`,
          descripcion: `Evaluación creada automáticamente`,
          tipo: 'QUIZ'
        }
      });
      evaluaciones.push(nueva);
    }

    const evaluacion = evaluaciones[numeroEvaluacion - 1];

    if (!evaluacion) {
      return NextResponse.json({ error: 'Evaluación no encontrada.' }, { status: 404 });
    }

    const evaluacionId = evaluacion.id;

    // Verificar intentos anteriores del usuario en esa evaluación
    const intentos = await prisma.respuestaUsuario.count({
      where: {
        evaluacionId,
        inscripcionId: inscripcion.id
      }
    });

    if (intentos >= 3) {
      return NextResponse.json({ error: 'Ya alcanzaste el máximo de intentos.' }, { status: 403 });
    }

    // Registrar intento
    const nuevaRespuesta = await prisma.respuestaUsuario.create({
      data: {
        evaluacionId,
        inscripcionId: inscripcion.id,
        respuesta: nota.toString()
      }
    });

    return NextResponse.json({ success: true, data: nuevaRespuesta });

  } catch (err) {
    console.error('❌ Error en responder:', err);
    return NextResponse.json({
      error: 'Error al procesar la solicitud.',
      detalle: err instanceof Error ? err.message : JSON.stringify(err)
    }, { status: 500 });
  }
}