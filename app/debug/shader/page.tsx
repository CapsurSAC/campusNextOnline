// app/debug/shader/page.tsx
'use client';

import AnimatedWaves from '@/components/AnimatedWaves';

export default function ShaderPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Fondo SVG animado en z-0 */}
      <div className="absolute inset-0 z-0">
        <AnimatedWaves />
      </div>

      {/* Contenido principal en z-10 */}
      <div className="relative z-10 flex items-center justify-center h-screen text-white">
        <h1 className="text-4xl font-bold drop-shadow-lg">Fondo Waves Activo 🌊</h1>
      </div>
    </main>
  );
}