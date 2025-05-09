// /app/api/progress/save/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { user_id, lesson_id, step } = await request.json();

  if (!user_id || !lesson_id || step === undefined) {
    return new Response("Faltan parámetros", { status: 400 });
  }

  try {
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: user_id,
          lessonId: lesson_id,
        },
      },
      update: {
        step,
        completed: step >= 4, // cambia este número según cuántos pasos tenga tu lección
      },
      create: {
        userId: user_id,
        lessonId: lesson_id,
        step,
        completed: step >= 4,
      },
    });

    return new Response(JSON.stringify(progress), { status: 200 });
  } catch (error) {
    console.error("❌ Error al guardar progreso:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
