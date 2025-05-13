'use client';

import React from 'react';

const vowelSounds = [
  { symbol: 'ɑ', word: 'hot' },
  { symbol: 'æ', word: 'cat' },
  { symbol: 'ʌ', word: 'cup' },
  { symbol: 'ɛ', word: 'bed' },
  { symbol: 'ɪ', word: 'ship' },
  { symbol: 'iː', word: 'sheep' },
  { symbol: 'ə', word: 'about' },
  { symbol: 'ʊ', word: 'book' },
  { symbol: 'uː', word: 'food' },
  { symbol: 'ɔː', word: 'law' },
  { symbol: 'eɪ', word: 'say' },
  { symbol: 'aɪ', word: 'my' },
  { symbol: 'oʊ', word: 'go' },
  { symbol: 'aʊ', word: 'now' },
  { symbol: 'ɔɪ', word: 'boy' },
];

const consonantSounds = [
  { symbol: 'p', word: 'pen' },
  { symbol: 'b', word: 'bat' },
  { symbol: 't', word: 'top' },
  { symbol: 'd', word: 'dog' },
  { symbol: 'k', word: 'cat' },
  { symbol: 'g', word: 'go' },
  { symbol: 'f', word: 'fish' },
  { symbol: 'v', word: 'van' },
  { symbol: 'θ', word: 'think' },
  { symbol: 'ð', word: 'this' },
  { symbol: 's', word: 'sun' },
  { symbol: 'z', word: 'zoo' },
  { symbol: 'ʃ', word: 'she' },
  { symbol: 'ʒ', word: 'measure' },
  { symbol: 'h', word: 'hat' },
  { symbol: 'm', word: 'man' },
  { symbol: 'n', word: 'no' },
  { symbol: 'ŋ', word: 'sing' },
  { symbol: 'l', word: 'leg' },
  { symbol: 'r', word: 'red' },
  { symbol: 'j', word: 'yes' },
  { symbol: 'w', word: 'we' },
  { symbol: 'tʃ', word: 'chat' },
  { symbol: 'dʒ', word: 'jam' },
];

export default function SonidosPage() {
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Puedes cambiar a 'es-ES' si usas español
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-extrabold text-center mb-4">¡Mejora tu pronunciación del inglés!</h1>
      
      <p className="text-center text-white/70 mb-6">
        Aquí aprenderás a reconocer y pronunciar los sonidos reales del inglés.  
        Cada botón representa un sonido, y al hacer clic escucharás una palabra que lo usa.  
        Ideal para entrenar tu oído, mejorar tu pronunciación y sonar más natural al hablar. 🎧🗣️
      </p>


      <div className="flex justify-center mb-10">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-bold shadow">
          EMPEZAR +10 EXP
        </button>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b border-white/20">Vocales</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {vowelSounds.map((sound, idx) => (
            <button
              key={idx}
              onClick={() => speakText(sound.word)}
              className="bg-white/10 hover:bg-white/20 transition rounded-lg p-4 flex flex-col items-center text-white text-center shadow"
            >
              <span className="text-2xl font-bold mb-1">{sound.symbol}</span>
              <span className="text-sm">{sound.word}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 border-b border-white/20">Consonantes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {consonantSounds.map((sound, idx) => (
            <button
              key={idx}
              onClick={() => speakText(sound.word)}
              className="bg-white/10 hover:bg-white/20 transition rounded-lg p-4 flex flex-col items-center text-white text-center shadow"
            >
              <span className="text-2xl font-bold mb-1">{sound.symbol}</span>
              <span className="text-sm">{sound.word}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
