'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiPlayCircle } from 'react-icons/fi';

const videos = [
  {
    title: 'Presentaciones en inglés',
    url: 'https://www.youtube.com/embed/cHGOot0I7OU?si=XKbVIPueS6MzDw39',
    description: 'Aprende a presentarte correctamente en distintos contextos.',
  },
  {
    title: 'Saludos y despedidas',
    url: 'https://www.youtube.com/embed/7y9O-erWs0Q?si=XKq1_2XP-ohHegy6',
    description: 'Frases básicas para empezar y cerrar una conversación.',


  },
  {
    title: 'Preguntas comunes',
    url: 'https://www.youtube.com/embed/H5FE-TxXUkM?si=jizInMqeO91VV__A',
    description: 'Expresiones para preguntar en inglés de forma simple.',
  },
  {
    title: 'Vocabulario para el día a día',
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
