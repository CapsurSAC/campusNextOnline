'use client';

import { useEffect, useState } from 'react';
import { Spinner, Button, Card, CardBody, Input } from '@nextui-org/react';

interface WrittenQuestion {
  question: string;
  expectedAnswer: string;
}

interface WrittenEvaluation {
  title: string;
  instructions: string;
  questions: WrittenQuestion[];
}

export default function WrittenEvaluationPage() {
  const [evaluation, setEvaluation] = useState<WrittenEvaluation | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadEvaluation() {
      const res = await fetch('/modules/module1/evaluation1-written.json');
      const data: WrittenEvaluation = await res.json();
      setEvaluation(data);
      setUserAnswers(Array(data.questions.length).fill(''));
    }
    loadEvaluation();
  }, []);

  const handleChange = (index: number, value: string) => {
    const updated = [...userAnswers];
    updated[index] = value;
    setUserAnswers(updated);
  };

  const isCorrect = (expected: string, actual: string) =>
    expected.trim().toLowerCase() === actual.trim().toLowerCase();

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (!evaluation) return <Spinner label="Cargando evaluación..." color="primary" />;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">{evaluation.title}</h1>
      <p className="text-center text-gray-600">{evaluation.instructions}</p>

      {evaluation.questions.map((q, i) => (
        <Card key={i} shadow="sm" className="w-full">
          <CardBody className="space-y-2">
            <p className="font-medium">{i + 1}. {q.question}</p>
            <Input
              disabled={submitted}
              variant="bordered"
              placeholder="Tu respuesta"
              value={userAnswers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-full"
            />
            {submitted && (
              <p className={`text-sm ${isCorrect(q.expectedAnswer, userAnswers[i]) ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect(q.expectedAnswer, userAnswers[i])
                  ? '✅ Correcto'
                  : `❌ Incorrecto. Respuesta esperada: ${q.expectedAnswer}`}
              </p>
            )}
          </CardBody>
        </Card>
      ))}

      {!submitted ? (
        <Button color="primary" onClick={handleSubmit}>
          Enviar respuestas
        </Button>
      ) : (
        <div className="text-center text-green-700 font-semibold">
          Evaluación enviada. ¡Buen trabajo!
        </div>
      )}
    </div>
  );
}
