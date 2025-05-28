'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import EditLeccionModal from '@/components/EditLeccionModal';
import { Lock, Unlock, Plus, X, CheckCircle } from 'lucide-react';

type Leccion = {
  id: number;
  titulo: string;
  contenido: string;
  orden: number;
  disponible: boolean;
};

export default function CursoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading } = useUser();
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [leccionEditando, setLeccionEditando] = useState<Leccion | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user) {
      fetch(`/api/cursos/${id}/lecciones`)
        .then(res => res.json())
        .then(setLecciones);
    }
  }, [id, loading, user]);

  if (loading || !user) return null;

  const handleCrearLeccion = async () => {
    if (!titulo.trim() || !contenido.trim()) return;
    const orden = lecciones.length + 1;

    await fetch(`/api/cursos/${id}/lecciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, contenido, orden }),
    });

    setTitulo('');
    setContenido('');
    setFormVisible(false);
    fetch(`/api/cursos/${id}/lecciones`)
      .then(res => res.json())
      .then(setLecciones);
  };

  const handleEliminarLeccion = async (leccionId: number) => {
    if (!confirm('¿Seguro que quieres eliminar este módulo?')) return;

    await fetch(`/api/lecciones/${leccionId}`, { method: 'DELETE' });
    setLecciones(prev => prev.filter(l => l.id !== leccionId));
  };

  const toggleDisponibilidad = async (leccionId: number, disponible: boolean) => {
    await fetch(`/api/lecciones/${leccionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disponible: !disponible }),
    });

    fetch(`/api/cursos/${id}/lecciones`)
      .then(res => res.json())
      .then(setLecciones);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black tracking-tight">📘 Módulos del Curso</h1>

        {user.rol === 'ADMIN' && (
          <button
            onClick={() => setFormVisible(!formVisible)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
              formVisible
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {formVisible ? <X size={16} /> : <Plus size={16} />} {formVisible ? 'Cancelar' : 'Crear módulo'}
          </button>
        )}
      </div>

      {formVisible && (
        <div className="bg-[#1c1f2b] p-6 rounded-xl mb-10 shadow-md space-y-4 border border-gray-700">
          <h2 className="text-lg font-semibold">Nuevo módulo</h2>
          <input
            className="w-full bg-gray-900 text-white p-3 rounded-lg border border-gray-700"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            className="w-full bg-gray-900 text-white p-3 rounded-lg border border-gray-700"
            placeholder="Descripción"
            rows={3}
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setFormVisible(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={handleCrearLeccion}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Guardar módulo
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {lecciones.map((modulo) => (
          <div
            key={modulo.id}
            className={`rounded-2xl p-6 transition border-2 shadow-sm ${
              modulo.disponible
                ? 'bg-[#111f2f] border-green-600'
                : 'bg-[#1e1e1e] border-yellow-500'
            }`}
          >
            <div
              onClick={() =>
                modulo.disponible || user.rol === 'ADMIN'
                  ? router.push(`/cursos/${id}/lecciones/${modulo.id}`)
                  : null
              }
              className={`cursor-pointer mb-4`}
            >
              <h2 className="text-xl font-bold mb-1 flex items-center justify-between">
                Módulo {modulo.orden}
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    modulo.disponible ? 'bg-green-700' : 'bg-yellow-600'
                  }`}
                >
                  {modulo.disponible ? 'Disponible' : 'Bloqueado'}
                </span>
              </h2>
              <h3 className="text-lg font-semibold">{modulo.titulo}</h3>
              <p className="text-sm text-gray-300 mt-1">{modulo.contenido}</p>
            </div>

            {user.rol === 'ADMIN' && (
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setLeccionEditando(modulo)}
                    className="text-blue-400 text-sm hover:underline"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleEliminarLeccion(modulo.id)}
                    className="text-red-400 text-sm hover:underline"
                  >
                    🗑 Eliminar
                  </button>
                </div>
                <button
                  onClick={() => toggleDisponibilidad(modulo.id, modulo.disponible)}
                  className={`text-sm px-3 py-1 rounded-lg border text-white flex items-center gap-1 ${
                    modulo.disponible
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {modulo.disponible ? <Lock size={14} /> : <Unlock size={14} />}
                  {modulo.disponible ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {lecciones.length === 0 && (
        <p className="text-sm text-gray-400 mt-8">Este curso aún no tiene módulos creados.</p>
      )}

      {leccionEditando && (
        <EditLeccionModal
          leccion={leccionEditando}
          onClose={() => setLeccionEditando(null)}
          onSave={() => {
            fetch(`/api/cursos/${id}/lecciones`)
              .then(res => res.json())
              .then(setLecciones);
          }}
        />
      )}
    </div>
  );
}
