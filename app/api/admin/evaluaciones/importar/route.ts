import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as xlsx from 'xlsx';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const cursoIdStr = formData.get('cursoId') as string;
    const titulo = formData.get('titulo') as string;
    const descripcion = formData.get('descripcion') as string;

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    const cursoId = parseInt(cursoIdStr);
    if (isNaN(cursoId)) {
      return NextResponse.json({ error: 'ID de curso inválido' }, { status: 400 });
    }

    // Leer el archivo
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Parsear el Excel
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convertir a JSON
    // Esperamos columnas: Enunciado, Opciones, Respuesta_Correcta, Audio_URL
    const rows = xlsx.utils.sheet_to_json<any>(sheet);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'El archivo Excel está vacío o no tiene el formato correcto.' }, { status: 400 });
    }

    // Iniciar transacción de Prisma para asegurar que todo se guarda correctamente
    const nuevaEvaluacion = await prisma.$transaction(async (tx) => {
      // 1. Crear la evaluación
      const evaluacion = await tx.evaluacion.create({
        data: {
          cursoId,
          titulo,
          descripcion,
          tipo: 'QUIZ',
        }
      });

      // 2. Preparar las preguntas
      const preguntasData = rows.map((row, index) => {
        // Aseguramos que existan los campos mínimos
        const enunciado = row['Enunciado'] || row['enunciado'] || `Pregunta ${index + 1}`;
        const opcionesRaw = row['Opciones'] || row['opciones'] || '';
        const respuestaCorrecta = row['Respuesta_Correcta'] || row['respuesta_correcta'] || '';
        const audioUrl = row['Audio_URL'] || row['audio_url'] || null;

        // Convertir las opciones (separadas por coma) a un JSON string array
        let opcionesArr = [respuestaCorrecta]; // fallback
        if (typeof opcionesRaw === 'string') {
          opcionesArr = opcionesRaw.split(',').map(o => o.trim());
        }

        return {
          evaluacionId: evaluacion.id,
          enunciado: String(enunciado),
          opciones: JSON.stringify(opcionesArr),
          respuestaCorrecta: String(respuestaCorrecta).trim(),
          audioUrl: audioUrl ? String(audioUrl) : null,
          orden: index + 1
        };
      });

      // 3. Insertar las preguntas
      await tx.preguntaEvaluacion.createMany({
        data: preguntasData
      });

      return evaluacion;
    });

    return NextResponse.json({ success: true, data: nuevaEvaluacion });

  } catch (error) {
    console.error('Error importando evaluación:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor al importar',
      detalle: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
