// app/Lecciones/modulo1/june/clases/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPlayCircle } from 'react-icons/fa';

const lessons = [
  {
    title: 'Lección 1: Presentaciones',
    description: 'Aprende a presentarte con tu avatar.',
    href: '/Lecciones/modulo1/june/clases/lesson1',
  },
  {
    title: 'Lección 2: Saludos y despedidas',
    description: 'Domina las frases más usadas al saludar.',
    href: '/Lecciones/modulo1/june/clases/lesson2',
  },
  {
    title: 'Lección 3: Preguntas básicas',
    description: 'Practica cómo preguntar y responder.',
    href: '/Lecciones/modulo1/june/clases/lesson3',
  },
  {
    title: 'Lección 4: Tu primera conversación',
    description: 'Simula una charla real con la IA.',
    href: '/Lecciones/modulo1/june/clases/lesson4',
  },
];

export default function ClasesPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🧠 Clases Interactivas con JUNE</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson, i) => (
          <Link href={lesson.href} key={i}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg cursor-pointer backdrop-blur-md hover:border-cyan-400 transition"
            >
              <div className="flex items-center gap-4 mb-3">
                <FaPlayCircle className="text-cyan-400" size={30} />
                <h2 className="text-xl font-semibold">{lesson.title}</h2>
              </div>
              <p className="text-white/70">{lesson.description}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
