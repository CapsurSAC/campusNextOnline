'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, BarChart3 } from 'lucide-react';

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
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent drop-shadow">
          Selecciona tu nivel para evaluar
        </h1>
        <p className="text-white/70 mt-3 max-w-xl mx-auto">
          Comienza por el nivel básico y desbloquea los siguientes al avanzar en tu formación con JUNE.
        </p>
      </motion.section>

      {/* Niveles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <LevelCard
          title="Nivel Básico"
          description="Evalúa lo aprendido en tus primeras lecciones."
          icon={<CheckCircle className="text-green-400" size={36} />}
          href="/evaluaciones/basico"
          locked={false}
        />
        <LevelCard
          title="Nivel Intermedio"
          description="Desbloquea este nivel completando el módulo básico."
          icon={<Lock className="text-yellow-300" size={36} />}
          locked
        />
        <LevelCard
          title="Nivel Avanzado"
          description="Completa los niveles anteriores para acceder."
          icon={<Lock className="text-red-400" size={36} />}
          locked
        />
      </div>
    </main>
  );
}

function LevelCard({
  title,
  description,
  icon,
  href,
  locked,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  locked?: boolean;
}) {
  const card = (
    <motion.div
      whileHover={!locked ? { scale: 1.03 } : {}}
      whileTap={!locked ? { scale: 0.97 } : {}}
      className={`p-6 rounded-xl backdrop-blur-lg shadow-lg transition cursor-pointer ${
        locked ? 'bg-white/10 opacity-50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div>{icon}</div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </motion.div>
  );

  return locked ? (
    <div>{card}</div>
  ) : (
    <Link href={href ?? '#'}>{card}</Link>
  );
}
