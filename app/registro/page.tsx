'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    contraseña: '',
    confirmar: '',
  });
  const [acepto, setAcepto] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (!acepto) return setError('Debes aceptar los términos.');
  if (form.contraseña !== form.confirmar) return setError('Las contraseñas no coinciden.');

  try {
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, rol: 'ALUMNO' }),
    });

    let data;
    try {
      data = await res.json(); // Solo si hay contenido
    } catch {
      throw new Error('Respuesta inválida del servidor.');
    }

    if (!res.ok) {
      throw new Error(data?.error || 'Error al registrar.');
    }

    alert('Cuenta creada con éxito. Inicia sesión.');
    router.push('/login');
  } catch (err: any) {
    setError(err.message);
  }
};


  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#0F172A]">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.1] z-0"
      >
        <source src="/bglogin.webm" type="video/webm" />
        Tu navegador no soporta videos en formato WebM.
      </video>

      <div className="absolute inset-0 z-0 backdrop-blur-[6px]" />

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

        {error && (
          <p className="text-red-500 text-center text-sm mb-4 font-semibold">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-white">
          <input type="hidden" name="rol" value="ALUMNO" />

          <div>
            <label className="text-sm block mb-1">Nombre</label>
            <input
              name="nombre"
              type="text"
              placeholder="Juan"
              className="input-field"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Apellido</label>
            <input
              name="apellido"
              type="text"
              placeholder="Pérez"
              className="input-field"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Correo electrónico</label>
            <input
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              className="input-field"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Teléfono</label>
            <input
              name="telefono"
              type="tel"
              placeholder="+51 999 888 777"
              className="input-field"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Contraseña</label>
            <input
              name="contraseña"
              type="password"
              placeholder="********"
              className="input-field"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Confirmar contraseña</label>
            <input
              name="confirmar"
              type="password"
              placeholder="********"
              className="input-field"
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-2 flex items-center space-x-2 text-sm mt-1">
            <input
              type="checkbox"
              id="terms"
              className="accent-[#38BDF8]"
              checked={acepto}
              onChange={() => setAcepto(!acepto)}
            />
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
