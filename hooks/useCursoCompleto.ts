'use client';

import { useEffect, useState } from 'react';

export function useCursoCompleto(id: number | string) {
  const [curso, setCurso] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchCurso = async () => {
      try {
        const res = await fetch(`/api/cursos/${id}`, { credentials: 'include' });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al obtener curso');
        }

        const data = await res.json();
        setCurso(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurso();
  }, [id]);

  return { curso, loading, error };
}
