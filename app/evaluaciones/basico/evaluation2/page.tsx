'use client';

import { useEffect, useState, useRef } from 'react';
import { Button, Spinner } from '@nextui-org/react';
import { Star, LogOut } from 'lucide-react';
import Link from 'next/link';
import AudioCircleVisualizer from '@/components/AudioCircleVisualizer';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Exercise {
  audio: string;
  display: string;
  answer: string;
  options: string[];
}

interface EvaluationData {
  title: string;
  exercises: Exercise[];
}

function ClickableWord({
  word,
  onClick,
  disabled = false,
  removable = false,
}: {
  word: string;
  onClick: () => void;
  disabled?: boolean;
  removable?: boolean;
}) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-xl text-white text-sm font-medium shadow transition
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-indigo-500'}`}
    >
      <span>{word}</span>
    </div>
  );
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function Evaluation2Page() {
  const [data, setData] = useState<EvaluationData | null>(null);
  const [current, setCurrent] = useState(0);
  const [available, setAvailable] = useState<string[]>([]);
  const [sentence, setSentence] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const abandonoRegistrado = useRef(false);
  const bloqueoMostrado = useRef(false);
  const evaluacionIniciada = useRef(false);

  const router = useRouter();

  useEffect(() => {
    async function cargarEvaluacion() {
      try {
        const meRes = await fetch('/api/auth/me');
        const me = await meRes.json();
        const usuarioId = me.user.userId;

        const insRes = await fetch(`/api/inscripciones/usuario/${usuarioId}`);
        const inscripciones = await insRes.json();
        const cursoId = inscripciones[0]?.cursoId;

        localStorage.setItem('usuarioId', usuarioId.toString());
        localStorage.setItem('cursoId', cursoId.toString());

        if (!cursoId) {
          alert('No estás inscrito en ningún curso.');
          router.push('/evaluaciones');
          return;
        }

        // Verificar intentos
        const intentosRes = await fetch('/api/evaluaciones/intentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuarioId,
            cursoId,
            numeroEvaluacion: 2
          })
        });

        const result = await intentosRes.json();

        if (result.bloqueado) {
          if (!bloqueoMostrado.current) {
            alert('❌ Ya agotaste tus 3 intentos para esta evaluación.');
            bloqueoMostrado.current = true;
          }
          router.push('/evaluaciones');
          return;
        }

        // Si tiene intentos, carga la evaluación
        const evalRes = await fetch('/lessons/module1/evaluation2-listen.json');
        const json = await evalRes.json();
        setData(json);
        setAvailable(shuffle(json.exercises[0].options));
        setSentence([]);

      } catch (error) {
        console.error('Error al cargar evaluación:', error);
        alert('Ocurrió un error al cargar la evaluación.');
      }
    }

    cargarEvaluacion();

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') setShowIntro(false);
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, []);

  // Registrar abandono si el usuario cambia de pestaña sin completar
  // ✅ Escucha abandono
  useEffect(() => {
    const handleAbandono = async () => {
      const isHidden = document.visibilityState === 'hidden';

      if (
        isHidden &&
        !abandonoRegistrado.current &&
        evaluacionIniciada.current &&
        !submitted
      ) {
        const usuarioId = localStorage.getItem('usuarioId');
        const cursoId = localStorage.getItem('cursoId');

        if (!usuarioId || !cursoId) return;

        try {
          await fetch('/api/evaluaciones/responder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              usuarioId: parseInt(usuarioId),
              cursoId: parseInt(cursoId),
              numeroEvaluacion: 2,
              nota: 'abandono'
            })
          });

          abandonoRegistrado.current = true;
        } catch (error) {
          console.error('❌ Error al registrar abandono:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleAbandono);
    return () => document.removeEventListener('visibilitychange', handleAbandono);
  }, [submitted]);

  // ✅ Evalúa si se debe enviar la nota final
  useEffect(() => {
    if (
      submitted &&
      evaluacionIniciada.current &&
      data &&
      Array.isArray(data.exercises) &&
      current === data.exercises.length - 1
    ) {
      enviarNota(score);
    }
  }, [submitted]);

  

  const handleAddWord = (word: string) => {
    if (submitted) return;
    setAvailable((prev) => prev.filter((w) => w !== word));
    setSentence((prev) => [...prev, word]);
  };

  const handleRemoveWord = (word: string) => {
    if (submitted) return;
    setSentence((prev) => prev.filter((w) => w !== word));
    setAvailable((prev) => [...prev, word]);
  };

  const checkAnswer = () => {
    if (!data) return;

    evaluacionIniciada.current = true; // ✅ Marca inicio

    const correct = data.exercises[current].answer.toLowerCase().trim();
    const user = sentence.join(' ').toLowerCase().trim();
    const isLast = current === data.exercises.length - 1;
    const earned = correct === user ? 2 : 0;

    setScore((prev) => {
      const total = prev + earned;
      if (isLast) {
        setTimeout(() => {
          enviarNota(total); // ✅ le pasas el valor actualizado
        }, 500);
      }
      return total;
    });

    setSubmitted(true);
  };

  const enviarNota = async (nota: number) => {
    try {
      const usuarioId = localStorage.getItem('usuarioId');
      const cursoId = localStorage.getItem('cursoId');

      if (!usuarioId || !cursoId) return;

      const res = await fetch('/api/evaluaciones/responder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: parseInt(usuarioId),
          cursoId: parseInt(cursoId),
          numeroEvaluacion: 2, // o el número que corresponda
          nota: nota.toString()
        })
      });

      if (res.ok) {
        abandonoRegistrado.current = true; // ✅ Solo si se envió exitosamente
      } else {
        console.error('❌ Error al guardar nota:', await res.text());
      }
    } catch (err) {
      console.error('❌ Error al enviar nota:', err);
    }
  };

  const nextExercise = () => {
    if (!data) return;
    const next = current + 1;
    if (next < data.exercises.length) {
      setCurrent(next);
      setAvailable(shuffle(data.exercises[next].options));
      setSentence([]);
      setSubmitted(false);
    }
  };

  const handleExit = () => {
    router.push('/evaluaciones'); // Redirige al home de evaluaciones
  };

  if (!data) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <Spinner label="Loading evaluation..." />
      </div>
    );
  }

  const exercise = data.exercises[current];
  const allDone = submitted && current === data.exercises.length - 1;

  if (showIntro) {
    return (
        <div
          onClick={() => setShowIntro(false)}
          className="min-h-screen w-full flex justify-center items-center intro-background px-6"
        >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl px-8 py-10 max-w-2xl text-center text-white shadow-2xl"
        >
          <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 animate-gradient-x">
            🎧 Antes de comenzar…
          </h1>

          <p className="text-lg mb-2 text-white/90">
            🔊 Esta evaluación está basada en comprensión auditiva y armado de oraciones.
          </p>

          <p className="text-lg mb-2 text-white/90">
            ⚠️ Tienes <span className="text-yellow-400 font-bold">solo 3 intentos</span> para completar esta evaluación.
          </p>

          <p className="text-base text-yellow-300 italic mb-4">
            ❌ Si abandonas la evaluación o la pestaña una vez respondida una pregunta, se contará como un intento perdido.
          </p>

          <p className="text-sm text-white/60">
            👉 Haz clic en cualquier parte o presiona <kbd className="bg-white/20 px-2 py-1 rounded text-sm">Enter</kbd> para comenzar.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 to-black text-white px-4 py-10">
      <div className="max-w-4xl mx-auto relative">
        {/* Botón de salir */}
        <Button
          onClick={() => setShowModal(true)}
          className="absolute right-0 top-0 text-white bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2"
          size="sm"
        >
          <LogOut size={16} className="mr-2" />
          Salir
        </Button>

        <h1 className="text-3xl font-bold text-center mb-8">{data.title}</h1>

        <div className="bg-white/10 p-6 rounded-2xl shadow-lg mb-10 border border-white/10">
          <p className="mb-4 font-medium text-lg">
            Ejercicio {current + 1} de {data.exercises.length}
          </p>
          <AudioCircleVisualizer src={exercise.audio} />

          <div className="mb-6">
            <p className="text-sm text-white/70 mb-2">Palabras disponibles:</p>
            <div className="flex flex-wrap gap-2 bg-slate-800/30 px-4 py-3 rounded-lg min-h-[48px]">
              {available.map((word) => (
                <ClickableWord
                  key={word}
                  word={word}
                  onClick={() => handleAddWord(word)}
                  disabled={submitted}
                />
              ))}
            </div>
          </div>

          <p className="text-sm text-white/70 mb-2">Oración construida:</p>
          <div className="flex flex-wrap gap-3 min-h-[56px] bg-black/40 px-4 py-4 rounded-xl border border-dashed border-white/20">
            {sentence.length === 0 ? (
              <span className="text-white/30 italic text-sm">
                Haz clic en las palabras para construir la oración...
              </span>
            ) : (
              sentence.map((word) => (
                <ClickableWord
                  key={word}
                  word={word}
                  onClick={() => handleRemoveWord(word)}
                  removable
                  disabled={submitted}
                />
              ))
            )}
          </div>

          {submitted && (
            <div
              className={`mt-4 font-semibold px-4 py-3 rounded-lg text-center text-sm ${
                sentence.join(' ') === exercise.answer
                  ? 'bg-green-700 text-green-100'
                  : 'bg-red-700 text-red-100'
              }`}
            >
              {sentence.join(' ') === exercise.answer
                ? '¡Correcto! 🎉'
                : `Incorrecto. La respuesta correcta es: "${exercise.display}"`}
            </div>
          )}
        </div>

        {!submitted ? (
          <div className="text-center">
            <Button color="primary" onClick={checkAnswer}>
              Verificar
            </Button>
          </div>
        ) : allDone ? (
          <div className="text-center mt-12 space-y-6">
            <p className="text-2xl font-bold">¡Evaluación completada!</p>
            <div className="flex justify-center gap-2">
              {[...Array(score / 2)].map((_, i) => (
                <Star key={i} className="text-yellow-400" />
              ))}
            </div>
            <p className="text-xl">
              Puntaje: <strong>{score} / {data.exercises.length * 2}</strong>
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button as={Link} href="/basico/evaluation3" color="primary" size="lg">
                Siguiente Examen
              </Button>
              <Button as={Link} href="/evaluaciones" variant="bordered" size="lg">
                Volver a Básico
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center mt-4">
            <Button color="success" onClick={nextExercise}>
              Siguiente ejercicio
            </Button>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-lg"
          >
            <p className="text-lg font-semibold text-white mb-4">
              ¿Seguro que quieres abandonar la evaluación?
            </p>
            <div className="flex justify-center gap-4">
              <Button color="danger" onClick={handleExit}>
                Abandonar
              </Button>
              <Button color="default" onClick={() => setShowModal(false)}>
                Continuar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}