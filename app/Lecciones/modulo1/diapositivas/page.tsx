'use client';

import { useState } from 'react';
import { FiFileText, FiChevronDown, FiChevronUp, FiExternalLink, FiCheckCircle, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const pdfs = [
  {
    title: 'Greetings and Introductions',
    file: '/slides/lesson1/Leccion-11.pdf',
  },
  {
    title: 'Daily Expressions and Farewells',
    file: '/slides/lesson1/Leccion-12.pdf',
  },
  {
    title: 'Numbers and Dates',
    file: '/slides/lesson1/Leccion-13.pdf',
  },
  {
    title: 'Classroom Language and Commands',
    file: '/slides/lesson1/Leccion-14.pdf',
  },
];

export default function DiapositivasPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [viewed, setViewed] = useState<number[]>([]);
  const [fullscreenPDF, setFullscreenPDF] = useState<string | null>(null);

  const togglePDF = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
    if (!viewed.includes(index)) {
      setViewed([...viewed, index]);
    }
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <FiFileText size={24} /> Diapositivas
      </h2>

      <div className="space-y-4">
        {pdfs.map((pdf, index) => {
          const isViewed = viewed.includes(index);
          return (
            <div
              key={index}
              className="bg-white/10 p-4 rounded-xl shadow backdrop-blur transition-all"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => togglePDF(index)}
              >
                <h3 className={`text-lg font-bold flex items-center gap-2 ${isViewed ? 'text-emerald-300' : ''}`}>
                  {isViewed && <FiCheckCircle size={18} className="text-emerald-400" />}
                  {pdf.title}
                </h3>
                {activeIndex === index ? (
                  <FiChevronUp size={20} />
                ) : (
                  <FiChevronDown size={20} />
                )}
              </div>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden mt-4 space-y-2"
                  >
                    <div className="flex justify-end">
                      <button
                        onClick={() => setFullscreenPDF(pdf.file)}
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <FiExternalLink /> Ver en pantalla completa
                      </button>
                    </div>
                    <div className="w-full h-[720px] rounded overflow-hidden">
                      <iframe
                        src={pdf.file}
                        className="w-full h-full"
                        title={pdf.title}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Modal fullscreen */}
      {fullscreenPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded shadow-lg overflow-hidden">
            <button
              onClick={() => setFullscreenPDF(null)}
              className="absolute top-3 right-3 z-10 text-black hover:text-red-600"
              title="Cerrar"
            >
              <FiX size={24} />
            </button>
            <iframe src={fullscreenPDF} className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
}
