'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: number;
  email: string;
  rol: string;
  exp: number;
}

export function useUsuario() {
  const [usuario, setUsuario] = useState<TokenPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode<TokenPayload>(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        setUsuario(null);
        return;
      }

      setUsuario(decoded);
    } catch (err) {
      console.error('Token inválido', err);
      localStorage.removeItem('token');
      setUsuario(null);
    }
  }, []);

  return usuario;
}
