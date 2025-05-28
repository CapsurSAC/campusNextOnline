'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import UploadMaterialModal from '@/components/UploadMaterialModal';

type Material = {
  id: number;
  tipo: 'VIDEO' | 'PDF' | 'ENLACE' | 'CLASE_JUNE';
  descripcion: string;
  urlArchivo: string;
};

type Leccion = {
  id: number;
  titulo: string;
  contenido: string;
};

const tabs = [
  { label: 'Videos de clase', tipo: 'VIDEO' },
  { label: 'Diapositivas', tipo: 'PDF' },
  { label: 'Recursos', tipo: 'ENLACE' },
  { label: 'Clase en vivo con JUNE', tipo: 'CLASE_JUNE' },
] as const;

export default function VerLeccion() {
  const { id, leccionId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
const [user, setUser] = useState<{ rol: string } | null>(null);

  const [leccion, setLeccion] = useState<Leccion | null>(null);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [activo, setActivo] = useState<'VIDEO' | 'PDF' | 'ENLACE' | 'CLASE_JUNE'>('VIDEO');

  useEffect(() => {
    fetch(`/api/lecciones/${leccionId}`)
      .then(res => res.json())
      .then(setLeccion);

    fetch(`/api/lecciones/${leccionId}/materiales`)
      .then(res => res.json())
      .then(setMateriales);
    fetch('/api/auth/me') // ✅ obtiene el usuario actual
    .then(res => res.json())
    .then(data => setUser(data.user));

  }, [leccionId]);

  const materialesFiltrados = materiales.filter(m => m.tipo === activo);

  if (!leccion) return <p className="text-white p-4">Cargando módulo...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenido al Módulo {leccion.id}: {leccion.titulo}
      </h1>
      <p className="mb-6 text-gray-300">{leccion.contenido}</p>

      <div className="flex gap-4 mb-6">
        {tabs.map(tab => (

          <button
            key={tab.tipo}
            onClick={() => setActivo(tab.tipo)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activo === tab.tipo ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {tab.label}
          </button>

        ))}
      </div>
        {user?.rol === 'ADMIN' && (
        <button
            onClick={() => setModalOpen(true)}
            className="mb-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
            ➕ Subir material
        </button>
        )}


      {materialesFiltrados.length === 0 ? (
        <p className="text-sm text-gray-400">No hay materiales disponibles en esta sección.</p>
      ) : (
        <ul className="space-y-4">
          {materialesFiltrados.map(m => (
            <li key={m.id} className="bg-gray-800 p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{m.descripcion}</h3>
              {m.tipo === 'VIDEO' && (
                <video controls src={m.urlArchivo} className="w-full mt-2 rounded" />
              )}
              {m.tipo === 'PDF' && (
                <a href={m.urlArchivo} target="_blank" className="text-blue-400 underline mt-2 inline-block">
                  Ver PDF
                </a>
              )}
              {m.tipo === 'ENLACE' && (
                <a href={m.urlArchivo} target="_blank" className="text-blue-400 underline mt-2 inline-block">
                  Abrir recurso externo
                </a>
              )}
              {m.tipo === 'CLASE_JUNE' && (
                <p className="text-sm text-yellow-300 mt-2">Clase personalizada con JUNE (próximamente 🤖)</p>
              )}
            </li>
          ))}
        </ul>
      )}
      {modalOpen && (
    <UploadMaterialModal
        leccionId={Number(leccionId)}
        tipoMaterial={activo}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
        fetch(`/api/lecciones/${leccionId}/materiales`)
            .then(res => res.json())
            .then(setMateriales);
        }}
    />
    )}

    </div>
  );
}
