'use client';

import { useEffect, useState } from 'react';

interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  imagenPortada: string;
  duracionHoras: number;
  categoria: string;
  estado: string;
}

export function useMisCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCursos() {
      try {
        const res = await fetch('/api/mis-cursos');
        if (!res.ok) throw new Error('No se pudieron cargar los cursos');
        const data = await res.json();
        setCursos(data.cursos);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchCursos();
  }, []);

  return { cursos, loading, error };
}
