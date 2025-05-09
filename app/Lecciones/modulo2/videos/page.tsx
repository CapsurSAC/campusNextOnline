'use client';

import { motion } from 'framer-motion';
import { FiPlayCircle } from 'react-icons/fi';

const videos = [
  {
    title: 'Daily Routines and the Present Simple',
    url: 'https://www.youtube.com/embed/mptgZS7j8YQ?si=i37PsccGUC-M_miy',
    description: 'Aprende a presentarte correctamente en distintos contextos.',
  },
  {
    title: 'Telling the Time',
    url: 'https://www.youtube.com/embed/2I9XfyM0jR8?si=5Dz9Kur2Qv-mqGjg',
    description: 'Frases básicas para empezar y cerrar una conversación.',
  },
  {
    title: 'The Days of the Week and Schedule',
    url: 'https://www.youtube.com/embed/V9pj3NGB4go?si=_c9h55zFx2dFX17H',
    description: 'Expresiones para preguntar en inglés de forma simple.',
  },
  {
    title: 'Talking About Frequency',
    url: 'https://www.youtube.com/embed/mEKf94TI7I8?si=Z0HY1HgfSBq8Le30',
    description: 'Palabras clave para comunicarte en situaciones cotidianas.',
  },
];

export default function VideosPage() {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <FiPlayCircle size={24} /> Videos de clase
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/10 rounded-xl p-4 shadow backdrop-blur"
          >
            <div className="aspect-video rounded overflow-hidden mb-3">
              <iframe
                className="w-full h-full rounded"
                src={video.url}
                title={video.title}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h3 className="text-lg font-bold mb-1">{video.title}</h3>
            <p className="text-white/70 text-sm">{video.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
