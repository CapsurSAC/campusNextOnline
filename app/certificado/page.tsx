'use client';

import { useEffect, useState } from 'react';

export default function CertificadoPage() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let objectUrl: string;

    const fetchCertificado = async () => {
      try {
        const res = await fetch('/api/certificado', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al generar certificado');
        }

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCertificado();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl); // limpieza
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎓 Tu Certificado</h1>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : pdfUrl ? (
        <div className="flex justify-center">
          <iframe
            src={`${pdfUrl}#view=FitH&navpanes=0`}
            className="w-full max-w-4xl h-[80vh] rounded shadow-lg bg-white"
            title="Certificado"
          />
        </div>
      ) : (
        <p className="text-center text-white/60">Generando certificado...</p>
      )}
    </main>
  );
}