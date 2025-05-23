'use client';

import { useState } from 'react';

type Props = {
  leccionId: number;
  tipoMaterial: 'VIDEO' | 'PDF' | 'ENLACE';
  onClose: () => void;
  onSuccess: () => void;
};

export default function UploadMaterialModal({ leccionId, tipoMaterial, onClose, onSuccess }: Props) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [urlArchivo, setUrlArchivo] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleArchivo = async () => {
    if (!file) return '';
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      let finalUrl = urlArchivo;

      if ((tipoMaterial === 'PDF' || (tipoMaterial === 'ENLACE' && file)) && file) {
        finalUrl = await handleArchivo();
      }

      if ((tipoMaterial === 'VIDEO' || tipoMaterial === 'ENLACE') && !urlArchivo) {
        setError('Debes ingresar un enlace.');
        setLoading(false);
        return;
      }

      if ((tipoMaterial === 'PDF' || (tipoMaterial === 'ENLACE' && file)) && !file) {
        setError('Debes subir un archivo.');
        setLoading(false);
        return;
      }

      const payload: any = {
        tipo: tipoMaterial,
        descripcion,
        urlArchivo: finalUrl,
      };

      if (tipoMaterial === 'VIDEO') payload.descripcion = `${titulo} - ${descripcion}`;

      const res = await fetch(`/api/lecciones/${leccionId}/materiales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al subir material');

      onSuccess();
      onClose();
    } catch (err) {
      setError('Ocurrió un error al guardar el material.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1f2937] text-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Subir {tipoMaterial.toLowerCase()}</h2>

        {tipoMaterial === 'VIDEO' && (
          <>
            <label className="block text-sm mb-1">Título del video</label>
            <input
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded mb-3"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </>
        )}

        <label className="block text-sm mb-1">Descripción</label>
        <textarea
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded mb-3"
          rows={2}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        {tipoMaterial === 'VIDEO' || tipoMaterial === 'ENLACE' ? (
          <>
            <label className="block text-sm mb-1">Enlace</label>
            <input
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded mb-4"
              placeholder="https://..."
              value={urlArchivo}
              onChange={(e) => setUrlArchivo(e.target.value)}
            />
          </>
        ) : (
          <>
            <label className="block text-sm mb-1">Archivo PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mb-4"
            />
          </>
        )}

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Subiendo...' : 'Subir'}
          </button>
        </div>
      </div>
    </div>
  );
}
