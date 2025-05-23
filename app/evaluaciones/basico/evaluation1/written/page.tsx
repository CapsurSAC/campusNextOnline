'use client';

import { useEffect, useState, useRef } from 'react';
import { Spinner, Button } from '@nextui-org/react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadLessonJson } from '@/app/lib/lessonLoader';
import { CheckCircle, XCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WrittenQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface EvaluationData {
  title: string;
  questions: WrittenQuestion[];
}

export default function WrittenEvaluation() {
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<null | boolean>(null);
  const [locked, setLocked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const bloqueoMostrado = useRef(false);

  const router = useRouter();

  useEffect(() => {
    async function verificarIntentos() {
      const meRes = await fetch('/api/auth/me');
      const me = await meRes.json();
      const usuarioId = me.user.userId;

      const insRes = await fetch(`/api/inscripciones/usuario/${usuarioId}`);
      const inscripciones = await insRes.json();
      const cursoId = inscripciones[0]?.cursoId;

      if (!cursoId) {
        if (!bloqueoMostrado.current) {
          alert('No estás inscrito en ningún curso.');
          bloqueoMostrado.current = true;
        }
        router.push('/evaluaciones');
        return;
      }

      const res = await fetch('/api/evaluaciones/intentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuarioId,
          cursoId,
          numeroEvaluacion: 1
        })
      });

      const result = await res.json();

      if (result.bloqueado) {
        if (!bloqueoMostrado.current) {
          alert('❌ Ya agotaste tus 3 intentos para esta evaluación.');
          bloqueoMostrado.current = true;
        }
        router.push('/evaluaciones');
        return;
      }

      const data = await loadLessonJson('module1', 'evaluation1-written');

      setEvaluation(data);
      setUserAnswers(Array(data.questions.length).fill(''));
      setUsuarioId(usuarioId);
    }

    verificarIntentos();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') setShowIntro(false);
    };
    if (showIntro) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showIntro]);

  const handleOptionClick = (val: string) => {
    if (locked) return;
    const correct = evaluation!.questions[currentPage].correctAnswer === val;
    const newAnswers = [...userAnswers];
    newAnswers[currentPage] = val;
    setUserAnswers(newAnswers);
    setFeedback(correct);
    setLocked(true);
    new Audio(`/sounds/${correct ? 'correct' : 'wrong'}.mp3`).play();
  };

  const nextQuestion = () => {
    setCurrentPage((p) => p + 1);
    setFeedback(null);
    setLocked(false);
  };

  const finishEvaluation = () => {
    let total = 0;
    evaluation!.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) total += 2;
    });
    setScore(total);
    setSubmitted(true);
    enviarNota(total); // ✅ Aquí mandamos el puntaje real
  };

  const handleExit = async () => {
    const meRes = await fetch('/api/auth/me');
    const me = await meRes.json();
    const usuarioId = me.user.userId;

    try {
      await fetch('/api/evaluaciones/responder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuarioId,
          numeroEvaluacion: 1,
          nota: 'abandono'
        })
      });
    } catch (error) {
      console.error('Error al registrar abandono:', error);
    } finally {
      router.push('/evaluaciones');
    }
  };

  if (!evaluation) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <Spinner label="Cargando evaluación..." />
      </div>
    );
  }

  const current = evaluation.questions[currentPage];
  const isLast = currentPage === evaluation.questions.length - 1;

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
            🎓 Antes de comenzar…
          </h1>

          <p className="text-lg mb-2 text-white/90">
            ⚠️ Recuerda que tienes <span className="text-yellow-400 font-bold">solo 3 intentos</span> para completar esta evaluación.
          </p>

          <p className="text-base text-yellow-300 italic mb-2">
            🚫 Si abandonas la evaluación, se contará como un intento perdido.
          </p>

          <p className="text-base text-white/90 mb-4">
            🟥 Las respuestas incorrectas se marcarán en <span className="text-red-400 font-semibold">rojo</span> y las correctas en <span className="text-green-400 font-semibold">verde</span>.
          </p>

          <p className="text-sm text-white/60">
            👉 Haz clic en cualquier parte o presiona <kbd className="bg-white/20 px-2 py-1 rounded text-sm">Enter</kbd> para comenzar.
          </p>
        </motion.div>
      </div>
    );
  }

  const enviarNota = async (nota: number) => {
    const meRes = await fetch('/api/auth/me');
    const me = await meRes.json();
    const usuarioId = me.user.userId;

    try {
      const res = await fetch('/api/evaluaciones/responder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuarioId,
          numeroEvaluacion: 1,
          nota: nota.toString()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Error:', data.error);
        alert(data.error);
      } else {
        console.log('✅ Nota guardada:', data.data);
        alert('Evaluación enviada con éxito');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 to-black text-white px-4 py-8 relative">
      {/* Botón de salir (estilo Evaluación 2) */}
      {!submitted && (
        <Button
          onClick={() => setShowModal(true)}
          className="absolute right-4 top-4 text-white bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2 z-30"
          size="sm"
        >
          <LogOut size={16} className="mr-2" />
          Salir
        </Button>
      )}

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

      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">{evaluation.title}</h1>

        {!submitted ? (
          <>
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 p-6 rounded-2xl shadow-xl"
            >
              <p className="mb-4 font-semibold text-xl">{currentPage + 1}. {current.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.options.map((opt, j) => {
                  const isSelected = userAnswers[currentPage] === opt;
                  const isCorrect = current.correctAnswer === opt;

                  const feedbackColor = feedback != null
                    ? isCorrect
                      ? 'bg-green-600 border-green-500'
                      : isSelected
                      ? 'bg-red-600 border-red-500'
                      : 'bg-white/20'
                    : isSelected
                    ? 'bg-blue-600 border-blue-500'
                    : 'bg-white/20';

                  return (
                    <button
                      key={j}
                      onClick={() => handleOptionClick(opt)}
                      disabled={locked}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium text-sm sm:text-base transition-all ${feedbackColor}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <div className="flex justify-center mt-6">
              {!isLast ? (
                <Button color="primary" onClick={nextQuestion} disabled={!locked}>
                  Siguiente
                </Button>
              ) : (
                <Button color="success" onClick={finishEvaluation} disabled={!locked}>
                  Finalizar
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center mt-12 px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="bg-gradient-to-br from-[#1e293b]/50 to-[#0f172a]/50 p-8 rounded-3xl shadow-xl backdrop-blur-lg border border-white/10"
            >
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">
                🎉 ¡Evaluación completada!
              </h2>
              <p className="text-xl text-white/90 mb-2">
                Tu puntaje: <span className="font-bold text-green-300">{score} / {evaluation.questions.length * 2}</span>
              </p>
              <p className="text-base text-white/80 italic mb-6">
                Gracias por tu esfuerzo. ¡Sigue así y conquista el siguiente reto!
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <Button
                  onClick={() => router.push('/evaluaciones')}
                  className="bg-white/10 border border-white/20 text-white font-semibold py-2 px-6 rounded-lg hover:bg-white/20 transition"
                >
                  🔙 Ir a evaluaciones
                </Button>
                <Button
                  onClick={() => router.push('/evaluaciones/basico/evaluation2')}
                  className="bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-semibold py-2 px-6 rounded-lg hover:scale-105 transition"
                >
                  ➡️ Siguiente examen
                </Button>
              </div>
            </motion.div>
          </div>
                  )}
      </div>
    </main>
  );
}