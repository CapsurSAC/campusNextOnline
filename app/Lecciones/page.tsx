'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBookOpen, FaLock } from 'react-icons/fa';

const modules = [
  {
    title: 'Módulo 1: Fundamentos del Inglés',
    description: 'Saludos, presentaciones y frases básicas.',
    href: '/Lecciones/modulo1',
    unlocked: true,
  },
  {
    title: 'Módulo 2: El Presente Simple',
    description: 'Verbo to be, rutinas y estructuras del presente.',
    href: '/Lecciones/modulo2',
    unlocked: false,
  },
  {
    title: 'Módulo 3: Interacción Cotidiana',
    description: 'Conversaciones comunes y preguntas frecuentes.',
    href: '/Lecciones/modulo3',
    unlocked: false,
  },
  {
    title: 'Módulo 4: Comunicación Activa',
    description: 'Vocabulario avanzado y diálogos extendidos.',
    href: '/Lecciones/modulo4',
    unlocked: true,
  },
];

export default function LeccionesPage() {
  return (
    <div className="ml-1 p-6 min-h-screen bg-slate-800 text-white">
      <h1 className="text-4xl font-extrabold mb-8 flex items-center gap-4">
        <FaBookOpen size={36} /> Lecciones de Inglés Básico
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {modules.map(({ title, description, href, unlocked }, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.015 }}
            className={`relative rounded-2xl p-6 transition-shadow shadow-xl min-h-[180px] ${
              unlocked
                ? 'bg-gradient-to-br from-green-500/20 to-green-700/10 border border-green-400 hover:shadow-green-400/40'
                : 'bg-gradient-to-br from-yellow-500/10 to-yellow-700/10 border border-yellow-400 opacity-90'
            }`}
          >
            {unlocked ? (
              <Link href={href}>
                <div className="flex flex-col justify-between h-full">
                  <h2 className="text-2xl font-bold mb-2">{title}</h2>
                  <p className="text-white/80 text-base">{description}</p>
                </div>
              </Link>
            ) : (
              <div className="relative group cursor-not-allowed h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{title}</h2>
                  <p className="text-white/70 text-base">{description}</p>
                </div>
                <div className="flex items-center gap-2 text-yellow-300 mt-4">
                  <FaLock />
                  <span className="text-sm group-hover:underline">
                    Módulo no disponible aún
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
