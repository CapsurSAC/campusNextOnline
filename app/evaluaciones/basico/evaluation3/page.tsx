'use client';

import { useEffect, useState } from 'react';
import { loadLessonJson } from '@/app/lib/lessonLoader';
import { Button, Input, Spinner } from '@nextui-org/react';
import { motion, AnimatePresence } from 'framer-motion';

interface FillInExercise {
  text: string;
  answers: string[];
  hint?: string;
}

interface EvaluationData {
  title: string;
  exercises: FillInExercise[];
}

export default function FillInEvaluation() {
  const [data, setData] = useState<EvaluationData | null>(null);
  const [responses, setResponses] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const json = await loadLessonJson('module1', 'evaluation3-fill'); // <- Asegúrate del nombre correcto
      setData(json);
      setResponses(Array(json.exercises.length).fill(''));
    }
    fetchData();
  }, []);

  const handleChange = (value: string) => {
    const updated = [...responses];
    updated[current] = value;
    setResponses(updated);
  };

  const handleSubmit = () => {
    if (!data) return;
    let points = 0;
    data.exercises.forEach((ex, i) => {
      const userAnswer = responses[i]?.trim().toLowerCase();
      const isCorrect = ex.answers?.some(
        (ans) => userAnswer === ans.trim().toLowerCase()
      );
      if (isCorrect) points += 2;
    });
    setScore(points);
    setSubmitted(true);
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Spinner label="Cargando evaluación..." />
      </div>
    );
  }

  const ex = data.exercises[current];
  const isLast = current === data.exercises.length - 1;
  const userAnswer = responses[current]?.trim().toLowerCase();
  const isCorrect = ex.answers?.some(
    (ans) => userAnswer === ans.trim().toLowerCase()
  );

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">{data.title}</h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="bg-white/10 p-6 rounded-xl"
          >
            <p className="mb-2">Ejercicio {current + 1} de {data.exercises.length}:</p>
            <p className="mb-4">{ex.text.replace("____", "_____")}</p>

            <Input
              placeholder="Tu respuesta"
              disabled={submitted}
              value={responses[current]}
              onChange={(e) => handleChange(e.target.value)}
              className="text-black"
            />

            {submitted && (
              <p className={`mt-2 text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect
                  ? '✅ ¡Correcto!'
                  : `❌ Incorrecto. Respuesta correcta: ${ex.answers[0]}`}
              </p>
            )}

            {submitted && !isCorrect && ex.hint && (
              <p className="mt-2 text-yellow-300 text-sm italic">Pista: {ex.hint}</p>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center mt-6">
          <Button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            Atrás
          </Button>

          {isLast && !submitted ? (
            <Button
              color="success"
              onClick={handleSubmit}
              disabled={responses.includes('')}
            >
              Enviar respuestas
            </Button>
          ) : (
            <Button
              color="primary"
              onClick={() => setCurrent(current + 1)}
              disabled={current >= data.exercises.length - 1}
            >
              Siguiente
            </Button>
          )}
        </div>

        {submitted && current === data.exercises.length - 1 && (
          <div className="text-center mt-8">
            <p className="text-xl font-bold">
              Puntaje obtenido: {score} / {data.exercises.length * 2}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
