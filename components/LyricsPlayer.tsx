'use client';

import { useEffect, useRef, useState } from 'react';
import { parseLRC } from '../app/utils/parseLRC';

export default function LyricsPlayer({
  videoId,
  lrcUrl,
  delay = -0.3,
}: {
  videoId: string;
  lrcUrl: string;
  delay?: number;
}) {
  const playerRef = useRef<any>(null);
  const [lyrics, setLyrics] = useState<{ time: number; text: string }[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [apiReady, setApiReady] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  // 1. Carga del archivo LRC
  useEffect(() => {
    fetch(lrcUrl)
      .then((res) => res.text())
      .then((text) => {
        setLyrics(parseLRC(text));
      })
      .catch((err) => console.error('Error cargando LRC:', err));
  }, [lrcUrl]);

  // 2. Carga de la API de YouTube
  useEffect(() => {
    if ((window as any).YT && (window as any).YT.Player) {
      setApiReady(true);
      return;
    }

    const previous = (window as any).onYouTubeIframeAPIReady;

    (window as any).onYouTubeIframeAPIReady = () => {
      if (previous) previous();
      setApiReady(true);
    };

    if (!document.getElementById('youtube-iframe-api')) {
      const script = document.createElement('script');
      script.id = 'youtube-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
    }
  }, []);

  // 3. Crear el player cuando la API esté lista
  useEffect(() => {
    if (!apiReady) return;

    playerRef.current = new (window as any).YT.Player(`player-${videoId}`, {
      videoId,
      events: {
        onReady: () => {
          setPlayerReady(true);
        },
      },
    });

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [apiReady, videoId]);

  // 4. Sincronizar letra
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerReady && playerRef.current?.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime() + delay;
        const current = lyrics.findLast((line) => line.time <= currentTime);
        if (current && current.text !== currentLine) {
          setCurrentLine(current.text);
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [lyrics, playerReady, delay, currentLine]);

  return (
    <div className="flex flex-col items-center">
      <div id={`player-${videoId}`} className="aspect-video w-full mb-4" />
      <div className="text-center text-white text-lg bg-slate-800/80 p-3 rounded">
        {playerReady ? currentLine || '🎵 Sincronizando...' : '🎶 Cargando...'}
      </div>
    </div>
  );
}