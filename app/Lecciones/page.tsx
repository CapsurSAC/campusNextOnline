'use client';

import { useEffect, useState } from 'react';
import { FaBookOpen, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';
import classNames from 'classnames';

const modulos = [
  {
    id: '1', // ID real de cursoId
    slug: 'modulo1',
    titulo: 'Módulo 1: Fundamentos del Inglés',
    descripcion: 'Saludos, presentaciones y frases básicas.',
  },
  {
    id: '2',
    slug: 'modulo2',
    titulo: 'Módulo 2: El Presente Simple',
    descripcion: 'Verbo to be, rutinas y estructuras del presente.',
  },
  {
    id: '3',
    slug: 'modulo3',
    titulo: 'Módulo 3: Interacción Cotidiana',
    descripcion: 'Conversaciones comunes y preguntas frecuentes.',
  },
  {
    id: '4',
    slug: 'modulo4',
    titulo: 'Módulo 4: Comunicación Activa',
    descripcion: 'Vocabulario avanzado y diálogos extendidos.',
  },
];

export default function LeccionesPage() {
  const [progresos, setProgresos] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProgresos = async () => {
      for (const modulo of modulos) {
        try {
          const res = await fetch(`/api/progreso/modulo/${modulo.id}`);
          const data = await res.json();
          setProgresos((prev) => ({ ...prev, [modulo.id]: data.progreso ?? 0 }));
        } catch (err) {
          console.error('Error cargando progreso de módulo', modulo.id);
        }
      }
      setLoading(false);
    };

    cargarProgresos();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-slate-900 text-white">
      <h1 className="text-4xl font-extrabold mb-10 flex items-center gap-4">
        <FaBookOpen size={36} /> Lecciones de Inglés Básico
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {modulos.map((modulo) => {
          const progreso = progresos[modulo.id] ?? 0;
          const completado = progreso === 100;

          return (
            <motion.div
              key={modulo.id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-950 to-sky-900 hover:from-sky-900 hover:to-sky-800 p-6 shadow-lg hover:shadow-blue-500/20 group"
            >
              <Link href={`/Lecciones/${modulo.slug}/diapositivas/lesson1`} className="block h-full">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                        {modulo.titulo}
                      </h2>
                      {completado && (
                        <span className="flex items-center gap-1 text-green-400 text-sm">
                          <FaCheckCircle className="text-green-400" /> Completado
                        </span>
                      )}
                    </div>
                    <p className="text-white/70 text-sm mb-4">{modulo.descripcion}</p>

                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className={classNames('h-2 rounded-full transition-all', {
                          'bg-green-500': completado,
                          'bg-blue-500': !completado,
                        })}
                        style={{ width: `${progreso}%` }}
                      />
                    </div>

                    <p className="text-xs text-right text-white/50 mt-1">
                      {loading ? 'Cargando...' : `${progreso}% completado`}
                    </p>
                  </div>

                  <div className="mt-6">
                    <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm transition">
                      Ver lecciones →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
