import type {
  Curso,
  Leccion,
  Material,
  Usuario,
  Inscripcion,
  Evaluacion,
  ProgresoLeccion,
  RespuestaUsuario,
} from '@prisma/client';

/**
 * Curso con todas sus lecciones asociadas
 */
export type CursoConLecciones = Curso & {
  lecciones: Leccion[];
};

/**
 * Lección con materiales y progresos
 */
export type LeccionCompleta = Leccion & {
  materiales: Material[];
  progresos: ProgresoLeccion[];
};

/**
 * Inscripción con progreso y respuestas del alumno
 */
export type InscripcionDetalle = Inscripcion & {
  curso: Curso;
  usuario: Usuario;
  progresos: ProgresoLeccion[];
  respuestas: RespuestaUsuario[];
};

/**
 * Curso con evaluaciones e inscripciones (Admin view)
 */
export type CursoAdmin = Curso & {
  lecciones: Leccion[];
  evaluaciones: Evaluacion[];
  inscripciones: InscripcionDetalle[];
};
type LeccionExtendida = {
  id: number;
  titulo: string;
  contenido: string;
  cursoId: number;
};
