'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, BookOpenCheck, ClipboardList } from 'lucide-react';

export default function EvaluacionesPage() {
  return (
    <main className="px-6 pt-6 pb-12 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Encabezado */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow">
          📝 Evalúa tu progreso con JUNE
        </h1>
        <p className="text-white/70 mt-3 max-w-2xl mx-auto">
          Aquí encontrarás evaluaciones para reforzar tu aprendizaje y medir tu avance en cada módulo.
        </p>
      </motion.section>

      {/* Tarjetas de evaluación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <EvaluationCard
          icon={<BookOpenCheck size={32} />}
          title="Evaluaciones por Módulo"
          description="Pon a prueba lo aprendido en cada módulo con preguntas específicas."
          href="basico/evaluation1/written"
        />
        <EvaluationCard
          icon={<ClipboardList size={32} />}
          title="Evaluación General"
          description="Mide tu dominio general del curso en una evaluación integral."
          href="basico/evaluation2"
        />
        <EvaluationCard
          icon={<ClipboardList size={32} />}
          title="Evaluación General"
          description="Mide tu dominio general del curso en una evaluación integral."
          href="basico/evaluation3"
        />
        <EvaluationCard
          icon={<FileText size={32} />}
          title="Revisar Resultados"
          description="Consulta tus evaluaciones pasadas, calificaciones y retroalimentación de JUNE."
          href="basico/logro"
        />
      </div>
    </main>
  );
}

function EvaluationCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="bg-white/10 p-6 rounded-xl backdrop-blur-lg shadow-lg hover:bg-white/20 transition"
    >
      <Link href={href} className="flex flex-col gap-4 h-full">
        <div className="text-white flex items-center gap-3 text-xl font-bold">
          <span className="text-teal-400">{icon}</span>
          {title}
        </div>
        <p className="text-white/80 text-sm">{description}</p>
      </Link>
    </motion.div>
  );
}
