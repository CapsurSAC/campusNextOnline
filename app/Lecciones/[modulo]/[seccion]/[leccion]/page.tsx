'use client';

import { useParams } from 'next/navigation';

const videosData: Record<string, { title: string; url: string; description: string }[]> = {
  lesson1: [
    {
      title: 'Clase Demo',
      url: 'https://www.youtube.com/embed/v-GkJPY29zU?si=S3r2STazIwGEb1zI',
      description: 'Aprende a presentarte correctamente en distintos contextos.',
    },
    {
      title: 'Daily Expressions and Farewells',
      url: 'https://www.youtube.com/embed/ToYfUrsFs0w?si=XfNFcJ5LVlUmPo8Y',
      description: 'Frases básicas para empezar y cerrar una conversación.',
    },
    {
      title: 'Numbers and Dates',
      url: 'https://www.youtube.com/embed/MyCs8v5p1Ro?si=2tUyT-BJ1YJiSk9o',
      description: 'Expresiones para preguntar en inglés de forma simple.',
    },
    {
      title: 'Classroom Language and Commands',
      url: 'https://www.youtube.com/embed/hhRtSoFHUPM?si=YEjlww2ZNlzgyLhI',
      description: 'Palabras clave para comunicarte en situaciones cotidianas.',
    },
  ],
};

export default function LeccionDinamicaPage() {
  const { modulo, seccion, leccion } = useParams();

  const pdfs = [
    `/slides/${leccion}/Leccion-11.pdf`,
    `/slides/${leccion}/Leccion-12.pdf`,
    `/slides/${leccion}/Leccion-13.pdf`,
    `/slides/${leccion}/Leccion-14.pdf`,
  ];

  const recursos = [
    'Diccionario Visual Básico',
    'Lista de Verbos Irregulares',
    'Student Book PDF',
    'Cuaderno de ejercicios',
  ];

  return (
    <main className="text-white">
      <h2 className="text-2xl font-bold mb-4 capitalize">
        Módulo: {modulo} | Sección: {seccion} | Lección: {leccion}
      </h2>

      {seccion === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videosData[leccion as string]?.map((video, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={video.url}
                  title={video.title}
                  className="w-full h-full rounded"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <h3 className="text-lg font-bold mt-2">{video.title}</h3>
              <p className="text-white/70 text-sm">{video.description}</p>
            </div>
          ))}
        </div>
      )}

      {seccion === 'diapositivas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pdfs.map((url, idx) => (
            <iframe
              key={idx}
              src={url}
              className="w-full h-[400px] border border-white/10 rounded"
            />
          ))}
        </div>
      )}

      {seccion === 'recursos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recursos.map((nombre, idx) => (
            <div
              key={idx}
              className="bg-white/10 p-4 rounded shadow hover:shadow-lg transition"
            >
              <h4 className="font-semibold mb-2">{nombre}</h4>
              <a
                href={`/pdfs/resource-${idx + 1}.pdf`}
                target="_blank"
                className="text-blue-400 underline text-sm"
              >
                Ver documento
              </a>
            </div>
          ))}
        </div>
      )}

      {seccion === 'june' && (
        <p className="text-white/80">Aquí se integrará la clase en vivo con JUNE 🤖</p>
      )}
    </main>
  );
}
