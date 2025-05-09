// /app/api/progress/load/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { user_id, lesson_id } = await request.json();

  if (!user_id || !lesson_id) {
    return new Response("Faltan parámetros", { status: 400 });
  }

  try {
    const progress = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId: user_id,
          lessonId: lesson_id,
        },
      },
    });

    return new Response(JSON.stringify(progress || {}), { status: 200 });
  } catch (error) {
    console.error("⚠️ Error al obtener progreso:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
