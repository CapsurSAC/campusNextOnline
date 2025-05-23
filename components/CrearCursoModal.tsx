'use client';
import { useState } from 'react';

export default function CrearCursoModal({ onClose }: { onClose: () => void }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreview(url);
  };

  const handleGuardar = async () => {
    if (!nombre.trim() || !descripcion.trim() || !file) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const imagenUrl = data.url;

        await fetch('/api/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, imagen: imagenUrl }),
        credentials: 'include', // ✅ Esto es CLAVE
        });

        


      onClose();
      window.location.reload();
    } catch (err) {
      setError('Error al crear el curso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1f2937] rounded-lg p-6 w-full max-w-md shadow-2xl text-white">
        <h2 className="text-2xl font-bold mb-4">Crear Curso</h2>

        <label className="block text-sm mb-1">Título</label>
        <input
          className="w-full bg-gray-800 text-white border border-gray-600 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label className="block text-sm mb-1">Descripción</label>
        <textarea
          className="w-full bg-gray-800 text-white border border-gray-600 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <label className="block text-sm mb-1">Imagen (JPG o PNG)</label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageUpload}
          className="mb-4 text-sm text-gray-300"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded mb-4 border border-gray-700"
          />
        )}

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            onClick={handleGuardar}
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}
