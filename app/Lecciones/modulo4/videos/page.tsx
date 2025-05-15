'use client';

import { motion } from 'framer-motion';
import { FiPlayCircle } from 'react-icons/fi';

const videos = [
  {
    title: 'Food and Meals',
    url: 'https://www.youtube.com/embed/gQXnk2UeD8k?si=zOpdrPHRGDROUU97',
    description: 'Aprende a presentarte correctamente en distintos contextos.',
  },
  {
    title: 'Shopping and Prices',
    url: 'https://www.youtube.com/embed/NW78LJX30M8?si=bLGQOK9K0S4GD_Rf',
    description: 'Frases básicas para empezar y cerrar una conversación.',
  },
  {
    title: 'Directions and Places in Town',
    url: 'https://www.youtube.com/embed/H5FE-TxXUkM?si=jizInMqeO91VV__A',
    description: 'Expresiones para preguntar en inglés de forma simple.',
  },
  {
    title: 'Review and Real-Life Conversation Practice',
    url: 'https://www.youtube.com/embed/H5FE-TxXUkM?si=jizInMqeO91VV__A',
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
