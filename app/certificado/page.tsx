'use client';

import React, { useState, ChangeEvent } from 'react';

export default function CertificadoPage() {
  const [inscripcionId, setInscripcionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerar = async () => {
    if (!inscripcionId) {
      setError('Por favor ingresa el ID de inscripción.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/certificado?id=${inscripcionId}`);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al generar el certificado.');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificado.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow text-black">
      <h1 className="text-2xl font-bold mb-4 text-center">🎓 Generar Certificado</h1>

      <input
        type="number"
        placeholder="ID de inscripción"
        value={inscripcionId}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setInscripcionId(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
      />

      <button
        onClick={handleGenerar}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Generando...' : 'Descargar Certificado'}
      </button>

      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
    </div>
  );
}