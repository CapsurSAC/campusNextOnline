'use client';

import { useEffect, useRef, useState } from 'react';
import { Spinner, Button } from '@nextui-org/react';
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from '@heygen/streaming-avatar';

interface LessonStep {
  text: string;
  expectedResponse?: string;
}

interface LessonData {
  title: string;
  avatarScript: string;
  dialog: LessonStep[];
}

export default function InteractiveChat() {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [stream, setStream] = useState<MediaStream>();
  const [stepIndex, setStepIndex] = useState(0);
  const [chat, setChat] = useState<{ from: 'avatar' | 'user'; message: string }[]>([]);
  const [userText, setUserText] = useState('');
  const [isListening, setIsListening] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const avatarRef = useRef<StreamingAvatar | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const loadLesson = async () => {
    const res = await fetch('/modules/module1/lesson2.json');
    const data = await res.json();
    setLesson(data);
  };

  const fetchToken = async () => {
    const res = await fetch('/api/get-access-token', { method: 'POST' });
    return res.text();
  };

  const handleAvatarEvents = () => {
    if (!avatarRef.current) return;

    avatarRef.current.on(StreamingEvents.STREAM_READY, (e) => setStream(e.detail));
    avatarRef.current.on(StreamingEvents.USER_STOP, async (e) => {
      const transcript = e.detail.transcript?.toLowerCase() || '';
      if (!transcript) return;
      updateChat('user', transcript);
      handleUserResponse(transcript);
    });
  };

  const startSession = async () => {
    setLoading(true);
    const token = await fetchToken();

    const avatar = new StreamingAvatar({
      token,
      basePath: process.env.NEXT_PUBLIC_BASE_API_URL,
    });

    avatarRef.current = avatar;
    handleAvatarEvents();

    await avatar.createStartAvatar({
      quality: AvatarQuality.Medium,
      avatarName: 'June_HR_public',
      language: 'es',
      voice: { emotion: VoiceEmotion.FRIENDLY },
      disableIdleTimeout: true,
    });

    await avatar.startVoiceChat();
    updateChat('avatar', lesson?.avatarScript || '');
    await avatar.speak({ text: lesson?.avatarScript || '', taskType: TaskType.TALK, taskMode: TaskMode.ASYNC });

    setSessionStarted(true);
    setLoading(false);

    setTimeout(() => sayStep(), 2000);
  };

  const sayStep = async () => {
    const step = lesson?.dialog[stepIndex];
    if (!step || !avatarRef.current) return;
    updateChat('avatar', step.text);
    await avatarRef.current.speak({
      text: step.text,
      taskType: TaskType.TALK,
      taskMode: TaskMode.ASYNC,
    });
  };

  const updateChat = (from: 'avatar' | 'user', message: string) => {
    setChat((prev) => [...prev, { from, message }]);
  };

  const handleUserResponse = async (text: string) => {
    const expected = lesson?.dialog[stepIndex].expectedResponse?.toLowerCase() || '';
    if (!expected || text.includes(expected)) {
      const next = stepIndex + 1;
      if (next < (lesson?.dialog.length || 0)) {
        setStepIndex(next);
        setTimeout(() => sayStep(), 1500);
      } else {
        await avatarRef.current?.speak({
          text: '¡Has completado la lección! ¡Felicidades!',
          taskType: TaskType.TALK,
          taskMode: TaskMode.ASYNC,
        });
        updateChat('avatar', '¡Has completado la lección! ¡Felicidades!');
      }
    } else {
      await avatarRef.current?.speak({
        text: 'Intenta de nuevo, por favor.',
        taskType: TaskType.TALK,
        taskMode: TaskMode.ASYNC,
      });
      updateChat('avatar', 'Intenta de nuevo, por favor.');
    }
  };

  const toggleMic = () => {
    if (!avatarRef.current) return;
    isListening ? avatarRef.current.stopListening() : avatarRef.current.startListening();
    setIsListening(!isListening);
  };

  const stopSession = async () => {
    await avatarRef.current?.stopAvatar();
    setStream(undefined);
    setSessionStarted(false);
  };

  const handleSend = async () => {
    const text = userText.trim();
    if (!text) return;
    setUserText('');
    updateChat('user', text);
    await handleUserResponse(text.toLowerCase());
  };

  useEffect(() => {
    loadLesson();
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  if (!lesson) return <Spinner label="Cargando lección..." />;

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold">{lesson.title}</h1>

      {stream ? (
        <>
          <div className="relative w-[700px] h-[500px] rounded-xl overflow-hidden shadow-xl">
            <video ref={videoRef} className="absolute w-full h-[400px] object-cover" />

            {!isListening && (
              <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-sm text-center py-1">
                ⚠️ Micrófono apagado. June no te escucha.
              </div>
            )}

            <div className="absolute bottom-0 w-full bg-black/90 p-4 flex flex-col gap-2">
              <div className="overflow-y-auto max-h-[120px] pr-1">
                {chat.map((item, idx) => (
                  <div key={idx} className={`flex ${item.from === 'avatar' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`text-white px-4 py-2 rounded-xl text-sm max-w-[75%] ${item.from === 'avatar' ? 'bg-blue-600' : 'bg-green-600'}`}>
                      <strong>{item.from === 'avatar' ? 'June' : 'Tú'}:</strong> {item.message}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu respuesta..."
                  className="flex-1 px-3 py-2 rounded text-sm bg-white text-black"
                />
                <button onClick={handleSend} className="bg-blue-600 px-4 py-2 rounded text-white text-sm">
                  Enviar
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            <Button color="secondary" onClick={() => avatarRef.current?.interrupt()}>
              ⏸️ Pausar
            </Button>
            <Button color="primary" onClick={toggleMic}>
              {isListening ? '🎙️ Apagar micrófono' : '🎙️ Encender micrófono'}
            </Button>
            <Button color="danger" onClick={stopSession}>
              🔚 Finalizar
            </Button>
          </div>
        </>
      ) : (
        <Button color="primary" isLoading={loading} onClick={startSession}>
          ▶️ Iniciar clase
        </Button>
      )}
    </div>
  );
}
