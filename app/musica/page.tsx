'use client';

import React from 'react';
import LyricsPlayer from '../../components/LyricsPlayer';

// ⬇️ Aquí defines el tipo Song con delay opcional
type Song = {
  title: string;
  artist: string;
  embedUrl: string;
  lrcUrl?: string;
  lyrics?: string;
  delay?: number;
};

const songs: Song[] = [
  {
    title: 'Happy',
    artist: 'Pharrell Williams',
    lrcUrl: '/lrc/happy.lrc', // Aquí el enlace al archivo en /public/lrc/
    embedUrl: 'https://www.youtube.com/embed/ZbZSe6N_BXs?si=HGqCiO2Yr_mVezfd',
    delay: +5.0,
  },
  {
    title: 'Yesterday',
    artist: 'The Beatles',
    lrcUrl: '/lrc/yesterday.lrc', // Aquí el enlace al archivo en /public/lrc/
    embedUrl: 'https://www.youtube.com/embed/NrgmdOz227I?si=QVfKMROfotul_eXm',
    delay: +0.3,
  },
  {
    title: 'Lemon Tree',
    artist: 'Fool’s Garden',
    lrcUrl: '/lrc/LemonTree.lrc', // Aquí el enlace al archivo en /public/lrc/
    embedUrl: 'https://www.youtube.com/embed/wCQfkEkePx8?si=50rBkLeFTTI6T1dn',
    delay: 0,
  },
  {
    title: 'We Will Rock You',
    artist: 'Queen',
    lrcUrl: '/lrc/we will rock you.lrc', // Aquí el enlace al archivo en /public/lrc/
    embedUrl: 'https://www.youtube.com/embed/-tJYN-eG1zk?si=c_nLX7XwNn1o72lb',
    delay: -5.5,
  },
];

export default function MusicPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        🎵 Aprende con Música
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {songs.map((song, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-xl p-4 shadow-md backdrop-blur"
          >
            <h2 className="text-2xl font-semibold mb-2">{song.title}</h2>
            <p className="text-white/70 mb-4 italic">{song.artist}</p>

            {song.lrcUrl ? (
              <LyricsPlayer
                videoId={song.embedUrl.split('/embed/')[1].split('?')[0]}
                lrcUrl={song.lrcUrl}
                delay={song.delay ?? -0.3}
              />
            ) : (
              <>
                <div className="aspect-w-16 aspect-h-9 w-full rounded overflow-hidden mb-4">
                  <iframe
                    className="w-full h-full"
                    src={song.embedUrl}
                    title={song.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="bg-slate-800 text-white/90 text-sm p-3 rounded whitespace-pre-wrap">
                  {song.lyrics}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
