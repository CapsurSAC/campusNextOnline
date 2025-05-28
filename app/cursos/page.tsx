'use client';

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Plus, Search } from 'lucide-react';
import EditCursoModal from '@/components/EditCursoModal';
import CrearCursoModal from '@/components/CrearCursoModal'; // NUEVO COMPONENTE

type Curso = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen?: string;
  inscritos: number[];
};

export default function CursosPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cursoEditando, setCursoEditando] = useState<Curso | null>(null);
  const [crearVisible, setCrearVisible] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user) {
      fetch('/api/cursos')
        .then(res => res.json())
        .then((data: Curso[]) => {
          const cursosFiltrados =
            user.rol === 'admin'
              ? data
              : data.filter(curso => curso.inscritos.includes(user.userId));
          setCursos(cursosFiltrados);
        });
    }
  }, [user, loading]);

  if (loading || !user) return null;

  const cursosFiltrados = cursos.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Mis Cursos</h1>

        {user.rol?.toLowerCase() === 'admin' && (
          <button
            onClick={() => setCrearVisible(true)}
            className="flex items-center gap-2 bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            <Plus size={16} /> Crear curso
          </button>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar cursos..."
            className="w-full bg-[#111827] border border-gray-700 text-white px-4 py-2 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cursosFiltrados.map(curso => (
          <div
            key={curso.id}
            className="relative bg-[#1f2937] border border-gray-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            {curso.imagen && (
              <img
                src={curso.imagen}
                alt={curso.nombre}
                className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            )}

            <div className="p-4">
              <h2 className="text-xl font-bold text-white mb-1">{curso.nombre}</h2>
              <p className="text-sm text-gray-300 mb-4">{curso.descripcion}</p>

              <Link
                href={`/cursos/${curso.id}`}
                className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Entrar al curso →
              </Link>
            </div>

            {user.rol?.toLowerCase() === 'admin' && (
              <button
                onClick={() => setCursoEditando(curso)}
                className="absolute top-3 right-3 bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1 shadow-md"
              >
                <Pencil size={14} /> Editar
              </button>
            )}
          </div>
        ))}
      </div>

      {cursoEditando && (
        <EditCursoModal curso={cursoEditando} onClose={() => setCursoEditando(null)} />
      )}

      {crearVisible && (
        <CrearCursoModal onClose={() => setCrearVisible(false)} />
      )}
    </div>
  );
}
