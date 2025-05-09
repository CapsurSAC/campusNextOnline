'use client';

import React from 'react';

const songs = [
  {
    title: 'Hello Song',
    artist: 'Super Simple Songs',
    lyrics: `Hello, hello, how are you?\nI'm good, I'm great, I'm wonderful!`,
    embedUrl: 'https://www.youtube.com/embed/tVlcKp3bWH8',
  },
  {
    title: 'The ABC Song',
    artist: 'ABCkidTV',
    lyrics: `A, B, C, D, E, F, G...\nNow I know my ABCs, next time won't you sing with me?`,
    embedUrl: 'https://www.youtube.com/embed/36IBDpTRVNE',
  },
  {
    title: 'If You’re Happy and You Know It',
    artist: 'Super Simple Songs',
    lyrics: `If you’re happy and you know it, clap your hands (clap clap)!`,
    embedUrl: 'https://www.youtube.com/embed/l4WNrvVjiTw',
  },
  {
    title: 'The Colors Song',
    artist: 'Songs for Littles',
    lyrics: `Red, yellow, green and blue,\nThese are the colors just for you!`,
    embedUrl: 'https://www.youtube.com/embed/3C1z4f9YTcw',
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
          </div>
        ))}
      </div>
    </main>
  );
}
