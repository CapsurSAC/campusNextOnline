'use client';

import { PlayCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function AudioPlayerVisualizer({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [playing, setPlaying] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const setupVisualizer = () => {
    if (initialized || !audioRef.current || !canvasRef.current) return;
    setInitialized(true);

    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 100;

    const audioCtx = new AudioContext();
    audioContextRef.current = audioCtx;

    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 64;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `hsl(${i * 15}, 100%, 60%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      }
    };

    draw();
  };

  const handlePlay = () => {
    if (!initialized) {
      setupVisualizer();
    }

    // Resume audio context if it was suspended
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    setPlaying(true);
    audioRef.current?.play();
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-500/30 rounded-2xl p-6 text-center shadow-xl mb-6">
      <button
        onClick={handlePlay}
        className="w-20 h-20 bg-teal-600 hover:bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg transition"
      >
        <PlayCircle size={40} />
      </button>
      <canvas ref={canvasRef} className="w-full h-[100px]" />
      <audio ref={audioRef} src={src} />
      <p className="text-white/80 text-sm mt-2">{playing ? 'Reproduciendo...' : 'Haz clic para escuchar'}</p>
    </div>
  );
}