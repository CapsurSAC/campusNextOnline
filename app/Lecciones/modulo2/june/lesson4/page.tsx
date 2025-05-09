"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner, Button } from "@nextui-org/react";
import { isEnglishRelated } from "@/app/utils/isEnglishRelated";
//import { useSearchParams } from "next/navigation";

import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  VoiceEmotion,
  TaskType,
  TaskMode,
} from "@heygen/streaming-avatar";

interface LessonStep {
  text: string;
  expectedResponse?: string;
}

interface LessonData {
  title: string;
  avatarScript: string;
  dialog: LessonStep[];
}

export default function Lesson1VoiceOnly() {
  //const searchParams = useSearchParams();
  //const user_id = searchParams.get("user_id") || "0";

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ from: "avatar" | "user"; message: string }[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);

  async function fetchAccessToken() {
    const res = await fetch("/api/get-access-token", { method: "POST" });
    return await res.text();
  }

  async function saveProgress(step: number) {
    try {
      await fetch("https://www.nextingles.com/campus/plugin/inglesia/save-progreso.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
         // user_id,
          lesson_id: "module1_lesson1",
          step,
          completed: step >= (lesson?.dialog.length ?? 1) - 1,
        }),
      });
    } catch (err) {
      console.error("❌ Error al guardar progreso:", err);
    }
  }

  async function loadProgress() {
    try {
      const res = await fetch("https://www.nextingles.com/campus/plugin/inglesia/get-progreso.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ user_id, lesson_id: "module1_lesson1" }),
      });

      const data = await res.json();
      console.log("📦 Progreso recuperado:", data);
      setCurrentStep(data.step || 0);
      if (data.completed) setSessionEnded(true);
    } catch (err) {
      console.error("⚠️ No se pudo recuperar progreso:", err);
    }
  }

  async function speakNextStep() {
    const step = lesson?.dialog[currentStep];
    if (!step || !avatar.current) return;

    setCurrentText(step.text);
    setChatHistory((prev) => [...prev, { from: "avatar", message: step.text }]);

    await avatar.current.speak({
      text: step.text,
      taskType: TaskType.TALK,
      taskMode: TaskMode.ASYNC,
    });

    await saveProgress(currentStep);
    setAwaitingResponse(true);
    avatar.current.startListening();
  }

  async function startLesson() {
    setIsSessionLoading(true);
    setSessionEnded(false);

    const token = await fetchAccessToken();

    avatar.current = new StreamingAvatar({
      token,
      basePath: process.env.NEXT_PUBLIC_BASE_API_URL,
    });

    avatar.current.on(StreamingEvents.STREAM_READY, (e) => setStream(e.detail));
    avatar.current.on(StreamingEvents.USER_START, () => setIsUserTalking(true));

    avatar.current.on(StreamingEvents.USER_STOP, async (e: any) => {
      setIsUserTalking(false);
      if (!awaitingResponse || isPaused) return;

      const transcript = e.detail.transcript?.toLowerCase() || "";

      if (isEnglishRelated(transcript)) {
        await avatar.current?.speak({
          text: `Buena pregunta. "${transcript}". Ahora volvamos a nuestra clase.`,
          taskType: TaskType.TALK,
          taskMode: TaskMode.ASYNC,
        });

        setChatHistory((prev) => [
          ...prev,
          { from: "user", message: transcript },
          { from: "avatar", message: `Buena pregunta. "${transcript}". Ahora volvamos a nuestra clase.` },
        ]);
      } else {
        await avatar.current?.speak({
          text: "Lo siento, solo puedo responder temas relacionados con la clase de inglés. Por favor, continuemos con la lección.",
          taskType: TaskType.TALK,
          taskMode: TaskMode.ASYNC,
        });

        setChatHistory((prev) => [
          ...prev,
          { from: "user", message: transcript },
          { from: "avatar", message: "Lo siento, solo puedo responder temas relacionados con la clase de inglés. Por favor, continuemos con la lección." }
        ]);
      }

      setAwaitingResponse(false);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        speakNextStep();
      }, 1000);
    });

    await avatar.current.createStartAvatar({
      quality: AvatarQuality.Medium,
      avatarName: "June_HR_public",
      language: "es",
      disableIdleTimeout: true,
      voice: { rate: 1.1, emotion: VoiceEmotion.FRIENDLY },
    });

    await avatar.current.startVoiceChat();

    if (lesson?.avatarScript && avatar.current) {
      await avatar.current.speak({
        text: lesson.avatarScript,
        taskType: TaskType.TALK,
        taskMode: TaskMode.ASYNC,
      });
    }

    speakNextStep();
    setIsSessionLoading(false);
  }

  async function endLesson() {
    await avatar.current?.stopAvatar();
    setStream(undefined);
    setSessionEnded(true);
  }

  useEffect(() => {
    async function loadLesson() {
      const res = await fetch("/modules/module2/lesson4.json");
      const data = await res.json();
      setLesson(data);
    }

    loadLesson();
    loadProgress();

    return () => {
      avatar.current?.stopAvatar();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => videoRef.current?.play();
    }
  }, [stream]);

  async function handlePause() {
    if (!avatar.current) return;
    await avatar.current.interrupt();
    avatar.current.stopListening();
    setIsPaused(true);
    setAwaitingResponse(false);
  }

  async function handleResume() {
    if (!avatar.current || !lesson) return;
    setIsPaused(false);
    speakNextStep();
  }

  if (!lesson) return <Spinner label="Iniciando..." />;

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">{lesson.title} (Modo Voz)</h1>

      {stream ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-[600px] h-[400px] rounded-lg shadow"
          />

          <p className="text-center text-lg">
            {isUserTalking ? (
              <><span role="img" aria-label="hablando">🎤</span> Estás hablando...</>
            ) : awaitingResponse ? (
              <><span role="img" aria-label="repite">🕐</span> Repite después del avatar...</>
            ) : (
              <><span role="img" aria-label="esperando">🧠</span> Esperando...</>
            )}
          </p>

          {currentText && (
            <div className="text-center mt-2 p-4 bg-white/10 rounded-lg text-base max-w-lg">
              <p className="font-medium"><span role="img" aria-label="instrucción">📢</span> Instrucción actual:</p>
              <p className="italic text-indigo-300">{currentText}</p>
            </div>
          )}

          {currentStep >= lesson.dialog.length && (
            <p className="text-green-500 text-xl mt-4">
              <span role="img" aria-label="completado">🎉</span> ¡Clase completada!
            </p>
          )}

          <div className="flex gap-4 flex-wrap justify-center mt-4">
            <Button color="secondary" onClick={handlePause} isDisabled={isPaused}>
              <span role="img" aria-label="pausar">⏸️</span> Pausar
            </Button>
            <Button color="success" onClick={handleResume} isDisabled={!isPaused}>
              <span role="img" aria-label="reanudar">▶️</span> Reanudar
            </Button>
            <Button color="default" onClick={speakNextStep}>
              <span role="img" aria-label="repetir">🔁</span> Repetir
            </Button>
            <Button color="danger" onClick={endLesson}>
              <span role="img" aria-label="finalizar">🔚</span> Finalizar
            </Button>
          </div>
        </>
      ) : sessionEnded ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-gray-500 mt-4">
            <span role="img" aria-label="terminado">🔚</span> Clase finalizada.
          </p>
          <Button color="primary" onClick={() => {
            setCurrentStep(0);
            setSessionEnded(false);
            setIsUserTalking(false);
            setAwaitingResponse(false);
            setStream(undefined);
            startLesson();
          }}>
            <span role="img" aria-label="reiniciar">🔁</span> Volver a empezar
          </Button>
        </div>
      ) : (
        <Button isLoading={isSessionLoading} onClick={startLesson} color="primary">
          <span role="img" aria-label="iniciar">▶️</span> Iniciar clase
        </Button>
      )}
    </div>
  );
}
