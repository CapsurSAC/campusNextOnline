'use client';

import { useState } from 'react';
import { Button, Spinner } from '@nextui-org/react';
import { Upload } from 'lucide-react';

export default function AdminEvaluacionesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [cursoId, setCursoId] = useState<string>('2'); // ID por defecto, idealmente dinámico
  const [titulo, setTitulo] = useState<string>('Nueva Evaluación');
  const [descripcion, setDescripcion] = useState<string>('Evaluación importada desde Excel');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Por favor, selecciona un archivo Excel.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('cursoId', cursoId);
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);

    try {
      const res = await fetch('/api/admin/evaluaciones/importar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Evaluación importada correctamente.');
        setFile(null);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Ocurrió un error al subir el archivo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 text-black bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold mb-6">Importar Evaluación (Excel)</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">ID del Curso</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Evaluación</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Archivo Excel (.xlsx)</label>
          <p className="text-xs text-gray-500 mb-2">Columnas requeridas: Enunciado, Opciones (separadas por coma), Respuesta_Correcta</p>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <Button
          color="primary"
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full"
        >
          {loading ? <Spinner size="sm" color="white" /> : <Upload size={18} className="mr-2" />}
          {loading ? 'Subiendo...' : 'Subir e Importar'}
        </Button>

        {message && (
          <div className={`mt-4 p-3 rounded text-sm ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
