'use client';

import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

export default function DemoAccessPage() {
  const [isReady, setIsReady] = useState(false);
  const [canAccess, setCanAccess] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const lastAccessStr = localStorage.getItem('lastDemoAccess');
    const now = Date.now();

    if (lastAccessStr) {
      const lastAccess = parseInt(lastAccessStr, 10);
      const elapsed = now - lastAccess;
      if (elapsed < TWELVE_HOURS) {
        setCanAccess(false);
        setTimeLeft(TWELVE_HOURS - elapsed);
      } else {
        localStorage.removeItem('lastDemoAccess');
        setCanAccess(true);
      }
    }
    setIsReady(true);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start bg-slate-900 text-white p-6 overflow-y-auto">

      <h1 className="text-3xl font-bold mb-4">🎓 Clase Demo Gratuita</h1>
      <p className="text-white/70 text-center mb-4 max-w-md">
        Puedes acceder a esta clase por 5 minutos cada 12 horas.
      </p>

      <div className="w-full max-w-sm mb-6 rounded-xl overflow-hidden shadow-lg">
        <video
          src="/videos/mentora-june.mp4"
          className="w-full rounded-xl"
          autoPlay
          muted
          loop={false}
          playsInline
          controls
        />
      </div>

      {isReady ? (
        canAccess ? (
          <Button color="primary" size="lg" onClick={() => router.push('/demo/clase')}>
            ▶️ Iniciar clase demo
          </Button>
        ) : (
          <div className="bg-red-600/10 border border-red-500 text-red-300 p-6 rounded-xl text-center max-w-sm space-y-2">
            <p className="mb-2 font-semibold">Ya accediste a tu clase demo.</p>
            <p className="text-sm">
              Podrás volver a intentarlo en:
              <br />
              <strong>{timeLeft !== null ? formatTime(timeLeft) : 'Cargando...'}</strong>
            </p>
            <a
            href="https://wa.me/51907770864?text=Me%20encant%C3%B3%20la%20demo.%20Ya%20quiero%20continuar%20con%20el%20curso%20completo.%20%C2%BFD%C3%B3nde%20me%20inscribo%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
            💬 Habla con un asesor por WhatsApp
            </a>


          </div>
        )
      ) : (
        <p>Cargando...</p>
      )}
    </main>
  );
}
