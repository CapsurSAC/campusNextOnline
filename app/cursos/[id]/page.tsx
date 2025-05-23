'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Leccion = {
  id: number;
  titulo: string;
  contenido: string;
  orden: number;
};

export default function CursoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lecciones, setLecciones] = useState<Leccion[]>([]);

  useEffect(() => {
    if (id) {
      fetch(`/api/cursos/${id}/lecciones`)
        .then(res => res.json())
        .then(setLecciones)
        .catch(() => setLecciones([]));
    }
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Módulos del Curso</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {lecciones.map((modulo) => (
          <div
            key={modulo.id}
            onClick={() => router.push(`/cursos/${id}/lecciones/${modulo.id}`)}
            className="cursor-pointer bg-gray-800 border border-gray-600 rounded-lg p-4 shadow hover:border-blue-500 transition"
          >
            <h2 className="text-xl font-bold mb-2">
              Módulo {modulo.orden}: {modulo.titulo}
            </h2>
            <p className="text-sm text-gray-300">{modulo.contenido}</p>
          </div>
        ))}
      </div>

      {lecciones.length === 0 && (
        <p className="text-sm text-gray-400 mt-6">
          Este curso aún no tiene módulos creados.
        </p>
      )}
    </div>
  );
}
