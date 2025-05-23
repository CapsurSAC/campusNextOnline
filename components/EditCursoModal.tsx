'use client';
import { useState } from 'react';

interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  imagen?: string;
}

export default function EditCursoModal({
  curso,
  onClose,
}: {
  curso: Curso;
  onClose: () => void;
}) {
  const [nombre, setNombre] = useState(curso.nombre);
  const [descripcion, setDescripcion] = useState(curso.descripcion);
  const [imagen, setImagen] = useState(curso.imagen || '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(curso.imagen || '');
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
    if (!nombre.trim() || !descripcion.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    setError('');

    let imageUrl = imagen;

    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        imageUrl = data.url;
      }

      await fetch(`/api/cursos/${curso.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, imagen: imageUrl }),
      });

      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1f2937] rounded-lg p-6 w-full max-w-md shadow-2xl text-white">
        <h2 className="text-2xl font-bold mb-4">Editar Curso</h2>

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

        <label className="block text-sm mb-1">Imagen del curso (JPG o PNG)</label>
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            onClick={handleGuardar}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
} 
