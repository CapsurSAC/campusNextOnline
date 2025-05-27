'use client';

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedWaves from '@/components/AnimatedWaves'; // Asegúrate que esta ruta esté correcta

export default function HomePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-lg font-semibold animate-pulse">Cargando tu información...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="relative min-h-screen overflow-hidden text-white font-sans">
      {/* Fondo animado en z-0 */}
      <div className="absolute inset-0 z-0">
        <AnimatedWaves />
      </div>

      {/* Contenido principal en z-10 */}
      <div className="relative z-10 px-6 py-14">
        {/* ENCABEZADO */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-teal-400 drop-shadow">
            ¡Hola, <span className="text-white">{user.email}</span>!
          </h1>
          <p className="text-gray-200 text-lg mt-3 max-w-2xl mx-auto">
            Este es tu panel personalizado para seguir aprendiendo con IA, música y recomendaciones de JUNE.
          </p>
        </motion.div>

        {/* LAYOUT PRINCIPAL */}
        <section className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* JUNE te recomienda */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#181c22]/80 rounded-2xl p-8 shadow-lg border border-white/10 backdrop-blur"
          >
            <div className="flex flex-col items-center text-center">
              <Image
                src="/images/june.png"
                alt="JUNE"
                width={90}
                height={90}
                className="rounded-full border-2 border-white shadow mb-3"
              />
              <h2 className="text-2xl font-bold">JUNE te recomienda</h2>
              <p className="text-gray-300 italic mt-2 mb-4 max-w-sm">
                “Un poco cada día es todo lo que necesitas.”
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full mt-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 transition rounded-lg py-2 text-sm font-medium shadow">
                  📘 Clase del día
                </button>
                <button className="flex-1 bg-pink-600 hover:bg-pink-700 transition rounded-lg py-2 text-sm font-medium shadow">
                  🎧 Consejo en audio
                </button>
              </div>
            </div>
          </motion.div>

          {/* Progreso */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-[#181c22]/80 rounded-2xl p-8 shadow-lg border border-white/10 backdrop-blur"
          >
            <h2 className="text-2xl font-bold text-center mb-6">📈 Tu progreso</h2>
            <div className="flex flex-col items-center gap-8">
              {/* Progreso circular */}
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    stroke="gray"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831"
                  />
                  <motion.path
                    stroke="#22c55e"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="65, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831"
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: '65, 100' }}
                    transition={{ duration: 1.2 }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-bold text-white text-lg">
                  65%
                </span>
              </div>

              {/* Progreso barra */}
              <div className="w-full max-w-xs">
                <p className="text-sm font-medium text-white mb-2">Vocabulario aprendido</p>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-green-500 h-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '80%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-right text-xs text-gray-400 mt-1">80% completado</p>
                <p className="text-xs text-gray-400 mt-2">Has completado 13 de 20 módulos.</p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}