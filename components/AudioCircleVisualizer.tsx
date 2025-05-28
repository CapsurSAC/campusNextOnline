'use client';

import { useRef, useEffect, useState } from 'react';

export default function AudioCircleVisualizer({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hue, setHue] = useState(200);

  const setup = () => {
    if (initialized || !canvasRef.current || !audioRef.current) return;
    setInitialized(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    const audio = audioRef.current;
    const audioCtx = new AudioContext();
    audioContextRef.current = audioCtx;

    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 512;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;

    let hueValue = 200;
    let frameCount = 0;

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(centerX, centerY);

      const pulseRadius = radius - 15 + Math.sin(Date.now() / 300) * 5;

      // Círculo pulsante
      ctx.beginPath();
      ctx.arc(0, 0, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(${hueValue}, 100%, 50%)`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = `hsl(${hueValue}, 100%, 50%)`;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Forma circular del espectro
      ctx.beginPath();
      for (let i = 0; i < bufferLength; i++) {
        const angle = (i / bufferLength) * 2 * Math.PI;
        const magnitude = dataArray[i] * 0.4;
        const x = Math.cos(angle) * (radius + magnitude);
        const y = Math.sin(angle) * (radius + magnitude);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsl(${hueValue}, 100%, 60%)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ícono de play en el centro
      ctx.font = 'bold 40px Arial';
      ctx.fillStyle = `hsl(${hueValue}, 100%, 70%)`;
      ctx.shadowColor = `hsl(${hueValue}, 100%, 70%)`;
      ctx.shadowBlur = 20;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('▶', 0, 5); // ligeramente ajustado verticalmente
      ctx.shadowBlur = 0;

      ctx.restore();

      // Actualizar el estado de color
      if (frameCount % 4 === 0) {
        hueValue = (hueValue + 5) % 360;
        setHue(hueValue);
      }
      frameCount++;
    };

    draw();
  };

  const handlePlay = () => {
    if (!initialized) setup();
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const handleEnded = () => setPlaying(false);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <canvas
        ref={canvasRef}
        onClick={handlePlay}
        className="rounded-full bg-black cursor-pointer transition shadow-lg hover:shadow-xl"
        title="Haz clic para escuchar"
      />
      <audio ref={audioRef} src={src} />
      <p className="text-white/80 text-sm mt-2">
        {playing ? 'Reproduciendo...' : 'Haz clic en el radar para escuchar'}
      </p>
    </div>
  );
}