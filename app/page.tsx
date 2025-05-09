'use client';
import React, { useState, useEffect } from 'react';

import { modules } from '@/app/data/modules';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(true), 800);
    return () => clearTimeout(timer);
  }, []);
  

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseVideo();
    };
    if (showVideo) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showVideo]);

  const handleCloseVideo = () => {
    setShowVideo(false);
    localStorage.setItem('mentoraVideoSeen', 'true');
  };
  return (
    <main className="px-6 pt-4 pb-10 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
   {showVideo && (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] rounded-xl overflow-hidden shadow-2xl bg-transparent">
          <button
            onClick={handleCloseVideo}
            className="absolute top-2 right-3 text-white text-2xl font-bold z-10 hover:text-red-500"
            aria-label="Cerrar video"
          >
            ✕
          </button>
          <video
            autoPlay
            controls
            playsInline
            className="w-full h-auto rounded-xl bg-black object-cover"
            style={{ aspectRatio: '9/16' }}
          >
            <source src="/videos/mentora-june.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
        </div>
      </div>
    )}




      {/* Encabezado */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
          ¡Bienvenido a <span className="text-white">NextOnline!</span>
        </h1>
        <p className="text-white/70 text-lg mt-3 max-w-2xl mx-auto">
          Aprende inglés con IA, música, módulos interactivos y clases recomendadas por JUNE.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* JUNE te recomienda */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/10 p-6 rounded-xl shadow backdrop-blur flex flex-col items-center text-center"
        >
          <Image
            src="/images/june.png"
            alt="IA JUNE"
            width={100}
            height={100}
            className="rounded-full border-2 border-white mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">JUNE te recomienda</h2>
          <p className="text-white/90 text-sm mb-4">
            🌟 “Practica 15 minutos al día. La constancia es la clave para dominar un nuevo idioma.”
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button className="bg-blue-500 hover:bg-blue-600 transition text-white text-sm px-4 py-2 rounded">
              📘 Ver clase recomendada
            </button>
            <button className="bg-amber-500 hover:bg-amber-600 transition text-white text-sm px-4 py-2 rounded">
              🎧 Escuchar consejo de JUNE
            </button>
          </div>
        </motion.div>

        {/* Tu progreso con doble gráfico animado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/10 p-6 rounded-xl shadow backdrop-blur flex flex-col items-center"
        >
          <h2 className="text-xl font-semibold mb-4">Tu progreso</h2>
          <div className="relative w-28 h-28 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-slate-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-teal-400"
                strokeDasharray="65, 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: '65, 100' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-bold text-white text-lg">
              65%
            </span>
          </div>
          <p className="text-white/70 text-sm text-center mb-2">Has completado 13 de 20 módulos.</p>

          {/* Barra horizontal animada */}
          <div className="w-full">
            <p className="text-white/70 text-sm mb-1">Vocabulario aprendido</p>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="bg-green-400 h-full"
                initial={{ width: '0%' }}
                animate={{ width: '80%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-right mt-1 text-white/60">80% completado</p>
          </div>
        </motion.div>

        {/* Música */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/10 p-6 rounded-xl shadow backdrop-blur"
        >
          <h2 className="text-xl font-semibold mb-4">🎵 Playlist diaria</h2>
          <div className="space-y-4">
            {[
              '3U4isOIWM3VvDubwSI3y7a',
              '1R0a2iXumgCiVEnA2U5K1Z',
              '6habFhsOp2NvshLv26DqMb',
            ].map((trackId) => (
              <iframe
                key={trackId}
                className="rounded w-full"
                src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                height="80"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Módulos */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-10"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">📚 Módulos disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {modules.map(({ title, description, href, emoji, color }) => (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 text-xl rounded-full ${color}`}>{emoji}</div>
                  <h3 className="text-base font-semibold">{title}</h3>
                </div>
                <p className="text-sm text-white/80">{description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
