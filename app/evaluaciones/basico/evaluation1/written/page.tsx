'use client';

import { useEffect, useState } from 'react';
import { Spinner, Button, Progress } from '@nextui-org/react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadLessonJson } from "@/app/lib/lessonLoader";

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
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    async function loadEvaluation() {
      try {
        const data = await loadLessonJson('module1', 'evaluation1-written');
        setEvaluation(data);
        setUserAnswers(Array(data.questions.length).fill(''));
      } catch (error) {
        console.error('Error al cargar la evaluación:', error);
      }
    }
    loadEvaluation();
  }, []);

  const handleOptionChange = (value: string) => {
    const updated = [...userAnswers];
    updated[currentPage] = value;
    setUserAnswers(updated);
  };

  const handleSubmit = () => {
    if (!evaluation) return;
    let points = 0;
    evaluation.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) {
        points += 2;
      }
    });
    setScore(points);
    setSubmitted(true);
  };

  if (!evaluation) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <Spinner label="Cargando evaluación..." />
      </div>
    );
  }

  const currentQuestion = evaluation.questions[currentPage];
  const progress = ((currentPage + 1) / evaluation.questions.length) * 100;

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">{evaluation.title}</h1>

        {!submitted ? (
          <>
            <Progress
              aria-label="Progreso"
              value={progress}
              color="primary"
              className="mb-6"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4 }}
                className="mb-6 bg-white/10 p-4 rounded-xl"
              >
                <p className="mb-2 font-medium">{currentPage + 1}. {currentQuestion.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentQuestion.options.map((opt, j) => (
                    <label
                      key={j}
                      className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer 
                        ${userAnswers[currentPage] === opt ? 'bg-blue-600' : 'bg-white/20'}
                      `}
                    >
                      <input
                        type="radio"
                        name={`q${currentPage}`}
                        value={opt}
                        checked={userAnswers[currentPage] === opt}
                        onChange={() => handleOptionChange(opt)}
                        className="accent-blue-500"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center mt-4">
              <Button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Atrás
              </Button>

              {currentPage < evaluation.questions.length - 1 ? (
                <Button
                  color="primary"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!userAnswers[currentPage]}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  color="success"
                  onClick={handleSubmit}
                  disabled={userAnswers.includes('')}
                >
                  Enviar respuestas
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center mt-10">
            <p className="text-xl font-bold mb-4">
              ¡Evaluación completada! Puntaje: {score} / {evaluation.questions.length * 2}
            </p>
            {evaluation.questions.map((q, i) => (
              <div key={i} className="mb-4 text-left">
                <p className="font-semibold">{i + 1}. {q.question}</p>
                <p className={`text-sm ${userAnswers[i] === q.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                  Tu respuesta: {userAnswers[i]}<br />
                  Correcta: {q.correctAnswer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
