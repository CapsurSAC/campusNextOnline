'use client';

import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Material = {
  id: number;
  leccionId: number;
  tipo: string;
  descripcion: string;
  urlArchivo: string;
};

type Leccion = {
  id: number;
  titulo: string;
};

const tipos = ['PDF', 'VIDEO', 'ENLACE'];

export default function AdminMaterialesPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [materialEnEdicion, setMaterialEnEdicion] = useState<Material | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filtroLeccion, setFiltroLeccion] = useState('');
  const [leccionesDisponibles, setLeccionesDisponibles] = useState<Leccion[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [form, setForm] = useState({
    leccionId: '',
    tipo: 'PDF',
    descripcion: '',
    urlArchivo: '',
  });

  useEffect(() => {
    if (!loading && user?.rol !== 'ADMIN') router.push('/');
    if (user?.rol === 'ADMIN') {
      fetchMateriales();
      fetchLecciones();
    }
  }, [user, loading]);

  const fetchLecciones = async () => {
    const res = await fetch('/api/lecciones/lista');
    const data = await res.json();
    setLeccionesDisponibles(data);
  };

  const fetchMateriales = async () => {
    const res = await fetch('/api/materiales');
    const data = await res.json();
    setMateriales(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/materiales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await fetchMateriales();
      setForm({ leccionId: '', tipo: 'PDF', descripcion: '', urlArchivo: '' });
      alert('✅ Material creado');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este material?')) return;
    const res = await fetch(`/api/materiales/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMateriales((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleSaveEdit = async () => {
    if (!materialEnEdicion) return;
    const res = await fetch(`/api/materiales/${materialEnEdicion.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materialEnEdicion),
    });
    if (res.ok) {
      await fetchMateriales();
      setShowModal(false);
    } else {
      alert('Error al guardar');
    }
  };

  if (loading || !user) return <p className="text-white p-6">Cargando...</p>;
  if (user.rol !== 'ADMIN') return null;

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📚 Panel de Materiales</h1>

      <form onSubmit={handleSubmit} className="bg-slate-700 rounded-xl p-6 shadow-md border border-white/10 space-y-4 mb-10">
        <h2 className="text-2xl font-bold text-center">📥 Cargar nuevo material</h2>

        <select name="leccionId" value={form.leccionId} onChange={handleChange} required className="w-full p-2 rounded text-black focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="">Selecciona una lección</option>
          {leccionesDisponibles.map((l) => (
            <option key={l.id} value={l.id}>{l.id} - {l.titulo}</option>
          ))}
        </select>

        <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full p-2 rounded text-black focus:ring-2 focus:ring-blue-500 focus:outline-none">
          {tipos.map((t) => <option key={t}>{t}</option>)}
        </select>

        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required className="w-full p-2 rounded text-black" />

        <div className="space-y-1">
          <label className="block text-sm text-white/80">Archivo (opcional):</label>
          <input
            type="file"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const body = new FormData();
              body.append('file', file);
              const res = await fetch('/api/upload', { method: 'POST', body });
              const data = await res.json();
              if (data.url) {
                setForm((prev) => ({ ...prev, urlArchivo: data.url }));
              }
            }}
            className="block text-sm text-white file:bg-blue-600 file:border-none file:px-3 file:py-1 file:rounded file:text-white"
          />
          {form.urlArchivo && (
            <p className="text-xs text-white/70 italic">📎 {form.urlArchivo}</p>
          )}
        </div>

        <input name="urlArchivo" placeholder="...o pega una URL" value={form.urlArchivo} onChange={handleChange} required className="w-full p-2 rounded text-black" />

        <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full font-semibold">Guardar material</button>
      </form>

      <div className="mb-6">
        <label className="block mb-1">Filtrar por lección:</label>
        <select value={filtroLeccion} onChange={(e) => setFiltroLeccion(e.target.value)} className="w-64 p-2 rounded text-black">
          <option value="">Todas las lecciones</option>
          {leccionesDisponibles.map((l) => (
            <option key={l.id} value={l.id.toString()}>{l.id} - {l.titulo}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 shadow-md mb-12">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-800 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Lección</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materiales
              .filter((m) => (filtroLeccion ? m.leccionId.toString() === filtroLeccion : true))
              .map((m) => (
                <tr key={m.id} className="even:bg-slate-800 hover:bg-slate-700/60 transition-colors">
                  <td className="p-3">{m.id}</td>
                  <td className="p-3">{m.leccionId}</td>
                  <td className="p-3">{m.tipo}</td>
                  <td className="p-3">{m.descripcion}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    <button onClick={() => { setMaterialEnEdicion(m); setShowModal(true); }} className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-xs font-semibold">✏️ Editar</button>
                    <button onClick={() => handleDelete(m.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-semibold">🗑 Eliminar</button>
                  </td>
                </tr>
              ))}
            {materiales.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-white/60 text-center italic">No hay materiales cargados aún.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && materialEnEdicion && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl w-full max-w-lg shadow-lg border border-white/10">
            <h3 className="text-2xl font-bold mb-4 text-center">✏️ Editar Material</h3>
            <div className="space-y-3">
              <select value={materialEnEdicion.tipo} onChange={(e) => setMaterialEnEdicion({ ...materialEnEdicion, tipo: e.target.value })} className="w-full p-2 rounded text-black">
                {tipos.map((t) => <option key={t}>{t}</option>)}
              </select>
              <input type="text" value={materialEnEdicion.descripcion} onChange={(e) => setMaterialEnEdicion({ ...materialEnEdicion, descripcion: e.target.value })} className="w-full p-2 rounded text-black" placeholder="Descripción" />
              <input type="text" value={materialEnEdicion.urlArchivo} onChange={(e) => setMaterialEnEdicion({ ...materialEnEdicion, urlArchivo: e.target.value })} className="w-full p-2 rounded text-black" placeholder="URL del archivo" />
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded font-medium">Cancelar</button>
                <button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
