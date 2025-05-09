'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@nextui-org/react';
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from '@heygen/streaming-avatar';
import { useRouter } from 'next/navigation';

const FIVE_MINUTES = 5 * 60; // en segundos

export default function DemoLessonPage() {
  const [remainingTime, setRemainingTime] = useState(FIVE_MINUTES);
  const [stream, setStream] = useState<MediaStream>();
  const [avatar, setAvatar] = useState<StreamingAvatar | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    const countdown = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          localStorage.setItem('lastDemoAccess', Date.now().toString());
          router.push('/demo');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [router]);

  useEffect(() => {
    async function init() {
      const token = await fetch('/api/get-access-token', { method: 'POST' }).then((res) =>
        res.text()
      );

      const instance = new StreamingAvatar({
        token,
        basePath: process.env.NEXT_PUBLIC_BASE_API_URL,
      });

      instance.on(StreamingEvents.STREAM_READY, (e) => {
        setStream(e.detail);
      });

      await instance.createStartAvatar({
        avatarName: 'June_HR_public',
        quality: AvatarQuality.Medium,
        language: 'es',
        disableIdleTimeout: true,
        voice: { emotion: VoiceEmotion.FRIENDLY, rate: 1.1 },
      });

      await instance.startVoiceChat();
      await instance.speak({
        text:
          '¡Bienvenido a tu clase demo en NextInglés! Tendrás 5 minutos para experimentar cómo es aprender con un instructor virtual. ¡Comencemos!',
        taskType: TaskType.TALK,
        taskMode: TaskMode.ASYNC,
      });

      setAvatar(instance);
    }

    init();
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => videoRef.current?.play();
    }
  }, [stream]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-xl font-bold mb-2">Demo en curso</h1>
      <p className="mb-4 text-sm">Tiempo restante: {formatTime(remainingTime)}</p>

      <div className="relative w-[600px] h-[400px] rounded-lg shadow overflow-hidden bg-black mb-6">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      </div>

      <Button color="danger" onClick={() => router.push('/demo')}>
        Finalizar clase
      </Button>
    </main>
  );
  
}
