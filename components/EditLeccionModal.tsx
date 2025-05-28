'use client';
import { useState } from 'react';

export default function EditLeccionModal({
  leccion,
  onClose,
  onSave,
}: {
  leccion: { id: number; titulo: string; contenido: string };
  onClose: () => void;
  onSave: () => void;
}) {
  const [titulo, setTitulo] = useState(leccion.titulo);
  const [contenido, setContenido] = useState(leccion.contenido);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGuardar = async () => {
    if (!titulo.trim() || !contenido.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await fetch(`/api/lecciones/${leccion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, contenido }),
      });

      onSave();
      onClose();
    } catch (err) {
      setError('Error al guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Módulo</h2>

        <input
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded mb-3"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded mb-3"
          placeholder="Descripción"
          rows={3}
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
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
