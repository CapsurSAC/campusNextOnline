'use client';

import React, { useState } from 'react';

const vowelSounds = [
  { symbol: 'ɑ', word: 'hot', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/ah.mp3' },
  { symbol: 'æ', word: 'cat', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/ae.mp3' },
  { symbol: 'ʌ', word: 'cup', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/uh.mp3' },
  { symbol: 'ɛ', word: 'bed', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/eh.mp3' },
  { symbol: 'ɪ', word: 'ship', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/ih.mp3' },
  { symbol: 'iː', word: 'sheep', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/ee.mp3' },
  { symbol: 'ə', word: 'about', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/schwa.mp3' },
  { symbol: 'ʊ', word: 'book', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/uh-short.mp3' },
  { symbol: 'uː', word: 'food', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/oo.mp3' },
  { symbol: 'ɔː', word: 'law', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/aw.mp3' },
  { symbol: 'eɪ', word: 'say', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/ay.mp3' },
  { symbol: 'aɪ', word: 'my', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/eye.mp3' },
  { symbol: 'oʊ', word: 'go', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/oh.mp3' },
  { symbol: 'aʊ', word: 'now', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/ow.mp3' },
  { symbol: 'ɔɪ', word: 'boy', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/oy.mp3' },
];

const consonantSounds = [
  { symbol: 'p', word: 'pen', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/p.mp3' },
  { symbol: 'b', word: 'bat', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/b.mp3' },
  { symbol: 't', word: 'top', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/t.mp3' },
  { symbol: 'd', word: 'dog', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/d.mp3' },
  { symbol: 'k', word: 'cat', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/k.mp3' },
  { symbol: 'g', word: 'go', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/g.mp3' },
  { symbol: 'f', word: 'fish', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/f.mp3' },
  { symbol: 'v', word: 'van', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/v.mp3' },
  { symbol: 'θ', word: 'think', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/th-voiceless.mp3' },
  { symbol: 'ð', word: 'this', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/th-voiced.mp3' },
  { symbol: 's', word: 'sun', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/s.mp3' },
  { symbol: 'z', word: 'zoo', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/z.mp3' },
  { symbol: 'ʃ', word: 'she', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/sh.mp3' },
  { symbol: 'ʒ', word: 'measure', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/zh.mp3' },
  { symbol: 'h', word: 'hat', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/h.mp3' },
  { symbol: 'm', word: 'man', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/m.mp3' },
  { symbol: 'n', word: 'no', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/n.mp3' },
  { symbol: 'ŋ', word: 'sing', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/ng.mp3' },
  { symbol: 'l', word: 'leg', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/l.mp3' },
  { symbol: 'r', word: 'red', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/r.mp3' },
  { symbol: 'j', word: 'yes', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/y.mp3' },
  { symbol: 'w', word: 'we', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/w.mp3' },
  { symbol: 'tʃ', word: 'chat', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/ch.mp3' },
  { symbol: 'dʒ', word: 'jam', audio: 'https://www.speechactive.com/wp-content/uploads/2019/06/j.mp3' },
];

export default function SonidosPage() {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const playAudio = (src: string) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    const audio = new Audio(src);
    setCurrentAudio(audio);
    audio.play();
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-extrabold text-center mb-4">¡Mejora tu pronunciación del inglés!</h1>
      <p className="text-center text-white/70 mb-6">Entrena tu oído y aprende a pronunciar palabras en inglés</p>

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
              onClick={() => playAudio(sound.audio)}
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
              onClick={() => playAudio(sound.audio)}
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
