'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, BookOpenCheck, ClipboardList } from 'lucide-react';
import AnimatedWaves from '../../../components/AnimatedWaves'; // Asegúrate de tener esta ruta correcta

export default function EvaluacionesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white px-6 py-20 bg-transparent">
      {/* Fondo animado */}
      <div className="absolute inset-0 z-1">
        <AnimatedWaves />
      </div>

      {/* Encabezado */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto mb-20 text-left relative z-10"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-pink-400 drop-shadow-md flex items-center gap-4">
          <span className="text-5xl">📁</span>
          <span className="relative">
            <span className="relative z-10">Evalúa tu progreso con JUNE</span>
            <span className="absolute inset-0 blur-xl opacity-25 bg-pink-500 rounded-lg" />
          </span>
        </h1>
        <p className="mt-5 text-white/75 text-lg max-w-2xl leading-relaxed">
          Realiza diferentes tipos de evaluaciones para reforzar tu aprendizaje, validar tu comprensión
          y seguir tu evolución a lo largo del curso.
        </p>
      </motion.section>

      {/* Tarjetas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto relative z-10">
        <EvaluationCard
          icon={<BookOpenCheck size={44} />}
          title="Selección Múltiple"
          description="Responde preguntas clave del módulo con opciones múltiples para afianzar tus conocimientos."
          href="/evaluaciones/basico/evaluation1/written"
          color="from-teal-400 to-cyan-500"
        />
        <EvaluationCard
          icon={<ClipboardList size={44} />}
          title="Prueba Auditiva"
          description="Escucha y selecciona respuestas correctas. Ideal para evaluar comprensión oral."
          href="/evaluaciones/basico/evaluation2"
          color="from-sky-500 to-indigo-500"
        />
        <EvaluationCard
          icon={<ClipboardList size={44} />}
          title="Interacción Rápida"
          description="Evalúa tus reflejos con dinámicas interactivas que desafían tu rapidez y precisión."
          href="/evaluaciones/basico/evaluation3"
          color="from-purple-500 to-fuchsia-600"
        />
        <EvaluationCard
          icon={<FileText size={44} />}
          title="Historial de Resultados"
          description="Consulta calificaciones anteriores, observaciones personalizadas y avances por módulo."
          href="/evaluaciones/basico/logro"
          color="from-yellow-300 to-orange-400"
        />
      </section>
    </main>
  );
}

function EvaluationCard({
  title,
  description,
  icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 shadow-md backdrop-blur-md overflow-hidden"
    >
      <Link href={href} className="relative z-10 flex flex-col items-center text-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className={`p-5 rounded-full bg-gradient-to-br ${color} text-black shadow-md`}
        >
          {icon}
        </motion.div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/70 leading-snug">{description}</p>
      </Link>

      <div
        className={`absolute -inset-1.5 rounded-3xl bg-gradient-to-br ${color} blur-2xl opacity-0 group-hover:opacity-25 transition duration-300`}
      />
    </motion.div>
  );
}