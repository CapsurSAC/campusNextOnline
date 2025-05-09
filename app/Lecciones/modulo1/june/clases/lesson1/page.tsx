"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner, Button } from "@nextui-org/react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  VoiceEmotion,
  TaskType,
  TaskMode,
} from "@heygen/streaming-avatar";
import { useRouter } from "next/navigation";

interface LessonStep {
  text: string;
}

interface LessonData {
  title: string;
  avatarScript: string;
  dialog: LessonStep[];
}

export default function Lesson1VoiceOnly() {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [chatHistory, setChatHistory] = useState<{ from: "avatar" | "user"; message: string }[]>([]);
  const [userInput, setUserInput] = useState("");
  const [showTips, setShowTips] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const router = useRouter();

  async function fetchAccessToken() {
    const res = await fetch("/api/get-access-token", { method: "POST" });
    return await res.text();
  }

  async function speak(text: string) {
    if (!avatar.current) return;
    setChatHistory((prev) => [...prev, { from: "avatar", message: text }]);
    await avatar.current.speak({
      text,
      taskType: TaskType.TALK,
      taskMode: TaskMode.ASYNC,
    });
  }

  async function startLesson() {
    setIsSessionLoading(true);

    const token = await fetchAccessToken();

    avatar.current = new StreamingAvatar({
      token,
      basePath: process.env.NEXT_PUBLIC_BASE_API_URL,
    });

    avatar.current.on(StreamingEvents.STREAM_READY, (e) => setStream(e.detail));
    avatar.current.on(StreamingEvents.USER_STOP, async (e: any) => {
      const userTranscript = e.detail.transcript;
      setChatHistory((prev) => [...prev, { from: "user", message: userTranscript }]);
    });

    await avatar.current.createStartAvatar({
      quality: AvatarQuality.Medium,
      avatarName: "June_HR_public",
      language: "es",
      disableIdleTimeout: true,
      voice: { rate: 1.1, emotion: VoiceEmotion.FRIENDLY },
    });

    await avatar.current.startVoiceChat();
    if (lesson?.avatarScript) await speak(lesson.avatarScript);
    if (lesson?.dialog[0]) await speak(lesson.dialog[0].text);

    setIsSessionLoading(false);
  }

  function handleSendMessage() {
    if (!userInput.trim()) return;
    setChatHistory((prev) => [...prev, { from: "user", message: userInput }]);
    setUserInput("");
  }

  async function stopLesson() {
    await avatar.current?.stopAvatar();
    router.push("/Lecciones/modulo1");
  }

  useEffect(() => {
    async function loadLesson() {
      const res = await fetch("/modules/module1/lesson1.json");
      const data = await res.json();
      setLesson(data);
    }
    loadLesson();
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => videoRef.current?.play();
    }
  }, [stream]);

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-center">{lesson?.title || "Cargando..."}</h1>

      {showTips && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded max-w-xl">
          <h2 className="font-bold mb-2">📌 Recomendaciones antes de comenzar</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Usa auriculares para evitar eco.</li>
            <li>Habla de forma clara y pausada.</li>
            <li>No interrumpas a June mientras habla.</li>
            <li>Puedes escribir si tienes problemas con el micrófono.</li>
            <li>Haz clic en "Finalizar clase" para salir.</li>
          </ul>
          <button onClick={() => setShowTips(false)} className="text-blue-600 underline text-sm mt-2">
            Ocultar recomendaciones
          </button>
        </div>
      )}

      {stream ? (
        <>
          <div className="relative w-[600px] h-[400px] rounded-lg shadow overflow-hidden bg-black">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 w-full bg-black/80 px-4 py-2 max-h-[120px] overflow-y-auto">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`text-sm mb-1 ${
                    msg.from === "avatar" ? "text-blue-300 text-left" : "text-green-300 text-right"
                  }`}
                >
                  <strong>{msg.from === "avatar" ? "June" : "Tú"}:</strong> {msg.message}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="px-3 py-2 rounded bg-white text-black text-sm"
              placeholder="Escribe tu mensaje..."
            />
            <Button color="primary" onClick={handleSendMessage}>
              Enviar
            </Button>
            <Button color="danger" onClick={stopLesson}>
              Finalizar clase
            </Button>
          </div>
        </>
      ) : (
        <Button isLoading={isSessionLoading} onClick={startLesson} color="primary">
          ▶️ Iniciar clase
        </Button>
      )}
    </div>
  );
}
