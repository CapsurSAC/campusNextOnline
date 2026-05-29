'use client';

import { useEffect, useState, useRef } from 'react';
import { Button, Spinner } from '@nextui-org/react';
import { Star, LogOut } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';

interface Pregunta {
  id: number;
  enunciado: string;
  opciones: string[];
  respuestaCorrecta: string;
  audioUrl?: string | null;
}

interface EvaluacionData {
  id: number;
  titulo: string;
  descripcion: string;
  preguntas: Pregunta[];
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function EvaluacionDinamicaPage() {
  const params = useParams();
  const router = useRouter();

  const evaluacionId = parseInt(params.evaluacionId as string);

  const [data, setData] = useState<EvaluacionData | null>(null);
  const [current, setCurrent] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const abandonoRegistrado = useRef(false);
  const bloqueoMostrado = useRef(false);
  const evaluacionIniciada = useRef(false);

  useEffect(() => {
    async function cargarEvaluacion() {
      try {
        if (isNaN(evaluacionId)) {
          alert('ID de evaluación no válido.');
          router.push('/evaluaciones');
          return;
        }

        const meRes = await fetch('/api/auth/me');
        const me = await meRes.json();
        const usuarioId = me.user?.userId;

        if (!usuarioId) {
           router.push('/login');
           return;
        }

        const insRes = await fetch(`/api/inscripciones/usuario/${usuarioId}`);
        const inscripciones = await insRes.json();
        const cursoId = inscripciones[0]?.cursoId;

        localStorage.setItem('usuarioId', usuarioId.toString());
        if (cursoId) localStorage.setItem('cursoId', cursoId.toString());

        // Verificar intentos (descomentar y ajustar la API según lo necesites)
        /*
        const intentosRes = await fetch('/api/evaluaciones/intentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuarioId,
            cursoId,
            numeroEvaluacion: evaluacionId
          })
        });

        const result = await intentosRes.json();
        if (result.bloqueado) {
          if (!bloqueoMostrado.current) {
            alert('❌ Ya agotaste tus intentos para esta evaluación.');
            bloqueoMostrado.current = true;
          }
          router.push('/evaluaciones');
          return;
        }
        */

        // Cargar las preguntas de la BD
        const evRes = await fetch(`/api/evaluaciones/${evaluacionId}`);
        if (!evRes.ok) {
           alert('No se pudo cargar la evaluación');
           return;
        }
        
        const evaluacionData = await evRes.json();
        
        if (!evaluacionData || evaluacionData.preguntas.length === 0) {
           alert('Esta evaluación aún no tiene preguntas configuradas.');
           router.push('/evaluaciones');
           return;
        }

        // Parseamos las opciones porque vienen como string JSON
        const parsedData = {
          ...evaluacionData,
          preguntas: evaluacionData.preguntas.map((p: any) => ({
            ...p,
            opciones: shuffle(JSON.parse(p.opciones))
          }))
        };

        setData(parsedData);

      } catch (error) {
        console.error('Error al cargar evaluación:', error);
      }
    }

    cargarEvaluacion();

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') setShowIntro(false);
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [evaluacionId, router]);

  // Enviar nota al finalizar
  useEffect(() => {
    if (submitted && data && current === data.preguntas.length - 1) {
      enviarNota(score);
    }
  }, [submitted, data, current, score]);

  const checkAnswer = () => {
    if (!data || !selectedOption) return;

    evaluacionIniciada.current = true;
    const correct = data.preguntas[current].respuestaCorrecta;
    const isCorrect = selectedOption.trim().toLowerCase() === correct.trim().toLowerCase();
    
    // Asumimos 2 puntos por pregunta correcta
    const earned = isCorrect ? 2 : 0;
    setScore(prev => prev + earned);
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
          numeroEvaluacion: evaluacionId,
          nota: nota.toString()
        })
      });

      if (res.ok) {
        abandonoRegistrado.current = true;
      }
    } catch (err) {
      console.error('Error al enviar nota:', err);
    }
  };

  const nextExercise = () => {
    if (!data) return;
    const next = current + 1;
    if (next < data.preguntas.length) {
      setCurrent(next);
      setSelectedOption(null);
      setSubmitted(false);
    }
  };

  const handleExit = () => {
    router.push('/evaluaciones');
  };

  if (!data) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <Spinner label="Cargando evaluación..." />
      </div>
    );
  }

  const pregunta = data.preguntas[current];
  const isLast = current === data.preguntas.length - 1;
  const allDone = submitted && isLast;

  if (showIntro) {
    return (
      <div onClick={() => setShowIntro(false)} className="min-h-screen flex justify-center items-center bg-gray-900 px-6 cursor-pointer">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 p-10 rounded-2xl text-center text-white backdrop-blur-md max-w-lg"
        >
          <h1 className="text-3xl font-bold mb-4">{data.titulo}</h1>
          <p className="mb-6 text-gray-300">{data.descripcion}</p>
          <p className="text-yellow-400 text-sm mb-4">Tienes 3 intentos disponibles.</p>
          <p className="text-gray-400 text-xs">Haz clic o presiona Enter para comenzar.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 to-black text-white px-4 py-10 relative">
      <div className="max-w-3xl mx-auto">
        <Button onClick={() => setShowModal(true)} className="absolute right-6 top-6" color="danger" size="sm">
          <LogOut size={16} className="mr-2" /> Salir
        </Button>

        <h1 className="text-3xl font-bold text-center mb-8">{data.titulo}</h1>

        <div className="bg-white/10 p-8 rounded-2xl shadow-lg border border-white/20 mb-8">
          <p className="text-gray-400 text-sm mb-4">Pregunta {current + 1} de {data.preguntas.length}</p>
          <h2 className="text-xl font-semibold mb-6">{pregunta.enunciado}</h2>

          <div className="space-y-3">
            {pregunta.opciones.map((opt, i) => (
              <button
                key={i}
                disabled={submitted}
                onClick={() => setSelectedOption(opt)}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  selectedOption === opt
                    ? 'border-indigo-500 bg-indigo-500/20'
                    : 'border-white/10 hover:bg-white/5 bg-transparent'
                } ${submitted ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          {submitted && (
            <div className={`mt-6 p-4 rounded-lg font-bold text-center ${
              selectedOption?.trim().toLowerCase() === pregunta.respuestaCorrecta.trim().toLowerCase()
                ? 'bg-green-600/30 text-green-400 border border-green-600'
                : 'bg-red-600/30 text-red-400 border border-red-600'
            }`}>
              {selectedOption?.trim().toLowerCase() === pregunta.respuestaCorrecta.trim().toLowerCase()
                ? '¡Correcto!'
                : `Incorrecto. La respuesta era: ${pregunta.respuestaCorrecta}`
              }
            </div>
          )}
        </div>

        {!submitted ? (
          <div className="text-center">
            <Button color="primary" onClick={checkAnswer} disabled={!selectedOption} size="lg">
              Verificar
            </Button>
          </div>
        ) : allDone ? (
          <div className="text-center mt-12">
            <h2 className="text-3xl font-bold mb-4">¡Evaluación completada!</h2>
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(Math.floor(score / 2))].map((_, i) => <Star key={i} className="text-yellow-400" />)}
            </div>
            <p className="text-xl mb-8">Puntaje final: {score} / {data.preguntas.length * 2}</p>
            <Button as={Link} href="/evaluaciones" color="primary" size="lg">
              Volver a Evaluaciones
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Button color="success" onClick={nextExercise} size="lg">
              Siguiente Pregunta
            </Button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-2xl text-center max-w-sm w-full">
             <p className="mb-6 font-semibold">¿Seguro que quieres abandonar?</p>
             <div className="flex justify-center gap-4">
                <Button color="danger" onClick={handleExit}>Abandonar</Button>
                <Button onClick={() => setShowModal(false)}>Cancelar</Button>
             </div>
          </div>
        </div>
      )}
    </main>
  );
}
