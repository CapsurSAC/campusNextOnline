'use client';

import { useEffect, useState } from 'react';
import { loadLessonJson } from '@/app/lib/lessonLoader';
import { Button, Spinner } from '@nextui-org/react';

interface DragDropData {
  title: string;
  exercises: {
    sentence: string;            // oración completa
    scrambled: string[];         // palabras desordenadas
  }[];
}

export default function DragDropEvaluation() {
  const [data, setData] = useState<DragDropData | null>(null);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      const json = await loadLessonJson('module1', 'evaluation2-dragdrop');
      setData(json);
      setAnswers(json.exercises.map(() => []));
    }
    fetchData();
  }, []);

  const handleDrop = (word: string, exIndex: number) => {
    setAnswers(prev => {
      const updated = [...prev];
      if (!updated[exIndex].includes(word)) {
        updated[exIndex].push(word);
      }
      return updated;
    });
  };

  const handleReset = (exIndex: number) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[exIndex] = [];
      return updated;
    });
  };

  const handleSubmit = () => {
    if (!data) return;
    let points = 0;
    data.exercises.forEach((ex, i) => {
      const userSentence = answers[i].join(' ').trim();
      if (userSentence.toLowerCase() === ex.sentence.toLowerCase()) {
        points += 2;
      }
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

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold text-center mb-6">{data.title}</h1>

      {data.exercises.map((ex, i) => (
        <div key={i} className="mb-8 bg-white/10 p-4 rounded-lg">
          <p className="mb-2 font-medium">Ejercicio {i + 1}:</p>

          <div className="flex flex-wrap gap-2 mb-2">
            {ex.scrambled.map((word, j) => (
              <button
                key={j}
                disabled={answers[i].includes(word) || submitted}
                onClick={() => handleDrop(word, i)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                {word}
              </button>
            ))}
          </div>

          <div className="bg-black/50 min-h-[40px] px-3 py-2 rounded text-sm mb-2">
            {answers[i].join(' ')}
          </div>

          {!submitted && (
            <Button color="danger" size="sm" onClick={() => handleReset(i)}>
              Limpiar
            </Button>
          )}
        </div>
      ))}

      {!submitted ? (
        <Button color="primary" onClick={handleSubmit}>
          Enviar respuestas
        </Button>
      ) : (
        <p className="text-xl font-bold text-center">Puntaje: {score} / {data.exercises.length * 2}</p>
      )}
    </main>
  );
}