// lib/lessonLoader.ts
export async function loadLessonJson(module: string, lesson: string) {
    const res = await fetch(`/modules/${module}/${lesson}.json`);
    if (!res.ok) throw new Error("No se pudo cargar el contenido");
    return res.json();
  }
  