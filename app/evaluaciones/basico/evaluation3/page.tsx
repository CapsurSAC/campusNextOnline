'use client';

import { useEffect, useState, useRef } from 'react';
import { loadLessonJson } from '@/app/lib/lessonLoader';
import { Button, Spinner, Chip } from '@nextui-org/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle, ChevronRight, XCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '@/public/styles/evaluation3-style.css';

type Question =
  | {
      type: 'audio-complete';
      audio: string;
      text: string;
      answers: string[];
      hint?: string;
    }
  | {
      type: 'build-sentence';
      audio: string;
      correct: string;
      words: string[];
    }
  | {
      type: 'multiple-choice';
      audio: string;
      question: string;
      options: string[];
      answer: string;
    };

interface EvaluationData {
  title: string;
  questions: Question[];
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function Evaluation3Page() {
  const router = useRouter();
  const [data, setData] = useState<EvaluationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const abandonoRegistrado = useRef(false);
  const alertaMostrada = useRef(false);

  useEffect(() => {
    async function fetchEvaluation() {
      try {
        // Obtener datos del usuario
        const meRes = await fetch('/api/auth/me');
        const me = await meRes.json();
        const usuarioId = me.user.userId;

        // Obtener inscripciones y curso
        const insRes = await fetch(`/api/inscripciones/usuario/${usuarioId}`);
        const inscripciones = await insRes.json();
        const cursoId = inscripciones[0]?.cursoId;

        console.log('Inscripciones encontradas:', inscripciones);

        if (!cursoId) {
          alert('No estás inscrito en ningún curso.');
          router.push('/evaluaciones');
          return;
        }

        // Guardar en localStorage
        localStorage.setItem('usuarioId', usuarioId.toString());
        localStorage.setItem('cursoId', cursoId.toString());

        // Verificar intentos
        const intentosRes = await fetch('/api/evaluaciones/intentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuarioId,
            cursoId,
            numeroEvaluacion: 3
          })
        });

        const intentos = await intentosRes.json();

        if (intentos.bloqueado && !alertaMostrada.current) {
          alertaMostrada.current = true;
          alert('❌ Ya agotaste tus 3 intentos para esta evaluación.');
          router.push('/evaluaciones');
          return;
        }

        // Cargar evaluación
        const json = await loadLessonJson('module1', 'evaluation3');
        setData(json);
      } catch {
        setError('No se pudo cargar la evaluación.');
      }
    }

    fetchEvaluation();

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') setShowIntro(false);
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, []);

  useEffect(() => {
    const handleAbandono = async () => {
      if (document.visibilityState === 'hidden' && !abandonoRegistrado.current) {
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
              numeroEvaluacion: 3,
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
  }, []);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  }

  if (!data || !data.questions[current]) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Spinner label="Loading evaluation..." />
      </div>
    );
  }

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
            ✍️ Antes de comenzar…
          </h1>
          <p className="text-lg mb-2 text-white/90">🧠 Esta evaluación incluye preguntas variadas sobre escritura, comprensión y armado de oraciones.</p>
          <p className="text-lg mb-2 text-white/90">⚠️ Tienes <span className="text-yellow-400 font-bold">solo 3 intentos</span>.</p>
          <p className="text-base text-yellow-300 italic mb-2">🚫 Abandonar esta pestaña o examen al responder una pregunta cuenta como intento perdido.</p>
          <p className="text-base text-white/90 mb-4">🟥 Las respuestas incorrectas se verán en rojo y las correctas en verde.</p>
          <p className="text-sm text-white/60">
            👉 Haz clic en cualquier parte o presiona <kbd className="bg-white/20 px-2 py-1 rounded text-sm">Enter</kbd> para comenzar.
          </p>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = data.questions[current];
  const isLast = current === data.questions.length - 1;

  const next = () => {
    setInputText('');
    setSelectedWords([]);
    setSelectedOption(null);
    setFeedback(null);
    setCurrent(current + 1);
  };

  const enviarNota = async (nota: number) => {
    try {
      const usuarioId = localStorage.getItem('usuarioId');
      const cursoId = localStorage.getItem('cursoId');

      if (!usuarioId || !cursoId) return;

      await fetch('/api/evaluaciones/responder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: parseInt(usuarioId),
          cursoId: parseInt(cursoId),
          numeroEvaluacion: 3,
          nota: nota.toString()
        })
      });

      abandonoRegistrado.current = true;
    } catch (error) {
      console.error('Error al enviar nota:', error);
    }
  };

  const evaluate = () => {
    if (!currentQuestion) return;

    let isCorrect = false; // esta es la que usaremos para sumar

    if (currentQuestion.type === 'audio-complete') {
      const userAns = inputText.trim().toLowerCase();
      isCorrect = currentQuestion.answers.some(
        (a) => a.trim().toLowerCase() === userAns
      );
      setFeedback(isCorrect ? '✅ ¡Correcto!' : `❌ Incorrecto: ${currentQuestion.answers[0]}`);
    }

    if (currentQuestion.type === 'build-sentence') {
      const userAns = selectedWords.join(' ').trim().toLowerCase();
      const correctAns = currentQuestion.correct.trim().toLowerCase();
      isCorrect = userAns === correctAns;
      setFeedback(isCorrect ? '✅ Bien armado.' : `❌ Incorrecto: ${currentQuestion.correct}`);
    }

    if (currentQuestion.type === 'multiple-choice') {
      isCorrect = selectedOption === currentQuestion.answer;
      setFeedback(isCorrect ? '✅ Muy bien.' : `❌ Era: ${currentQuestion.answer}`);
    }

    const puntosGanados = isCorrect ? 2 : 0;
    const nuevoScore = score + puntosGanados;
    setScore(nuevoScore);

    if (isLast) {
      setSubmitted(true);
      enviarNota(nuevoScore);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-6 relative">
      {/* Botón de salir */}
      {!submitted && (
        <Button
          onClick={() => setShowModal(true)}
          className="absolute right-6 top-6 text-white bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2 z-30"
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
            className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-lg border border-gray-800"
          >
            <p className="text-lg font-semibold text-white mb-4">¿Seguro que quieres abandonar la evaluación?</p>
            <div className="flex justify-center gap-4">
              <Button color="danger" onClick={() => router.push('/evaluaciones')}>Abandonar</Button>
              <Button color="default" onClick={() => setShowModal(false)}>Continuar</Button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="fancy-title text-center mb-4">{data.title}</h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="fancy-card"
          >
            {currentQuestion.type === 'audio-complete' && (
              <>
                <p className="text-lg mt-2">{currentQuestion.text.replace('____', '_____')}</p>
                <input
                  type="text"
                  disabled={feedback !== null}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full mt-4 p-3 bg-transparent text-white placeholder-gray-400 animated-border focus:outline-none"
                  placeholder="Tu respuesta"
                />
                {feedback && currentQuestion.hint && (
                  <p className="mt-2 text-sm text-yellow-300 italic">{currentQuestion.hint}</p>
                )}
              </>
            )}

            {currentQuestion.type === 'build-sentence' && (
              <>
                <p className="text-lg mt-4 mb-2 font-semibold text-white/90">Arma la oración:</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {shuffle(currentQuestion.words).map((word, idx) => {
                    const alreadyUsed = selectedWords.includes(word);
                    return (
                      <Chip
                        key={idx}
                        color="primary"
                        variant="shadow"
                        onClick={() => {
                          if (!alreadyUsed) setSelectedWords((prev) => [...prev, word]);
                        }}
                        className={`cursor-pointer select-none transition-all duration-200 ${
                          alreadyUsed ? 'opacity-30 pointer-events-none' : ''
                        }`}
                      >
                        {word}
                      </Chip>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded">
                  {selectedWords.map((w, idx) => (
                    <Chip
                      key={idx}
                      color="success"
                      onClick={() =>
                        setSelectedWords((prev) => prev.filter((item) => item !== w))
                      }
                    >
                      {w}
                    </Chip>
                  ))}
                </div>
              </>
            )}

            {currentQuestion.type === 'multiple-choice' && (
              <>
                <p className="text-lg mt-4 mb-4 text-center font-semibold text-white/90">{currentQuestion.question}</p>
                <div className="space-y-3">
                  {currentQuestion.options.map((opt, i) => (
                    <Button
                      key={i}
                      onClick={() => setSelectedOption(opt)}
                      fullWidth
                      className={`rounded-xl font-semibold transition-all py-3 ${
                        feedback
                          ? opt === currentQuestion.answer
                            ? 'bg-green-600 text-white'
                            : opt === selectedOption
                            ? 'bg-red-600 text-white'
                            : 'bg-white/10 text-white'
                          : selectedOption === opt
                          ? 'gradient-button'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      disabled={feedback !== null}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </>
            )}

            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`mt-6 flex items-center justify-center gap-3 px-5 py-3 rounded-xl text-lg font-semibold shadow-lg border
                  ${
                    feedback.startsWith('✅')
                      ? 'bg-green-500/20 text-green-300 border-green-500'
                      : 'bg-red-500/20 text-red-300 border-red-500'
                  }`}
              >
                {feedback.startsWith('✅') ? (
                  <CheckCircle className="text-green-400" size={24} />
                ) : (
                  <XCircle className="text-red-400" size={24} />
                )}
                <span>{feedback.replace(/^✅|^❌/, '').trim()}</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
            className={`gradient-button flex items-center gap-2 ${
              current === 0 && 'opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronLeft size={16} />
            Atrás
          </Button>

          {feedback === null ? (
            <Button
              onClick={evaluate}
              disabled={
                (currentQuestion.type === 'audio-complete' && !inputText) ||
                (currentQuestion.type === 'build-sentence' && currentQuestion.words.length === 0) ||
                (currentQuestion.type === 'multiple-choice' && !selectedOption)
              }
              className="gradient-button flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Verificar
            </Button>
          ) : !isLast ? (
            <Button onClick={next} className="gradient-button flex items-center gap-2">
              <ChevronRight size={16} />
              Siguiente
            </Button>
          ) : (
            <Button onClick={() => router.push('/evaluaciones')} className="gradient-button flex items-center gap-2">
              🎯 Finalizar
            </Button>
          )}
        </div>

        {submitted && (
          <div className="mt-10 text-center">
            <p className="text-xl font-bold text-yellow-300">
              🎉 Puntaje final: {score} / {data.questions.length * 2}
            </p>
            <p className="text-green-400 mt-2">¡Gracias por completar la evaluación!</p>
          </div>
        )}
      </div>
    </main>
  );
}