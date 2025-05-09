'use client';

import { motion } from 'framer-motion';
import { FiPlayCircle } from 'react-icons/fi';

const videos = [
  {
    title: 'Describing People (Appearance and Personality)',
    url: 'https://www.youtube.com/embed/amuG79ifw8I?si=YeMU4Qs8IqKlyqGL',
    description: 'Aprende a presentarte correctamente en distintos contextos.',
  },
  {
    title: 'Family Members and Possessives',
    url: 'https://www.youtube.com/embed/eyUEksNs_J8?si=KSL35RVWpx1nR_QO',
    description: 'Frases básicas para empezar y cerrar una conversación.',
  },
  {
    title: 'My House and Furniture',
    url: 'https://www.youtube.com/embed/o1QBm_R9VAE?si=NT1lNY4Y4Mt0nHV9',
    description: 'Expresiones para preguntar en inglés de forma simple.',
  },
  {
    title: 'There is / There are + Places',
    url: 'https://www.youtube.com/embed/tE9iv0DksXA?si=4OX5gDq9AoQ4ZY0L',
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
