'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Material = {
  id: number;
  tipo: 'PDF' | 'VIDEO' | 'ENLACE';
  descripcion: string;
  urlArchivo: string;
};

export default function LeccionDinamicaPage() {
  const { modulo, seccion, leccion } = useParams();
  const [materiales, setMateriales] = useState<Material[]>([]);

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const res = await fetch(`/api/materiales/${leccion}`);
        const data = await res.json();
        setMateriales(data);
      } catch (error) {
        console.error('Error cargando materiales:', error);
      }
    };

    fetchMateriales();
  }, [leccion]);

  const materialesFiltrados = materiales.filter((m) => {
    if (seccion === 'videos') return m.tipo === 'VIDEO';
    if (seccion === 'diapositivas') return m.tipo === 'PDF';
    if (seccion === 'recursos') return m.tipo === 'ENLACE';
    return false;
  });

  return (
    <div className="text-white p-6">
      <h2 className="text-2xl font-bold mb-4">
        Módulo: {modulo} | Sección: {seccion} | Lección: {leccion}
      </h2>

      <div className="space-y-6">
        {materialesFiltrados.length === 0 && (
          <p className="text-white/70">No hay materiales disponibles para esta sección.</p>
        )}

        {seccion === 'videos' &&
          materialesFiltrados.map((video) => (
            <div key={video.id} className="mb-6">
              <div className="aspect-video rounded overflow-hidden mb-2">
                <iframe
                  src={video.urlArchivo}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <p className="text-sm text-white/80">{video.descripcion}</p>
            </div>
          ))}

        {seccion === 'diapositivas' &&
          materialesFiltrados.map((pdf) => (
            <div key={pdf.id} className="mb-6">
              <iframe
                src={pdf.urlArchivo}
                className="w-full h-[600px] border border-white/10 rounded"
              />
              <p className="text-sm text-white/70 mt-1">{pdf.descripcion}</p>
            </div>
          ))}

        {seccion === 'recursos' &&
          materialesFiltrados.map((r) => (
            <div key={r.id} className="mb-4">
              <a
                href={r.urlArchivo}
                className="text-blue-400 underline"
                target="_blank"
              >
                {r.descripcion}
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}
