'use client';

import { useState } from 'react';
import { FiFileText } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const pdfResources = [
  {
    title: '📘 Diccionario Visual Básico',
    description: 'Guía ilustrada con palabras y objetos comunes en inglés.',
    file: '/pdfs/clase1.pdf',
  },
  {
    title: '🧠 Guía de Gramática para Principiantes',
    description: 'Conceptos esenciales de gramática explicados paso a paso.',
    file: '/pdfs/clase2.pdf',
  },
  {
    title: '📖 Lista de Verbos Irregulares',
    description: 'PDF con traducción, pronunciación y ejemplos.',
    file: '/pdfs/clase2.pdf',
  },
  {
    title: '✍️ Cuaderno de ejercicios',
    description: 'Practica escritura y comprensión con actividades guiadas.',
    file: '/pdfs/clase2.pdf',
  },
];

export default function RecursosPage() {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  return (
    <div className="text-white">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <FiFileText size={24} /> Recursos descargables
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pdfResources.map((res, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/10 p-5 rounded-xl backdrop-blur shadow hover:bg-white/20 transition cursor-pointer"
            onClick={() => setSelectedPdf(res.file)}
          >
            <h3 className="text-lg font-bold mb-1">{res.title}</h3>
            <p className="text-white/80 text-sm">{res.description}</p>
            <span className="text-sm text-blue-400 mt-2 inline-block">👁 Ver documento</span>
          </motion.div>
        ))}
      </div>

      {/* Visor PDF */}
      <AnimatePresence>
        {selectedPdf && (
          <motion.div
            key="viewer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="mt-10 bg-white/10 rounded-xl p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">📄 Documento seleccionado</h3>
              <button
                onClick={() => setSelectedPdf(null)}
                className="text-red-400 hover:text-red-300 transition"
              >
                ❌ Cerrar visor
              </button>
            </div>
            <iframe
              src={selectedPdf}
              className="w-full h-[500px] rounded border border-white/20"
              title="PDF Viewer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
