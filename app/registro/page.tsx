'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function RegistroPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#0F172A]">
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => console.log('Video cargado')}
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.1] z-0"
      >
        <source src="/bglogin.webm" type="video/webm" />
        Tu navegador no soporta videos en formato WebM.
      </video>

      {/* Capa con más difuminado */}
      <div className="absolute inset-0 z-0 backdrop-blur-[6px]"></div>

      {/* Card de registro */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl px-6 py-10 md:p-10 mt-[-70px]">
        <div className="flex justify-center mb-6">
          <Image
            src="/logoingles.webp"
            alt="Logo NextInglés"
            width={280}
            height={90}
            className="object-contain"
            priority
          />
        </div>

        <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-2">Crea tu cuenta</h2>
        <p className="text-slate-300 text-center mb-6">
          Comienza tu camino en{' '}
          <span className="text-[#38BDF8] font-semibold">NextOnline</span>
        </p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5 text-white">
          <div>
            <label className="text-sm block mb-1">Nombre</label>
            <input type="text" placeholder="Juan" className="input-field" />
          </div>
          <div>
            <label className="text-sm block mb-1">Apellido</label>
            <input type="text" placeholder="Pérez" className="input-field" />
          </div>
          <div>
            <label className="text-sm block mb-1">Correo electrónico</label>
            <input type="email" placeholder="correo@ejemplo.com" className="input-field" />
          </div>
          <div>
            <label className="text-sm block mb-1">Teléfono</label>
            <input type="tel" placeholder="+51 999 888 777" className="input-field" />
          </div>
          <div>
            <label className="text-sm block mb-1">Contraseña</label>
            <input type="password" placeholder="********" className="input-field" />
          </div>
          <div>
            <label className="text-sm block mb-1">Confirmar contraseña</label>
            <input type="password" placeholder="********" className="input-field" />
          </div>

          <div className="md:col-span-2 flex items-center space-x-2 text-sm mt-1">
            <input type="checkbox" id="terms" className="accent-[#38BDF8]" />
            <label htmlFor="terms">
              Acepto los{' '}
              <span className="text-[#38BDF8] hover:underline cursor-pointer">
                Términos y condiciones
              </span>
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-2 bg-[#2F8B92] text-white font-semibold rounded-lg transition hover:brightness-110 hover:scale-[1.01]"
            >
              Crear cuenta
            </button>
            <p className="text-sm text-center text-slate-300 mt-4">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-[#38BDF8] hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}