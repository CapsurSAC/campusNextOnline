'use client';

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedWaves from '@/components/AnimatedWaves';

export default function HomePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [currentTip, setCurrentTip] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audios = [
    'Askquestionswhenyoudontunderstand.mp3',
    'Learnvocabularyincontext.mp3',
    'ListentoEnglishmusicorpodcasts.mp3',
    'Practicepronunciationdaily.mp3',
    'Practicewithalanguagepartner.mp3',
    'Repeatwordsandphrasesaloud.mp3',
    'Staypatientandpracticeconsistently.mp3',
    'WatchmovieswithEnglishsubtitles.mp3',
  ];

  const playRandomAudio = () => {
  // Asegúrate de que la variable `randomFile` no esté declarada en un scope superior
  const randomIndex = Math.floor(Math.random() * audios.length);
  const selectedFile = audios[randomIndex];

  const fullPath = `/tips/audios/${selectedFile}`;
  setAudioSrc(fullPath);

  // setCurrentTip espera un string, y `replace()` ya devuelve un string
  setCurrentTip(selectedFile.replace('.mp3', ''));

  setTimeout(() => {
    audioRef.current?.play();
  }, 100);
};


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

  const cardStyles = "bg-[#181c22]/80 min-h-[420px] rounded-2xl p-8 shadow-lg border border-white/10 backdrop-blur flex flex-col justify-between";


  return (
    <main className="relative min-h-screen overflow-hidden text-white font-sans">
      <div className="absolute inset-0 z-0">
        <AnimatedWaves />
      </div>

      <div className="relative z-10 px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-teal-400 drop-shadow">
            ¡Hola, <span className="text-white">{user.nombre}</span>!
          </h1>
          <p className="text-gray-200 text-lg mt-3 max-w-2xl mx-auto">
            Este es tu panel personalizado para seguir aprendiendo con IA, música y recomendaciones de JUNE.
          </p>
        </motion.div>

        {/* Las 3 tarjetas en fila */}
        <section className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
         

          {/* JUNE te recomienda */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={cardStyles}
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
                <button
                  onClick={playRandomAudio}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 transition rounded-lg py-2 text-sm font-medium shadow"
                >
                  🎧 Consejo en audio
                </button>
              </div>
              {isPlaying && (
                <p className="text-4xl text-pink-400 mt-4 animate-pulse">🔊</p>
              )}
              {audioSrc && (
                <audio
                  ref={audioRef}
                  src={audioSrc}
                  hidden
                  onPlay={() => setIsPlaying(true)}
                  onEnded={() => setIsPlaying(false)}
                />
              )}
            </div>
          </motion.div>

          {/* Tu progreso */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={cardStyles}
          >
            <h2 className="text-2xl font-bold text-center mb-6">📈 Tu progreso</h2>
            <div className="flex flex-col items-center gap-8">
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

          {/* Música recomendada */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={cardStyles}
          >
            <div>
              <h2 className="text-2xl font-bold text-center mb-4">🎵 Música recomendada</h2>
              <iframe
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator"
                width="100%"
                height="280"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
              ></iframe>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}