'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Solución al error de Hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  // No renderizar nada en el servidor para evitar el error de hidratación
  if (!isClient) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-end overflow-hidden -translate-y-8 px-4">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/bgjunelogin.webm" type="video/webm" />
        Tu navegador no soporta videos en formato WebM.
      </video>

      <div className="fixed inset-0 bg-black/10 -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl px-6 py-10 z-10 backdrop-blur-md mr-20"
      >
        <div className="flex justify-end mb-6">
          <Image
            src="/logoingles.webp"
            alt="Logo NextInglés"
            width={420}
            height={150}
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-tight">
          Bienvenido de nuevo
        </h1>
        <p className="text-[#172E4D] text-sm font-bold text-center mb-8">
          Inicia sesión para acceder a tu cuenta de{' '}
          <span className="text-[#38BDF8] font-medium">NextOnline</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-slate-200 block mb-1 text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="tucorreo@ejemplo.com"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-slate-200 block mb-1 text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="********"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              loading
                ? 'bg-[#38BDF8]/60 text-white cursor-not-allowed'
                : 'bg-[#38BDF8] text-white hover:brightness-110 hover:scale-[1.01]'
            }`}
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-[#172E4D] text-sm font-bold text-center mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-[#38BDF8] hover:underline font-medium">
            Regístrate aquí
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
