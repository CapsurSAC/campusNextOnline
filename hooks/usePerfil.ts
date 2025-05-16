'use client';

import { useEffect, useState } from 'react';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  dni?: string;
  idioma?: string;
  nivel?: string;
  metaSemanal?: string;
  progreso?: number;
  rol: string;
  fechaRegistro: string;
  ultimoAcceso?: string;
}

export function usePerfil() {
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const res = await fetch('/api/perfil', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Error al cargar el perfil');
        setPerfil(data.usuario);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerPerfil();
  }, []);

  return { perfil, loading, error };
}
